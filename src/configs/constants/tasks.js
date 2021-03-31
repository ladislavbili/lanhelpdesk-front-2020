import {
  timestampToDate,
  timestampToHoursAndMinutes,
} from 'helperFunctions';

import {
  momentLocalizer
} from "react-big-calendar";

import moment from 'moment';

export const defaultTasksAttributesFilter = {
  id: "",
  status: "",
  title: "",
  requester: "",
  company: "",
  createdAt: "",
  deadline: "",
  project: "",
  taskType: "",
  milestone: "",
  assignedTo: "",
  tags: "",
  overtime: "",
  pausal: "",
}
export const defaultTaskSort = {
  key: 'status',
  asc: true
}
export const defaultTasklistColumnPreference = {
  taskId: true,
  status: true,
  important: true,
  invoiced: true,
  title: true,
  requester: true,
  company: true,
  assignedTo: true,
  createdAtV: false,
  deadline: true,
  project: true,
  milestone: false,
  taskType: false,
  overtime: false,
  pausal: false,
  tags: false,
  subtasksApproved: false,
  subtasksPending: false,
  tripsApproved: false,
  tripsPending: false,
  materialsApproved: false,
  materialsPending: false,
  itemsApproved: false,
  itemsPending: false,
}
export const orderByValues = [
  {
    value: 'id',
    label: 'ID',
    type: 'int'
  },
  {
    value: 'status',
    label: 'Status',
    type: 'object'
  },
  {
    value: 'title',
    label: 'Title',
    type: 'text'
  },
  {
    value: 'requester',
    label: 'Requester',
    type: 'user'
  },
  {
    value: 'createdAt',
    label: 'Created at',
    type: 'date'
  },
  {
    value: 'deadline',
    label: 'Deadline',
    type: 'date'
  }
]
export const attributeLimitingRights = [
  {
    right: 'assignedRead',
    preference: 'assignedTo'
  },
  {
    right: 'companyRead',
    preference: 'company'
  },
  {
    right: 'overtimeRead',
    preference: 'overtime'
  },
  {
    right: 'pausalRead',
    preference: 'pausal'
  },
  {
    right: 'requesterRead',
    preference: 'requester'
  },
  {
    right: 'statusRead',
    preference: 'status'
  },
  {
    right: 'tagsRead',
    preference: 'tags'
  },
  {
    right: 'deadlineRead',
    preference: 'deadline'
  },
  {
    right: 'milestoneRead',
    preference: 'milestone'
  },
  {
    right: 'typeRead',
    preference: 'taskType'
  },
]
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
  eventTimeRangeFormat: ( {
    start,
    end
  }, culture, localizer ) => {
    return timestampToHoursAndMinutes( start ) + ' - ' + timestampToHoursAndMinutes( end );
  },
}

export const unimplementedAttributes = [
]