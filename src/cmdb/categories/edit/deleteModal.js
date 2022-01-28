import React from 'react';
import Empty from 'components/Empty';
import Checkbox from 'components/checkbox';
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

export default function DeleteCategoryModal( props ) {
  const {
    saving,
    deleteCategory,
    categories,
    id,
    history,
  } = props;

  const {
    t
  } = useTranslation();

  const deleteAllItems = {
    id: null,
    value: null,
    label: t( 'deleteAllItems' ),
  }

  const [ open, setOpen ] = React.useState( false );
  const [ replacement, setReplacement ] = React.useState( deleteAllItems );
  const [ deleting, setDeleting ] = React.useState( false );

  const deleteCategoryFunc = () => {
    setDeleting( true );
    deleteCategory( {
        variables: {
          id,
          newId: replacement.id
        }
      } )
      .then( () => {
        setDeleting( false );
        history.push( `/cmdb/i/${ replacement.id === null ? 'all' : replacement.id }` )
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
        {`${t('delete')} ${t('category2').toLowerCase()}`}
      </button>
      { open &&
        <Modal isOpen={open} className="small-modal" >
          <ModalHeader>{`${t('delete')} ${t('category2').toLowerCase()}`}</ModalHeader>
          <ModalBody>
            <div className="p-20">
              <FormGroup>
                <Label htmlFor="replacement">{t('replacement')}</Label>
                <Select
                  placeholder={t('selectCategory')}
                  value={replacement}
                  options={[ deleteAllItems, ...toSelArr(categories) ]}
                  onChange={(category)=>{
                    setReplacement(category);
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
                <button className="btn ml-auto" disabled={ deleting } onClick={deleteCategoryFunc} >
                  {!saving ? `${t('delete')} ${t('category2').toLowerCase()}` : `${t('deleting')} ${t('category2').toLowerCase()}` }
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
      }
    </Empty>
  )
}