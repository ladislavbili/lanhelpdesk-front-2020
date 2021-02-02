import React from 'react';
import downloadjs from 'downloadjs';
import {
  Label
} from 'reactstrap';
import axios from 'axios';
import {
  REST_URL,
} from 'configs/restAPI';

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
          'authorization': `Bearer ${sessionStorage.getItem('acctok')}`
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
    <div className="form-section">
      <Label>Attachments</Label>
      <div></div>
      <div className="form-section-rest">
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
        { !disabled && !top &&
          <div className="attachment-label">
            <label htmlFor={`uploadAttachment-${taskID}`} className="btn btn-link" >
              <i className="fa fa-plus" />
              Add attachment
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
        { !disabled && top &&
          <label htmlFor={`uploadAttachment-${taskID}`} className="btn btn-link" >
            <i className="fa fa-plus" />
            Add attachment
          </label>
        }
      </div>
    </div>
  );
}