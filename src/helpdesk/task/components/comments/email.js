import React from 'react';
import {
  timestampToString
} from 'helperFunctions';
import {
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

export default function EmailRender( props ) {
  const {
    getAttachment,
    comment,
    sendEmail,
    openedComments,
    setOpenedComments,
  } = props;

  const {
    t
  } = useTranslation();
  return (
    <div>
      <div className="media m-b-30 m-t-20">

        <img
          className="d-flex mr-3 rounded-circle thumb-sm"
          src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
          alt="Generic placeholder XX"
          />
        <div className="flex" >
          <div>
            <span className="media-meta pull-right color-muted">{timestampToString(comment.createdAt)}</span>
            <h2 className="font-13 m-0"><Label>{t('from2')}: {comment.user !== null ? `${comment.user.fullName} (${comment.user.email})` : t('unknownUser')}</Label></h2>
            { comment.tos.length !== 0 && <h2 className="font-13 m-0"><Label>{t('to2')}: {comment.tos.toString()}</Label></h2>}
          </div>
          <Dropdown className="center-hor pull-right"
            isOpen={openedComments.includes(comment.id)}
            toggle={()=>{
              if(openedComments.includes(comment.id)){
                setOpenedComments(openedComments.filter((commentId) => commentId === comment.id));
              }else{
                setOpenedComments([...openedComments, comment.id]);
              }
            }}
            >
            <DropdownToggle className="header-dropdown">
              <i className="fa fa-arrow-down" style={{color:'grey'}}/>
            </DropdownToggle>
            <DropdownMenu right>
              <label
                className='btn btn-link btn-outline-blue waves-effect waves-light'
                onClick={sendEmail}
                >
                <i className="fa fa-reply" />
              </label>
            </DropdownMenu>
          </Dropdown>
          <p className="m-b-0">{t('subject')}: <span className="color-muted">{comment.subject}</span></p>
          <div
            className="ignore-css"
            dangerouslySetInnerHTML={{
              __html: (comment.html ? comment.html : unescape(comment.message).replace(/(?:\r\n|\r|\n)/g, '<br>')).replace(/(?:<p>)/g, '<div>').replace(/(?:<\/p>)/g, '</div>')
            }}
            >
          </div>
        </div>
      </div>
      <div className="m-l-40 m-b-30">
        {comment.commentAttachments && comment.commentAttachments.map((attachment)=>
          <span key={attachment.id} className="comment-attachment link m-r-5" onClick={ () => getAttachment(attachment) }>
            {`${attachment.filename} (${attachment.size/1000}kb)`}
          </span>
        )}
      </div>
    </div>
  )
}