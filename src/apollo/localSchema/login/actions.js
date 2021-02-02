import {
  isLoggedInVar,
  testedTokenVar,
} from './variables';

export function setIsLoggedIn( newValue ) {
  isLoggedInVar( newValue );
}

export function setTestedToken( newValue ) {
  testedTokenVar( newValue );
}