import React from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import Empty from 'components/Empty';
import {
  SketchPicker
} from "react-color"
import {
  useMutation,
} from "@apollo/client";
import {
  ADD_TAG,
} from './queries';

import {
  useTranslation
} from "react-i18next";
const defaultTagColor = '#f759f2';

export default function TagAdd( props ) {

  const {
    t
  } = useTranslation();
  const [ addTag ] = useMutation( ADD_TAG );

  const [ addOpen, setAddOpen ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );
  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ color, setColor ] = React.useState( defaultTagColor );

  const createTag = () => {
    setSaving( true );
    addTag( {
        variables: {
          title,
          color,
          order: parseInt( order ),
          description,
        },
      } )
      .then( () => {
        setTitle( '' );
        setDescription( '' );
        setOrder( 0 );
        setColor( defaultTagColor );
        setSaving( false );
        setAddOpen( false );
      } )
      .catch( ( e ) => {
        console.log( e );
        setSaving( false );
      } );
  }

  return (
    <Empty>
      <button
        className='btn-link p-l-15'
        onClick={() => setAddOpen(true)}
        >
        <i className="fa fa-plus"/>
        {t('tag')}
      </button>
      <Modal isOpen={addOpen} className="small-modal" >
        <ModalHeader>{t('addTag')}</ModalHeader>
        <ModalBody>
          <div className='p-20'>
            <FormGroup>
              <Label htmlFor="name">{t('title')}</Label>
              <Input id="name" className="form-control" placeholder={t('titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)}/>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="order">{t('order')}</Label>
              <Input type="number" id="order" className="form-control" placeholder={t('orderPlaceholder')} value={order} onChange={(e) => setOrder(e.target.value)}/>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">{t('description')}</Label>
              <Input type="textarea" className="form-control" id="description" placeholder={t('descriptionPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)}/>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="body">{t('color')}</Label>
              <SketchPicker
                id="color"
                color={color}
                onChangeComplete={value => setColor(value.hex)}
                />
            </FormGroup>

            <div className="row buttons">
              <Button
                className="btn btn-link-cancel"
                disabled={saving}
                onClick={() => {
                  setAddOpen(false);
                  setTitle('');
                  setDescription('');
                  setOrder(0);
                  setColor(defaultTagColor);
                }}
                >
                {t('close')}
              </Button>
              <Button  className="btn ml-auto" disabled={title.length === 0 || isNaN(parseInt(order)) || saving } onClick={createTag} >
                {!saving ? `${t('add')} ${t('tag').toLowerCase()}` : `${t('adding')} ${t('tag').toLowerCase()}` }
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </Empty>
  );
}