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

  const mappedNotes = notes.map( ( note ) => ( {
      ...note,
      tags: tags.filter( ( item ) => note.tags.includes( item.id ) )
    } ) )
    .filter( ( item ) => item.tags.some( ( item ) => match.params.listID === 'all' || !match.params.listID || item.id === parseInt( match.params.listID ) ) );

  const note = mappedNotes[ 0 ];

  const [ editFormOpen, setEditFormOpen ] = React.useState( false );

  const edit = () => {}

  const remove = () => {
    if ( window.confirm( "Chcete zmazať túto poznámku?" ) ) {
      history.goBack();
    }
  }

  return (
    <div>
      <div className="commandbar p-l-30">
        {
          !editFormOpen &&
          <button type="button" className="btn-link center-hor btn-distance" onClick={() => setEditFormOpen(true)}>
            Edit
          </button>
        }
        {
          !editFormOpen &&
          <button type="button" className="btn-link center-hor" onClick={remove}>
            Delete
          </button>
        }
      </div>

      {
        !editFormOpen &&
        <NoteInfo note={note} />
      }
      {
        editFormOpen &&
        <NoteEdit note={note} cancel={() => setEditFormOpen(false)}/>
      }
    </div>
  );
}