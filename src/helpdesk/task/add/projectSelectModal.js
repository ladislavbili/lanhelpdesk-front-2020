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
        <div>
          <div className="task-add-layout-2 m-l-20 row">
            <h2 className="center-hor p-r-20">Create new task</h2>
          </div>
          <div className="m-30 m-t-15">
            <FormGroup>
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
            <div className="row m-t-30">
              <Button className="btn-link-cancel" onClick={closeModal}>Cancel</Button>
              <button
                className="btn ml-auto"
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