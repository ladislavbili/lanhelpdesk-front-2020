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
    note,
    openEdit
  } = props;

  return (
    <div className={"lanwiki-note scrollable fit-with-header"} >

      <div className="lanwiki-title group">
        <h1>{`${note.id}: ${note.title}`}</h1>
      </div>

      <div className="group ">
        <div className="row rest h-30px"  style={{alignItems: "baseline"}}>
          <Label className="btn-distance">Description</Label>
          <button className="btn-link btn-distance" onClick={openEdit}><i className="fa fa-pen" /> Edit</button>
          <div>
            {note.tags.map((tag)=> (
              <span key={tag.id} className="label label-info m-r-5">{tag.title}</span>
            ))}
          </div>
        </div>
        <div className="description">
        {note.body}
      </div>
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