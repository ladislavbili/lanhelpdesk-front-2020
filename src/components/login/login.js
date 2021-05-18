import React from 'react';
import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  setIsLoggedIn,
  setTestedToken,
} from 'apollo/localSchema/actions';
import {
  useQuery,
} from "@apollo/client";
import refreshToken from 'apollo/refreshToken';
import {
  GET_TESTED_TOKEN,
} from 'apollo/localSchema/queries';
import {
  socketLink
} from 'apollo/links';


export default function Login( props ) {
  const {
    loginUser
  } = props;

  const [ email, setEmail ] = React.useState( '' );
  const [ password, setPassword ] = React.useState( '' );
  const [ signingIn, setSigningIn ] = React.useState( false );
  const [ error, setError ] = React.useState( null );

  const {
    data: testedTokenData,
    loading: testedTokenLoading
  } = useQuery( GET_TESTED_TOKEN );

  const login = () => {
    setSigningIn( true );
    setError( null );

    loginUser( {
        variables: {
          email,
          password
        }
      } )
      .then( ( response ) => {
        setSigningIn( false );
        sessionStorage.setItem( "acctok", response.data.loginUser.accessToken );
        setIsLoggedIn( true );
      } )
      .catch( ( err ) => {
        setSigningIn( false );
        setError( err.message );
      } );
  }

  React.useEffect( () => {
    if ( !testedTokenData.testedToken ) {
      setTestedToken( true )
      tryLogin();
    }
  }, [ testedTokenLoading, testedTokenData.testedToken ] );

  const tryLogin = () => {
    setSigningIn( true );
    refreshToken()
      .then( ( response ) => {
        const {
          ok,
          accessToken
        } = response.data;
        if ( ok ) {
          sessionStorage.setItem( "acctok", accessToken );
          setIsLoggedIn( true )
          setSigningIn( false );
        } else {
          sessionStorage.removeItem( "acctok" );
          setIsLoggedIn( false );
          setSigningIn( false );
        }
      } )
      .catch( ( error ) => {
        setIsLoggedIn( false );
        setSigningIn( false );
      } )
  }


  return (
    <div className="login-bkg">
      <div className="login-card">

        <h1 className="login-header">
          LanHelpdesk
        </h1>

        <FormGroup className="login-item">
          <Label for="email">E-mail</Label>
          <Input type="email" name="email" id="email" placeholder="Enter e-mail" value={email}
            onChange={(e) => setEmail(e.target.value) }
            onKeyPress={(e)=>{
              if( e.charCode===13 && signingIn && email.length > 0 && password.length > 0 ){
                login();
              }
            }}
            />
        </FormGroup>
        <FormGroup className="login-item">
          <Label for="pass">Password</Label>
          <Input type="password" name="pass" id="pass" placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)}
            onKeyPress={(e)=>{
              if(e.charCode===13 && !signingIn && email.length>0 && password.length>0){
                login();
              }
            }}
            />
        </FormGroup>
        <button
          className="btn login-item"
          disabled={ signingIn || email.length === 0 || password.length === 0 }
          onClick={ login }
          >
          Login
        </button>
        {error !== null &&
          <div style={{color:'red'}}>
            {error}
          </div>
        }
      </div>
    </div>
  )
}