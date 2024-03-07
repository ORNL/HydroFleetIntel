import pandas as pd

def read_damage_coef(path):
    data_DC = pd.read_excel(path, sheet_name='Damage Coefficients', header=[0, 1])
    data_DC_ind = data_DC.iloc[:, 13:23]
    data_DC_ind = data_DC_ind.set_index(data_DC.iloc[:, 0])
    return data_DC_ind

def read_data_offset(path):
    data_offset = pd.read_excel(path, header=[0], parse_dates=['Installed_Year'])
    return data_offset

def read_data_mapping(path):
    data_map = pd.read_excel(path, sheet_name='FunctionalAreaMapping')
    data_map = data_map[pd.to_numeric(data_map['GADS Cause Code'], errors='coerce').notnull()]
    return data_map

def read_timeseries(path):
    #This fills blank cells with empty strings (na_filter=False)
    ts_data = pd.read_csv(path, sep=',', header=0, index_col='Date', parse_dates=True, date_format='%m-%d-%Y', na_filter=False)
    return ts_data

def read_gads(path):
    gads_data = pd.read_csv(path, sep=',', header=0, index_col=False, parse_dates=['EVENT TIMES START', 'EVENT TIMES END'], na_filter=False)
    return gads_data

def read_maintenance_history(path):
    maint_hist = pd.read_csv(path, sep=',', header=0, index_col=False, parse_dates=['Basic Start Date'], date_format='%m-%d-%Y', na_filter=False)
    return maint_hist

def read_simple_csv(path):
    data = pd.read_csv(path, sep=',', header=0, index_col=False, na_filter=False)
    return data