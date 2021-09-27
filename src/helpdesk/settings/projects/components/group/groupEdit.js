import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup,
} from 'reactstrap';
import {
  defaultGroups,
} from 'configs/constants/projects';

export default function ProjectGroupEdit( props ) {
  //props
  const {
    open,
    closeModal,
    group,
    updateGroup,
  } = props;

  const [ title, setTitle ] = React.useState( '' );
  const [ description, setDescription ] = React.useState( '' );
  const [ order, setOrder ] = React.useState( '' );

  React.useEffect( () => {
    if ( group !== null ) {
      setTitle( group.title );
      setDescription( group.description );
      setOrder( group.order );
    }
  }, [ group ] );

  return (
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
              setTitle(group.title);
              setDescription(group.description);
              setOrder(group.order);
              closeModal();
            } }
            >
            Close
          </button>
          <div className="ml-auto">
            <button
              className="btn btn-distance"
              onClick={ () => {
                setTitle(group.title);
                setDescription(group.description);
                setOrder(group.order);
              } }
              >
              Restore
            </button>
            <button
              className="btn"
              disabled={ title.length === 0 || isNaN(parseInt(order)) }
              onClick={ () => {
                updateGroup({ title, description, id: group.id, order })
                closeModal();
              } }
              >
              Update
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}