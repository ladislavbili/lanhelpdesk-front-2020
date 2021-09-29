import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup,
} from 'reactstrap';
import Empty from 'components/Empty';
import {
  defaultGroups,
  createCleanRights,
  getEmptyAttributeRights,
} from 'configs/constants/projects';

export default function ProjectGroupAdd( props ) {
  //props
  const {
    submit,
    getFakeId,
    reccomendedOrder,
  } = props;

  const [ open, setOpen ] = React.useState( false );
  const [ title, setTitle ] = React.useState( '' );
  const [ description, setDescription ] = React.useState( '' );
  const [ order, setOrder ] = React.useState( '' );

  React.useEffect( () => {
    if ( open ) {
      setTitle( '' );
      setDescription( '' );
      setOrder( '' );
    }
  }, [ open ] );

  return (
    <Empty>
      <button
        className="btn btn-link"
        onClick={() => setOpen(true)}
        >
        <i className="fa fa-plus" />
        Group
      </button>
      <Modal isOpen={open}>
        <ModalHeader>
          Edit group
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="group-title">Group name</Label>
            <Input placeholder="Enter group name" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label for="group-title">Group description</Label>
            <Input placeholder="Enter group description" value={description} onChange={(e) => setDescription(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label for="role">Order</Label>
            <Input placeholder="Set order" type="number" value={order} onChange={(e) => setOrder(e.target.value)}/>
          </FormGroup>
          <div className="form-buttons-row m-b-10">
            <button
              className="btn btn-link-cancel"
              onClick={ () => {
                setOpen(false);
              } }
              >
              Cancel
            </button>
            <div className="ml-auto">
              <button
                className="btn"
                disabled={ title.length === 0 || isNaN(parseInt(order)) }
                onClick={ () => {
                  submit({ title, description, id: getFakeId(), order, rights: createCleanRights(), attributeRights: getEmptyAttributeRights() })
                  setOpen(false);
                } }
                >
                Add
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Empty>
  );
}