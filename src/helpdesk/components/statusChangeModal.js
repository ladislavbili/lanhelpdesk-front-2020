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
  selectStyleNoArrowColoredRequired,
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
    <div>
      <Modal isOpen={open}>
        <ModalBody>
          <div className="row" >
            <div className="row">
              <Label className="center-hor">
                New status
              </Label>
              <Select
                placeholder="Status required"
                className="m-l-5 minimal-select"
                value={status}
                styles={selectStyleNoArrowColoredRequired}
                onChange={ changeStatus }
                options={(statuses).filter((status)=>status.action!=='Invoiced')}
                />
            </div>
            <div className="ml-auto">
              <Label className="center-hor">
                {getDateType()}:
              </Label>
              <DatePicker
                className="form-control hidden-input bolder"
                selected={date}
                disabled={ !status || !['CloseDate', 'Invalid', 'PendingDate'].includes(status.action) }
                onChange={setDate}
                placeholderText={`No ${getDateType().toLowerCase()}`}
                />
            </div>
          </div>
            <FormGroup className="m-t-20">
              <Label>
                Comment change:
              </Label>
              <Input type="textarea" disabled={!userRights.addComments} placeholder="Enter comment" rows="4" value={comment} onChange={(e)=>setComment(e.target.value)}/>
            </FormGroup>

          <div className="row">
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
    </div>
  );
}