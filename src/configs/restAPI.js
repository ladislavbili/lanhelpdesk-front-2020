const testingREST = false;
const protectedREST = 'https://api01.lansystems.sk:8080';
const localREST = 'http://127.0.0.1:3003';

export const REST_URL = testingREST ? localREST : protectedREST
