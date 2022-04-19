import React from 'react';
import Empty from 'components/Empty';
import {
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  Label,
} from 'reactstrap';
import Select from 'react-select';

import {
  toSelArr,
} from 'helperFunctions';
import {
  pickSelectStyle,
} from 'configs/components/select';
import {
  useTranslation
} from "react-i18next";

export default function DeleteFolderModal( props ) {
  const {
    saving,
    deleteFolder,
    folders,
    id,
    history,
  } = props;

  const {
    t
  } = useTranslation();

  const deleteAllPages = {
    id: null,
    value: null,
    label: t( 'deleteAllLanwikiPages' ),
  }

  const [ open, setOpen ] = React.useState( false );
  const [ replacement, setReplacement ] = React.useState( deleteAllPages );
  const [ deleting, setDeleting ] = React.useState( false );

  const deleteFolderFunc = () => {
    setDeleting( true );
    deleteFolder( {
        variables: {
          id,
          newId: replacement.id
        }
      } )
      .then( () => {
        setDeleting( false );
        history.push( `/lanwiki/i/${ replacement.id === null ? 'all' : replacement.id }` )
      } )
      .catch( ( e ) => {
        console.log( e );
        setDeleting( false );
      } )
  };

  return (
    <Empty>
      <button
        className='btn-red ml-auto'
        disabled={saving}
        onClick={() => setOpen(true)}
        >
        {`${t('delete')} ${t('folder').toLowerCase()}`}
      </button>
      { open &&
        <Modal isOpen={open} className="small-modal" >
          <ModalHeader>{`${t('delete')} ${t('folder').toLowerCase()}`}</ModalHeader>
          <ModalBody>
            <div className="p-20">
              <FormGroup>
                <Label htmlFor="replacement">{t('replacement')}</Label>
                <Select
                  placeholder={t('selectFolder')}
                  value={replacement}
                  options={[deleteAllPages, ...toSelArr(folders).filter((folder) => folder.myRights.write && folder.id !== id )]}
                  onChange={(folder)=>{
                    setReplacement(folder);
                  }}
                  styles={pickSelectStyle( [ 'noArrow', 'required', ] )}
                  />
              </FormGroup>

              <div className="m-t-20 row">
                <button
                  className="btn-link-cancel"
                  onClick={() => setOpen(false) }
                  >
                  {t('close')}
                </button>
                <button className="btn ml-auto" disabled={ deleting } onClick={deleteFolderFunc} >
                  {!saving ? `${t('delete')} ${t('folder').toLowerCase()}` : `${t('deleting')} ${t('folder').toLowerCase()}` }
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      }
    </Empty>
  )
}