from flask import Blueprint, request, Response
from api.classes.UnitDataClass import UnitData
from api.functions.readDataFuncs import *
from api.functions.formatDataFuncs import format_user_dates, format_gads_dates, remove_sp_characters
from api.functions.gadsDataFuncs import getGADsData
from datetime import datetime
from json import loads, dumps
from math import ceil
import os, glob
import pandas as pd

main = Blueprint("main", __name__) #initialize blueprint

@main.route('/api/get_facilities', methods=['GET'])
def get_facilities():
    facility_path = os.path.join(os.getcwd(), 'api/data/general/FacilitiesList.csv')
    facilityDF = read_simple_csv(facility_path)
    facilityDF['key'] = facilityDF['Plant Name'].apply(remove_sp_characters)
    facilityDF['value'] = facilityDF['Plant Name'].apply(remove_sp_characters)
    facilityDF['displayText'] = facilityDF['Plant Name'].apply(lambda x: x.capitalize())
    facilityDF.drop(columns='Plant Name', inplace=True)
    print(facilityDF)

    #Create array of dictionaries, one dict for each row in the dataframe
    facility_rows = facilityDF.to_dict('records')

    responseData = dumps({"facilities": facility_rows})
    response = Response(response=responseData, status=200, mimetype='application/json')
    return response

@main.route('/api/get_part_information', methods=['POST'])
def get_part_info():
    part = loads(request.form['part'])
    part_path = os.path.join(os.getcwd(), f'api/data/general/partInfo/{part}.csv')

    try:
        partDF = read_simple_csv(part_path)
        print(partDF)
    except:
        #If a matching part file is not found, return file not found status
        response = Response(response={'data': []}, status=404, mimetype='application/json')
        return response
    
    partDF = partDF.astype(str)
    part_rows = partDF.to_dict('records')
    responseData = dumps({"data": part_rows})
    response = Response(response=responseData, status=200, mimetype='application/json')
    return response

@main.route('/api/get_viz_data', methods=['POST'])
def get_viz_data():
    sDateWithTime, eDateWithTime, sDate, eDate = format_user_dates(loads(request.form['startDate']), loads(request.form['endDate']))
    facility = loads(request.form['facility'])

    ################################
    # Process Time Series Data     
    ################################
    try:
        ts_path = os.path.join(os.getcwd(), glob.glob(f'api/data/powertrain/generator/timeseries/*{facility}*.csv')[0])
    except:
        responseData = dumps({"timeseries": [], "gads": []})
        response = Response(response=responseData, status=404, mimetype='application/json')
        return response
    
    tsRawData = read_timeseries(ts_path)

    #Filter the time series data by the user selected dates
    filteredTSData = tsRawData.loc[sDate:eDate, : ]
    filteredTSData.reset_index(inplace=True)
    filteredTSData['Date'] = filteredTSData['Date'].dt.strftime('%m/%d/%Y')

    #Cast all columns to string data type
    filteredTSData = filteredTSData.astype(str)

    #Create array of dictionaries, one dict for each row in the dataframe
    ts_rows = filteredTSData.to_dict('records')

    ################################
    # Process GADS Data     
    ################################
    try:
        gadsDF = getGADsData(sDateWithTime, eDateWithTime, facility)
    except:
        responseData = dumps({"timeseries": [], "gads": []})
        response = Response(response=responseData, status=404, mimetype='application/json')
        return response
        
    gadsDF['formattedStartDate'] = gadsDF['EVENT TIMES START'].apply(format_gads_dates, args=(sDateWithTime, 'start', 5,))
    gadsDF['formattedEndDate'] = gadsDF['EVENT TIMES END'].apply(format_gads_dates, args=(eDateWithTime, 'end', 5,))

    #Cast all columns to string data type
    gadsDF = gadsDF.astype(str)

    #Create array of dictionaries, one dict for each row in the dataframe
    gads_rows = gadsDF.to_dict('records')

    responseData = dumps({"timeseries": ts_rows, "gads": gads_rows})
    response = Response(response=responseData, status=200, mimetype='application/json')
    return response

