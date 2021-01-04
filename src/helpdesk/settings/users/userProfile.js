import React from 'react';
import {
  useMutation,
  useQuery,
  has,
  cache
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

import languages from "configs/constants/languages";

import {
  isEmail,
  toSelArr
} from 'helperFunctions';
import Checkbox from 'components/checkbox';

import {
  UPDATE_PROFILE,
  GET_MY_DATA,
  GET_BASIC_USERS,
  GET_USERS
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
    data: myData,
    loading: myDataLoading
  } = useQuery( GET_MY_DATA );

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
    if ( !myDataLoading ) {
      const user = myData.getMyData;
      setUsername( user.username );
      setEmail( user.email );
      setName( user.name );
      setSurname( user.surname );
      setReceiveNotifications( user.receiveNotifications );
      setSignature( ( user.signature ? user.signature : `${user.name} ${user.surname}, ${user.company.title}` ) );
      setLanguage( languages.find( language => language.value === user.language ) );
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
        try {
          const allUsers = client.readQuery( {
              query: GET_USERS
            } )
            .users;
          client.writeQuery( {
            query: GET_USERS,
            data: {
              users: allUsers.map( user => ( user.id !== response.data.updateProfile.user.id ? user : {
                ...user,
                username,
                email,
                name,
                surname,
                receiveNotifications,
                signature,
                language
              } ) )
            }
          } );
        } catch ( err ) {
          console.log( "Users are not yet in the cache." );
        }
        try {
          let allBasicUsers = client.readQuery( {
              query: GET_BASIC_USERS
            } )
            .basicUsers;
          client.writeQuery( {
            query: GET_BASIC_USERS,
            data: {
              basicUsers: allBasicUsers.map( user => ( user.id !== response.data.updateProfile.user.id ? user : {
                ...user,
                username,
                email,
                name,
                surname,
                receiveNotifications,
                signature,
                language
              } ) )
            }
          } );
        } catch ( err ) {
          console.log( "BasicUsers are not yet in the cache." );
        }
      } )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
    setSaving( false );
    closeModal();
  };

  if ( myDataLoading ) {
    return <Loading />
  }

  const USER = myData.getMyData;

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
          className="btn-link"
          onClick={closeModal}
          >
          Cancel
        </Button>
        <Button
          className="btn-link ml-auto"
          disabled={ saving }
          onClick={ ()=>{
            setPasswordChangeOpen(true);
          }}
          >
          { password === null ? 'Change password' : 'Password change edit' }
        </Button>
        <Button
          className="btn m-l-5"
          disabled={ saving || !isEmail(email) }
          onClick={updateProfileFunc}
          >
          { saving ? 'Saving user...' : 'Save user' }
        </Button>
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