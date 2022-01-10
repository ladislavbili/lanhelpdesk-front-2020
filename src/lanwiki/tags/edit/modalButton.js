import React from 'react';
import TagEditLoader from './index';
import Empty from 'components/Empty';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

export default function TagEditModal( props ) {
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
          <ModalHeader>{t('editTag')}</ModalHeader>
          <ModalBody>
            <TagEditLoader
              {...props}
              close={() => setOpen(false)}
              />
          </ModalBody>
        </Modal>
      }
    </Empty>
  )
}