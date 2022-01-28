import React from 'react';
import CategoryAddLoader from './index';
import Empty from 'components/Empty';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

export default function CategoryAddModal( props ) {
  const {
    t
  } = useTranslation();
  const [ open, setOpen ] = React.useState( false );

  return (
    <Empty>
      <button
        className='btn-link p-l-15'
        onClick={() => setOpen(true)}
        >
        <i className="fa fa-plus"/>
        {t('category')}
      </button>
      { open &&
        <Modal isOpen={open} className="small-modal" >
          <ModalHeader>{`${t('add')} ${t('category2').toLowerCase()}`}</ModalHeader>
          <ModalBody>
            <CategoryAddLoader
              {...props}
              close={() => setOpen(false)}
              />
          </ModalBody>
        </Modal>
      }
    </Empty>
  )
}