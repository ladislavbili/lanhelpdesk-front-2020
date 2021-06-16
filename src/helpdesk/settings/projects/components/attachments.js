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

export default function TaskAttachments( props ) {
  //data & queries
  const {
    disabled,
    projectId,
    attachments,
    addAttachments,
    removeAttachment,
    type
  } = props;


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
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } )
  }

  return (
    <div className={classnames( {"p-t-15": projectId === null}, {"p-l-0 ": projectId === null}, {"display-none": attachments.length === 0} )}>
      <div className="">
        <input
          type="file"
          id={`upload-project-attachment-${projectId === null ? 'add' : projectId}`}
          multiple={true}
          style={{display:'none'}}
          onChange={(e)=>{
            if(e.target.files.length>0){
              let files = [...e.target.files];
              addAttachments(files);
            }
          }}
          />
        { attachments.map((attachment,index) =>
          <div key={index}  className="attachment" style={{backgroundColor: 'inherit'}}>
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
      </div>
    </div>
  );
}