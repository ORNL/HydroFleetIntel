from api.functions.readDataFuncs import read_gads
import os, glob
import pandas as pd

def getGADsData(startDateWTime, endDateWTime, facilityName):
    gads_path = os.path.join(os.getcwd(), glob.glob(f'api/data/powertrain/generator/gads/*{facilityName}*.csv')[0])
    gadsRawData = read_gads(gads_path)

    user_drange = pd.Interval(startDateWTime, endDateWTime, 'both')
    gadsRawData.index = pd.IntervalIndex.from_arrays(gadsRawData['EVENT TIMES START'].values, gadsRawData['EVENT TIMES END'].values, 'both')

    #Filter GADS data to find all events that start within the user specified date range 
    #as well as all events that completely encompass the entire user specified date range.
    validEvents = []
    for data_drange in set(gadsRawData.index):
        if user_drange.overlaps(data_drange):
            validEvents.append(data_drange)

    filteredGADsData = gadsRawData.loc[validEvents, :]

    filteredGADsData.sort_values(by=['UNIT', 'EVENT TIMES START', 'EVENT TIMES END'], inplace=True)

    return filteredGADsData