@main.route('/api/get_event_history', methods=['POST'])
def get_event_history():
    sDateWithTime, eDateWithTime, sDate, eDate = format_user_dates(loads(request.form['startDate']), loads(request.form['endDate']))
    facility = loads(request.form['facility'])

    try:
        gadsDF = getGADsData(sDateWithTime, eDateWithTime, facility)
    except:
        responseData = dumps({"gads": [], "xAxisDates": []})
        response = Response(response=responseData, status=404, mimetype='application/json')
        return response
    
    gadsDF['formattedStartDate'] = gadsDF['EVENT TIMES START'].apply(format_gads_dates, args=(sDateWithTime, 'start',))
    gadsDF['formattedEndDate'] = gadsDF['EVENT TIMES END'].apply(format_gads_dates, args=(eDateWithTime, 'end',))

    #Find earliest start date and latest end date to later create x-axis values for the chart
    gadsDF.reset_index(inplace=True, drop=True)
    units = set(gadsDF['UNIT'])
    gadsDF.set_index(['UNIT'], inplace=True)
    xAxisDates = {}
    for unit in units:
        unitDF = gadsDF.loc[unit]
        unitNum = unit.split()[1]
        startTimes = unitDF['formattedStartDate']
        endTimes = unitDF['formattedEndDate']
        if isinstance(startTimes, pd.Series):
            xAxisDates[unitNum] = {'earliestDate': startTimes.min().strftime('%Y-%m-%d %X')}
        else:
            xAxisDates[unitNum] = {'earliestDate': startTimes.strftime('%Y-%m-%d %X')}
        if isinstance(endTimes, pd.Series):
            xAxisDates[unitNum]['latestDate'] = endTimes.max().strftime('%Y-%m-%d %X')
        else:
            xAxisDates[unitNum]['latestDate'] = endTimes.strftime('%Y-%m-%d %X')
    
    #Cast all columns to string data type
    gadsDF.reset_index(inplace=True)
    gadsDF = gadsDF.astype(str)

    #Create array of dictionaries, one dict for each row in the dataframe
    gads_rows = gadsDF.to_dict('records')

    responseData = dumps({"gads": gads_rows, "xAxisDates": xAxisDates})
    response = Response(response=responseData, status=200, mimetype='application/json')
    return response

@main.route('/api/get_maintenance_hist', methods=['POST'])
def get_maintenance_hist():
    facility = loads(request.form['facility'])
    try:
        mh_path = os.path.join(os.getcwd(), glob.glob(f'api/data/powertrain/generator/maintenance/*{facility}*.csv')[0])
    except:
        response = Response(response={"maintenance_history": []}, status=404, mimetype='application/json')
        return response
    
    maintHistDF = read_maintenance_history(mh_path)

    #Cast all columns to string data type
    maintHistDF = maintHistDF.astype(str)

    #Create array of dictionaries, one dict for each row in the dataframe
    maintHist_rows = maintHistDF.to_dict('records')

    responseData = dumps({"maintenance_history": maintHist_rows})
    response = Response(response=responseData, status=200, mimetype='application/json')
    return response

