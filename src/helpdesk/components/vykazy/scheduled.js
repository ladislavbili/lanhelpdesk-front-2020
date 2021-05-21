import React from 'react';
import {
  Popover,
  PopoverBody,
  FormGroup,
  Label
} from 'reactstrap';
import DatePicker from 'components/DatePicker';

export default function Scheduled( props ) {
  const {
    dateFrom,
    dateTo,
    disabled,
    needsSubmit,
    submit,
    id,
  } = props;

  const [ scheduledOpen, setScheduledOpen ] = React.useState( false );
  const [ newFrom, setNewFrom ] = React.useState( dateFrom ? dateFrom : null );
  const [ newTo, setNewTo ] = React.useState( dateTo ? dateTo : null );

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
        onClick={() => setScheduledOpen(true) }
        id={'scheduled-' + id }
        >
        { newFrom && newTo ?
          `
          ${newFrom.format( 'HH:mm DD.MM.YYYY' )} - ${
            newFrom.format( 'DD.MM.YYYY' ) === newTo.format( 'DD.MM.YYYY' ) ?
            newTo.format( 'HH:mm' ) :
            newTo.format( 'HH:mm DD.MM.YYYY' )
          }
          ` :
          `No scheduled date`
        }
      </span>
      <Popover className="scheduled-in-table" placement="bottom" style={{maxWidth: '350px !important', width: '350px !important'}} isOpen={scheduledOpen && !disabled} target={'scheduled-' + id } toggle={() => {setScheduledOpen(!scheduledOpen)}}>
          <PopoverBody>
            <FormGroup>
              <Label className="w-100">From</Label>
              <DatePicker
                className="form-control w-100"
                selected={newFrom}
                disabled={disabled}
                onChange={date => {
                  setNewFrom(date);
                  if(newTo === null || date.isAfter(newTo) ){
                    setNewTo(date);
                  }
                  if(!needsSubmit){
                    if(newTo === null || date.isAfter(newTo) ){
                      submit( date, date);
                    }else{
                      submit( date, newTo );
                    }
                  }
                }}
                placeholderText="No start"
                />
            </FormGroup>
            <FormGroup>
              <Label className="w-100">To</Label>
              <DatePicker
                className="form-control w-100"
                selected={newTo}
                disabled={disabled}
                popperPlacement="auto-left"
                onChange={date => {
                  setNewTo(date);
                    if(!needsSubmit){
                      submit(newFrom, date);
                    }
                }}
                placeholderText="No end"
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
                Close
              </button>
              <button
                className="btn-link-cancel btn-distance"
                onClick={() => {
                  setNewFrom(null);
                  setNewTo(null);
                }}
                >
                Clear
              </button>
              <button
                disabled={disabled}
                className="btn center-hor ml-auto"
                onClick={() => {
                  if(needsSubmit){
                    submit(newFrom, newTo);
                  }
                  setScheduledOpen(false);
                }}
                >
                Save
              </button>
            </div>
          </PopoverBody>
        </Popover>
    </div>
  )
}