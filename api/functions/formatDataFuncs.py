from datetime import datetime
import pandas as pd
from string import punctuation

def remove_sp_characters(item):
    sp_charac_dict = {sp_character: '' for sp_character in punctuation}
    sp_charac_dict[' '] = ''
    trans_table = str.maketrans(sp_charac_dict)
    result = item.translate(trans_table)
    return result.lower().strip()

def format_user_dates(s, e):
    #Slightly alter user input datetime objects for easier comparisons
    sDateWithTime = pd.Timestamp(datetime.fromisoformat(s).replace(hour=0, minute=0, second=0, tzinfo=None))
    eDateWithTime = pd.Timestamp(datetime.fromisoformat(e).replace(hour=23, minute=59, second=59, tzinfo=None))
    sDate = sDateWithTime.date()
    eDate = eDateWithTime.date()

    return sDateWithTime, eDateWithTime, sDate, eDate

def format_gads_dates(testDate, userDate, date_type, timeInterval=None):
    """ 
    Description:
    This function alters start and end times of the data superficially to align them with the needed 
    date range bounds and x-axis intervals on the display chart. For example, the user specifies a 
    date range of 1/11/2020 - 1/12/2020 and the event being tested is going on from 1/1/2020 to 3/20/2020. 
    The user specified date range fits entirely within the event being tested, but in order to display
    points on the chart for the event being tested, the event must have altered start and end times to
    the user date range, thus 1/1 turns to 1/11 and 3/20 turns to 1/12. The popup on the chart will
    display the actual data (1/1 and 3/20).

    Parameters:
    testDate
        data type: pandas.Timestamp
        description: the date being tested
        optional: no
    userDate
        data type: pandas.Timestamp
        description: the start or end date the user specified in their input date range
        optional: no
    date_type
        data type: string
        description: whether the date being tested is a start or end date
        optional: no
    timeInterval
        data type: integer
        description: the minute interval to round an input time to. For example, a timeInterval of 5
                     could round a time of 10:01 to 10:00 or 10:05.
        optional: yes

    Returns:
    A pandas.Timestamp object.
    """
    
    if date_type == 'start':
        if timeInterval:
            mins = str(timeInterval) + 'min'
            rounded = testDate.ceil(mins)
        else:
            rounded = testDate
        if testDate.date() < userDate.date():
            return userDate
        else:
            return rounded
    elif date_type == 'end':
        if timeInterval:
            mins = str(timeInterval) + 'min'
            rounded = testDate.floor(mins)
        else:
            rounded = testDate
        if testDate.date() > userDate.date():
            #Add one second to rollover to next day to make it align with the 5 min increments
            #of timeseries x-axis
            return userDate + pd.Timedelta(1, 'sec')
        else:
            return rounded