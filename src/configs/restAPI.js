const testingREST = true;
//const protectedREST = 'http://nodejs01.lanhelpdesk.com:4000';
const protectedREST = 'http://173.212.231.78:4000';
const localREST = 'http://localhost:4000';

export const REST_URL = testingREST ? localREST : protectedREST