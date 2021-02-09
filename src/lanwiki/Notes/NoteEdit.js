import React, {
  Component
} from 'react';
import {
  Button,
  FormGroup,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label
} from 'reactstrap';

import TimeAgo from 'react-timeago'
import Select from 'react-select';
import {
  timestampToString,
  toSelArr
} from '../../helperFunctions';
import {
  selectStyle
} from 'configs/components/select';

import CKEditor from 'ckeditor4-react';
import CKEditor5 from '@ckeditor/ckeditor5-react';
import ck5config from 'configs/components/ck5config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import PictureUpload from './PictureUpload';

import classnames from "classnames";
import Comments from './comments';

import {
  tags as allTags,
  notes,
  users,
  usersWithRights
} from '../constants';

export default function NoteEdit( props ) {

  const {
    match,
    history,
    note,
    cancel
  } = props;

  const columns = false;

  const [ saving, setSaving ] = React.useState( false );
  const [ loading, setLoading ] = React.useState( true );
  const [ dropdownOpen, setDropdownOpen ] = React.useState( false );
  const [ modalOpen, setModalOpen ] = React.useState( false );
  const [ name, setName ] = React.useState( note.title );
  const [ body, setBody ] = React.useState( note.body );
  const [ newLoad, setNewLoad ] = React.useState( false );
  const [ tags, setTags ] = React.useState( [] );
  const [ chosenTags, setChosenTags ] = React.useState( note.tags );
  const [ dateCreated, setDateCreated ] = React.useState( null );
  const [ lastUpdated, setLastUpdated ] = React.useState( null );
  const [ editBodyOpen, setEditBodyOpen ] = React.useState( false );
  const [ value, setValue ] = React.useState( 0 );
  const [ timeout, setTimeout ] = React.useState( null );


  const submit = () => {}

  const toggleModal = () => {
    setModalOpen( !modalOpen );
  }

  const onEditorChange = ( evt ) => {
    if ( newLoad ) {
      setBody( evt.editor.getData() );
      setNewLoad( false );
    } else {
      setBody( evt.editor.getData() );
    }
  }

  const appendImage = ( image ) => {
    setBody( body.concat( image ) );
    setModalOpen( false );
  }

  return (
    <div className={"lanwiki-note scrollable fit-with-header-and-commandbar"} >
      <div className="row lanwiki-title">
        <h1 className="center-hor">{note.id}:</h1>
        <span className="center-hor flex m-l-5">
          <input
            type="text"
            value={name}
            className="task-title-input hidden-input flex"
            onChange={ (e) =>  setName(e.target.value) }
            placeholder="Enter task name"
            />
        </span>
      </div>


      <div className="note-tags edit">
        <Label>Tags</Label>
        <div className="f-1">
          <Select
            value={tags}
            isMulti
            onChange={ (tags) => setTags(tags) }
            options={allTags}
            styles={selectStyle}
            />
        </div>
      </div>

      <Modal isOpen={modalOpen}>
        <ModalHeader>
          Picture upload
        </ModalHeader>
        <ModalBody className="m-t-15">
          <PictureUpload appendImage={appendImage}/>
        </ModalBody>
        <ModalFooter>
          <Button className="btn-link mr-auto" onClick={toggleModal}>Close</Button>{'  '}
          </ModalFooter>
        </Modal>

        <FormGroup className=""  style={{position: "relative",zIndex:(modalOpen ? "1" : "9999")}}>
          {
            false &&
            <Button className="btn-link-reversed p-l-0" onClick={toggleModal}>
              Pridať obrázok z uložiska
            </Button>
          }
          <CKEditor5
            editor={ ClassicEditor }
            data={body}
            onInit={(editor)=>{}}
            onChange={(e, editor)=>{
              setBody(editor.getData());
            }}
            config={ck5config}
            />
        </FormGroup>

        <div className="row m-b-20">
          <Button className="btn btn-link-cancel" disabled={saving} onClick={cancel}>
            Close
          </Button>
          <Button  className="btn ml-auto" onClick={submit} >
            {!saving ? "Save":"Saving..."}
          </Button>
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