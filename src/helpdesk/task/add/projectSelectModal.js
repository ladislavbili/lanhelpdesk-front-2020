import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Button,
  FormGroup,
  Label,
} from 'reactstrap';

import {
  selectStyleNoArrowRequired
} from 'configs/components/select';

import Select from 'react-select';

export default function ProjectSelectModal( props ) {
  const {
    projects,
    onSubmit,
    closeModal,
    loading,
  } = props;

  const [ project, setProject ] = React.useState( null );

  return (
    <Modal isOpen={true} className="small-modal" >
      <ModalBody>
        <div className="m-l-30 m-r-30">
          <div className="task-add-layout-2 p-l-0 row">
            <h2 className="center-hor">Create new task</h2>
          </div>
          <div>
            <FormGroup className="m-b-0">
              <Label>Project <span className="warning-big">*</span></Label>
              <Select
                placeholder="Zadajte projekt"
                value={project}
                onChange={(project)=>{
                  setProject(project);
                }}
                options={projects}
                styles={selectStyleNoArrowRequired}
                />
            </FormGroup>
            <div className="task-add-layout-2 p-l-0 row ">
              <Button className="btn-link-cancel a-s-c" onClick={closeModal}>Cancel</Button>
              <button
                className="btn ml-auto a-s-c"
                disabled={ project === null }
                onClick={() => { onSubmit(project.id) }}
                > Select
              </button>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>

  )
}