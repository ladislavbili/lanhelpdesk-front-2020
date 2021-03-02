import React from 'react';
import {
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
  createCleanRights
} from 'configs/constants/projects';

let fakeID = -( defaultGroups.length + 1 );

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
      <button
        id={`add-project-group`}
        className="btn center-hor"
        onClick={ () => setOpen(true) }
        >
        <i className="fa fa-plus" />
        Add group
      </button>
      <Popover
        placement="right"
        target={`add-project-group`}
        toggle={() => setOpen(false) }
        isOpen={ open }
        >
        <PopoverHeader><span className="h5 p-l-10">Create group</span></PopoverHeader>
        <PopoverBody className="m-10">
          <FormGroup>
            <Label for="group-title">Group name</Label>
            <Input placeholder="Enter group name" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label for="role">Order</Label>
            <Input placeholder="Set order" value={order} onChange={(e) => setOrder(e.target.value)}/>
          </FormGroup>
          <button
            disabled={ title.length === 0 || isNaN(parseInt(order)) }
            onClick={ () => {
              addGroup({ title, id: fakeID--, order, rights: createCleanRights() })
              setTitle('');
              setOrder(0);
              setOpen(false);
            } }
            >
            Add new group
          </button>
        </PopoverBody>
      </Popover>
    </div>
  );
}