@main.route('/api/maintenance_mileage', methods=['POST'])
def calc_maintenance_mileage():
    facility = request.form['facility']
    selectedUnit = int(request.form['unit'])
    installedYear = datetime.fromisoformat(loads(request.form['comDate'])).date().year
    installYearDateObj = datetime(installedYear, 1, 1)
    startDate = datetime.fromisoformat(loads(request.form['startDate'])).date()
    endDate = datetime.fromisoformat(loads(request.form['endDate'])).date()

    #Save the user input file
    # if 'file' in request.files:
    #     file = request.files['file']
    #     filenameParts = file.filename.split('.')
    #     if len(filenameParts) == 2:
    #         extension = filenameParts[1]
    #         if extension == 'xlsx':
    #             jobFolderCreated = False
    #             while jobFolderCreated == False:
    #                 jobID = str(uuid4())
    #                 jobDir = os.path.join('/Users/umf/Documents/hfi_input', jobID)
    #                 if not os.path.exists(jobDir):
    #                     os.mkdir(jobDir)
    #                     jobFolderCreated = True
    #                 else:
    #                     continue
    #             file.filename = f'userInputFile.{extension}'
    #             saveLoc = os.path.join(jobDir, file.filename)
    #             file.save(saveLoc)

    ### Paths for required files
    try:
        timeseries_file_path = os.path.join(os.getcwd(), glob.glob('api/data/powertrain/generator/assetMileage/*GADS*.xlsx')[0])
        gads_file_path = os.path.join(os.getcwd(), glob.glob(f'api/data/powertrain/generator/assetMileage/*{facility}*Events*.xlsx')[0])
        data_map_path = os.path.join(os.getcwd(), glob.glob('api/data/powertrain/generator/assetMileage/*FunctionalAreaMapping*.xlsx')[0])
        damage_coef_path = os.path.join(os.getcwd(), glob.glob('api/data/powertrain/generator/assetMileage/*DamageMatrix*.xlsx')[0])
        data_offset_path = os.path.join(os.getcwd(), glob.glob('api/data/powertrain/generator/assetMileage/*InstalledYearInfo*.xlsx')[0])
    except:
        responseData = dumps({"calendarhrs_mileage": [], "adj_mileage": [], "xAxisValues": [], "yAxisMax": []})
        response = Response(response=responseData, status=404, mimetype='application/json')
        return response

    #inter='Y'          ### to plot yearly cycles
    inter='D'           ### to plot daily cycles
    #inter='M'          ### to plot monthly cycles

    interhrs = 24

    ### Generate class for UnitData
    Unit = UnitData(timeseries_file_path, gads_file_path, selectedUnit)

    ### Category of the component
    func_categ = ['Wicket', 'Turbine', 'Governor', 'Stator', 'Stator', 'Stator', 'Stator', 'Rotor', 'Rotor',
                  'GSUTransformer', 'StationService', 'Exciter', 'Exciter', 'Generator']

    maint_fac = 0.03  ### factor of mileage to be subtracted proportional to maintenance events
    #maint_fac_maj = 0.05  ### factor of mileage to be subtracted proportional to maintenance events

    selected_categ = request.form['asset']
    selected_component_idx = func_categ.index(selected_categ)
    
    ### Read functional area mapping spreadsheet
    data_map = read_data_mapping(data_map_path)

    ### Read damage coefficient spreadsheet and fetch coefficients for given component
    dc_mat = read_damage_coef(damage_coef_path)
    component_list = dc_mat.index
    dc_selected = dc_mat.loc[component_list[selected_component_idx],:]

    ### Read offset spreadsheet and fetch offset for given component
    # data_offset = read_data_offset(data_offset_path)
    # offset = data_offset.loc[selected_component_idx,:]["Installed_Year"]
    offset = installYearDateObj

    ### Estimate mileage
    ### TODO: This function runs for a single given component, implement loop over all components provided by user.
    ### TODO: Make script handle user-input for only selected unit (could be more than three units available to select from)
    calendarhrs_mil, adj_mil = Unit.mileage_est(offset, dc_selected, inter, interhrs, data_map, maint_fac, selected_categ)

    ###########################################
    # This sections is added for use in Flask #
    ###########################################

    #Subset returned data by user-defined dates
    calendarhrs_mil.sort_index(inplace=True)
    subsetCal = calendarhrs_mil.loc[startDate:endDate]
    #If the dataframe is empty for the user-specified dates, return with no content
    if len(subsetCal) == 0:
        responseData = dumps({"calendarhrs_mileage": [], "adj_mileage": [], "xAxisValues": [], "yAxisMax": []})
        response = Response(response=responseData, status=204, mimetype='application/json')
        return response
    
    adj_mil.sort_index(inplace=True)
    subsetAdj = adj_mil.loc[startDate:endDate]

    #The index should be the same for calendarhrs_mil and adj_mil so just get one for the x-axis values
    #Convert them to datetime objects and then to iso format
    xAxisValues =  subsetCal.index.to_pydatetime().tolist()
    xAxisValues = [date.isoformat() for date in xAxisValues]

    #Get data values to plot
    calendarhrs_mil_data = subsetCal.to_list()
    adj_mil_data = subsetAdj[0].to_list()

    #Find the max value in either mileage calculation. This will be used as the max for the y-axis.
    calendarhrs_max = int(ceil(max(calendarhrs_mil_data)))
    adj_mil_max = int(ceil(max(adj_mil_data)))
    if calendarhrs_max > adj_mil_max:
        yAxisMax = calendarhrs_max
    else:
        yAxisMax = adj_mil_max

    responseData = dumps({"calendarhrs_mileage": calendarhrs_mil_data, "adj_mileage": adj_mil_data, "xAxisValues": xAxisValues, "yAxisMax": yAxisMax})
    response = Response(response=responseData, status=200, mimetype='application/json')
    return response