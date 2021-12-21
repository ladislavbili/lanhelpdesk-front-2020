import React, {
  Component
} from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import TagACL from './acl';

import {
  users,
  usersWithRights
} from '../constants';

export default function TagEdit( props ) {

  const [ saving, setSaving ] = React.useState( false );
  const [ title, setTitle ] = React.useState( "Tag 2" );
  const [ body, setBody ] = React.useState( "Hello" );

  const submit = () => {}

  const cancel = () => {}

  return (
    <div className="lanwiki-tag-form">
      <h1>Edit tag</h1>

      <FormGroup >
        <Label htmlFor="name">Title</Label>
        <Input id="name" className="form-control" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)}/>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="body">Description</Label>
        <Input type="textarea" className="form-control" id="body" placeholder="Enter text" value={body} onChange={(e) => setBody(e.target.value)}/>
      </FormGroup>

      <TagACL
        users={users}
        usersWithRights={usersWithRights}
        />

      <div className="row buttons">
        <Button className="btn btn-link-cancel" disabled={saving} onClick={cancel}>
          Close
        </Button>
        <Button  className="btn ml-auto" onClick={submit} >
          {!saving ? "Save":"Saving..."}
        </Button>
      </div>
    </div>
  );
}