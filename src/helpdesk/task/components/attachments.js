import React from 'react';
import downloadjs from 'downloadjs';
import {
  Label
} from 'reactstrap';
import axios from 'axios';
import {
  REST_URL,
} from 'configs/restAPI';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";

export default function TaskAttachments( props ) {
  //data & queries
  const {
    disabled,
    taskID,
    attachments,
    addAttachments,
    removeAttachment,
    type
  } = props;

  const {
    t
  } = useTranslation();


  const getAttachment = ( attachment ) => {
    axios.get( `${REST_URL}/get-attachments`, {
        params: {
          type,
          path: attachment.path
        },
        headers: {
          'authorization': `Bearer ${sessionStorage.getItem('acctok')}`
        },
        responseType: 'arraybuffer',
      } )
      .then( ( response ) => {
        downloadjs( response.data, attachment.filename, attachment.mimetype );
        /*
        window.open(
        URL.createObjectURL(
        new Blob( [ response.data ], {
        type: attachment.mimetype
        } )
        )
        );
        */
        //download
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } )
  }

  return (
    <div className={classnames("task-edit-popis", {"p-t-15": taskID === null}, {"p-l-0 ": taskID === null}, {"display-none": attachments.length === 0} )}>
      <input
        type="file"
        id={`uploadAttachment-${taskID}`}
        multiple={true}
        style={{display:'none'}}
        onChange={(e)=>{
          if(e.target.files.length>0){
            let files = [...e.target.files];
            addAttachments(files);
          }
        }}
        />
      { false && !disabled && !top &&
        <div className="attachment-label">
          <label htmlFor={`uploadAttachment-${taskID}`} className="btn-link" >
            <i className="fa fa-plus" />
            {t('attachment')}
          </label>
        </div>
      }
      { attachments.map((attachment,index) =>
        <div key={index}  className="attachment">
          <span key={attachment.id} className="comment-attachment link m-r-5" onClick={ () => getAttachment(attachment) }>
            {`${attachment.filename} (${attachment.size/1000}kb)`}
          </span>
          {!disabled &&
            <button className="btn-link"
              disabled={disabled}
              onClick={()=>{
                removeAttachment(attachment);
              }}>
              <i className="fa fa-times"  />
            </button>
          }
        </div>
      )}
      { false && !disabled && top &&
        <label htmlFor={`uploadAttachment-${taskID}`} className="btn-link" >
          <i className="fa fa-plus" />
          {t('attachment')}
        </label>
      }
    </div>
  );
}