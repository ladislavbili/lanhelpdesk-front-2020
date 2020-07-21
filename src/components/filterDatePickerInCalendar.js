import React, { Component } from 'react';
import { Button, FormGroup } from 'reactstrap';

import DatePicker from 'react-datepicker';
import datePickerConfig from 'configs/components/datepicker';
import classnames from 'classnames';


export default class FilterDatePickerInCalendar extends Component{
  render(){
    const { label, showNowFrom, dateFrom, showNowTo, dateTo } = this.props;
    const { setShowNowFrom, setDateFrom, setShowNowTo, setDateTo, minimal } = this.props;
    const DateInputFrom = ({ value, onClick }) => {
      let text = '';
      if(minimal){
        text = showNowFrom ? 'Current date' : ( value ? `${value}` : 'Select date from' )
      }else{
        text = showNowFrom ? 'From: Current date' : ( value ? `From: ${value}` : 'Select date from' );
      }
      return (
        <div className="row form-control p-0" style={ minimal ? { backgroundColor:'inherit', color:'inherit' } : {}}>
          <button className={classnames({ "datepicker-input-button-minimal": minimal, "datepicker-input-button": !minimal })} onClick={onClick} style={{flex: 1}}>
            { text }
          </button>
          <Button
            className={classnames({ "datepicker-input-button-minimal bolder": minimal, "datepicker-input-button": !minimal })}
            onClick={(e)=>{
              e.preventDefault();
              setShowNowFrom(!showNowFrom);
              setDateFrom(null);
            }}
            >
            { minimal ? 'Now' : 'Set now' }
          </Button>
      </div>
      )
    };
    const DateInputTo = ({ value, onClick }) => {
      let text = '';
      if(minimal){
        text = showNowTo ? 'Current date' : ( value ? `${value}` : 'Select date to' )
      }else{
        text = showNowTo ? 'To: Current date' : ( value ? `To: ${value}` : 'Select date to' );
      }
      return (
        <div className="row form-control p-0" style={ minimal ? { backgroundColor:'inherit', color:'inherit' } : {}}>
          <button className={classnames({ "datepicker-input-button-minimal": minimal, "datepicker-input-button": !minimal })} onClick={onClick} style={{flex: 1}}>
            { text }
          </button>
          <Button
            className={classnames({ "datepicker-input-button-minimal bolder": minimal, "datepicker-input-button": !minimal })}
            onClick={(e)=>{
              e.preventDefault();
              setShowNowTo(!showNowTo);
              setDateTo(null);
            }}
            >
            { minimal ? 'Now' : 'Set now' }
          </Button>
      </div>
      )
    };

    return (
      <FormGroup className={classnames({'sidebar-filter-row': minimal})}>
        <label>{label}</label>
        <div className="row">
          <div className="col-6">
            <FormGroup className={classnames({"m-r-10": !minimal}, "flex-input")}>
              <DatePicker
                className="form-control"
                selected={dateFrom}
                onChange={(e)=>{
                  setShowNowFrom(false);
                  setDateFrom(e)
                }}
                placeholderText="No date"
                {...datePickerConfig}
                customInput={ <DateInputFrom /> }
                />
            </FormGroup>
          </div>
          <div className="col-6">
            <FormGroup className="flex-input">
              <DatePicker
                className="form-control"
                selected={dateTo}
                onChange={(e)=>{
                  setShowNowTo(false);
                  setDateTo(e)
                }}
                placeholderText="No date"
                {...datePickerConfig}
                customInput={ <DateInputTo /> }
                />
            </FormGroup>
          </div>
        </div>
      </FormGroup>
    );
  }
}
