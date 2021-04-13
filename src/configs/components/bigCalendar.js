import {
  momentLocalizer
} from "react-big-calendar";

import moment from 'moment';

import {
  timestampToDate,
  timestampToHoursAndMinutes,
} from 'helperFunctions';

moment.locale( 'sk', {
  week: {
    dow: 1,
    doy: 1,
  },
} )
export const calendarLocalizer = momentLocalizer( moment );

export const calendarDateFormats = {
  dayFormat: ( date, culture, localizer ) => localizer.format( date, 'dddd', culture ), //timestampToDate( date ),
  timeGutterFormat: ( date, culture, localizer ) => {
    return timestampToHoursAndMinutes( date );
  },
  dayRangeHeaderFormat: ( {
    start,
    end
  }, culture, localizer ) => {
    return timestampToDate( start ) + ' - ' + timestampToDate( end );
  },
  agendaHeaderFormat: ( {
    start,
    end
  }, culture, localizer ) => {
    return timestampToDate( start ) + ' - ' + timestampToDate( end );
  },
  selectRangeFormat: ( {
    start,
    end
  }, culture, localizer ) => {
    return timestampToHoursAndMinutes( start ) + ' - ' + timestampToHoursAndMinutes( end );
  },
  eventTimeRangeFormat: () => null,
}

export const taskCalendarDefaults = {
  defaultDate: new Date( moment().valueOf() ),
  style: {
    padding: "20px"
  },
  views: [ 'month', 'week', 'work_week', 'day', 'agenda' ],
  drilldownView: "day",
  localizer: calendarLocalizer,
  resizable: true,
  popup: true,
  formats: calendarDateFormats,
  scrollToTime: new Date(
    moment().get( 'year' ),
    moment().get( 'month' ),
    moment().get( 'date' ),
    8
  ),

}