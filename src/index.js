import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {
  Button,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';

import Navigation from 'navigation';
import Login from 'components/login';

import createStore from 'redux/store';
import 'react-datepicker/dist/react-datepicker.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import "scss/index.scss";

import gql from "graphql-tag";
import {ApolloProvider, useQuery} from "@apollo/react-hooks";
import createClient, {secondaryClient} from 'apollo/createClient';
import {useMutation} from "@apollo/react-hooks";
import axios from 'axios';

export const database = {};
export const rebase = {};

const store = createStore();
const client = createClient();

const Root = () => {
  return (<div>

    <Input type="file" name="name" id="user" multiple="multiple" placeholder="Enter user" onChange={async (e) => {
        let files = [...e.target.files];
        const formData = new FormData();
        console.log(files[0]);
        files.forEach((file) => formData.append(`file`, file));
        formData.append("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW5LZXkiOiJmdDN3dWgzN3N0Z3FzZ3Q4ZjlxZGMiLCJpYXQiOjE2MDEzMDYzMTMsImV4cCI6MTYwMjE3MDMxM30.SFyoI9fHlFfJ87j_zLGcLIkGhmnsEF7E3KzU6FkFmdc");
        formData.append("taskId", 1);
        axios.post('http://localhost:4000/upload-attachments', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }}/>
    <button onClick={() => {
        axios.get('http://localhost:4000/get-attachments', {
          params: {
            taskId: 1,
            path: 'files/task-attachments/1/1601409017058-cmyk-printer-test-page-powerpoint-template_2.jpg'
          },
          headers: {
            'authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibG9naW5LZXkiOiJmdDN3dWgzN3N0Z3FzZ3Q4ZjlxZGMiLCJpYXQiOjE2MDEzMDYzMTMsImV4cCI6MTYwMjE3MDMxM30.SFyoI9fHlFfJ87j_zLGcLIkGhmnsEF7E3KzU6FkFmdc"
          }
        }).then((response) => console.log(response))
      }}>get attachments</button>

  </div>)
}

ReactDOM.render(<ApolloProvider client={secondaryClient}><Root/></ApolloProvider>, document.getElementById('root'));
