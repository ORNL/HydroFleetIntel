import pandas as pd
import numpy as np

class GADSData:
    """Class to fetch, extract, and preprocess GADS data for a given unit"""
    def __init__(self, data_file_path, unit_no):
        df = pd.read_excel(data_file_path, sheet_name='All Events', parse_dates=['Started', 'Ended'])
        df = df[df.CauseCode != 0]  ### elimination of rows with cause code 0 as it is not MO
        df = df[df.CauseCode != 1]  ### elimination of rows with cause code 1 as it is not MO
        # df = df[df[('UnitName')].str.contains(site_name, na=False)]
        # self.data_evt_u = (df[df[('UnitName')].str.contains(str(unit_no), na=False)]).reset_index(drop=True)
        self.data_evt_u = df.reset_index(drop=True)


    def add_comp(self, data_map, maint_fac):
        """Extract events with maintenance outage for given unit"""
        comp = []
        ind = []
        ind_na = []
        for dind in range(0, len(self.data_evt_u)):
            cc = self.data_evt_u.CauseCode[dind]
            complist = (data_map[data_map[('GADS Cause Code')] == cc])
            if len(complist) > 0:
                comp.append('-'.join(complist['Area4'].unique()))
                ind.append(dind)
            else:
                ind_na.append(dind)
        data_evt_ur = self.data_evt_u.iloc[ind, :]
        data_evt_ur['component'] = np.array(comp)
        data_evt_ur['mofactor'] = np.zeros(len(comp)) * 0 + maint_fac
        data_evt_ur_na = self.data_evt_u.iloc[ind_na, :]
        return (data_evt_ur, data_evt_ur_na)


class TimeSeriesData:
    """Class to fetch, extract, and preprocess time series data for a given unit"""
    def __init__(self, data_file_path, unit_no):
        self.df = pd.read_excel(data_file_path, sheet_name='Unit{}'.format(unit_no), parse_dates=['sdates', 'edates'])
        self.gen_data = self.df.loc[self.df['optype'] == 1]
        self.pump_data = self.df.loc[self.df['optype'] == 2]
        self.gen_pump_data = self.gen_pump_reversals()


    def gen_pump_reversals(self):
        pump_neg = self.pump_data.copy()
        pump_neg['optype'] = pump_neg['optype'] * -1
        gen_pump = pd.merge(self.gen_data, pump_neg, how='outer')
        gen_pump = gen_pump.set_index(['sdates']).sort_index()
        gen_pump['optype'] = np.concatenate(([0], np.diff(np.array(gen_pump['optype']))))
        gen_pump = gen_pump[gen_pump['optype'] != 0]
        return gen_pump


    def get_cycles(self, interval):
        gen_cyc = self.gen_data.set_index(['sdates'])
        gen_cyc = gen_cyc.resample(interval).size()
        pump_cyc = self.pump_data.set_index(['sdates'])
        pump_cyc = pump_cyc.resample(interval).size()
        gen_pump_cyc = self.gen_pump_data.resample(interval).size()
        return gen_cyc, pump_cyc, gen_pump_cyc


    def get_hours(self, interval):
        gen_hrs = self.gen_data.set_index(['sdates'])
        gen_hrs = gen_hrs.dur.resample(interval).sum()
        gen_hrs[gen_hrs > 48] = 0
        pump_hrs = self.pump_data.set_index(['sdates'])
        pump_hrs = pump_hrs.dur.resample(interval).sum()
        return gen_hrs, pump_hrs


    def remove_zero_variation(self, baseline_data, data):
        non_zero_indices = data.to_numpy().nonzero()
        return baseline_data.iloc[non_zero_indices]


    def get_baseline_signals(self, year, data):
        u_3yr_avg = np.array(data[year])
        u_3yr_avg_3yr_allyr = np.tile(np.concatenate((u_3yr_avg, u_3yr_avg, u_3yr_avg)), 16 * 31)[:len(data)]
        u_3yr_avg_3yr_allyr = pd.DataFrame(u_3yr_avg_3yr_allyr, index=data.index)
        u_3yr_avg_3yr_allyr_bl = self.remove_zero_variation(u_3yr_avg_3yr_allyr, data)
        u_3yr_avg_3yr_allyr = self.remove_zero_variation(data, data)

        return {'baseline': u_3yr_avg_3yr_allyr_bl, 'nonbaseline': u_3yr_avg_3yr_allyr}


    def get_extreme(self, data):
        extreme_data = np.tile(np.concatenate(([0] * 30, [24] * 30)), 16 * 31 * 7 * 30)[0:len(data)]
        extreme_data_df = pd.DataFrame(extreme_data, index=data.index)
        return extreme_data_df


    def get_mean(self, data):
        mean_data = np.tile(np.concatenate(([6] * 30, [6] * 30)), 16 * 31 * 7)[0:len(data)]
        mean_data_df = pd.DataFrame(mean_data, index=data.index)
        return mean_data_df