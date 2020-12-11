import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import {
  toSelArr
} from 'helperFunctions';
import {
  Modal,
  ModalBody,
  Button
} from 'reactstrap';

export default function RowTaskAdd( props ) {
  const {
    project
  } = props;
  //data & queries
  return null;
  return (
    <div>
    {project.title}
    </div>
  );
}