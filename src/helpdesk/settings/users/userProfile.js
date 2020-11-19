import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Loading from 'components/loading';
import Select from 'react-select';
import {
  selectStyle
} from "configs/components/select";

import {
  isEmail,
  toSelArr
} from 'helperFunctions';
import Checkbox from 'components/checkbox';

import {
  UPDATE_PROFILE,
  GET_MY_DATA,
  GET_USERS
} from './querries';

import {
  GET_ROLES,
} from '../roles/querries';

import {
  GET_BASIC_COMPANIES,
} from '../companies/querries';
import PasswordChange from './passChange';


export default function UserProfile( props ) {
  // data & queries
  const {
    history,
    match,
    closeModal
  } = props;
  const {
    data: rolesData,
    loading: rolesLoading
  } = useQuery( GET_ROLES );
  const {
    data: myData,
    loading: myDataLoading
  } = useQuery( GET_MY_DATA );
  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES );

  const [ updateProfile, {
    client
  } ] = useMutation( UPDATE_PROFILE );

  const USER = ( myDataLoading ? [] : myData.getMyData );
  const ROLES = ( rolesLoading ? [] : toSelArr( rolesData.roles ) );
  const COMPANIES = ( companiesLoading ? [] : toSelArr( companiesData.basicCompanies ) );

  const languages = [
    {
      label: "SK",
      value: "sk"
    },
    {
      label: "ENG",
      value: "en"
  }
 ]

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
    if ( !myDataLoading ) {
      setUsername( USER.username );
      setEmail( USER.email );
      setName( USER.name );
      setSurname( USER.surname );
      setReceiveNotifications( USER.receiveNotifications );
      setSignature( ( USER.signature ? USER.signature : `${USER.name} ${USER.surname}, ${USER.company.title}` ) );
      setLanguage( USER.language === "sk" ? languages[ 0 ] : languages[ 1 ] );
    }
  }, [ myDataLoading ] );

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
          localStorage.setItem( "acctok", response.data.updateProfile.accessToken );
        }
        closeModal();
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
  };

  if ( rolesLoading || companiesLoading || myDataLoading ) {
    return <Loading />
  }

  const myRoleLevel = myData === undefined ? null : myData.getMyData.role.level;
  const isDisabled = myRoleLevel === null || ( myRoleLevel !== 0 && myRoleLevel >= role.level );

  return (
    <div className="p-t-10 p-b-20">
        <FormGroup>
          <Label for="username">Username</Label>
          <Input type="text" name="username" id="username" placeholder="Enter username" value={ username } onChange={ (e) => setUsername(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter name" value={ name } onChange={ (e) => setName(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="surname">Surname</Label>
          <Input type="text" name="surname" id="surname" placeholder="Enter surname" value={ surname } onChange={ (e) => setSurname(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="email">E-mail</Label>
          <Input type="email" name="email" id="email" placeholder="Enter email" value={ email } onChange={ (e) => setEmail(e.target.value) } />
        </FormGroup>

        <FormGroup>
          <Label for="language">Language</Label>
          <Select
            styles={ selectStyle }
            options={ languages }
            value={ language }
            onChange={ lang => setLanguage(lang) }
            />
        </FormGroup>

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { receiveNotifications }
          label = "Receive e-mail notifications"
          onChange={()=> setReceiveNotifications(!receiveNotifications)}
          />

        <FormGroup>
          <Label for="signature">Signature</Label>
          <Input
            type="textarea"
            name="signature"
            id="signature"
            placeholder="Enter signature"
            value={ signature }
            onChange={ (e) => setSignature(e.target.value) }
            />
        </FormGroup>

        <div className="row">
          <Button
            className="btn m-r-5"
            disabled={ saving || ( COMPANIES.length === 0) || !isEmail(email) }
            onClick={ updateProfileFunc }
            >
            { saving ? 'Saving user...' : 'Save user' }
          </Button>
            <Button
              className="btn-link"
              disabled={ saving || isDisabled }
              onClick={ ()=>{
                setPasswordChangeOpen(true);
              }}
              >{ password === null ? 'Change password' : 'Password change edit' }</Button>
              <Button
                className="btn-link ml-auto"
                onClick={closeModal}
                >Cancel</Button>
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