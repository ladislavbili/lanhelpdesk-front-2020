import React from 'react';
import {
  timestampToString
} from 'helperFunctions';
import {
  Label,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

export default function CommentRender( props ) {
  const {
    getAttachment,
    comment
  } = props;

  const {
    t
  } = useTranslation();

  return (
    <div>
      <div className="media m-b-30 m-t-30">
        <img
          className="d-flex mr-3 rounded-circle thumb-sm"
          src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
          alt="Generic placeholder XX"
          />
        <div className="flex">
          <span className="media-meta pull-right color-muted">{timestampToString(comment.createdAt)}</span>
          <span className="font-15 m-0 font-bold">{comment.user !== null ? (comment.user.fullName) : t('unknownUser')}</span>
          { comment.internal && <span className="inline-success-message m-l-5" >{t('internalMessage')}</span> }
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
