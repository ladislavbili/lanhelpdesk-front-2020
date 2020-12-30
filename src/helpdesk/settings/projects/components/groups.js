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
  projectACLS,
  projectDoubleACLS
} from './acl';

let fakeID = -1;

export default function ProjectGroups( props ) {
  //props
  const {
    addGroup
  } = props;

  const [ open, setOpen ] = React.useState( false );
  const [ title, setTitle ] = React.useState( '' );
  const [ order, setOrder ] = React.useState( 0 );

  return (
    <div className="row">
      <h3 className="m-t-20 m-b-20 m-r-10"> Project groups </h3>
      <Button
        id={`add-project-group`}
        className="center-hor"
        onClick={ () => setOpen(true) }
        >
        <i className="fa fa-plus" />
        Add group
      </Button>
      <Popover
        placement="left"
        target={`add-project-group`}
        toggle={() => setOpen(false) }
        isOpen={ open }
        >
        <PopoverHeader>Create group</PopoverHeader>
        <PopoverBody>
          <FormGroup>
            <Label for="group-title">Group name</Label>
            <Input placeholder="Enter group name" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label for="role">Order</Label>
            <Input placeholder="Set order" value={order} onChange={(e) => setOrder(e.target.value)}/>
          </FormGroup>
          <Button
            disabled={ title.length === 0 || isNaN(parseInt(order)) }
            onClick={ () => {
              let rights = {};
              projectACLS.forEach((acl) => {
                rights[acl.id] = Math.random() > 0.5;
              })
              projectDoubleACLS.forEach((acl) => {
                rights[acl.id] = { read: Math.random() > 0.5, write: false };
              })
              addGroup({ title, id: fakeID--, order, rights })
              setTitle('');
              setOrder(0);
              setOpen(false);
            } }
            >
            Add new group
          </Button>
        </PopoverBody>
      </Popover>
    </div>
  );
}