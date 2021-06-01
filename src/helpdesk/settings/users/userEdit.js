import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Loading from 'components/loading';
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";

import languages from "configs/constants/languages";

import {
  isEmail,
  toSelArr,
  compareObjectAttributes,
  getMyData,
} from 'helperFunctions';
import Checkbox from 'components/checkbox';

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
import PasswordChange from './passChange';

export default function UserEdit( props ) {
  // data & queries
  const {
    history,
    match
  } = props;
  const id = parseInt( match.params.id );
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
  const [ deleteUser, {
    client
  } ] = useMutation( DELETE_USER );

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
  const [ saving, setSaving ] = React.useState( false );
  const [ deletingUser /*, setDeletingUser */ ] = React.useState( false );
  const [ passwordChangeOpen, setPasswordChangeOpen ] = React.useState( false );
  const [ password, setPassword ] = React.useState( null );

  const [ dataChanged, setDataChanged ] = React.useState( false );

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
    if ( password !== null && password.length >= 6 ) {
      data.password = password;
    }
    updateUser( {
        variables: data
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
    setDataChanged( false );
  };

  const deleteUserFunc = () => {
    if ( window.confirm( "Are you sure you want to delete the user?" ) ) {
      deleteUser( {
          variables: {
            id,
            taskPairs: [],
            subtaskPairs: [],
            workTripPairs: [],
          }
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  };

  const deactivateUser = ( active ) => {
    setUserActive( {
      variables: {
        id,
        active: !active
      }
    } );
    setActive( !active );
  }

  const currentUser = getMyData();
  if ( userLoading || rolesLoading || companiesLoading || !currentUser ) {
    return <Loading />
  }
  const currentUserLevel = currentUser.role.level;
  const roles = toSelArr( rolesData.roles )
    .filter( ( role ) => role.level > currentUserLevel || role.id === userData.user.role.id || ( currentUserLevel === 0 && role.level === 0 ) );
  const companies = toSelArr( companiesData.basicCompanies );
  const isDisabled = ( currentUserLevel !== 0 && currentUserLevel >= role.level );

  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { dataChanged &&
          <div className="message error-message">
            Save changes before leaving!
          </div>
        }
        { !dataChanged &&
          <div className="message success-message">
            Saved
          </div>
        }
      </div>
      <div className="scroll-visible p-l-20 p-r-20 p-b-20 p-t-10 fit-with-header-and-commandbar">
        <h2 className="m-b-20" >
          Edit user
        </h2>
        <FormGroup>
          <Label for="role">Role <span className="warning-big">*</span></Label>
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
        <FormGroup>
          <Label for="username">Username <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="Enter username"
            disabled={ isDisabled }
            value={ username }
            onChange={ (e) => {
              setUsername(e.target.value);
              setDataChanged( true );
            }}
            />
        </FormGroup>
        <FormGroup>
          <Label for="name">Name <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Enter name"
            disabled={ isDisabled }
            value={ name }
            onChange={ (e) => {
              setName(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>
        <FormGroup>
          <Label for="surname">Surname <span className="warning-big">*</span></Label>
          <Input
            type="text"
            name="surname"
            id="surname"
            placeholder="Enter surname"
            disabled={ isDisabled }
            value={ surname }
            onChange={ (e) => {
              setSurname(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>
        <FormGroup>
          <Label for="email">E-mail <span className="warning-big">*</span></Label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter email"
            value={ email }
            disabled={ isDisabled }
            onChange={ (e) => {
              setEmail(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>

        <FormGroup>
          <Label for="language">Language</Label>
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
          label = "Receive e-mail notifications"
          disabled={isDisabled}
          onChange={()=> {
            setReceiveNotifications(!receiveNotifications);
            setDataChanged( true );
          }}
          />

        <FormGroup>
          <Label for="company">Company <span className="warning-big">*</span></Label>
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

        <FormGroup>
          <Label for="signature">Signature</Label>
          <Input
            type="textarea"
            name="signature"
            id="signature"
            placeholder="Enter signature"
            disabled={isDisabled}
            value={ signature }
            onChange={ (e) => {
              setSignature(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>

        { !isDisabled &&
          <div className="form-buttons-row">
            { id !== currentUser.id &&
              <button
                className="btn-red btn-distance"
                disabled={deletingUser}
                onClick={deleteUserFunc}
                >
                Delete
              </button>
            }
            { id !== currentUser.id &&
              <button
                className={ active ? "btn btn-grey" : "btn btn-green"}
                onClick={()=> deactivateUser(active)}
                >
                {active ? 'Deactivate user' : 'Activate user'}
              </button>
            }
            <button
              className="btn-link ml-auto btn-distance"
              disabled={ saving || isDisabled }
              onClick={ ()=>{
                setPasswordChangeOpen(true);
              }}
              >
              { password === null ? 'Change password' : 'Password change edit' }
            </button>
            <button
              className="btn"
              disabled={ saving || ( companiesData.basicCompanies ? companiesData.basicCompanies.length === 0 : false) || !isEmail(email) }
              onClick={ updateUserFunc }
              >
              { saving ? 'Saving user...' : 'Save user' }
            </button>
          </div>
        }
        <PasswordChange
          submitPass={(pass) => {
            setPassword(pass);
            setPasswordChangeOpen(false);
          }}
          isOpen={passwordChangeOpen}
          />
      </div>
    </div>

  )
}