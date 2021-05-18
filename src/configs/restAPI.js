const testingREST = true;
const protectedREST = 'https://nodejs02.lanhelpdesk.com:8080';
const localREST = 'http://localhost:4000';
const protectedSocket = 'ws://nodejs02.lanhelpdesk.com:8080';
const localSocket = 'ws://localhost:4000';

export const REST_URL = testingREST ? localREST : protectedREST;
export const SOCKET_URL = testingREST ? localSocket : protectedSocket;