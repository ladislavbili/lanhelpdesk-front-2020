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

export default function ModalError( props ) {
  const {
    opened,
    close,
    localError,
  } = props;

  const renderGeneralError = () => {
    const error = localError.error;
    return (
      <div style={{ marginTop: 20 }}>
        <div className="row">
          <label className="p-r-5">Error message: </label>
          {error.message}
        </div>
        { error.name &&
          <div className="row">
            <label className="p-r-5">Error name: </label>
            {error.name}
          </div>
        }
        { error.fileName &&
          <div className="row">
            <label className="p-r-5">File name: </label>
            {error.fileName}
          </div>
        }
        { error.path &&
          <Empty>
            <label>Stack path:</label>
            <div>{error.path.reduce(((acc, cur) => `${acc.length > 0 ? `${acc} -> ` :''}${cur}` ),'')}</div>
          </Empty>
        }
        { error.stack &&
          <Empty>
            <label>Stack trace:</label>
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
              <label className="p-r-5">Error message: </label>
              {error.message}
            </div>
            <div className="row">
              <label className="p-r-5">Error code: </label>
              {error.extensions.code}
            </div>
            { error.path &&
              <Empty>
                <label>Stack path:</label>
                <div>{error.path.reduce(((acc, cur) => `${acc.length > 0 ? `${acc} -> ` :''}${cur}` ),'')}</div>
              </Empty>
            }
            <label>Stack trace:</label>
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
    <Modal isOpen={ opened } className="task-add-container" modalClassName="scroll-x-auto" >
      <ModalBody>
        <Card>
          <CardHeader tag="h3">Error message(s)</CardHeader>
          <CardBody>
            { localError.apollo ? renderApolloErrors() : renderGeneralError() }
          </CardBody>
          <CardFooter>
            <button className="btn-link-cancel btn-distance" onClick={close}>
              Close
            </button>
          </CardFooter>
        </Card>
      </ModalBody>
    </Modal>
  )
}