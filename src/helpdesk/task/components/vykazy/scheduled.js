import React from 'react';
import {
  Popover,
  PopoverBody,
  FormGroup,
  Label
} from 'reactstrap';
import moment from 'moment';
import DatePicker from 'components/DatePicker';
import {
  useTranslation
} from "react-i18next";

const getTimeDifference = ( fromDate, toDate ) => {
  if ( fromDate === null || toDate === null ) {
    return null;
  }
  return (
    moment.duration( toDate.diff( fromDate ) )
    .asMinutes() / 60
  )
}

export default function Scheduled( props ) {
  const {
    dateFrom,
    dateTo,
    disabled,
    needsSubmit,
    submit,
    quantity,
    //setQuantity,
    id,
  } = props;

  const {
    t
  } = useTranslation();

  const [ scheduledOpen, setScheduledOpen ] = React.useState( false );
  const [ newFrom, setNewFrom ] = React.useState( dateFrom ? dateFrom : null );
  const [ newTo, setNewTo ] = React.useState( dateTo ? dateTo : null );
  const floatQuantity = isNaN( parseFloat( quantity ) ) ? 1 : parseFloat( quantity );

  // sync
  React.useEffect( () => {
    setNewFrom( dateFrom ? dateFrom : null );
  }, [ dateFrom ] );
  React.useEffect( () => {
    setNewTo( dateTo ? dateTo : null );
  }, [ dateTo ] );

  return (
    <div className="center-hor">
      <span
        className="clickable"
        onClick={() =>{
          setScheduledOpen(true);
          if(!dateFrom && !dateTo ){
            setNewFrom(moment());
            setNewTo(moment().add(floatQuantity, 'hours' ));
          }
        }}
        id={'scheduled-' + id }
        >
        { newFrom && newTo ?
          `
          ${
            newFrom.format( 'DD.MM.YYYY' ) === newTo.format( 'DD.MM.YYYY' ) ?
            newFrom.format( 'HH:mm' ) :
            newFrom.format( 'HH:mm DD.MM.YYYY' )
          } -
          ${ newTo.format( 'HH:mm DD.MM.YYYY' ) }
          ` :
          t('noScheduledDate')
        }
      </span>
      <Popover className="scheduled-in-table" placement="bottom" style={{maxWidth: '350px !important', width: '350px !important'}} isOpen={scheduledOpen && !disabled} target={'scheduled-' + id } toggle={() => {setScheduledOpen(!scheduledOpen)}}>
        <PopoverBody>
          <FormGroup>
            <Label className="width-100-p">{t('from')}</Label>
            <DatePicker
              className="form-control width-100-p"
              selected={newFrom}
              disabled={disabled}
              onChange={date => {
                setNewFrom(date);
                if(newTo === null || date.isAfter(newTo) ){
                  if(floatQuantity !== null){
                    setNewTo(moment(date).add(floatQuantity, 'hours'))
                  }else{
                    setNewTo(moment(date).add(1, 'hours'));
                    //setQuantity(1);
                  }
                }else{
                  //setQuantity(moment.duration(newTo.diff(date)).asHours());
                }
                if(!needsSubmit){
                  if(newTo === null || date.isAfter(newTo) ){
                    if(floatQuantity !== null){
                      submit( date, moment(date).add(floatQuantity, 'hours'), floatQuantity );
                    }else{
                      submit( date, moment(date).add(1, 'hours'), 1 );
                    }
                  }else{
                    submit( date, newTo, getTimeDifference(date, newTo) );
                  }
                }
              }}
              placeholderText={t('noStartDate')}
              />
          </FormGroup>
          <FormGroup>
            <Label className="width-100-p">{t('to')}</Label>
            <DatePicker
              className="form-control width-100-p"
              selected={newTo}
              disabled={disabled}
              popperPlacement="auto-left"
              minDate={ newFrom }
              onChange={date => {
                setNewTo(date);
                if(newFrom === null || !date.isAfter(newFrom) ){
                  if(floatQuantity !== null){
                    setNewFrom(moment(date).add( -1 * floatQuantity, 'hours' ))
                  }else{
                    setNewFrom(moment(date).add( -1, 'hours' ));
                    //setQuantity(1);
                  }
                }else{
                  //setQuantity(moment.duration(date.diff(newFrom)).asHours());
                }
                if(!needsSubmit){
                  if(newFrom === null || date.isAfter(newFrom) ){
                    if(floatQuantity !== null){
                      submit( date, moment(date).add( -1 * floatQuantity, 'hours' ), floatQuantity );
                    }else{
                      submit( moment(date).add(-1, 'hours'), date , 1 );
                    }
                  }else{
                    submit( newFrom, date, getTimeDifference(newFrom, date) );
                  }
                }
              }}
              placeholderText={t('noToDate')}
              />
          </FormGroup>
          <div className="p-t-5 row">
            <button
              className="btn-link-cancel btn-distance"
              onClick={() => {
                if(needsSubmit){
                  setNewFrom(dateFrom);
                  setNewTo(dateTo);
                }
                setScheduledOpen(false);
              }}
              >
              {t('close')}
            </button>
            <button
              className="btn-link-cancel btn-distance"
              onClick={() => {
                setNewFrom(null);
                setNewTo(null);
              }}
              >
              {t('clear')}
            </button>
            <button
              disabled={disabled}
              className="btn center-hor ml-auto"
              onClick={() => {
                const scheduledClear = newFrom === null || newTo === null;
                if(needsSubmit){
                  submit(scheduledClear ? null : newFrom, scheduledClear ? null : newTo, getTimeDifference(newFrom, newTo));
                }
                setScheduledOpen(false);
              }}
              >
              {t('save')}
            </button>
          </div>
        </PopoverBody>
      </Popover>
    </div>
  )
}