import {
  isLoggedInVar,
  testedTokenVar,
} from './variables';

export const isLoggedIn = () => {
  return isLoggedInVar();
}

export const testedToken = () => {
  return testedTokenVar();
}