import {
  makeVar
} from "@apollo/client";

export const isLoggedInVar = makeVar( false );
export const testedTokenVar = makeVar( false );