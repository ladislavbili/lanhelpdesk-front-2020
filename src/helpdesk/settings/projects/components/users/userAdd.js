import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  FormGroup,
} from 'reactstrap';
import {
  pickSelectStyle
} from "configs/components/select";
import Select from "react-select";
import Empty from 'components/Empty';
import {
  useTranslation
} from "react-i18next";

export default function ProjectGroupAddUser( props ) {
  //props
  const {
    submit,
    users,
    groups,
  } = props;

  const {
    t
  } = useTranslation();

  const [ open, setOpen ] = React.useState( false );

  const [ chosenUser, setChosenUser ] = React.useState( null );
  const [ userGroup, setUserGroup ] = React.useState( null );

  React.useEffect( () => {
    if ( open ) {
      setChosenUser( null );
      setUserGroup( null );
    }
  }, [ open ] );

  return (
    <Empty>
      <button
        className="btn btn-link"
        onClick={() => setOpen(true)}
        >
        <i className="fa fa-plus" />
        Helpdesk {t('user').toLowerCase()}
      </button>
      <Modal isOpen={open}>
        <ModalHeader>
          {t('addingUserToGroup')}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="group-title">{t('user')}</Label>
              <Select
                value={chosenUser}
                styles={pickSelectStyle()}
                onChange={(e)=> setChosenUser(e)}
                options={users}
                />
          </FormGroup>
          <FormGroup>
            <Label for="group-title">{t('group')}</Label>
              <Select
                value={userGroup}
                styles={pickSelectStyle()}
                onChange={(e)=> setUserGroup(e)}
                options={groups}
                />
          </FormGroup>
          <div className="form-buttons-row m-b-10">
            <button
              className="btn btn-link-cancel"
              onClick={ () => {
                setOpen(false);
              } }
              >
              {t('cancel')}
            </button>
            <div className="ml-auto">
              <button
                className="btn"
                disabled={ chosenUser === null || userGroup === null }
                onClick={ () => {
                  submit({ user: chosenUser, group: userGroup })
                  setOpen(false);
                } }
                >
                {t('add')}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Empty>
  );
}