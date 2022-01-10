import React from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import UserManagement from '../userManagement';

import {
  useTranslation
} from "react-i18next";

export default function FolderAdd( props ) {
  const {
    close,
    users,
    addFolder,
    currentUser,
  } = props;

  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( '' );
  const [ order, setOrder ] = React.useState( 1 );
  const [ description, setDescription ] = React.useState( '' );
  const [ folderRights, setFolderRights ] = React.useState( [ {
      userId: currentUser.id,
      active: true,
      read: true,
      write: true,
      manage: true,
  }
] );
  const [ saving, setSaving ] = React.useState( false );

  const addFolderFunc = () => {
    setSaving( true );
    addFolder( {
        variables: {
          archived: false,
          title,
          order: parseInt( order ),
          description,
          folderRights,
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
        <Label htmlFor="order">{t('order')}</Label>
        <Input type="number" id="order" className="form-control" placeholder={t('orderPlaceholder')} value={order} onChange={(e) => setOrder(e.target.value)}/>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">{t('description')}</Label>
        <Input type="textarea" className="form-control" id="description" placeholder={t('descriptionPlaceholder')} value={description} onChange={(e) => setDescription(e.target.value)}/>
      </FormGroup>

      <UserManagement
        users={users}
        myId={currentUser.id}
        folderRights={folderRights}
        setFolderRights={setFolderRights}
        />

      <div className="row buttons">
        <Button
          className="btn btn-link-cancel"
          disabled={saving}
          onClick={close}
          >
          {t('close')}
        </Button>
        <Button  className="btn ml-auto" disabled={title.length === 0 || isNaN(parseInt(order)) || saving || folderRights.filter((folderRight) => folderRight.manage ).length === 0 } onClick={addFolderFunc} >
          {!saving ? `${t('add')} ${t('folder').toLowerCase()}` : `${t('adding')} ${t('folder').toLowerCase()}` }
        </Button>
      </div>
    </div>
  );
}