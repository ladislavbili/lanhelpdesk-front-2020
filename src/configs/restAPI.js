const testingREST = false;
//const protectedREST = 'http://nodejs01.lanhelpdesk.com:4000';
const protectedREST = 'http://nodejs02.lanhelpdesk.com:4000';
const localREST = 'http://localhost:4000';

export const REST_URL = testingREST ? localREST : protectedREST