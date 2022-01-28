import React from 'react';
import Zoom from 'react-medium-image-zoom';
import CKEditor from 'components/CKEditor';
import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";
import {
  useQuery,
} from "@apollo/client";
import axios from 'axios';
import {
  REST_URL,
} from 'configs/restAPI';
import {
  CMDB_SIDEBAR_COMPANY,
} from 'apollo/localSchema/queries';
import 'react-medium-image-zoom/dist/styles.css';

export default function SchemeForm( props ) {
  const {
    schemeImage,
    scheme,
    schemeRefetch,
    addOrUpdateCmdbScheme,
    companyId,
    history,
  } = props;

  const {
    t
  } = useTranslation();

  const [ description, setDescription ] = React.useState( scheme ? scheme.description : '' );
  const [ newScheme, setNewScheme ] = React.useState( null );
  const [ showEdit, setShowEdit ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  const {
    data: companyData,
  } = useQuery( CMDB_SIDEBAR_COMPANY );
  const company = companyData.cmdbSidebarCompany;

  const addOrUpdateCmdbSchemeFunc = () => {
    setSaving( true );
    addOrUpdateCmdbScheme( {
        variables: {
          description,
          companyId
        }
      } )
      .then( ( response ) => {
        if ( newScheme ) {
          const formData = new FormData();
          formData.append( `file`, newScheme );
          formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
          formData.append( "id", response.data.addOrUpdateCmdbScheme.id );
          axios.post( `${REST_URL}/cmdb-upload-scheme`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            } )
            .then( ( response ) => {
              schemeRefetch();
              setShowEdit( false );
              setSaving( false );
            } )
            .catch( ( error ) => {
              setSaving( false );
              console.log( error );
            } )
        } else {
          schemeRefetch();
          setShowEdit( false );
          setSaving( false );
        }
      } )
      .catch( ( error ) => {
        setSaving( false );
        console.log( error );
      } );
  }

  console.log( company );

  if ( !showEdit ) {
    return (
      <div>
        <div className="task-add-layout row">
          <button
            type="button"
            disabled={saving}
            className="btn-link task-add-layout-button btn-distance"
            onClick={() => {
              history.goBack();
            }}
            >
            <i className="fas fa-arrow-left commandbar-command-icon" />
            {t('back')}
          </button>
          <button
            type="button"
            disabled={saving}
            className="btn-link task-add-layout-button btn-distance"
            onClick={() => { setShowEdit(true) }}
            >
            <i className="fa fa-pen" />
            {t('edit')}
          </button>
        </div>
        <div className="p-20">
          <h2>
            {
              company.id === null ? '' :
              (scheme ? company.title: `${company.title} (${t('companyWithoutScheme').toLowerCase()})`)
            }
          </h2>
          <FormGroup>
            <Label>{t('scheme')}</Label>
            <div>
              { schemeImage &&
                <Zoom>
                  <img
                    alt="scheme here"
                    src={schemeImage}
                    width="600"
                    />
                </Zoom>
              }
              { !schemeImage &&
                <div>{t('noSchemeUploaded')}</div>
              }
            </div>
          </FormGroup>
          <FormGroup>
            <Label>{t('description')}</Label>
            <div>
              { scheme &&
                <div dangerouslySetInnerHTML={{ __html: scheme.description }} />
              }
              { !scheme &&
                <div>{`${t('noDescription')}!`}</div>
              }
            </div>
          </FormGroup>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="p-20 fit-with-header-and-lanwiki-commandbar scroll-visible">
        <h2>{`${t('edit')} ${t('scheme2').toLowerCase()}`}</h2>
        <FormGroup>
          <Label htmlFor="scheme">{t('scheme')}</Label>
          <Input type="file" className="form-control" id="description" placeholder={t('scheme')} accepts="image/jpeg,image/png,image/gif,image/bmp,image/webp,image/tiff" onChange={(e) => {
              const files = [...e.target.files];
              if(files.length > 0){
                setNewScheme(files[0]);
              }
            } }/>
          </FormGroup>
          { (schemeImage || newScheme) &&
            <FormGroup>
              <Label>{t('currentScheme')}</Label>
              <div>
                <Zoom>
                  <img
                    alt="scheme here"
                    src={ newScheme ? URL.createObjectURL(newScheme) : schemeImage }
                    width="600"
                    />
                </Zoom>
              </div>
            </FormGroup>
          }
          <FormGroup>
            <Label htmlFor="description">{t('description')}</Label>
              <CKEditor
                value={description}
                type="advanced"
                onChange={(description) => {
                  setDescription(description);
                }}
                />
          </FormGroup>
        </div>

        <div className="task-add-layout row stick-to-bottom">
          <div className="center-ver">
            <button
              className="btn-link task-add-layout-button btn-distance"
              onClick={() => setShowEdit(false) }
              >
              <i className="fas fa-arrow-left commandbar-command-icon" />
              {t('close')}
            </button>
            <button
              className="btn-link task-add-layout-button btn-distance"
              disabled={saving}
              onClick={addOrUpdateCmdbSchemeFunc}
              >
              {saving ? `${t('saving')}...` : `${t('save')} ${t('scheme2').toLowerCase()}`}
            </button>
          </div>
        </div>

      </div>
  );
}