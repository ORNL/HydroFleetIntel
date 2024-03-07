import pandas as pd
import numpy as np
from api.classes.InputDataClasses import TimeSeriesData, GADSData
from scipy.spatial import procrustes
from math import ceil

class UnitData:
    """Class specific to a unit, that contains TimeSeriesData and GADSData"""
    def __init__(self, timeseries_file_path, gads_file_path, unit_no):
        self.time_series = TimeSeriesData(timeseries_file_path, unit_no)
        self.gads = GADSData(gads_file_path, unit_no)


    def disparity_fun(self, win_len, signal_data, baseline_data):
        """Computes disparity between two given signals through moving window"""

        signal_len = len(signal_data)
        baseline_len = len(baseline_data)
        tot_signal_mat = np.column_stack((np.cumsum(np.zeros(signal_len) + 1), signal_data))
        tot_baseline_mat = np.column_stack((np.cumsum(np.zeros(baseline_len) + 1), baseline_data))
        pcm_MOOper_mil = []
        pcm_MOOper_milcum = []
        for dind in range(signal_len - win_len):
            signal_window = tot_signal_mat[dind:dind + win_len, :]
            baseline_window = tot_baseline_mat[dind:dind + win_len, :]
            _, _, disparity = procrustes(signal_window, baseline_window)
            pcm_MOOper_mil.append(disparity)
            signal_cumulative_window = tot_signal_mat[dind:dind + win_len, :]
            baseline_cumulative_window = tot_baseline_mat[dind:dind + win_len, :]
            _, _, disparity_cumulative = procrustes(signal_cumulative_window, baseline_cumulative_window)
            pcm_MOOper_milcum.append(disparity_cumulative)

        pcm_MOOper_mil_df = pd.DataFrame(pcm_MOOper_mil, index=signal_data.index[win_len:])
        pcm_MOOper_mil_df = pcm_MOOper_mil_df.rolling(win_len, min_periods=0).mean()
        pcm_MOOper_milcum_df = pd.DataFrame(pcm_MOOper_milcum, index=signal_data.index[win_len:])
        pcm_MOOper_milcum_df = pcm_MOOper_milcum_df.rolling(win_len, min_periods=0).mean()

        return pcm_MOOper_mil_df, pcm_MOOper_milcum_df


    def mileage_est(self, offset, wts, inter, interhrs, data_map, maint_fac, comp_func):
        """Estimate mileage for given component of the unit"""

        ### Fetch time series data
        u_gen_cyc, u_pump_cyc, _ = self.time_series.get_cycles(inter)
        u_gen_hrs, u_pump_hrs = self.time_series.get_hours(inter)

        ### Extract data based on date of installation
        u_gen_cyc_offset = u_gen_cyc.loc[u_gen_cyc.index > offset]
        u_gen_hrs_offset = u_gen_hrs.loc[u_gen_hrs.index > offset]
        u_pump_cyc_offset = u_pump_cyc.loc[u_gen_cyc.index][u_gen_cyc.index > offset]
        u_pump_hrs_offset = u_pump_hrs.loc[u_gen_cyc.index][u_gen_cyc.index > offset]

        gencyc_mil = np.cumsum(u_gen_cyc_offset) * wts["gen starts"].to_numpy()
        gendur_mil = np.cumsum(u_gen_hrs_offset) * wts["gen hours"].to_numpy()
        pumpcyc_mil = np.cumsum(u_pump_cyc_offset) * wts["pump starts"].to_numpy()
        pumpdur_mil = np.cumsum(u_pump_hrs_offset) * wts["pump hours"].to_numpy()

        tot_mil_t = (gencyc_mil + gendur_mil + pumpcyc_mil + pumpdur_mil).fillna(method='ffill').fillna(0)
        ### Mileage due to aging or period hrs
        perhrs = ((tot_mil_t * 0 + 1).fillna(1)) * interhrs
        perhrs_mil = np.cumsum(perhrs) * wts["period hours"].to_numpy()
        ### Total Mileage due to cycles and period hrs
        tot_mil = (tot_mil_t + perhrs_mil)
        ### Adjusted Mileage due to minor maintenance
        sub_mil = 0
        sub_mil_vec = []

        ### Adjusted Mileage due to minor maintenance
        data_evt_compfact, _ = self.gads.add_comp(data_map, maint_fac)
        data_evt_u_comp = (data_evt_compfact[data_evt_compfact[('component')].str.contains(comp_func, na=False)]).reset_index(drop=True)
        data_evt_u_comp = data_evt_u_comp.set_index(data_evt_u_comp['Ended'])
        cycs_arr = ((u_gen_cyc * 0 + data_evt_u_comp.resample(inter).size()).fillna(0))
        data_evt_u_compfact = 1 - ((1 - maint_fac) ** cycs_arr)

        for mind in range(0, len(tot_mil)):
            if data_evt_u_compfact[mind] > 0:  ### for minor outage related mileage loss
                sub_mil = sub_mil + (tot_mil[mind] - sub_mil) * data_evt_u_compfact[mind]
            sub_mil_vec.append(sub_mil)
        adj_mil = np.array(tot_mil) - sub_mil_vec  ### subtract major and minor outage related comps
        adj_mil = pd.DataFrame(adj_mil, index=tot_mil.index)
        mil_offset = tot_mil.index[0] - offset
        mil_offset_yrs = mil_offset.days / 365
        adj_mil = adj_mil / 360 / 24 + mil_offset_yrs

        ### Calendar mileage (period hrs) for superposition
        offset_yrs = tot_mil.index[-1] - offset  ### Offset for calendar yrs age
        offset_yrs = offset_yrs.days / 365
        calendarhrs_mil = perhrs * 0 + offset_yrs
        return calendarhrs_mil, adj_mil