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

import languages from "configs/constants/languages";

import {
  isEmail,
  toSelArr
} from 'helperFunctions';
import Checkbox from 'components/checkbox';

import {
  GET_BASIC_USERS as GET_USERS,
  GET_USER,
  UPDATE_USER,
  DELETE_USER,
  GET_MY_DATA,
  SET_USER_ACTIVE
} from './querries';

import {
  GET_ROLES,
} from '../roles/querries';

import {
  GET_BASIC_COMPANIES,
} from '../companies/querries';
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
    notifyOnNetworkStatusChange: true,
  } );
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

  // sync
  React.useEffect( () => {
    if ( !userLoading ) {
      const user = myData.getMyData;
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
    }
  }, [ userLoading ] );

  React.useEffect( () => {
    userRefetch( {
      variables: {
        id
      }
    } );
  }, [ id ] );

  // functions
  const updateUserFunc = () => {
    setSaving( true );
    updateUser( {
        variables: {
          id,
          username,
          email,
          name,
          surname,
          password,
          receiveNotifications,
          signature,
          roleId: role.id,
          companyId: company.id,
          language: language.value,
        }
      } )
      .then( ( response ) => {
        const allUsers = client.readQuery( {
            query: GET_USERS
          } )
          .basicUsers;
        let newUser = {
          id,
          username,
          email,
          role,
          company,
          __typename: "User"
        }
        client.writeQuery( {
          query: GET_USERS,
          data: {
            basicUsers: allUsers.map( user => ( user.id !== id ? user : {
              ...newUser
            } ) )
          }
        } );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
  };

  const deleteUserFunc = () => {
    if ( !window.confirm( "Are you sure you want to delete the user?" ) ) {
      deleteUser( {
          variables: {
            id
          }
        } )
        .then( ( response ) => {
          const allUsers = client.readQuery( {
              query: GET_USERS
            } )
            .basicUsers;
          client.writeQuery( {
            query: GET_USERS,
            data: {
              basicUsers: allUsers.filter( user => user.id !== id )
            }
          } );
          history.goBack();
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  };

  const deactivateUser = ( active ) => {
    const newUsers = client.readQuery( {
        query: GET_USERS
      } )
      .basicUsers;
    let index = newUsers.findIndex( ( user ) => user.id === id );
    newUsers[ index ].active = !active;
    client.writeQuery( {
      query: GET_USERS,
      data: {
        basicUsers: newUsers
      }
    } );
    setUserActive( {
      variables: {
        id,
        active: !active
      }
    } );
    setActive( !active );
  }
  if ( userLoading || rolesLoading || companiesLoading || myDataLoading ) {
    return <Loading />
  }

  const USER = userData.user;
  const ROLES = toSelArr( rolesData.roles );
  const COMPANIES = toSelArr( companiesData.basicCompanies );
  const myRoleLevel = myData === undefined ? null : myData.getMyData.role.level;
  const isDisabled = myRoleLevel === null || ( myRoleLevel !== 0 && myRoleLevel >= role.level );

  return (
    <div className="scroll-visible p-20 fit-with-header-and-commandbar">
        <FormGroup>
          <Label for="role">Role</Label>
          <Select
            styles={ selectStyle }
            isDisabled={ isDisabled }
            options={ ROLES.filter(( role ) => role.level > myRoleLevel || myRoleLevel === 0 ) }
            value={ role }
            onChange={ role => setRole(role) }
            />
        </FormGroup>
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
          <Label for="company">Company</Label>
          <Select
            styles={ selectStyle }
            isDisabled={ isDisabled }
            options={ COMPANIES }
            value={ company }
            onChange={ e => this.setCompany( e ) }
            />
        </FormGroup>

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
            disabled={ saving || ( companiesData.basicCompanies ? companiesData.basicCompanies.length === 0 : false) || !isEmail(email) }
            onClick={ updateUserFunc }
            >
            { saving ? 'Saving user...' : 'Save user' }
          </Button>
            { !isDisabled && myData !== undefined && id !== myData.getMyData.id &&
                <Button
                  className={ active ? "btn-grey" : "btn-green"}
                  onClick={()=> deactivateUser(active)}
                  >
                  {active ? 'Deactivate user' : 'Activate user'}
                </Button>
              }
              { !isDisabled && myData !== undefined && id !== myData.getMyData.id &&
                <Button
                  className="btn-red m-l-5"
                  disabled={deletingUser}
                  onClick={deleteUserFunc}
                  >
                  Delete
                </Button>
              }
            <Button
              className="btn-link"
              disabled={ saving || isDisabled }
              onClick={ ()=>{
                setPasswordChangeOpen(true);
              }}
              >{ password === null ? 'Change password' : 'Password change edit' }</Button>
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