import React from 'react';
import {
  timestampToString
} from 'helperFunctions';
import {
  Label,
} from 'reactstrap';

export default function CommentRender( props ) {
  const {
    getAttachment,
    comment
  } = props;
  return (
    <div>
      <div className="media m-b-30 m-t-30">
        <img
          className="d-flex mr-3 rounded-circle thumb-sm"
          src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
          alt="Generic placeholder XX"
          />
        <div className="flex">
          <span className="media-meta pull-right text-muted">{timestampToString(comment.createdAt)}</span>
          <h2 className="font-13 m-0"><Label>{comment.user !== null ? (comment.user.fullName) : 'Unknown sender'}</Label></h2>
        </div>
      </div>
      <div className="m-l-40 m-b-15 font-13" style={{marginTop: "-40px"}} dangerouslySetInnerHTML={{__html: comment.message.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/(?:<p>)/g, '<div>').replace(/(?:<\/p>)/g, '</div>') }}>
      </div>
      <div className="m-l-40 m-b-30">
        {comment.commentAttachments && comment.commentAttachments.map( (attachment) =>
          <span key={attachment.id} className="comment-attachment link m-r-5" onClick={ () => getAttachment(attachment) }>
            {`${attachment.filename} (${attachment.size/1000}kb)`}
          </span>
        )}
      </div>
    </div>
  )
}