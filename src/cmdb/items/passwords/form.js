import React from 'react';
import {
  useTranslation
} from "react-i18next";
import {
  Modal,
  ModalBody,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';
import PasswordErrors from 'cmdb/passwords/edit/showErrors';
import DatePicker from 'components/DatePicker';
import Textarea from 'react-textarea-autosize';
import classnames from 'classnames';
import moment from 'moment';
let fakeId = -1;

export default function PasswordForm( props ) {
  const {
    passwordData,
    open,
    close,
    edit,
    onChange,
  } = props;
  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( passwordData ? passwordData.title : '' );
  const [ login, setLogin ] = React.useState( passwordData ? passwordData.login : '' );
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
      password !== passwordCheck
    );
  }

  React.useEffect( () => {
    if ( open ) {
      setTitle( edit ? passwordData.title : '' );
      setLogin( edit ? passwordData.login : '' );
      setPassword( edit ? passwordData.password : '' );
      setPasswordCheck( edit ? passwordData.password : '' );
      setUrl( edit ? passwordData.url : '' );
      setExpireDate( passwordData && passwordData.expireDate ? moment( parseInt( passwordData.expireDate ) ) : null );
      setNote( edit ? passwordData.note : '' );
    }
  }, [ open ] );

  return (
    <Modal isOpen={open}>
      <ModalBody>
        <div className="m-20">
          <h2>{`${edit ? t('edit') : t('add')} ${t('password').toLowerCase()}`}</h2>
          <FormGroup>
            <Label htmlFor="title">{t('title')}</Label>
            <Input id="title" className="form-control" placeholder={t('titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="login">{t('login2')}</Label>
            <Input id="login" className="form-control" placeholder={t('login2Placeholder')} value={login} onChange={(e) => setLogin(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">{t('password')}</Label>
              <InputGroup>
                <Input type={ showPassword ? 'text' : "password" } autoComplete="new-password" className="from-control" placeholder={t('passwordPlaceholder')} value={password} id="password" onChange={ (e) => setPassword(e.target.value) } />
                <InputGroupAddon addonType="append" className="clickable" onClick={ () => setShowPassword(!showPassword) }>
                  <InputGroupText>
                    <i className={"center-hor " + (!showPassword ? 'fa fa-eye' : 'fa fa-eye-slash')} />
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
          </FormGroup>
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
          <FormGroup>
            <Label htmlFor="url">{t('url')}</Label>
            <Input id="url" className="form-control" placeholder={t('urlPlaceholder')} value={url} onChange={(e) => setUrl(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label htmlFor="expireDate">{t('expireDate')}</Label>
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
          </FormGroup>
          <FormGroup>
            <Label htmlFor="note">{t('note')}</Label>
            <Textarea className="form-control" id="note" placeholder={t('notePlaceholder')} value={note} minRows={4} onChange={(e) => setNote(e.target.value)} />
          </FormGroup>

          <PasswordErrors title={title} login={login} password={password} passwordCheck={passwordCheck} show={showErrors} />
          <div className="row buttons">
            <button
              className="btn btn-link-cancel"
              onClick={close}
              >
              {t('close')}
            </button>
            <button  className="btn ml-auto" disabled={cannotSave() && showErrors } onClick={() => {
                if(cannotSave()){
                  setShowErrors( true );
                }else{
                  onChange({
                  id: edit ? passwordData.id : fakeId--,
                  title,
                  login,
                  password,
                  url,
                  expireDate,
                  note,
              })
                }
              }} >
              {`${ edit ? t('save') : t('add')} ${t('password').toLowerCase()}`}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}