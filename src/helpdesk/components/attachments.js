import React, {
  Component
} from 'react';
import downloadjs from 'downloadjs';
import axios from 'axios';
import {
  REST_URL,
} from 'configs/restAPI';

export default class Attachments extends Component {
  constructor( props ) {
    super( props );
    this.state = {}
  }

  getAttachment( attachment ) {
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


  render() {
    const {
      disabled,
      taskID,
      attachments,
      addAttachments,
      removeAttachment,
    } = this.props;
    return (
      <div className="full-width task-edit-popis">
        <input
          type="file"
          id={"uploadAttachment" + taskID}
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
            <label htmlFor={"uploadAttachment"+taskID} className="btn-link" >
              <i className="fa fa-plus" />
              Add attachment
            </label>
          </div>
        }
        { attachments.map((attachment,index)=>
          <div key={index}  className="attachment">
            <span key={attachment.id} className="comment-attachment link m-r-5" onClick={ () => this.getAttachment(attachment) }>
              {`${attachment.filename} (${attachment.size/1000}kb)`}
            </span>
            {!disabled &&
              <button className="btn-link-remove"
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
          <div className="attachment-label">
            <label htmlFor={"uploadAttachment"+taskID} className="btn-link clickable" >
              <i className="fa fa-plus p-r-5" />
              Add attachment
            </label>
          </div>
        }
      </div>

    );
  }
}