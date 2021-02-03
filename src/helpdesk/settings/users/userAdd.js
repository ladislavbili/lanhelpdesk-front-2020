import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient
} from "@apollo/client";

import {
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import Select from 'react-select';
import {
  selectStyle
} from "configs/components/select";

import languages from "configs/constants/languages";
import classnames from 'classnames';

import {
  isEmail,
  toSelArr
} from 'helperFunctions';
import Checkbox from 'components/checkbox';

import {
  GET_USERS,
  GET_BASIC_USERS,
  ADD_USER
} from './queries';

import {
  GET_ROLES,
} from '../roles/queries';

import {
  GET_BASIC_COMPANIES,
} from '../companies/queries';


export default function UserAddContainer( props ) {
  // data & queries
  const {
    history,
    addUserToList,
    closeModal
  } = props;
  const client = useApolloClient();
  const {
    data: rolesData,
    loading: rolesLoading
  } = useQuery( GET_ROLES );
  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES );
  const [ registerUser ] = useMutation( ADD_USER );

  const ROLES = ( rolesLoading ? [] : toSelArr( rolesData.roles ) );
  const COMPANIES = ( companiesLoading ? [] : toSelArr( companiesData.basicCompanies ) );

  //state
  const [ active ] = React.useState( true );
  const [ username, setUsername ] = React.useState( "" );
  const [ email, setEmail ] = React.useState( "" );
  const [ name, setName ] = React.useState( "" );
  const [ surname, setSurname ] = React.useState( "" );
  const [ password, setPassword ] = React.useState( "" );
  const [ receiveNotifications, setReceiveNotifications ] = React.useState( false );
  const [ signature, setSignature ] = React.useState( "" );
  const [ signatureChanged, setSignatureChanged ] = React.useState( false );
  const [ role, setRole ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ language, setLanguage ] = React.useState( languages[ 0 ] );
  const [ saving, setSaving ] = React.useState( false );


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
        if ( addUserToList ) {
          let newUser = {
            ...response.data.registerUser,
            __typename: "BasicUser"
          }
          const allUsers = client.readQuery( {
              query: GET_BASIC_USERS
            } )
            .basicUsers;
          client.writeQuery( {
            query: GET_BASIC_USERS,
            data: {
              basicUsers: [ ...allUsers, newUser ]
            }
          } );
          addUserToList( newUser );
          closeModal();
        } else {
          let newUser = {
            ...response.data.registerUser,
            __typename: "User"
          }
          const allUsers = client.readQuery( {
              query: GET_USERS
            } )
            .users;
          client.writeQuery( {
            query: GET_USERS,
            data: {
              users: [ ...allUsers, newUser ]
            }
          } );
          history.push( '/helpdesk/settings/users/' + newUser.id );
        }

      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
  }

  const cannotAddUser = () => {
    let cond1 = saving || ( COMPANIES ? COMPANIES.length === 0 : false );
    let cond2 = !username || !name || !surname || !isEmail( email ) || password.length < 6 || !role || !company;
    return cond1 || cond2;
  }

  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { cannotAddUser() &&
          <div className="message error-message">
            Fill in all the required information!
          </div>
        }
      </div>
      <div
        className={classnames(
        "p-t-10 p-l-20 p-r-20 p-b-20",
        {" scroll-visible fit-with-header-and-commandbar": !closeModal},
        {"bkg-F9F9F9": closeModal}
      )}
        >
        <h2 className="m-b-20" >
          Add user
        </h2>
        <FormGroup>
          <Label for="role">Role <span className="warning-big">*</span></Label>
          <Select
            styles={ selectStyle }
            options={ ROLES }
            value={ role }
            onChange={ role => setRole(role) }
            />
        </FormGroup>
        <FormGroup>
          <Label for="username">Username <span className="warning-big">*</span></Label>
          <Input type="text" name="username" id="username" placeholder="Enter username" value={ username } onChange={ (e) => setUsername(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="name">Name <span className="warning-big">*</span></Label>
          <Input type="text" name="name" id="name" placeholder="Enter name" value={ name } onChange={ (e)=>{
              if (signatureChanged){
                setName(e.target.value);
              } else {
                setName(e.target.value);
                setSignature(`${e.target.value} ${surname}, ${(company? company.title :'')}`);
                setSignatureChanged(false);
              }
            }}
            />
        </FormGroup>
        <FormGroup>
          <Label for="surname">Surname <span className="warning-big">*</span></Label>
          <Input type="text" name="surname" id="surname" placeholder="Enter surname" value={ surname } onChange={ (e) => {
              if (signatureChanged) {
                setSurname(e.target.value);
              } else {
                setSurname(e.target.value);
                setSignature(`${name} ${e.target.value}, ${(company? company.title :'')}`);
                setSignatureChanged(false);
              }
            }}
            />
        </FormGroup>
        <FormGroup>
          <Label for="email">E-mail <span className="warning-big">*</span></Label>
          <Input type="email" name="email" id="email" placeholder="Enter email" value={ email } onChange={ (e) => setEmail(e.target.value) } />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password <span className="warning-big">*</span></Label>
          <Input type="password" name="password" id="password" placeholder="Enter password" value={ password } onChange={ (e) => setPassword(e.target.value) } />
        </FormGroup>

        <FormGroup>
          <Label for="role">Language</Label>
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
          onChange={ () =>  setReceiveNotifications(!receiveNotifications) }
          />

        <FormGroup>
          <Label for="company">Company <span className="warning-big">*</span></Label>
          <Select
            styles={ selectStyle }
            options={ COMPANIES }
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
        <FormGroup>
          <Label for="signature">Signature</Label>
          <Input
            type="textarea"
            name="signature"
            id="signature"
            placeholder="Enter signature"
            value={ signature }
            onChange={ (e) => {
              setSignature(e.target.value);
              setSignatureChanged(true);
            }}
            />
        </FormGroup>

        <div className="row">
          {closeModal &&
            <Button
              className="btn btn-link"
              onClick={ closeModal }
              >
              Cancel
            </Button>
          }
          <Button
            className="btn ml-auto"
            disabled={ cannotAddUser() }
            onClick={ addUserFunc }
            >
            { saving ? 'Adding...' : 'Add user' }
          </Button>
        </div>
      </div>
    </div>
  )
}