import React from 'react';
import moment from 'moment';

import {
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  Input,
  FormGroup,
} from 'reactstrap';
import {
  pickSelectStyle,
} from 'configs/components/select';
import Select from 'react-select';
import DatePicker from 'components/DatePicker';

export default function StatusChangeModal( props ) {
  const {
    open,
    statuses,
    newStatus,
    userRights,
    closeModal,
    submit,
  } = props;

  const [ status, setStatus ] = React.useState( false );
  const [ comment, setComment ] = React.useState( "" );
  const [ date, setDate ] = React.useState( null );

  React.useEffect( () => {
    setComment( "" );
    changeStatus( newStatus )
  }, [ newStatus ] )

  const changeStatus = ( newStatus ) => {
    setStatus( newStatus );
    if ( newStatus === null ) {
      setDate( null );
    } else if ( newStatus.action === 'PendingDate' ) {
      setDate( moment()
        .add( 1, 'days' ) );
    } else {
      setDate( moment() );
    }
  }

  const getDateType = () => {
    let dateType = 'Status change';
    if ( status ) {
      switch ( status.action ) {
        case 'CloseDate':
        case 'Invalid': {
          dateType = 'Close date';
          break;
        }
        case 'PendingDate': {
          dateType = 'Pending date';
          break;
        }
        default: {
          break;
        }

      }
    }
    return dateType;
  }


  return (
    <Modal isOpen={open} className="statusChangeModal small-modal">
        <ModalBody>
          <h1>Change status</h1>
          <div className="row" >
            <div className="width-50-p p-r-10">
              <Label className="center-hor">
                New status
              </Label>
              <Select
                placeholder="Status required"
                className=""
                value={status}
                styles={pickSelectStyle( [ 'noArrow', 'colored', 'required', ] )}
                onChange={ changeStatus }
                options={(statuses).filter((status)=>status.action!=='Invoiced')}
                />
            </div>
            <div className="width-50-p">
              <Label className="center-hor">
                {getDateType()}
              </Label>
                <DatePicker
                  className="form-control bkg-white"
                  selected={date}
                  disabled={ !status || !['CloseDate', 'Invalid', 'PendingDate'].includes(status.action) }
                  onChange={setDate}
                  placeholderText={`No ${getDateType().toLowerCase()}`}
                  />
            </div>
          </div>
            <FormGroup className="m-t-10">
              <Label>
                Comment change
              </Label>
              <Input type="textarea" disabled={!userRights.rights.addComments} placeholder="Enter comment" rows="4" value={comment} onChange={(e)=>setComment(e.target.value)}/>
            </FormGroup>

          <div className="row m-t-30">
            <button className="btn-link-cancel" onClick={closeModal}>
              Close
            </button>

            <button
              className="ml-auto btn"
              disabled={ !date || !date.isValid() || !status }
              onClick={() => submit(status, comment, date) }
              >
              Change status
            </button>
          </div>
        </ModalBody>
      </Modal>
  );
}