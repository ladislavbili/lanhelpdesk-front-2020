import React from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import {
  SketchPicker
} from "react-color";

import {
  useTranslation
} from "react-i18next";

export default function TagAdd( props ) {
  const {
    id,
    close,
    tag,
    updateTag,
    deleteTag,
    clearFilterTag,
  } = props;

  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( tag.title );
  const [ description, setDescription ] = React.useState( tag.description );
  const [ order, setOrder ] = React.useState( tag.order );
  const [ color, setColor ] = React.useState( tag.color );
  const [ saving, setSaving ] = React.useState( false );

  const updateTagFunc = () => {
    setSaving( true );
    updateTag( {
        variables: {
          id,
          title,
          color,
          order: parseInt( order ),
          description,
        },
      } )
      .then( () => {
        setSaving( false );
        close();
      } )
      .catch( ( e ) => {
        console.log( e );
        setSaving( false );
      } );
  }
  const deleteTagFunc = () => {
    if ( window.confirm( t( 'comfirmDeletingLanwikiTag' ) ) ) {
      setSaving( true );
      deleteTag( {
          variables: {
            id,
          },
        } )
        .then( () => {
          clearFilterTag();
          setSaving( false );
          close();
        } )
        .catch( ( e ) => {
          console.log( e );
          setSaving( false );
        } );
    }
  }

  return (
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
          onClick={close}
          >
          {t('close')}
        </Button>
        <Button  className="btn-red ml-auto" disabled={saving} onClick={deleteTagFunc} >
          {!saving ? `${t('delete')} ${t('tag').toLowerCase()}` : `${t('deleting')} ${t('tag').toLowerCase()}` }
        </Button>
        <Button  className="btn" disabled={title.length === 0 || isNaN(parseInt(order)) || saving } onClick={updateTagFunc} >
          {!saving ? `${t('save')} ${t('tag').toLowerCase()}` : `${t('saving')} ${t('tag').toLowerCase()}` }
        </Button>
      </div>
    </div>
  );
}