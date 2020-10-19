import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import {
  FormGroup,
  Label,
  Button
} from 'reactstrap';
import moment from 'moment';

import datePickerConfig from 'configs/components/datepicker';
import {
  selectStyle
} from 'configs/components/select';

var months = [
{value:1,label:'January'},
{value:2,label:'February'},
{value:3,label:'March'},
{value:4,label:'April'},
{value:5,label:'May'},
{value:6,label:'June'},
{value:7,label:'July'},
{value:8,label:'August'},
{value:9,label:'September'},
{value:10,label:'October'},
{value:11,label:'November'},
{value:12,label:'December'}
];

var years = [];
for (let i = moment().year(); i >= 2000; i--) {
  years.push({value:i,label:i});
}

export default function MonthSelector ( props ) {
  const {
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    refetchInvoices
  } = props;

  const [ year, setYear ] = React.useState( years.find(y => y.value === moment().year()) );
  const [ month, setMonth ] = React.useState( months[moment().month()] );

  return (
    <div className="p-20">
      <FormGroup>
        <Label>Select month and year</Label>
        <div className="flex-row">
          <div className="w-50 p-r-20">
            <Select
              value={month}
              onChange={(e)=> setMonth(e)}
              options={months}
              styles={selectStyle}
              />
          </div>
          <div className="w-50 p-r-20">
            <Select
              value={year}
              onChange={(e)=> setYear(e)}
              options={years}
              styles={selectStyle}
              />
          </div>
          <Button type="button" disabled={year===null || month===null} className="btn-primary flex" onClick={()=>{
              let firstDay = moment({ year: year.value, month: month.value-1, day: 1});
              let lastDay = moment({ year: year.value, month: month.value-1});
              lastDay.date(lastDay.daysInMonth());
              setFromDate(firstDay);
              setToDate(lastDay);
              refetchInvoices();
            }}>
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
              onChange={date => {
                setFromDate(date)
              }}
              placeholderText="From"
              {...datePickerConfig}
              showTimeSelect={false}
              dateFormat="DD.MM.YYYY"
              />
          </div>
          <div className="w-50 p-r-20">
            <DatePicker
              className="form-control datepicker-width-185"
              selected={toDate}
              onChange={date => {
                setToDate(date)
              }}
              placeholderText="To"
              {...datePickerConfig}
              showTimeSelect={false}
              dateFormat="DD.MM.YYYY"
              />
          </div>
          <Button type="button" disabled={fromDate !== null && toDate !== null && ( fromDate.valueOf() > toDate.valueOf() )} className="btn-primary flex" onClick={()=>{
              refetchInvoices();
        /*      setFromDate(fromDate);
              setToDate(toDate);*/
            }}>
            Show
          </Button>
        </div>
      </FormGroup>
    </div>
  );
}
