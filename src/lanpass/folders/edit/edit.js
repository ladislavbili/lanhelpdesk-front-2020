import React from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Checkbox from 'components/checkbox';
import UserManagement from '../userManagement';
import DeleteFolder from './deleteModal';

import {
  useTranslation
} from "react-i18next";

export default function FolderEdit( props ) {
  const {
    id,
    close,
    users,
    folder,
    folders,
    updateFolder,
    deleteFolder,
    currentUser,
    history,
  } = props;

  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( folder.title );
  const [ archived, setArchived ] = React.useState( folder.archived );
  const [ order, setOrder ] = React.useState( folder.order );
  const [ description, setDescription ] = React.useState( folder.description );
  const [ folderRights, setFolderRights ] = React.useState( folder.folderRights.map( ( folderRight ) => ( {
    active: true,
    read: folderRight.read,
    write: folderRight.write,
    manage: folderRight.manage,
    userId: folderRight.user.id,
  } ) ) );
  const [ saving, setSaving ] = React.useState( false );

  const updateFolderFunc = () => {
    const variables = {
      id,
      title,
      order: parseInt( order ),
      description,
      folderRights,
    };
    setSaving( true );
    updateFolder( {
        variables
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
        <DeleteFolder
          saving={saving}
          deleteFolder={deleteFolder}
          folders={folders}
          history={history}
          id={id}
          />
        <Button className="btn" disabled={title.length === 0 || isNaN(parseInt(order)) || saving || folderRights.filter((folderRight) => folderRight.manage ).length === 0 } onClick={updateFolderFunc} >
          {!saving ? `${t('save')} ${t('folder').toLowerCase()}` : `${t('saving')} ${t('folder').toLowerCase()}` }
        </Button>
      </div>
    </div>
  );
}
