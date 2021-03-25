import React from 'react';

import {
  tags,
  notes
} from '../constants';

import NoteInfo from './NoteInfo';
import NoteEdit from './NoteEdit';


export default function NoteContainer( props ) {

  const {
    match,
    history,
  } = props;


  const note = {
    ...notes[ 0 ],
    tags: tags.filter( ( item ) => notes[ 0 ].tags.includes( item.id ) )
  };

  const [ editFormOpen, setEditFormOpen ] = React.useState( false );

  return (
    <div>
      {
        !editFormOpen &&
        <NoteInfo note={note}  openEdit={() => setEditFormOpen(true)}/>
      }
      {
        editFormOpen &&
        <NoteEdit note={note} cancel={() => setEditFormOpen(false)}/>
      }
    </div>
  );
}