import React from 'react';
import Select from 'react-select';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import CKCustomEditor from 'components/ckeditor5';
import CKEditor5 from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ck5config from 'configs/components/ck5config';
import Empty from 'components/Empty';
import AddPageErrors from './add/showErrors';
import EditPageErrors from './edit/showErrors';
import {
  pickSelectStyle,
} from 'configs/components/select';
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";

export default function LanwikiPageForm( props ) {
  const {
    edit,
    addPage,
    savePage,
    deletePage,
    close,
    allFolders,
    allTags,
    folderId,
    tagId,
    id,
    disabled,
    page,
  } = props;
  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( page ? page.title : '' );
  const [ folder, setFolder ] = React.useState( page ? allFolders.find( ( folder ) => folder.id === page.folder.id ) : ( folderId === null ? allFolders[ 0 ] : allFolders.find( ( folder ) => folder.id === folderId ) ) );
  const [ tags, setTags ] = React.useState( page ? allTags.filter( ( tag ) => page.tags.some( ( tag2 ) => tag2.id === tag.id ) ) : ( tagId === null ? [] : allTags.filter( ( tag ) => tag.id === tagId ) ) );
  const [ body, setBody ] = React.useState( page ? page.body : '' );

  const [ showErrors, setShowErrors ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  const cannotSave = () => {
    return (
      saving ||
      title.length === 0 ||
      !folder ||
      !folder.id
    );
  }

  const saveOrAddPage = () => {
    if ( disabled ) {
      return;
    };
    if ( cannotSave() ) {
      setShowErrors( true );
    } else {
      let data = {
        title,
        folderId: folder.id,
        tags: tags.map( ( tag ) => tag.id ),
        body,
      };
      if ( edit ) {
        data.id = id;
        savePage( data, setSaving, close );
      } else {
        addPage( data, setSaving, close );
      }
    }
  }

  return (
    <div className="p-20" style={{backgroundColor: "#eaeaea"}}>
      { disabled &&
        <FormGroup>
          <h2>
            {title}
          </h2>
          <hr className="m-t-10 m-b-10" />
          <div className="row">
            { tags.map((tag) => (
              <span key={tag.id} style={{ background: tag.color, color: 'white', borderRadius: 3 }} className="m-r-5 p-l-5 p-r-5">
                {tag.title}
              </span>
            )) }
          </div>
        </FormGroup>
      }
      <FormGroup>
        { !disabled &&
          <Empty>
            <Label htmlFor="name">{t('title')}</Label>
            <Input id="name" className="form-control" placeholder={t('titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)}/>
          </Empty>
        }
      </FormGroup>
      { !disabled && <hr className="m-t-10 m-b-10"/> }

      <FormGroup>
        <Label htmlFor="name">{t('folder')}</Label>
        { disabled &&
          <div>
            {folder.title}
          </div>
        }
        {! disabled &&
          <Select
            placeholder={t('selectFolder')}
            value={folder}
            options={allFolders.filter((folder) => folder.myRights.write )}
            onChange={(folder)=>{
              setFolder(folder);
            }}
            styles={pickSelectStyle( [ 'noArrow', 'required', ] )}
            />
        }
      </FormGroup>

      {! disabled &&
        <FormGroup>
          <Label htmlFor="tags">{t('tags')}</Label>
          <Select
            id="tags"
            placeholder={t('selectTags')}
            isMulti
            value={tags}
            options={allTags}
            onChange={(tags)=>{
              setTags(tags);
            }}
            styles={pickSelectStyle( [ 'noArrow', 'colored' ] )}
            />
        </FormGroup>
      }


      { disabled &&
        <FormGroup>
          <div className="task-edit-popis p-t-10 min-height-300-f" dangerouslySetInnerHTML={{ __html: body }} />
        </FormGroup>
      }
      { !disabled &&
        <FormGroup>
          <Label htmlFor="content">{t('content')}</Label>
          <CKEditor5
            id="content"
            editor={ ClassicEditor }
            data={body}
            onInit={(editor)=>{
            }}
            onChange={(e, editor)=>{
              setBody(editor.getData());
            }}
            config={ck5config}
            />
            <CKCustomEditor
                text={body}
                setText={(body) => {
                  setBody(body);
                }}
                buttonId={"ckeditor-file-upload-button-note-form"}
                editorIndex={0}
                />
        </FormGroup>
      }

      { !edit && <AddPageErrors title={title} body={body} folder={folder} show={showErrors} />}
      { edit && <EditPageErrors title={title} body={body} folder={folder} show={showErrors} />}

      <div className="row m-t-20">
        <button className="btn-link-cancel" onClick={close}>{edit ? t('back') : t('cancel')}</button>
        { !disabled &&
          <div className="ml-auto">
            { edit &&
              <button
                className="btn-red"
                disabled={saving}
                onClick={() => {
                  deletePage(setSaving);
                }}
                >
                {`${t('delete')} ${t('lanwikiPage').toLowerCase()}`}
              </button>
            }
            <button
              className="btn"
              disabled={cannotSave() && showErrors}
              onClick={saveOrAddPage}
              >
              {saving ? `${edit ? t('saving') : t('adding')}...` : `${edit ? t('save') : t('add')} ${t('lanwikiPage').toLowerCase()}`}
            </button>
          </div>
        }
      </div>
    </div>
  );
}