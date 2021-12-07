import React from 'react';
import Empty from 'components/Empty';
import {
  Modal,
  ModalBody,
  ModalHeader,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

export default function ModalError( props ) {
  const {
    opened,
    close,
    localError,
  } = props;

  const {
    t
  } = useTranslation();

  const renderGeneralError = () => {
    const error = localError.error;
    return (
      <div style={{ marginTop: 20 }}>
        <div className="row">
          <label className="p-r-5">{t('errorMessage')}: </label>
          {error.message}
        </div>
        { error.name &&
          <div className="row">
            <label className="p-r-5">{t('errorName')}: </label>
            {error.name}
          </div>
        }
        { error.fileName &&
          <div className="row">
            <label className="p-r-5">{t('fileName')}: </label>
            {error.fileName}
          </div>
        }
        { error.path &&
          <Empty>
            <label>{t('stackPath')}:</label>
            <div>{error.path.reduce(((acc, cur) => `${acc.length > 0 ? `${acc} -> ` :''}${cur}` ),'')}</div>
          </Empty>
        }
        { error.stack &&
          <Empty>
            <label>{t('stackTrace')}:</label>
            {error.stack && error.stack.split('\n').map((text, index) => <div key={index}>{text}</div> )}
          </Empty>
        }
      </div>
    )
  }

  const renderApolloErrors = () => {
    const errors = localError.errors;
    return (
      <Empty>
        {errors.map((error) => (
          <div style={{ borderBottom: '3px solid lightGray', marginTop: 20 }}>
            <div className="row">
              <label className="p-r-5">{t('errorName')}: </label>
              {error.message}
            </div>
            <div className="row">
              <label className="p-r-5">{t('errorCode')}: </label>
              {error.extensions.code}
            </div>
            { error.path &&
              <Empty>
                <label>{t('stackPath')}:</label>
                <div>{error.path.reduce(((acc, cur) => `${acc.length > 0 ? `${acc} -> ` :''}${cur}` ),'')}</div>
              </Empty>
            }
            <label>{t('stackTrace')}:</label>
            {error.extensions.exception.stacktrace.map((text, index) => <div key={index}>{text}</div> )}
          </div>
        ))}
      </Empty>
    )
  }

  if ( localError === null ) {
    return null;
  }

  return (
    <Modal isOpen={ opened } className="task-add-container" modalClassName="overflow-x-auto" >
      <ModalBody>
        <Card>
          <CardHeader tag="h3">{t('errorMessages')}</CardHeader>
          <CardBody>
            { localError.apollo ? renderApolloErrors() : renderGeneralError() }
          </CardBody>
          <CardFooter>
            <button className="btn-link-cancel btn-distance" onClick={close}>
              {t('close')}
            </button>
          </CardFooter>
        </Card>
      </ModalBody>
    </Modal>
  )
}