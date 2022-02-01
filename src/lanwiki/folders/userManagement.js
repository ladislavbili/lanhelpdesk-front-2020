import React from 'react';
import Checkbox from 'components/checkbox';
import {
  Label,
  FormGroup,
} from 'reactstrap';
import Select from "react-select";
import {
  pickSelectStyle
} from "configs/components/select";
import {
  toSelArr,
  updateArrayItem,
} from 'helperFunctions';

import {
  useTranslation
} from "react-i18next";

export default function UserManagement( props ) {
  const {
    users,
    myId,
    folderRights,
    setFolderRights,
  } = props;

  const {
    t
  } = useTranslation();

  const [ newUser, setNewUser ] = React.useState( null );

  const addNewUser = () => {
    setFolderRights( [
      ...folderRights,
      {
        userId: newUser.id,
        active: true,
        read: true,
        write: false,
        manage: false,
      }
    ] );
    setNewUser( null );
  }

  const updateUserRight = ( folderRight, attribute, value ) => {
    setFolderRights( updateArrayItem( folderRights, {
      ...folderRight,
      read: attribute === 'write' && value ? true : folderRight.read,
      [ attribute ]: value,
    }, 'userId' ) )
  }

  const removeUserRight = ( userId ) => {
    setFolderRights( folderRights.filter( ( folderRight ) => folderRight.userId !== userId ) )
  }

  return (
    <div>
      <h3>{t('userRights')}</h3>
      <FormGroup>
        <Label>{t('user')}</Label>
        <div className="row">
          <div className="flex">
            <Select
              value={newUser}
              styles={pickSelectStyle()}
              onChange={ (e)=> setNewUser(e) }
              options={toSelArr(users, 'fullName').filter((user) => !folderRights.some((folderRight) => folderRight.userId === user.id ) )}
              />
          </div>
          <button
            className="btn m-l-10"
            disabled={ newUser === null }
            onClick={addNewUser}
            >
            {t('add')}
          </button>
        </div>
      </FormGroup>

      <table className="table bkg-white m-t-20">
        <thead>
          <tr>
            <th>{t('user')}</th>
            <th className="text-center">{t('active')}</th>
            <th className="text-center">{t('read')}</th>
            <th className="text-center">{t('write')}</th>
            <th className="text-center">{t('manage')}</th>
            <th className="text-center" width="50">{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          { folderRights.map((folderRight) => (
            <tr key={folderRight.userId}>
              <td>{users.find((user) => user.id === folderRight.userId ).fullName}</td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value={folderRight.active}
                  disabled={folderRight.userId === myId}
                  disableLabel
                  onChange={() => updateUserRight( folderRight, 'active', !folderRight.active ) }
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value={folderRight.read}
                  disabled={folderRight.userId === myId}
                  blocked={folderRight.write}
                  disableLabel
                  onChange={() => updateUserRight( folderRight, 'read', !folderRight.read ) }
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value={folderRight.write}
                  disabled={folderRight.userId === myId}
                  disableLabel
                  onChange={() =>{
                    updateUserRight( folderRight, 'write', !folderRight.write );
                  }}
                  />
              </td>
              <td>
                <Checkbox
                  centerHor
                  centerVer
                  value={folderRight.manage}
                  disabled={folderRight.userId === myId}
                  disableLabel
                  onChange={() => updateUserRight( folderRight, 'manage', !folderRight.manage ) }
                  />
              </td>
              <td>
                <button
                  className="btn-link m-l-10"
                  disabled={folderRight.userId === myId}
                  onClick={()=>{
                    removeUserRight(folderRight.userId)
                  }}
                  >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
          ) )}
        </tbody>
      </table>
    </div>
  );
}