const testingREST = false;
const protectedREST = 'nodejs01.lanhelpdesk.com';
const localREST = 'http://localhost:4000';

export const REST_URL = testingREST ? localREST : protectedREST
