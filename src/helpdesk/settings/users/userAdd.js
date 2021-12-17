import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient
} from "@apollo/client";
import classnames from 'classnames';

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Select from 'react-select';
import Loading from 'components/loading';
import Checkbox from 'components/checkbox';
import SettingsInput from '../components/settingsInput';
import SettingsHiddenInput from '../components/settingsHiddenInput';

import languages from "configs/constants/languages";
import {
  pickSelectStyle
} from "configs/components/select";
import {
  useTranslation
} from "react-i18next";
import {
  isEmail,
  toSelArr,
  getMyData,
  randomPassword,
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_USERS,
  GET_BASIC_USERS,
  ADD_USER,
} from './queries';
import {
  GET_ROLES,
} from '../roles/queries';
import {
  GET_BASIC_COMPANIES,
} from '../companies/queries';


export default function UserAdd( props ) {
  const {
    history,
    addUserToList,
    closeModal
  } = props;

  const {
    t
  } = useTranslation();

  const client = useApolloClient();

  const currentUser = getMyData();

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

  const [ registerUser ] = useMutation( ADD_USER );

  //state
  const [ active ] = React.useState( true );
  const [ username, setUsername ] = React.useState( "" );
  const [ email, setEmail ] = React.useState( "" );
  const [ name, setName ] = React.useState( "" );
  const [ surname, setSurname ] = React.useState( "" );
  const [ password, setPassword ] = React.useState( randomPassword() );
  const [ receiveNotifications, setReceiveNotifications ] = React.useState( false );
  const [ signature, setSignature ] = React.useState( "" );
  const [ signatureChanged, setSignatureChanged ] = React.useState( false );
  const [ role, setRole ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ language, setLanguage ] = React.useState( languages[ 0 ] );

  const [ saving, setSaving ] = React.useState( false );

  const dataLoading = (
    !currentUser ||
    rolesLoading ||
    companiesLoading
  )

  if ( dataLoading ) {
    return <Loading />
  }

  const currentUserLevel = currentUser.role.level;
  const roles = toSelArr( rolesData.roles )
    .filter( ( role ) => role.level > currentUserLevel || ( currentUserLevel === 0 && role.level === 0 ) );
  const companies = toSelArr( companiesData.basicCompanies );

  const addUserFunc = () => {
    setSaving( true );
    registerUser( {
        variables: {
          active,
          username,
          email,
          name,
          surname,
          password,
          receiveNotifications,
          signature: ( signature ? signature : `${name} ${surname}, ${company.title}` ),
          roleId: role.id,
          companyId: company.id,
          language: language.value,
        }
      } )
      .then( ( response ) => {
        setPassword( randomPassword() );
        let newUser = {
          ...response.data.registerUser,
          __typename: "BasicUser"
        }
        if ( addUserToList ) {
          addUserToList( newUser );
          closeModal();
        } else {
          history.push( `/helpdesk/settings/users/${newUser.id}` );
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const cannotSave = () => {
    let cond1 = saving || companies.length === 0;
    let cond2 = !username || !name || !surname || !isEmail( email ) || password.length < 6 || !role || !company;
    return cond1 || cond2;
  }

  return (
    <div>
      <div
        className={classnames(
          "p-20",
          {" scroll-visible fit-with-header": !closeModal},
        )}
        >

        <h2 className="m-b-20" >
          {`${t('add')} ${t('user2').toLowerCase()}`}
        </h2>

        <FormGroup>
          <Label for="role">{t('role')}<span className="warning-big">*</span></Label>
          <Select
            styles={ pickSelectStyle() }
            options={ roles }
            value={ role }
            onChange={ role => setRole(role) }
            />
        </FormGroup>

        <SettingsInput
          required
          label={t('username')}
          id="username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
          />

        <SettingsInput
          required
          label={t('name')}
          id="name"
          value={name}
          onChange={ (e) => {
            if (signatureChanged){
              setName(e.target.value);
            } else {
              setName(e.target.value);
              setSignature(`${e.target.value} ${surname}, ${(company? company.title :'')}`);
              setSignatureChanged(false);
            }
          }}
          />

        <SettingsInput
          required
          label={t('surname')}
          id="surname"
          value={surname}
          onChange={ (e) => {
            if (signatureChanged) {
              setSurname(e.target.value);
            } else {
              setSurname(e.target.value);
              setSignature(`${name} ${e.target.value}, ${(company? company.title :'')}`);
              setSignatureChanged(false);
            }
          }}
          />

        <SettingsInput
          required
          label={t('email')}
          type="email"
          id="new-email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          />

        <SettingsHiddenInput
          required
          regeneratePassword
          label={t('password')}
          id="new-password"
          value={password}
          onChange={(e)=> {
            setPassword(e.target.value);
          }}
          />

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
          onChange={ () =>  setReceiveNotifications(!receiveNotifications) }
          />

        <FormGroup>
          <Label for="company">{t('company')}<span className="warning-big">*</span></Label>
          <Select
            styles={ pickSelectStyle() }
            options={ companies }
            value={ company }
            onChange={ company => {
              if (signatureChanged){
                setCompany(company);
              } else {
                setCompany(company);
                setSignature(`${name} ${surname}, ${company.title}`);
                setSignatureChanged(false);
              }
            }}
            />
        </FormGroup>

        <SettingsInput
          label={t('signature')}
          id="signature"
          type="textarea"
          value={signature}
          onChange={(e)=> {
            setSignature(e.target.value);
            setSignatureChanged(true);
          }}
          />

        <div className="form-buttons-row">

          {closeModal &&
            <button
              className="btn-link"
              onClick={ closeModal }
              >
              {t('cancel')}
            </button>
          }

          { cannotSave() &&
            <div className=" ml-auto message error-message m-r-10">
              {t('fillAllRequiredInformation')}
            </div>
          }

          <button
            className={classnames(
              "btn",
              {"ml-auto": !cannotSave()}
            )}
            disabled={ cannotSave() }
            onClick={ addUserFunc }
            >
            { saving ? `${t('adding')}...` : `${t('add')} ${t('user2').toLowerCase()}` }
          </button>

        </div>
      </div>
    </div>
  )
}