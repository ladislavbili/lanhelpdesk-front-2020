import React, {
  Component,
  forwardRef
} from 'react';
import {
  Button,
  FormGroup,
  Popover,
  PopoverHeader,
  PopoverBody,
  Label
} from 'reactstrap';

import DatePicker from 'components/DatePicker';
import classnames from 'classnames';
import moment from 'moment';
import {
  useTranslation
} from "react-i18next";


export default function FilterDatePickerPopover( props ) {
  const {
    id,
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
  const {
    t
  } = useTranslation();

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
        text = showNowFrom ? t( 'currentDate' ) : ( value ? `${value}` : t( 'selectDateFrom' ) )
      } else {
        text = showNowFrom ? `${t('from')}: ${t('currentDate')}` : ( value ? `${t('from')}: ${value}` : t( 'selectDateFrom' ) );
      }
      return (
        <div className="row form-control p-0" style={ minimal ? {  color:'inherit' } : {}}>
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
        <div className="row form-control p-0" style={ minimal ? {  color:'inherit' } : {}}>
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
      <Label id={`date-popover-${id}`} style={{display: "block"}}>
        {label}
      </Label>
      <div className="bkg-white">
        <button type="button" className="btn-link p-l-0 p-r-0 m-r-0" onClick={() => setPopoverOpen(true)}>
          {`${dateFrom ? dateFrom.format( 'DD.MM.YYYY' ) : t('all')} - ${dateTo ? dateTo.format( 'DD.MM.YYYY' ) : t('all')}`}
        </button>
        <Popover placement="bottom-end" className="custom-popover" isOpen={popoverOpen} target={`date-popover-${id}`} toggle={() => setPopoverOpen(false)}>
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
              {t('thisWeek')}
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
              {t('lastWeek')}
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
              {t('thisMonth')}
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
              {t('lastMonth')}
            </button>
            <div className="row">
              <div className="width-50-p p-r-10">
                <div className="row">
                  <label className="center-hor">{t('from')}</label>
                  <button type="button" className="btn-link ml-auto m-r-0" onClick={() => setNewDateFrom(moment())}>
                    {t('now')}
                  </button>
                </div>
                <DatePicker
                  className="form-control"
                  hideTime={true}
                  selected={newDateFrom}
                  onChange={(e)=>{
                    setNewDateFrom(e);
                  }}
                  placeholderText={t('noDate')}
                  />
              </div>

              <div className="width-50-p p-l-10">
                <div className="row">
                  <label className="center-hor">{t('to')}</label>
                  <button type="button" className="btn-link ml-auto m-r-0" onClick={() => setNewDateTo(moment())}>
                    {t('now')}
                  </button>
                </div>
                <DatePicker
                  className="form-control"
                  hideTime={true}
                  selected={newDateTo}
                  onChange={(e)=>{
                    setNewDateTo(e);
                  }}
                  placeholderText={t('noDate')}
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
                {t('cancel')}
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
                {t('save')}
              </button>
            </div>
          </PopoverBody>
        </Popover>
      </div>
    </FormGroup>
  );
}