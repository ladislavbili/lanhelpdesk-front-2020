import React from 'react';
import Select from 'react-select';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import CKEditor from 'components/CKEditor';
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
  const [ bodyImages, setBodyImages ] = React.useState( [] );

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
    <Empty>
      <div className={classnames({"fit-with-header-and-lanwiki-commandbar scroll-visible": edit, "p-b-20":  disabled || !edit },"p-t-20 p-l-20 p-r-20 p-b-0")} style={{backgroundColor: "#eaeaea"}}
        >
        { disabled &&
          <FormGroup>
            <h2>
              {title}
            </h2>
          </FormGroup>
        }
        { !disabled &&
          <FormGroup>
            <Empty>
              <Label htmlFor="name">{t('title')}</Label>
              <Input id="name" className="form-control" placeholder={t('titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)}/>
            </Empty>
          </FormGroup>
        }

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

        <FormGroup>
          <Label htmlFor="tags">{t('tags')}</Label>
          {! disabled &&
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
          }
          {disabled &&
            <div className="row">
              { tags.map((tag) => (
                <span key={tag.id} style={{ background: tag.color, color: 'white', borderRadius: 3 }} className="m-r-5 p-l-5 p-r-5">
                  {tag.title}
                </span>
              )) }
            </div>
          }
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">{t('content')}</Label>
          { !disabled &&
            <CKEditor
              value={body}
              type="imageUpload"
              onChange={(body) => {
                setBody(body);
              }}
              uploadImage={ (images) => {
                setBodyImages([...bodyImages, ...images]);
              }}
              images={bodyImages}
              />
          }
          { disabled &&
            <div className="task-edit-popis p-t-10 min-height-300-f" dangerouslySetInnerHTML={{ __html: body }} />
          }
        </FormGroup>

        { !edit && <AddPageErrors title={title} body={body} folder={folder} show={showErrors} />}
        { edit && <EditPageErrors title={title} body={body} folder={folder} show={showErrors} />}

        { !edit &&
          <div className="row m-t-20">
            <button className="btn-link-cancel" onClick={close}>{edit ? t('back') : t('cancel')}</button>
            { !disabled &&
              <div className="ml-auto">
                <button
                  className="btn"
                  disabled={cannotSave() && showErrors}
                  onClick={saveOrAddPage}
                  >
                  {saving ? `${t('adding')}...` : `${t('add')} ${t('lanwikiPage').toLowerCase()}`}
                </button>
              </div>
            }
          </div>
        }
      </div>
      { !disabled && edit &&
        <div className="task-add-layout row stick-to-bottom">
          <div className="center-ver">
            <button
              className="btn-link task-add-layout-button btn-distance"
              onClick={close}
              >
              <i className="fas fa-arrow-left commandbar-command-icon" />
              {t('close')}
            </button>
            <button
              className="btn-link task-add-layout-button btn-distance"
              disabled={cannotSave() && showErrors}
              onClick={saveOrAddPage}
              >
              {saving ? `${t('saving')}...` : `${t('save')} ${t('lanwikiPage').toLowerCase()}`}
            </button>
          </div>
        </div>
      }
    </Empty>
  );
}