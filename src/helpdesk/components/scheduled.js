import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
  FormGroup,
  Label
} from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'components/DatePicker';
import Checkbox from 'components/checkbox';
import classnames from "classnames";
import {
  pickSelectStyle
} from 'configs/components/select';

export default function Scheduled( props ) {
  const {
    items,
    users,
    disabled,
    onChange,
    submitItem,
    deleteItem,
    layout,
    canTransfer,
    onTransfer,
  } = props;

  const [ addItem, setAddItem ] = React.useState( null );
  const [ newUser, setNewUser ] = React.useState( null );
  const [ newFrom, setNewFrom ] = React.useState( null );
  const [ newTo, setNewTo ] = React.useState( null );
  const [ trasfered, setTransfered ] = React.useState( [] );

  React.useEffect( () => {
    if ( users.length > 0 && newUser === null ) {
      setNewUser( users[ 0 ] );
    }
  }, [ users ] );

  return (
    <div className={classnames("form-selects-entry-column", {"m-r-10": layout === 1})}>
      <div className="row">
        <Label className={classnames({"m-l-0 m-t-5 m-r-10": layout === 1})} >Scheduled</Label>
        <button
          className={classnames("btn-link m-r-0 h-fit-content", {"ml-auto": layout === 2}, {"center-hor": layout === 1})}
          id="scheduledPopover"
          disabled={disabled}
          onClick={()=>{
            setAddItem(true);
          }}
          >
          <i className="fa fa-plus" />
        </button>
      </div>
      <div className={classnames("form-selects-entry-column-rest", "scheduled-items-container", {"row": layout === 1})}>
        { items.map((item) =>
          <div className={classnames("row", {"m-r-10": layout === 1})} key={item.id}>
            { onTransfer && canTransfer &&
                <Checkbox
                  className="m-t-5"
                  disabled= { !canTransfer }
                  value={ trasfered.some((id) => id === item.id ) }
                  onChange={()=>{
                    if(trasfered.some((id) => id === item.id )){
                      setTransfered(trasfered.filter((id) => id !== item.id ))
                    }else{
                      setTransfered([...trasfered, item.id])
                      onTransfer(item.id);
                    }
                  }}
                  />
          }
            <span className={classnames({"m-r-10": layout === 1})}>
              {
                `
                ${item.from.format( 'HH:mm DD.MM.YYYY' )} - ${
                  item.from.format( 'DD.MM.YYYY' ) === item.to.format( 'DD.MM.YYYY' ) ?
                  item.to.format( 'HH:mm' ):
                  item.to.format( 'HH:mm DD.MM.YYYY' )
                }
                `
              }
              <br/>
              {
                `${item.user.fullName}`
              }
            </span>
            <button
              className="btn-link ml-auto"
              disabled={disabled}
              onClick={()=>{
                deleteItem(item);
              }}
              >
              <i className="fa fa-times" />
            </button>
          </div>
        ) }

        <Popover  className="scheduled" placement="bottom" style={{maxWidth: '350px !important', width: '350px !important'}} isOpen={addItem} target="scheduledPopover" toggle={() => {setAddItem(!addItem)}}>
          <h2 className="center-hor">Add scheduled</h2>
          <PopoverBody>
            <FormGroup>
              <Label className="width-100-p">From</Label>
              <DatePicker
                className="form-control width-100-p"
                selected={newFrom}
                disabled={disabled}
                onChange={date => {
                  setNewFrom(date);
                  if(newTo === null || date.isAfter(newTo) ){
                    setNewTo(date);
                  }
                }}
                placeholderText="No start"
                />
            </FormGroup>
            <FormGroup>
              <Label className="width-100-p">To</Label>
              <DatePicker
                className="form-control width-100-p"
                selected={newTo}
                disabled={disabled}
                popperPlacement="auto-left"
                onChange={date => {
                  setNewTo(date);
                }}
                placeholderText="No end"
                />
            </FormGroup>
            <FormGroup>
              <Label>User</Label>
              <Select
                value={newUser}
                isDisabled={disabled}
                onChange={(user)=> setNewUser(user)}
                options={users}
                styles={pickSelectStyle()}
                />
            </FormGroup>
            <div className="p-t-5 row">
              <button
                className="btn-link-cancel btn-distance"
                onClick={() => {
                  setAddItem(!addItem)
                  setNewUser(null);
                  setNewFrom(null);
                  setNewTo(null);
                }}
                >
                Close
              </button>
              <button
                disabled={
                  newUser === null ||
                  newFrom === null ||
                  newTo === null
                }
                className="btn center-hor ml-auto"
                onClick={() => {
                  submitItem({user: newUser, from: newFrom, to: newTo})
                  setNewUser(null);
                  setNewFrom(null);
                  setNewTo(null);
                  setAddItem(!addItem)
                }}
                >
                Add
              </button>
            </div>
          </PopoverBody>
        </Popover>
      </div>
    </div>
  )
}