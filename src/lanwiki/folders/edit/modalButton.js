import React from 'react';
import FolderEditLoader from './index';
import Empty from 'components/Empty';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

export default function FolderEditModal( props ) {
  const {
    t
  } = useTranslation();
  const [ open, setOpen ] = React.useState( false );

  return (
    <Empty>
      <button
        className='btn-link ml-auto m-r-15'
        onClick={() => setOpen(true)}
        >
        <i className="fa fa-cog"/>
      </button>
      { open &&
        <Modal isOpen={open} className="small-modal" >
          <ModalHeader>{`${t('edit')} ${t('folder').toLowerCase()}`}</ModalHeader>
          <ModalBody>
            <FolderEditLoader
              {...props}
              close={() => setOpen(false)}
              />
          </ModalBody>
        </Modal>
      }
    </Empty>
  )
}