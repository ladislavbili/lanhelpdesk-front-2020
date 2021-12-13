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
import {
  useTranslation
} from "react-i18next";
import Select from "react-select";
import Empty from 'components/Empty';

export default function ProjectGroupAddUser( props ) {
  //props
  const {
    submit,
    companies,
    groups,
  } = props;

  const {
    t
  } = useTranslation();

  const [ open, setOpen ] = React.useState( false );

  const [ chosenCompany, setChosenCompany ] = React.useState( null );
  const [ userGroup, setUserGroup ] = React.useState( null );

  React.useEffect( () => {
    if ( open ) {
      setChosenCompany( null );
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
        Helpdesk {t('company').toLowerCase()}
      </button>
      <Modal isOpen={open}>
        <ModalHeader>
          {t('addingCompanyToGroup')}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="group-title">{t('company')}</Label>
              <Select
                value={chosenCompany}
                styles={pickSelectStyle()}
                onChange={(e)=> setChosenCompany(e)}
                options={companies}
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
                disabled={ chosenCompany === null || userGroup === null }
                onClick={ () => {
                  submit({ company: chosenCompany, group: userGroup })
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