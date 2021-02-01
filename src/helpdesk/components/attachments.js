import React from 'react';
import downloadjs from 'downloadjs';
import {
  Label
} from 'reactstrap';
import axios from 'axios';
import {
  REST_URL,
} from 'configs/restAPI';
import classnames from 'classnames';

export default function TaskAttachments( props ) {
  //data & queries
  const {
    disabled,
    taskID,
    attachments,
    addAttachments,
    removeAttachment,
  } = props;
  const getAttachment = ( attachment ) => {
    axios.get( `${REST_URL}/get-attachments`, {
        params: {
          type: "task",
          path: attachment.path
        },
        headers: {
          'authorization': `Bearer ${localStorage.getItem('acctok')}`
        },
        responseType: 'arraybuffer',
      } )
      .then( ( response ) => {
        console.log( response );
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
        downloadjs( response.data, attachment.filename, attachment.mimetype );
      } )
  }

  return (
    <div className={classnames("task-edit-popis", {"p-t-15": taskID === null})}>
      <div className="">
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
            <label htmlFor={`uploadAttachment-${taskID}`} className="btn btn-link" >
              <i className="fa fa-plus" />
              Attachment
            </label>
          </div>
        }
        { attachments.map((attachment,index)=>
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
          <label htmlFor={`uploadAttachment-${taskID}`} className="btn btn-link" >
            <i className="fa fa-plus" />
            Attachment
          </label>
        }
      </div>
    </div>
  );
}