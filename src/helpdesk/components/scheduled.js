import React from 'react';
import Checkbox from 'components/checkbox';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  FormGroup,
  Label
} from 'reactstrap';
import Select from 'react-select';
import DatePicker from 'components/DatePicker';
import classnames from "classnames";
import {
  selectStyle
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
  } = props;

  const [ addItem, setAddItem ] = React.useState( null );

  const [ newUser, setNewUser ] = React.useState( null );
  const [ newFrom, setNewFrom ] = React.useState( null );
  const [ newTo, setNewTo ] = React.useState( null );
  return (
    <div className="form-selects-entry-column">
      <div className="row">
        <Label className={classnames({"m-l-0 m-t-5 m-r-10": layout === 1})} >Scheduled</Label>
        <button
          className={classnames("btn btn-link waves-effect", {"ml-auto": layout === 2})}
          disabled={disabled}
          onClick={()=>{
            setAddItem(true);
          }}
          >
          <i className="fa fa-plus" />
        </button>
      </div>
      <div className={classnames("form-selects-entry-column-rest", {"row": layout === 1})} style={{border: "none"}}>
        { items.map((item) =>
          <div className={classnames({"m-l-7": layout === 2}, "row", {"m-r-10": layout === 1})} key={item.id}>
            <span className={classnames({"make-space-30-r": layout === 2, "m-r-10": layout === 1})}>
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
              className="btn btn-link waves-effect ml-auto"
              disabled={disabled}
              onClick={()=>{
                deleteItem(item);
              }}
              >
              <i className="fa fa-times" />
            </button>
          </div>
        ) }
        <Modal isOpen={addItem}  >
          <ModalHeader>Add scheduled</ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label style={{width:50}}>From</Label>
              <DatePicker
                className="form-control hidden-input"
                selected={newFrom}
                disabled={disabled}
                onChange={date => {
                  setNewFrom(date);
                  if(newTo === null){
                    setNewTo(date);
                  }
                }}
                placeholderText="No start"
                />
            </FormGroup>
            <FormGroup>
              <Label style={{width:50}}>To</Label>
              <DatePicker
                className="form-control hidden-input"
                selected={newTo}
                disabled={disabled}
                onChange={date => {
                  setNewTo(date);
                  if(newFrom === null){
                    setNewFrom(date);
                  }
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
                styles={selectStyle}
                />
            </FormGroup>
            <div className="p-t-5 row">
              <Button
                className="btn-red m-l-5 btn btn-secondary"
                onClick={() => {
                  setAddItem(!addItem)
                  setNewUser(null);
                  setNewFrom(null);
                  setNewTo(null);
                }}
                >
                Close
              </Button>
              <Button
                disabled={
                  newUser === null ||
                  newFrom === null ||
                  newTo === null
                }
                className="btn-primary center-hor ml-auto"
                onClick={() => {
                  submitItem({user: newUser, from: newFrom, to: newTo})
                  setNewUser(null);
                  setNewFrom(null);
                  setNewTo(null);
                  setAddItem(!addItem)
                }}
                >
                Add
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </div>
  )
}