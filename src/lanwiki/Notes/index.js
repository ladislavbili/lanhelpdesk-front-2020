import React from 'react';
import ShowData from 'components/showData';
import NoteContainer from './NoteContainer';
import NoteEmpty from './noteEmpty';
import moment from 'moment';

import {
  objectToAtributeArray
} from 'helperFunctions';

import {
  tags,
  notes,
} from '../constants';

export default function List( props ) {

  const {
    match,
    history
  } = props;

  const [ notesFilter, setNotesFilter ] = React.useState( "" );

  const mappedNotes = notes.map( ( note ) => ( {
      ...note,
      tags: tags.filter( ( item ) => note.tags.includes( item.id ) )
    } ) )
    .filter( ( item ) => item.tags.some( ( item ) => match.params.listID === 'all' || !match.params.listID || item.id === parseInt( match.params.listID ) ) );

  return (
    <div className="lanwiki-content row">
          <div className="col-lg-4">
            <div className="scroll-visible fit-with-header lanwiki-list">

              <h1>{match.params.listID === 'all' ? "ALL" : tags.find(tag => tag.id === parseInt( match.params.listID ))?.title}</h1>

              <div className="search-row">
                <div className="search">
                  <input
                    type="text"
                    className="form-control search-text"
                    value={notesFilter}
                    onChange={ (e) => setNotesFilter(e.target.value) }
                    placeholder="Search"
                    />
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                </div>
              </div>

                  {mappedNotes.filter((item)=>item.title.toLowerCase().includes(notesFilter.toLowerCase())).map((note)=> (
                    <li>
            					<div>
            						<p className="pull-right">
            							<span>
                            {`Updated: 09.02.2021`}
            							</span>
            						</p>
            						<p className="list-title">
                          {note.title}
            						</p>
            					</div>
                      <div className="lanwiki-tags" >
                        {`Tags: ${objectToAtributeArray(note.tags, 'title').join(' ')}`}
                      </div>
            				</li>
                  ))}
            </div>
          </div>
          <div className="col-lg-8">
            {
              match.params.listID && notes.some((item)=>item.id===parseInt(match.params.listID)) && <NoteContainer {...{history, match}} />
            }
            {
              !match.params.listID && <NoteEmpty/>
            }
          </div>
        </div>
  );
}