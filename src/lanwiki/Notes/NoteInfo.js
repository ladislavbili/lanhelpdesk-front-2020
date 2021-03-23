import React from 'react';
import {
  Button,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label
} from 'reactstrap';
import Comments from './comments';

import {
  tags as allTags,
  notes,
  users,
  usersWithRights
} from '../constants';

export default function NoteInfo( props ) {

  const {
    match,
    history,
    note
  } = props;

  return (
    <div className={"lanwiki-note scrollable fit-with-header-and-commandbar"} >

      <div className="lanwiki-title group">
        <h1>{`${note.id}: ${note.title}`}</h1>
      </div>


      <div className="group">
        <Label>Tags</Label>
        <div>
          {note.tags.map((tag)=> (
            <span key={tag.id} className="label label-info m-r-5">{tag.title}</span>
          ))}
        </div>
      </div>

      <div className="group">
        {note.body}
      </div>

      <Comments
        id={1}
        isMulti
        users={users}
        userRights={usersWithRights}
        submitComment={() => {}}
        submitEmail={() => {}}
        />

    </div>
  );
}