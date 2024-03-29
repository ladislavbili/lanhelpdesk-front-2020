import React from 'react';
import {
  useMutation,
  useQuery,
  has,
  cache
} from "@apollo/client";
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  useTranslation
} from "react-i18next";
import Loading from 'components/loading';
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";

import languages from "configs/constants/languages";

import {
  isEmail,
  toSelArr,
  getMyData,
} from 'helperFunctions';
import Checkbox from 'components/checkbox';

import {
  UPDATE_PROFILE,
} from './queries';

import PasswordChange from './passChange';


export default function UserProfile( props ) {
  // data & queries
  const {
    history,
    match,
    closeModal
  } = props;

  const {
    t
  } = useTranslation();

  const currentUser = getMyData();

  const [ updateProfile, {
    client
  } ] = useMutation( UPDATE_PROFILE );

  //state
  const [ username, setUsername ] = React.useState( "" );
  const [ email, setEmail ] = React.useState( "" );
  const [ name, setName ] = React.useState( "" );
  const [ surname, setSurname ] = React.useState( "" );
  const [ receiveNotifications, setReceiveNotifications ] = React.useState( false );
  const [ signature, setSignature ] = React.useState( "" );
  const [ language, setLanguage ] = React.useState( languages[ 0 ] );
  const [ passwordChangeOpen, setPasswordChangeOpen ] = React.useState( false );
  const [ password, setPassword ] = React.useState( null );
  const [ saving, setSaving ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( currentUser ) {
      const user = currentUser;
      setUsername( user.username );
      setEmail( user.email );
      setName( user.name );
      setSurname( user.surname );
      setReceiveNotifications( user.receiveNotifications );
      setSignature( ( user.signature ? user.signature : `${user.name} ${user.surname}, ${user.company.title}` ) );
      setLanguage( languages.find( language => language.value === user.language ) );
    }
  }, [ currentUser ] );

  // functions
  const updateProfileFunc = () => {
    setSaving( true );
    let data = {
      username,
      email,
      name,
      surname,
      receiveNotifications,
      signature,
      language: language.value,
    }
    if ( password !== null && password.length >= 6 ) {
      data.password = password;
    }
    updateProfile( {
        variables: data
      } )
      .then( ( response ) => {
        if ( password !== null && password.length >= 6 ) {
          sessionStorage.setItem( "acctok", response.data.updateProfile.accessToken );
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
    closeModal();
  };

  if ( !currentUser ) {
    return <Loading />
  }

  return (
    <div className="p-t-10 p-b-20">
      <FormGroup>
        <Label for="username">{t('username')}</Label>
        <Input type="text" name="username" id="username" placeholder={t('usernamePlaceholder')} value={ username } onChange={ (e) => setUsername(e.target.value) } />
      </FormGroup>
      <FormGroup>
        <Label for="name">{t('name')}</Label>
        <Input type="text" name="name" id="name" placeholder={t('namePlaceholder')} value={ name } onChange={ (e) => setName(e.target.value) } />
      </FormGroup>
      <FormGroup>
        <Label for="surname">{t('surname')}</Label>
        <Input type="text" name="surname" id="surname" placeholder={t('surnamePlaceholder')} value={ surname } onChange={ (e) => setSurname(e.target.value) } />
      </FormGroup>
      <FormGroup>
        <Label for="email">{t('email')}</Label>
        <Input type="email" name="email" id="email" placeholder={t('emailPlaceholder')} value={ email } onChange={ (e) => setEmail(e.target.value) } />
      </FormGroup>

      <FormGroup>
        <Label for="language">{t('language')}</Label>
        <Select
          styles={ pickSelectStyle() }
          options={ languages }
          value={ language }
          onChange={ lang => setLanguage(lang) }
          />
      </FormGroup>

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { receiveNotifications }
        label={t('receiveNotifications')}
        onChange={()=> setReceiveNotifications(!receiveNotifications)}
        />

      <FormGroup>
        <Label for="signature">{t('signature')}</Label>
        <Input
          type="textarea"
          name="signature"
          id="signature"
          placeholder={t('signaturePlaceholder')}
          value={ signature }
          onChange={ (e) => setSignature(e.target.value) }
          />
      </FormGroup>

      <div className="row">
        <button
          className="btn-link"
          onClick={closeModal}
          >
          {t('cancel')}
        </button>
        <button
          className="btn-link ml-auto btn-distance"
          disabled={ saving }
          onClick={ ()=>{
            setPasswordChangeOpen(true);
          }}
          >
          { password === null ? t('changePassword') : t('changePasswordEdit') }
        </button>
        <button
          className="btn"
          disabled={ saving || !isEmail(email) }
          onClick={updateProfileFunc}
          >
          { saving ? `${t('saving')}...` : `${t('save')} ${t('user2').toLowerCase()}` }
        </button>
      </div>
      <PasswordChange
        submitPass={(pass) => {
          setPassword(pass);
          setPasswordChangeOpen(false);
        }}
        isOpen={passwordChangeOpen}
        />
    </div>
  )
}