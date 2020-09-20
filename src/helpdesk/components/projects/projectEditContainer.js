import React from 'react';

import { Modal, ModalBody, ModalHeader, Button } from 'reactstrap';
import ProjectEdit from 'helpdesk/settings/projects/projectEdit';

export default function ProjectEditContainer(props){
  //state
  const [ opened, setOpened ] = React.useState(false);

return (
  <div className='p-l-15 p-r-15'>
    <hr className='m-t-10 m-b-10'/>
      <Button
        className='btn-link p-0'
        onClick={() => setOpened(true)}
        >
        Project settings
      </Button>
    <Modal isOpen={opened}>
        <ModalHeader>
          Edit project
        </ModalHeader>
        <ModalBody>
          <ProjectEdit {...props} closeModal={() => setOpened(false)}/>
        </ModalBody>
    </Modal>
  </div>
  );
}
