import React from 'react';
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  Label,
  Input,
  FormGroup,
} from 'reactstrap';
import ProjectAdd from 'helpdesk/settings/projects/projectAdd';
import {
  setProject,
} from 'apollo/localSchema/actions';
import {
  defaultGroups,
  createRandomRights
} from 'configs/constants/projects';

let fakeID = -( defaultGroups.length + 1 );

export default function ProjectGroups( props ) {
  //props
  const {
    updateGroup,
    group
  } = props;

  const [ open, setOpen ] = React.useState( false );
  const [ title, setTitle ] = React.useState( group.title );
  const [ order, setOrder ] = React.useState( group.order );

  return (
    <div>
      <Button
        id={`edit-project-group-${group.id}`}
        className="btn waves-effect m-r-5"
        onClick={ () => setOpen(true) }
        >
        EDIT
      </Button>
      <Popover
        placement="right"
        target={`edit-project-group-${group.id}`}
        toggle={() => setOpen(false) }
        isOpen={ open }
        >
        <PopoverHeader><span className="h5 p-l-10">Edit group</span></PopoverHeader>
        <PopoverBody className="m-10">
          <FormGroup>
            <Label for="group-title">Group name</Label>
            <Input placeholder="Enter group name" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label for="role">Order</Label>
            <Input placeholder="Set order" value={order} onChange={(e) => setOrder(e.target.value)}/>
          </FormGroup>
          <Button
            onClick={ () => {
              setTitle(group.title);
              setOrder(group.order);
            } }
            >
            Restore
          </Button>
          <Button
            disabled={ title.length === 0 || isNaN(parseInt(order)) }
            onClick={ () => {
              updateGroup({ title, id: group.id, order })
              setOpen(false);
            } }
            >
            Update
          </Button>
        </PopoverBody>
      </Popover>
    </div>
  );
}