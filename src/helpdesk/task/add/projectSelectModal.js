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
  pickSelectStyle
} from 'configs/components/select';
import {
  useTranslation
} from "react-i18next";

import ErrorMessage from 'components/errorMessage';

import Select from 'react-select';

export default function ProjectSelectModal( props ) {
  const {
    projects,
    onSubmit,
    closeModal,
    loading,
  } = props;

  const {
    t
  } = useTranslation();

  const [ project, setProject ] = React.useState( null );

  React.useEffect( () => {
    if ( project ) {
      const updatedProject = projects.find( ( project2 ) => project2.id === project.id )
      if ( updatedProject ) {
        setProject( updatedProject );
      } else {
        setProject( null );
      }
    }
  }, [ projects ] );

  return (
    <Modal isOpen={true} className="small-modal" >
      <ModalBody>
        <div className="m-l-30 m-r-30">
          <div className="task-add-layout-2 p-l-0 row">
            <h2 className="center-hor">{t('createNewTask')}</h2>
          </div>
          <div>
            <FormGroup className="m-b-0">
              <Label>{t('project')}<span className="warning-big">*</span></Label>
              <Select
                placeholder={t('selectProject')}
                value={project}
                onChange={(project)=>{
                  setProject(project);
                }}
                options={projects}
                styles={pickSelectStyle([ 'noArrow', 'required', ])}
                />
            </FormGroup>
            <ErrorMessage className="m-t-5" message="Can't create tasks, no available project with rights." show={projects.length === 0} />
            <div className="task-add-layout-2 p-l-0 row ">
              <Button className="btn-link-cancel align-self-center" onClick={closeModal}>{t('cancel')}</Button>
              <button
                className="btn ml-auto align-self-center"
                disabled={ project === null }
                onClick={() => { onSubmit(project.id) }}
                >
                {t('select')}
              </button>
            </div>
          </div>
        </div>
      </ModalBody>
    </Modal>

  )
}