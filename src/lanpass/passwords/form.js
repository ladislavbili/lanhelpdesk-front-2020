import React from 'react';
import {
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';

import Select from "react-select";
import {
  pickSelectStyle
} from "configs/components/select";

import Empty from 'components/Empty';
import AddPasswordErrors from './add/showErrors';
import EditPasswordErrors from './edit/showErrors';
import Textarea from 'react-textarea-autosize';
import DatePicker from 'components/DatePicker';
import classnames from 'classnames';
import moment from 'moment';

import {
  timestampToString,
  toSelArr
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";

export default function PasswordForm( props ) {
  const {
    folderId,
    edit,
    close,
    addPassword,
    savePassword,
    disabled,
    passwordData,
    allFolders,
  } = props;
  const {
    t
  } = useTranslation();
  console.log(passwordData);
  const [ title, setTitle ] = React.useState( passwordData ? passwordData.title : '' );
  const [ login, setLogin ] = React.useState( passwordData ? passwordData.login : '' );
  const [ folder, setFolder ] = React.useState( null );
  const [ password, setPassword ] = React.useState( passwordData ? passwordData.password : '' );
  const [ passwordCheck, setPasswordCheck ] = React.useState( passwordData ? passwordData.password : '' );
  const [ url, setUrl ] = React.useState( passwordData ? passwordData.url : '' );
  const [ expireDate, setExpireDate ] = React.useState( passwordData && passwordData.expireDate ? moment( parseInt( passwordData.expireDate ) ) : null );
  const [ note, setNote ] = React.useState( passwordData ? passwordData.note : '' );

  const [ showPassword, setShowPassword ] = React.useState( false );
  const [ viewPassword, setViewPassword ] = React.useState( false );
  const [ showPasswordCheck, setShowPasswordCheck ] = React.useState( false );
  const [ showErrors, setShowErrors ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  const cannotSave = () => {
    return (
      saving ||
      title.length === 0 ||
      password !== passwordCheck ||
      (!folderId && !folder && !edit)
    );
  }

  const saveOrAddPassword = () => {
    if ( disabled ) {
      return;
    };
    if ( cannotSave() ) {
      setShowErrors( true );
    } else {
      let data = {
        title,
        login,
        password,
        url,
        expireDate: expireDate ? expireDate.valueOf() + "" : null,
        note,
      };
      if ( edit ) {
        savePassword( {
          ...data,
          id: passwordData.id
        }, setSaving, close );
      } else {
        addPassword( {
          ...data,
          folderId: folderId ? folderId : folder.id
        },
        setSaving, close );
      }
    }
  }

  return (
    <Empty>
      <div className={classnames({"fit-with-header-and-lanwiki-commandbar scroll-visible": edit, "p-b-20":  disabled || !edit },"p-t-20 p-l-20 p-r-20 p-b-0")} style={{backgroundColor: "#eaeaea"}}
        >

        {
          !disabled &&
          !folderId &&
          !edit &&
          <FormGroup>
            <Label>{t('folder')}<span className="warning-big">*</span></Label>
            <Select
              value={folder}
              styles={pickSelectStyle()}
              onChange={ (e)=> setFolder(e) }
              options={toSelArr(allFolders)}
              />
          </FormGroup>
        }

        <FormGroup>
          { !disabled && <Label htmlFor="name">{t('title')}<span className="warning-big">*</span></Label> }
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
                      {passwordData.createdBy ? `${t('createdBy')} ` : ""}
                    </span>
                    <span className="bolder">
                      {passwordData.createdBy ? `${passwordData.createdBy.fullName}` :''}
                    </span>
                    <span>
                      {passwordData.createdBy ?` ${t('atDate')} `: t('createdAt')}
                    </span>
                    <span className="bolder">
                      {passwordData.createdAt ? (timestampToString(passwordData.createdAt)) : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <span>
                      {passwordData.updatedBy ? `${t('changedBy')} ` : ""}
                    </span>
                    <span className="bolder">
                      {passwordData.updatedBy ? `${passwordData.updatedBy.fullName}` :''}
                    </span>
                    <span>
                      {passwordData.updatedBy ?` ${t('atDate')} `: t('changedAt')}
                    </span>
                    <span className="bolder">
                      {passwordData.createdAt ? (timestampToString(passwordData.updatedAt)) : ''}
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
          <Label htmlFor="login">{t('login2')}</Label>
          { disabled &&
            <div>{ login.length === 0 ? t('noLogin') : login }</div>
          }
          { !disabled &&
            <Input id="login" className="form-control" autoComplete="new-password" placeholder={t('login2Placeholder')} value={login} onChange={(e) => setLogin(e.target.value)}/>
          }
        </FormGroup>

        <FormGroup>
          <Label htmlFor="password">{t('password')}</Label>
          { !disabled &&
            <InputGroup>
              <Input type={ showPassword ? 'text' : "password" } autoComplete="new-password" className="from-control" placeholder={t('passwordPlaceholder')} value={password} id="password" onChange={ (e) => setPassword(e.target.value) } />
              <InputGroupAddon addonType="append" className="clickable" onClick={ () => setShowPassword(!showPassword) }>
                <InputGroupText>
                  <i className={"center-hor " + (!showPassword ? 'fa fa-eye' : 'fa fa-eye-slash')} />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          }
          { disabled &&
            <div>
              <button
                className="btn-link m-r-5"
                onClick={() => setViewPassword(!viewPassword) }
                >
                <i className={`p-l-5 p-r-5 center-hor fa ${(!viewPassword ? 'fa fa-eye' : 'fa fa-eye-slash')}`} />
                { !viewPassword ? t('show') : t('hide') }
              </button>
              { viewPassword &&
                <span className="p-r-10">{ password.length === 0 ? t('noPassword') : password }</span>
              }
            </div>
          }
        </FormGroup>

        { !disabled &&
          <FormGroup>
            <Label htmlFor="passwordCheck">{t('passwordCheck')}</Label>
            <InputGroup>
              <Input type={ showPassword ? 'text' : "password" } className="from-control" placeholder={t('passwordCheckPlaceholder')} value={passwordCheck} id="passwordCheck" onChange={ (e) => setPasswordCheck(e.target.value) } />
              <InputGroupAddon addonType="append" className="clickable" onClick={ () => setShowPasswordCheck(!showPasswordCheck) }>
                <InputGroupText>
                  <i className={"mt-auto mb-auto " + (!showPasswordCheck ? 'fa fa-eye' : 'fa fa-eye-slash')} />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
        }

        <FormGroup>
          <Label htmlFor="url">{t('url')}</Label>
          { disabled &&
            <div>{ url.length === 0 ? t('noUrl') : (<a href={`//${url}`} target="_blank" rel="noopener noreferrer">{url}</a>) }</div>
          }
          { !disabled &&
            <Input id="url" className="form-control" placeholder={t('urlPlaceholder')} value={url} onChange={(e) => setUrl(e.target.value)}/>
          }
        </FormGroup>

        <FormGroup>
          <Label htmlFor="expireDate">{t('expireDate')}</Label>
          { disabled &&
            <div className="disabled-info">{expireDate ? timestampToString(expireDate.valueOf()) : t('noExpireDate') }</div>
          }
          { !disabled &&
            <div className="flex-input">
              <DatePicker
                className={classnames("form-control")}
                selected={expireDate}
                hideTime
                isClearable
                onChange={date => {
                  setExpireDate( isNaN(date.valueOf()) ? null : date );
                }}
                placeholderText={t('expireDatePlaceholder')}
                />
            </div>
          }
        </FormGroup>

        <FormGroup>
          <Label htmlFor="content">{t('note')}</Label>
          { disabled &&
            <FormGroup>
              <div className="task-edit-popis p-t-10 min-height-300-f" dangerouslySetInnerHTML={{ __html: note }} />
            </FormGroup>
          }
          { !disabled &&
            <Textarea className="form-control" id="descriptionLabel" placeholder={t('enterNote')} minRows={4} value={note} onChange={(e) => setNote(e.target.value)} />
          }
        </FormGroup>

        { !edit && <AddPasswordErrors title={title} login={login} password={password} passwordCheck={passwordCheck} show={showErrors} />}
        { edit && <EditPasswordErrors title={title} login={login} password={password} passwordCheck={passwordCheck} show={showErrors} />}

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
                  onClick={saveOrAddPassword}
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
                onClick={saveOrAddPassword}
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
/*
  const [ title, setTitle ] = React.useState( password ? password.title : '' );
  const [ folder, setFolder ] = React.useState( password ? allFolders.find( ( folder ) => folder.id === password.folder.id ) : ( folderId === null ? allFolders[ 0 ] : allFolders.find( ( folder ) => folder.id === folderId ) ) );
  const [ body, setBody ] = React.useState( password ? password.body : '' );
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

  const saveOrAddPassword = () => {
    if ( disabled ) {
      return;
    };
    if ( cannotSave() ) {
      setShowErrors( true );
    } else {
      let data = {
        title,
        folderId: folder.id,
        body,
      };
      if ( edit ) {
        data.id = id;
        savePassword( data, setSaving, close );
      } else {
        addPassword( data, setSaving, close );
      }
    }
  }

  return (
    <Empty>
      <div className={classnames({"fit-with-header-and-lanwiki-commandbar scroll-visible": edit },"row")} style={{backgroundColor: "#eaeaea"}}>

        <div className="task-edit-left">
          { disabled &&
            <div>
              <div className="row">
                <h2>
                  {title}
                </h2>
                <div className="ml-auto">
                  <div className="text-right">
                    <span>
                      {password.createdBy ? `${t('createdBy')} ` : ""}
                    </span>
                    <span className="bolder">
                      {password.createdBy ? `${password.createdBy.fullName}` :''}
                    </span>
                    <span>
                      {` ${password.createdBy ? t('atDate') : t('createdAt')} `}
                    </span>
                    <span className="bolder">
                      {password.createdAt ? (timestampToString(password.createdAt)) : ''}
                    </span>
                  </div>
                  <div className="text-right">
                    <span>
                      {password.updatedBy ? `${t('changedBy')} ` : ""}
                    </span>
                    <span className="bolder">
                      {password.updatedBy ? `${password.updatedBy.fullName}` :''}
                    </span>
                    <span>
                      {password.updatedBy ?` ${t('atDate')} `: t('changedAt')}
                    </span>
                    <span className="bolder">
                      {password.createdAt ? (timestampToString(password.updatedAt)) : ''}
                    </span>
                  </div>
                </div>
              </div>
              <hr/>
            </div>
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
          { !edit && <AddPasswordErrors title={title} body={body} folder={folder} show={showErrors} />}
          { edit && <EditPasswordErrors title={title} body={body} folder={folder} show={showErrors} />}
        </div>

        <div className="task-edit-right">
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
        </div>


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
                  onClick={saveOrAddPassword}
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
                onClick={saveOrAddPassword}
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
*/
