const testingREST = false;
const protectedREST = 'http://212.89.238.104:4000';
const localREST = 'http://localhost:4000';

export const REST_URL = testingREST ? localREST : protectedREST
