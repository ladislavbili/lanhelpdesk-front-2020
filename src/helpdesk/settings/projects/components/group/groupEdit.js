import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Label,
  Input,
  FormGroup,
} from 'reactstrap';
import {
  defaultGroups,
} from 'configs/constants/projects';
import {
  useTranslation
} from "react-i18next";

export default function ProjectGroupEdit( props ) {
  //props
  const {
    open,
    closeModal,
    group,
    updateGroup,
  } = props;

  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( '' );
  const [ description, setDescription ] = React.useState( '' );
  const [ order, setOrder ] = React.useState( '' );

  React.useEffect( () => {
    if ( group !== null ) {
      setTitle( group.title );
      setDescription( group.description );
      setOrder( group.order );
    }
  }, [ group ] );

  return (
    <Modal isOpen={open}>
      <ModalHeader>
        {`${t('edit')} ${t('group2').toLowerCase()}`}
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
              setTitle(group.title);
              setDescription(group.description);
              setOrder(group.order);
              closeModal();
            } }
            >

            {t('cancel')}
          </button>
          <div className="ml-auto">
            <button
              className="btn btn-distance"
              onClick={ () => {
                setTitle(group.title);
                setDescription(group.description);
                setOrder(group.order);
              } }
              >
              {t('restore')}
            </button>
            <button
              className="btn"
              disabled={ title.length === 0 || isNaN(parseInt(order)) }
              onClick={ () => {
                updateGroup({ title, description, id: group.id, order })
                closeModal();
              } }
              >
              {t('update')}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}