import React from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Textarea from 'react-textarea-autosize';
import Checkbox from 'components/checkbox';
import DeleteCategory from './deleteModal';

import {
  useTranslation
} from "react-i18next";

export default function CategoryEdit( props ) {
  const {
    id,
    close,
    users,
    category,
    categories,
    updateCategory,
    deleteCategory,
    currentUser,
    history,
  } = props;

  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( category.title );
  const [ descriptionLabel, setDescriptionLabel ] = React.useState( category.descriptionLabel );
  const [ backupLabel, setBackupLabel ] = React.useState( category.backupLabel );
  const [ monitoringLabel, setMonitoringLabel ] = React.useState( category.monitoringLabel );

  const [ saving, setSaving ] = React.useState( false );

  const updateCategoryFunc = () => {
    setSaving( true );
    updateCategory( {
        variables: {
          id,
          title,
          descriptionLabel,
          backupLabel,
          monitoringLabel,
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

  return (
    <div className='p-20'>
      <FormGroup>
        <Label htmlFor="name">{t('title')}</Label>
        <Input id="name" className="form-control" placeholder={t('titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)}/>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="descriptionLabel" >{t('descriptionLabel')}</Label>
        <Textarea className="form-control" id="descriptionLabel" placeholder={t('descriptionLabelPlaceholder')} value={descriptionLabel} onChange={(e) => setDescriptionLabel(e.target.value)} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="backupLabel">{t('backupLabel')}</Label>
          <Textarea className="form-control" id="backupLabel" placeholder={t('backupLabelPlaceholder')} value={backupLabel} onChange={(e) => setBackupLabel(e.target.value)} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="monitoringLabel">{t('monitoringLabel')}</Label>
          <Textarea className="form-control" id="monitoringLabel" placeholder={t('monitoringLabelPlaceholder')} value={monitoringLabel} onChange={(e) => setMonitoringLabel(e.target.value)} />
      </FormGroup>

      <div className="row buttons">
        <Button
          className="btn btn-link-cancel"
          disabled={saving}
          onClick={close}
          >
          {t('close')}
        </Button>
        <DeleteCategory
          saving={saving}
          deleteCategory={deleteCategory}
          categories={categories}
          history={history}
          id={id}
          />
        <Button className="btn" disabled={title.length === 0 || saving } onClick={updateCategoryFunc} >
          {!saving ? `${t('save')} ${t('category2').toLowerCase()}` : `${t('saving')} ${t('category2').toLowerCase()}` }
        </Button>
      </div>
    </div>
  );
}