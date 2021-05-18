import axios from 'axios';
import {
  REST_URL
} from 'configs/restAPI';

//refreshne access a refresh token
export default async function refreshToken() {
  return axios.request( {
    url: `${REST_URL}/refresh_token`,
    method: 'post',
    withCredentials: true
  }, )
}