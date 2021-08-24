import React, {
  Component,
  forwardRef
} from 'react';
import {
  Button,
  FormGroup,
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';

import DatePicker from 'components/DatePicker';
import classnames from 'classnames';
import moment from 'moment';

export default function FilterDatePickerPopover( props ) {
  const {
    label,
    showNowFrom,
    dateFrom,
    showNowTo,
    dateTo,
    setShowNowFrom,
    setDateFrom,
    setShowNowTo,
    setDateTo,
    minimal
  } = props;

  const [ popoverOpen, setPopoverOpen ] = React.useState( false );
  const [ newDateFrom, setNewDateFrom ] = React.useState( dateFrom );
  const [ newDateTo, setNewDateTo ] = React.useState( dateTo );

  const DateInputFrom = forwardRef(
    ( {
      value,
      onClick
    }, ref ) => {
      let text = '';
      if ( minimal ) {
        text = showNowFrom ? 'Current date' : ( value ? `${value}` : 'Select date from' )
      } else {
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
    }
  )
  const DateInputTo = forwardRef(
    ( {
      value,
      onClick
    }, ref ) => {
      let text = '';
      if ( minimal ) {
        text = showNowTo ? 'Current date' : ( value ? `${value}` : 'Select date to' )
      } else {
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
    }
  )

  return (
    <FormGroup className={classnames({'sidebar-filter-row': minimal})}>
        <label style={{display: "block"}}>{label}</label>
          <button id="Popover1" type="button" className="btn-link p-l-0 p-r-0 m-r-0" onClick={() => setPopoverOpen(true)}>
            {`${dateFrom ? dateFrom.format( 'DD.MM.YYYY' ) : 'All'} - ${dateTo ? dateTo.format( 'DD.MM.YYYY' ) : 'All'}`}
          </button>
          <Popover placement="right" className="custom-popover" isOpen={popoverOpen} target="Popover1" toggle={() => setPopoverOpen(false)}>
            <PopoverBody>
              <label style={{display: "block"}}>{`Set ${label}`}</label>
                <button
                  type="button"
                  className="btn-link"
                  style={{display: "block"}}
                  onClick={() => {
                    setNewDateFrom(moment().startOf('week').add(1, 'days'));
                    setNewDateTo(moment().endOf('week').add(1, 'days'));
                  }}
                  >
                  This week
                </button>
                <button
                  type="button"
                  className="btn-link"
                  style={{display: "block"}}
                  onClick={() => {
                    setNewDateFrom(moment().subtract(1, 'weeks').startOf('week').add(1, 'days'));
                    setNewDateTo(moment().subtract(1, 'weeks').endOf('week').add(1, 'days'));
                  }}
                  >
                  Last week
                </button>
                <button
                  type="button"
                  className="btn-link"
                  style={{display: "block"}}
                  onClick={() => {
                    setNewDateFrom(moment().startOf('month'));
                    setNewDateTo(moment().endOf('month'));
                  }}
                  >
                  This month
                </button>
                <button
                  type="button"
                  className="btn-link"
                  style={{display: "block"}}
                  onClick={() => {
                    setNewDateFrom(moment().subtract(1, 'months').startOf('month'));
                    setNewDateTo(moment().subtract(1, 'months').endOf('month'));
                  }}
                  >
                  Last month
                </button>
                <div className="row">
                  <div className="width-50-p p-r-10">
                    <div className="row">
                      <label className="center-hor">From</label>
                      <button type="button" className="btn-link ml-auto m-r-0" onClick={() => setNewDateFrom(moment())}>
                        NOW
                      </button>
                    </div>
                    <DatePicker
                      className="form-control"
                      hideTime={true}
                      selected={newDateFrom}
                      onChange={(e)=>{
                        seNewDateFrom(e);
                      }}
                      placeholderText="No date"
                      />
                  </div>

                  <div className="width-50-p p-l-10">
                    <div className="row">
                      <label className="center-hor">To</label>
                      <button type="button" className="btn-link ml-auto m-r-0" onClick={() => setNewDateTo(moment())}>
                        NOW
                      </button>
                    </div>
                    <DatePicker
                      className="form-control"
                      hideTime={true}
                      selected={newDateTo}
                      onChange={(e)=>{
                        setNewDateTo(e);
                      }}
                      placeholderText="No date"
                      />
                  </div>
                </div>
                <div className="row m-t-15">
                  <button
                    type="button"
                    className="btn-link-reversed"
                    onClick={() => {
                      setNewDateFrom(dateFrom);
                      setNewDateTo(dateTo);
                      setPopoverOpen(false);
                    }}
                    >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn ml-auto"
                    onClick={() => {
                      setDateFrom(newDateFrom);
                      setDateTo(newDateTo);
                      setPopoverOpen(false);
                    }}
                    >
                    Save
                  </button>
                </div>
            </PopoverBody>
          </Popover>
      </FormGroup>
  );
}