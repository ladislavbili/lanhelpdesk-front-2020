import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient
} from "@apollo/client";

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Loading from 'components/loading';
import Select from 'react-select';
import Checkbox from 'components/checkbox';
import Switch from "components/switch";
import PasswordChange from './passChange';
import SettingsInput from '../components/settingsInput';
import DeleteReplacement from 'components/deleteReplacement';
import {
  useTranslation
} from "react-i18next";

import languages from "configs/constants/languages";
import {
  pickSelectStyle
} from "configs/components/select";
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  isEmail,
  toSelArr,
  compareObjectAttributes,
  getMyData,
} from 'helperFunctions';

import {
  GET_USERS,
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
  SET_USER_ACTIVE,
} from './queries';

import {
  GET_ROLES,
} from '../roles/queries';

import {
  GET_BASIC_COMPANIES,
} from '../companies/queries';

export default function UserEdit( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const id = parseInt( match.params.id );
  const client = useApolloClient();
  const currentUser = getMyData();

  const {
    data: userData,
    loading: userLoading,
    refetch: userRefetch
  } = useQuery( GET_USER, {
    variables: {
      id
    },
    fetchPolicy: 'network-only',
  } );

  const {
    data: usersData,
    loading: usersLoading,
    refetch: usersRefetch
  } = useQuery( GET_USERS, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: rolesData,
    loading: rolesLoading
  } = useQuery( GET_ROLES, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );

  const [ updateUser ] = useMutation( UPDATE_USER );
  const [ deleteUser ] = useMutation( DELETE_USER );
  const [ setUserActive ] = useMutation( SET_USER_ACTIVE );

  //state
  const [ active, setActive ] = React.useState( true );
  const [ username, setUsername ] = React.useState( "" );
  const [ email, setEmail ] = React.useState( "" );
  const [ name, setName ] = React.useState( "" );
  const [ surname, setSurname ] = React.useState( "" );
  const [ receiveNotifications, setReceiveNotifications ] = React.useState( false );
  const [ signature, setSignature ] = React.useState( "" );
  const [ role, setRole ] = React.useState( {} );
  const [ company, setCompany ] = React.useState( {} );
  const [ language, setLanguage ] = React.useState( languages[ 0 ] );
  const [ passwordChangeOpen, setPasswordChangeOpen ] = React.useState( false );
  const [ password, setPassword ] = React.useState( null );

  const [ saving, setSaving ] = React.useState( false );
  const [ deletingUser ] = React.useState( false );
  const [ dataChanged, setDataChanged ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );

  // sync
  React.useEffect( () => {
    setData();
  }, [ userLoading ] );

  React.useEffect( () => {
    userRefetch( {
        variables: {
          id
        }
      } )
      .then( setData );
  }, [ id ] );

  // functions
  const setData = () => {
    if ( userLoading ) {
      return;
    }
    const user = userData.user;
    setActive( user.active );
    setUsername( user.username );
    setEmail( user.email );
    setName( user.name );
    setSurname( user.surname );
    setReceiveNotifications( user.receiveNotifications );
    setSignature( ( user.signature ? user.signature : `${user.name} ${user.surname}, ${user.company.title}` ) );
    setRole( {
      ...user.role,
      label: user.role.title,
      value: user.role.id
    } );
    setCompany( {
      ...user.company,
      label: user.company.title,
      value: user.company.id
    } );
    setLanguage( languages.find( language => language.value === user.language ) );
    setDataChanged( false );
  }

  const updateUserFunc = () => {
    setSaving( true );
    let data = {
      id,
      username,
      email,
      name,
      surname,
      receiveNotifications,
      signature,
      roleId: role.id,
      companyId: company.id,
      language: language.value,
    }
    if ( active !== userData.user.active ) {
      deactivateUser( active );
    }
    if ( password !== null && password.length >= 6 ) {
      data.password = password;
    }
    updateUser( {
        variables: data
      } )
      .then( () => {
        setSaving( false );
        setDataChanged( false );
      } )
      .catch( ( err ) => {
        setSaving( false );
        addLocalError( err );
      } );
  };

  const deleteUserFunc = ( replacement ) => {
    setDeleteOpen( false );

    if ( window.confirm( t( 'deleteUserMessage' ) ) ) {
      deleteUser( {
          variables: {
            id,
            newId: parseInt( replacement.id ),
          }
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  const deactivateUser = () => {
    setUserActive( {
      variables: {
        id,
        active
      }
    } );
  }

  const dataLoading = ( userLoading || usersLoading || rolesLoading || companiesLoading || !currentUser );

  if ( dataLoading ) {
    return <Loading />
  }

  const currentUserLevel = currentUser.role.level;
  const roles = toSelArr( rolesData.roles )
    .filter( ( role ) => role.level > currentUserLevel || role.id === userData.user.role.id || ( currentUserLevel === 0 && role.level === 0 ) );
  const companies = toSelArr( companiesData.basicCompanies );

  const isDisabled = ( currentUserLevel !== 0 && currentUserLevel >= role.level );

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20" >
        {`${t('edit')} ${t('user2').toLowerCase()}`}
      </h2>

      <Switch
        value={active}
        onChange={() => {
          setActive(!active);
          setDataChanged( true );
        }}
        label={t('active')}
        disabled={id === currentUser.id}
        labelClassName="text-normal font-normal"
        simpleSwitch
        />

      <FormGroup>
        <Label for="role">{t('role')}<span className="warning-big">*</span></Label>
        <Select
          styles={ pickSelectStyle() }
          isDisabled={ isDisabled }
          options={ roles }
          value={ role }
          onChange={ role => {
            setRole(role);
            setDataChanged( true );
          }}
          />
      </FormGroup>

      <SettingsInput
        required
        label={t('username')}
        id="username"
        disabled={ isDisabled }
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        required
        label={t('name')}
        id="name"
        disabled={ isDisabled }
        value={ name }
        onChange={(e) => {
          setName(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        required
        label={t('surname')}
        id="surname"
        disabled={ isDisabled }
        value={ surname }
        onChange={(e) => {
          setSurname(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        required
        label={t('email')}
        id="email"
        type="email"
        disabled={ isDisabled }
        value={ email }
        onChange={(e) => {
          setEmail(e.target.value);
          setDataChanged( true );
        }}
        />

      <FormGroup>
        <Label for="language">{t('language')}</Label>
        <Select
          styles={ pickSelectStyle() }
          options={ languages }
          value={ language }
          isDisabled={ isDisabled }
          onChange={ lang => {
            setLanguage(lang);
            setDataChanged( true );
          } }
          />
      </FormGroup>

      <Checkbox
        className = "m-b-5 p-l-0"
        value = { receiveNotifications }
        label={t('receiveNotifications')}
        disabled={ isDisabled }
        onChange={()=> {
          setReceiveNotifications(!receiveNotifications);
          setDataChanged( true );
        }}
        />

      <FormGroup>
        <Label for="company">{t('company')}<span className="warning-big">*</span></Label>
        <Select
          styles={ pickSelectStyle() }
          isDisabled={ isDisabled }
          options={ companies }
          value={ company }
          onChange={ e => {
            setCompany( e );
            setDataChanged( true );
          } }
          />
      </FormGroup>

      <SettingsInput
        label={t('signature')}
        id="signature"
        type="textarea"
        disabled={ isDisabled }
        value={ signature }
        onChange={(e) => {
          setSignature(e.target.value);
          setDataChanged( true );
        }}
        />

      { !isDisabled &&
        <div className="form-buttons-row">

          { id !== currentUser.id &&
            <button
              className="btn-red btn-distance"
              disabled={deletingUser}
              onClick={() => setDeleteOpen(true)}
              >
              {t('delete')}
            </button>
          }

          <button
            className="btn-link btn-distance"
            disabled={ saving || isDisabled }
            onClick={ () => {
              setPasswordChangeOpen(true);
            }}
            >
            { password === null ? t('changePassword') : t('changePasswordEdit') }
          </button>

          <div className="ml-auto message m-r-10">
            { dataChanged &&
              <div className="message error-message">
                {t('saveBeforeLeaving')}
              </div>
            }
            { !dataChanged &&
              <div className="message success-message">
                {t('saved')}
              </div>
            }
          </div>

          <button
            className="btn"
            disabled={ saving || ( companiesData.basicCompanies ? companiesData.basicCompanies.length === 0 : false) || !isEmail(email) }
            onClick={ updateUserFunc }
            >
            { saving ? `${t('saving')}...` : `${t('save')} ${t('user2').toLowerCase()}` }
          </button>

        </div>
      }
      <PasswordChange
        submitPass={(pass) => {
          if(pass !== null){
            updateUser({
              variables: {
                id,
                password:pass,
              }
            });
          }
          setPasswordChangeOpen(false);
        }}
        isOpen={passwordChangeOpen}
        />
      <DeleteReplacement
        isOpen = { deleteOpen }
        label = {t('user')}
        options = { toSelArr(usersData.users.filter( user => user.id !== parseInt( match.params.id ) ), 'fullName') }
        close = { () => setDeleteOpen( false ) }
        finishDelete = { deleteUserFunc }
        />
    </div>
  )
}