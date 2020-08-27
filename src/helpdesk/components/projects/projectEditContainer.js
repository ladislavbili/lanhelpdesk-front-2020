import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import ProjectEdit from 'helpdesk/settings/projects/projectEdit';

export default function ProjectEditContainer(props){
  //data & queries
  const { history, match } = props;

return (
  <div className='p-l-15 p-r-15'>
    <hr className='m-t-10 m-b-10'/>
      <Button
        className='btn-link p-0'
        onClick={this.toggle.bind(this)}
        >
        Project settings
      </Button>
    <Modal isOpen={this.state.opened}>
        <ModalHeader>
          Edit project
        </ModalHeader>
        <ModalBody>
        </ModalBody>
    </Modal>
  </div>
  );
}
