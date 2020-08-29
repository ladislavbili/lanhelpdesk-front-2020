import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import ProjectAdd from 'helpdesk/settings/projects/projectAdd';

export default function ProjecAddContainer(props){
  //props
  const { open } = props;

return (
  <div>
      <Modal isOpen={open}  >
        <ModalHeader>Add project</ModalHeader>
        <ModalBody>
          <ProjectAdd {...props}/>
        </ModalBody>
    </Modal>
  </div>
  );
}
