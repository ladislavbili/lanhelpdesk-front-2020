import React from 'react';
import Select from 'react-select';
import DatePicker from 'components/DatePicker';
import {
  FormGroup,
  Label,
  Button
} from 'reactstrap';
import moment from 'moment';

import {
  pickSelectStyle
} from 'configs/components/select';

import {
  months
} from 'configs/constants/reports';

var years = [];
for ( let i = moment()
    .year(); i >= 2000; i-- ) {
  years.push( {
    value: i,
    label: i
  } );
}

export default function MonthSelector( props ) {
  const {
    fromDate,
    onChangeFromDate,
    toDate,
    onChangeToDate,
    onTrigger,
    blockedShow
  } = props;


  const [ year, setYear ] = React.useState( {
    label: moment()
      .year(),
    value: moment()
      .year()
  } );
  const [ month, setMonth ] = React.useState(
    months[ moment()
      .month() ]
  );
  return (
    <div className="p-20">
      <FormGroup>
        <Label>Select month and year</Label>
        <div className="flex-row">
          <div className="w-50 p-r-20">
            <Select
              value={month}
              onChange={(mn) => {
                setMonth(mn);
              }}
              options={months}
              styles={pickSelectStyle()}
              />
          </div>
          <div className="w-50 p-r-20">
            <Select
              value={year}
              onChange={(yr) => {
                setYear(yr);
              }}
              options={years}
              styles={pickSelectStyle()}
              />
          </div>
          <Button
            type="button"
            disabled={
              year===null ||
              month===null ||
              blockedShow
            }
            className="btn-primary flex"
            onClick={()=>{
              let firstDay = moment({ year: year.value, month: month.value-1});
              firstDay.startOf('month');
              let lastDay = moment({ year: year.value, month: month.value-1});
              lastDay.endOf('month');
              onChangeFromDate(firstDay);
              onChangeToDate(lastDay);
              onTrigger(firstDay, lastDay);
            }}
            >
            Show
          </Button>
        </div>
      </FormGroup>
      <FormGroup>
        <Label>Select date range you preffer</Label>
        <div className="flex-row">
          <div className="w-50 p-r-20">
            <DatePicker
              className="form-control datepicker-width-185"
              selected={fromDate}
              onChange={date => onChangeFromDate(date) }
              placeholderText="From"
              showTimeSelect={false}
              dateFormat="DD.MM.YYYY"
              />
          </div>
          <div className="w-50 p-r-20">
            <DatePicker
              className="form-control datepicker-width-185"
              selected={toDate}
              onChange={date => onChangeToDate(date)}
              placeholderText="To"
              showTimeSelect={false}
              dateFormat="DD.MM.YYYY"
              />
          </div>
          <Button
            type="button"
            disabled={
              blockedShow ||
              ( fromDate !== null &&
                toDate !== null &&
                ( fromDate.valueOf() > toDate.valueOf() ) )
              }
              className="btn-primary flex"
              onClick={()=>{
                onTrigger();
              }}
              >
              Show
            </Button>
          </div>
        </FormGroup>
      </div>
  );
}