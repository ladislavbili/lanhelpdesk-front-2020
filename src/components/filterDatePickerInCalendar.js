import React, {
  Component,
  forwardRef
} from 'react';
import {
  Button,
  FormGroup
} from 'reactstrap';

import DatePicker from 'components/DatePicker';
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";

export default function FilterDatePickerInCalendar( props ) {
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
  } = this.props;
  const {
    t
  } = useTranslation();

  const DateInputFrom = forwardRef(
    ( {
      value,
      onClick
    }, ref ) => {
      let text = '';
      if ( minimal ) {
        text = showNowFrom ? t( 'currentDate' ) : ( value ? `${value}` : t( 'selectDateFrom' ) )
      } else {
        text = showNowFrom ? `${t('from')}: ${t('currentDate')}` : ( value ? `${t('from')}: ${value}` : t( 'selectDateFrom' ) );
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
          { minimal ? t('now') : t('setNow') }
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
        text = showNowTo ? t( 'currentDate' ) : ( value ? `${value}` : t( 'selectDateTo' ) )
      } else {
        text = showNowTo ? `${t('from')}: ${t('currentDate')}` : ( value ? `${t('from')}: ${value}` : t( 'selectDateTo' ) );
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
          { minimal ? t('now') : t('setNow') }
        </Button>
    </div>
      )
    }
  )

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
              placeholderText={t('noDate')}
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
              placeholderText={t('noDate')}
              customInput={ <DateInputTo /> }
              />
          </FormGroup>
        </div>
      </div>
    </FormGroup>
  );
}