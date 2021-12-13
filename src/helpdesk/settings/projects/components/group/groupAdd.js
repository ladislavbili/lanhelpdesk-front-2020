import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup,
} from 'reactstrap';
import Empty from 'components/Empty';
import {
  defaultGroups,
  createCleanRights,
  getEmptyAttributeRights,
} from 'configs/constants/projects';
import {
  useTranslation
} from "react-i18next";

export default function ProjectGroupAdd( props ) {
  //props
  const {
    submit,
    getFakeId,
    reccomendedOrder,
  } = props;

  const {
    t
  } = useTranslation();

  const [ open, setOpen ] = React.useState( false );
  const [ title, setTitle ] = React.useState( '' );
  const [ description, setDescription ] = React.useState( '' );
  const [ order, setOrder ] = React.useState( '' );

  React.useEffect( () => {
    if ( open ) {
      setTitle( '' );
      setDescription( '' );
      setOrder( '' );
    }
  }, [ open ] );

  return (
    <Empty>
      <button
        className="btn btn-link"
        onClick={() => setOpen(true)}
        >
        <i className="fa fa-plus" />
        {t('group')}
      </button>
      <Modal isOpen={open}>
        <ModalHeader>
          {`${t('add')} ${t('group2').toLowerCase()}`}
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="group-title">{t('groupTitle')}</Label>
            <Input placeholder={t('groupTitlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label for="group-title">{t('groupDescription')}</Label>
            <Input placeholder={t('groupDescriptionPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)}/>
          </FormGroup>
          <FormGroup>
            <Label for="role">{t('order')}</Label>
            <Input placeholder={t('orderPlaceholder')} type="number" value={order} onChange={(e) => setOrder(e.target.value)}/>
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
                disabled={ title.length === 0 || isNaN(parseInt(order)) }
                onClick={ () => {
                  submit({ title, description, id: getFakeId(), order, rights: createCleanRights(), attributeRights: getEmptyAttributeRights() })
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