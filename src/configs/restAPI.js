const testingREST = true;
//const protectedREST = 'http://nodejs01.lanhelpdesk.com:4000';
const protectedREST = 'https://nodejs02.lanhelpdesk.com:8080';
const localREST = 'http://localhost:4000';

export const REST_URL = testingREST ? localREST : protectedREST