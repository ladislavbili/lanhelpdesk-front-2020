import React from 'react';
import FolderAddLoader from './index';
import Empty from 'components/Empty';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

export default function FolderAddModal( props ) {
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
        {t('folder')}
      </button>
      { open &&
        <Modal isOpen={open} className="small-modal" >
          <ModalHeader>{`${t('add')} ${t('folder').toLowerCase()}`}</ModalHeader>
          <ModalBody>
            <FolderAddLoader
              {...props}
              close={() => setOpen(false)}
              />
          </ModalBody>
        </Modal>
      }
    </Empty>
  )
}