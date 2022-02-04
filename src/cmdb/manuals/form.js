import React from 'react';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import CKEditor from 'components/CKEditor';
import Empty from 'components/Empty';
import AddManualErrors from './add/showErrors';
import EditManualErrors from './edit/showErrors';
import classnames from 'classnames';

import {
  timestampToString,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";

export default function ManualForm( props ) {
  const {
    edit,
    close,
    addManual,
    saveManual,
    disabled,
    manual,
  } = props;
  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( manual ? manual.title : '' );
  const [ body, setBody ] = React.useState( manual ? manual.body : '' );

  const [ showErrors, setShowErrors ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  const cannotSave = () => {
    return (
      saving ||
      title.length === 0
    );
  }

  const saveOrAddManual = () => {
    if ( disabled ) {
      return;
    };
    if ( cannotSave() ) {
      setShowErrors( true );
    } else {
      let data = {
        title,
        body,
      };
      if ( edit ) {
        saveManual( data, setSaving );
      } else {
        addManual( data, setSaving );
      }
    }
  }

  return (
    <Empty>
      <div className={classnames({"fit-with-header-and-lanwiki-commandbar scroll-visible": edit, "p-b-20":  disabled || !edit },"p-t-20 p-l-20 p-r-20 p-b-0")} style={{backgroundColor: "#eaeaea"}}
        >

        <div className="row">
        </div>
        <FormGroup>
          { !disabled && <Label htmlFor="name">{t('title')}</Label> }
          { disabled &&
            <div>
              <div className="row">
                <div>
                  <Label htmlFor="name">{t('title')}</Label>
                  <h2>
                    {title}
                  </h2>
                </div>
                <div className="ml-auto">
                  <div className="text-right">
                    <span>
                      {manual.createdBy ? `${t('createdBy')} ` : ""}
                    </span>
                    <span className="bolder">
                      {manual.createdBy ? `${manual.createdBy.fullName}` :''}
                    </span>
                    <span>
                      {manual.createdBy ?` ${t('atDate')} `: t('createdAt')}
                    </span>
                    <span className="bolder">
                      {manual.createdAt ? (timestampToString(manual.createdAt)) : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <span>
                      {manual.updatedBy ? `${t('changedBy')} ` : ""}
                    </span>
                    <span className="bolder">
                      {manual.updatedBy ? `${manual.updatedBy.fullName}` :''}
                    </span>
                    <span>
                      {manual.updatedBy ?` ${t('atDate')} `: t('changedAt')}
                    </span>
                    <span className="bolder">
                      {manual.createdAt ? (timestampToString(manual.updatedAt)) : ''}
                    </span>
                  </div>
                </div>
              </div>
              <hr />
            </div>
          }
          { !disabled &&
            <Input id="name" className="form-control" placeholder={t('titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)}/>
          }
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">{t('content')}</Label>
          { disabled &&
            <FormGroup>
              <div className="task-edit-popis p-t-10 min-height-300-f" dangerouslySetInnerHTML={{ __html: body }} />
            </FormGroup>
          }
          { !disabled &&
            <CKEditor
              value={body}
              type="imageUpload"
              onChange={(body) => {
                setBody(body);
              }}
              />
          }
        </FormGroup>

        { !edit && <AddManualErrors title={title} body={body} show={showErrors} />}
        { edit && <EditManualErrors title={title} body={body} show={showErrors} />}

        { !edit &&
          <div className="row m-t-20">
            <button className="btn-red" onClick={close}>
              <i className="fas fa-ban commandbar-command-icon" />
              {t('cancel')}
              </button>
            { !disabled &&
              <div className="ml-auto">
                <button
                  className="btn"
                  disabled={cannotSave() && showErrors}
                  onClick={saveOrAddManual}
                  >
                  {saving ? `${t('adding')}...` : `${t('add')}`}
                </button>
              </div>
            }
          </div>
        }
      </div>
      { !disabled && edit &&
        <div className="button-bar row stick-to-bottom">
          <div className="center-ver row">
            <div>
              <button
                className="btn-red btn-distance center-hor"
                onClick={close}
                >
                <i className="fas fa-ban commandbar-command-icon" />
                {t('cancel')}
              </button>
            </div>
            <div>
              <button
                className="btn btn-distance center-hor"
                disabled={cannotSave() && showErrors}
                onClick={saveOrAddManual}
                >
                <i className="fas fa-save commandbar-command-icon" />
                {saving ? `${t('saving')}...` : `${t('save')}`}
              </button>
            </div>
          </div>
        </div>
      }
    </Empty>
  );
}