import React from 'react';
import {
  useMutation
} from "@apollo/client";
import {
  Input,
  Label,
  Button,
  FormGroup,
  Dropdown,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import Checkbox from 'components/checkbox';
import {
  timestampToString
} from 'helperFunctions';
import {
  Creatable
} from 'react-select';
import CKEditor from 'ckeditor4-react';
import {
  selectStyle
} from 'configs/components/select';
import axios from 'axios';

import {
  REST_URL,
} from 'configs/restAPI';

import downloadjs from 'downloadjs';

export default function Comments( props ) {

  const {
    id,
    isMulti,
    users,
    showInternal,
    submitComment,
    submitEmail,
    comments
  } = props;

  const [ attachments, setAttachments ] = React.useState( [] );
  const [ emailBody, setEmailBody ] = React.useState( "" );
  const [ hasError ] = React.useState( false );
  const [ isEmail, setIsEmail ] = React.useState( false );
  const [ isInternal, setIsInternal ] = React.useState( false );
  const [ newComment, setNewComment ] = React.useState( "" );
  const [ saving, setSaving ] = React.useState( false );
  const [ subject, setSubject ] = React.useState( "" );
  const [ tos, setTos ] = React.useState( [] );
  const [ openedComments, setOpenedComments ] = React.useState( [] );

  React.useEffect( () => {
    setOpenedComments( [] )
  }, [ id ] );

  const getAttachment = ( attachment ) => {
    axios.get( `${REST_URL}/get-attachments`, {
        params: {
          type: "comment",
          path: attachment.path
        },
        headers: {
          'authorization': `Bearer ${localStorage.getItem('acctok')}`
        },
        responseType: 'arraybuffer',
      } )
      .then( ( response ) => {
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
    <div>
      <div>
        {isEmail &&<FormGroup className="row m-b-10">
          <Label className="m-r-10 center-hor" style={{width:50}}>To:</Label>
          <div className="flex">
            <Creatable
              isMulti
              value={tos}
              onChange={(newData) => setTos(newData)}
              options={users}
              styles={selectStyle}/>
          </div>
        </FormGroup>}
        {isEmail && <FormGroup className="row m-b-10">
          <Label className="m-r-10 center-hor" style={{width:50}}>Subject:</Label>
          <Input className="flex" type="text" placeholder="Enter subject" value={subject} onChange={(e)=>setSubject(e.target.value)}/>
        </FormGroup>}
        {isEmail &&
          <FormGroup>
            <Label className="">Message</Label>
              <CKEditor
                data={emailBody}
                onChange={(evt)=>setEmailBody(evt.editor.getData()) }
                />
          </FormGroup>
        }
        {!isEmail &&
          <FormGroup>
            <Input type="textarea" placeholder="Enter comment" value={newComment} onChange={(e)=>setNewComment(e.target.value)}/>
          </FormGroup>
        }
        {isEmail && hasError &&
          <div style={{color:'red'}}>
            E-mail failed to send! Check console for more information
          </div>
        }

        <div className="row m-b-30">

          <Button className="btn waves-effect m-t-5 p-l-20 p-r-20 center-hor"
            disabled={(!isEmail && newComment==='')||
              (isEmail&&(tos.length < 1 ||subject===''||emailBody===''))||saving}
              onClick={() => {
                if(isEmail){
                  submitEmail(
                    {
                      id,
                      attachments,
                      emailBody,
                      subject,
                      tos
                  },
                  setSaving
                )
                }else{
                  submitComment(
                    {
                      id,
                      message: newComment,
                      attachments,
                      parentCommentId: null,
                      internal: isInternal,
                    },
                    setSaving
                  );
                }
                setSaving(true);
                setAttachments( [] );
                setEmailBody( '' );
                setNewComment( '' );
                setSubject( '' );
                setTos( [] );
              }}>
              Submit
            </Button>
            <Checkbox
              className = "m-l-10 center-hor"
              centerHor
              label = "E-mail"
              value = { isEmail }
              onChange={() => setIsEmail(!isEmail) }
              />

            {showInternal && !isEmail &&
              <Checkbox
                className = "m-l-10 center-hor"
                centerHor
                label = "Internal"
                value = { isInternal }
                onChange={()=>setIsInternal(!isInternal)}
                />
          }

          <div className='center-hor'>
            <label
              className="btn btn-table-add-item m-l-5"
              style={{fontFamily:"Segoe UI"}}
              htmlFor="uploadCommentAttachments">
              Add Attachement
            </label>
            <input type="file" id="uploadCommentAttachments" multiple={true} style={{display:'none'}}
              onChange={(e)=>{
                if(e.target.files.length>0){
                  let files = [...e.target.files];
                  setAttachments([...attachments,...files]);
                }
              }}
              />
          </div>
          {
            attachments.map((attachment,index)=>
            <div className="comment-attachment"
              style={{    height: "25px", marginTop: "11px", marginRight:"5px"}}
              >
              <span style={{color: "#0078D4"}}>
                {`${attachment.name} (${Math.round(parseInt(attachment.size)/1024)}kB)`}
              </span>
              <button className="btn btn-link-reversed waves-effect"
                style={{height: "15px",
                  marginTop: "-8px",
                  marginLeft: "5px",
                  padding: "0px"}}
                  onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      let newAttachments=[...attachments];
                      newAttachments.splice(index,1);
                      setAttachments(newAttachments)
                    }
                  }}>
                  <i className="fa fa-times"  />
                </button>
              </div>
            )
          }
        </div>
      </div>
      { !isMulti && comments.filter((comment)=>showInternal || !comment.isInternal).sort((item1,item2)=>item2.createdAt-item1.createdAt).map((comment)=>
        <div key={comment.id} >
          { comment.isEmail &&
            <div>
              <div className="media m-b-30 m-t-20">

                <img
                  className="d-flex mr-3 rounded-circle thumb-sm"
                  src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
                  alt="Generic placeholder XX"
                  />
                <div className="flex" >
                  <p>
                    <span className="media-meta pull-right text-muted">{timestampToString(comment.createdAt)}</span>
                      <h2 className="font-13 m-0"><Label>From: {`${comment.user.fullName} (${comment.user.email})`}</Label></h2>
                      <h2 className="font-13 m-0"><Label>To: {comment.tos.toString()}</Label></h2>
                  </p>
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
                      onClick={()=> {
                        setTos(comment.tos.map((to)=>{
                          return {
                            label:to,
                            value:to
                          }
                        }));
                        setSubject(comment.subject);
                        setIsEmail(true);
                        setEmailBody(('<body><br><blockquote><p>'+(comment.html?comment.html:unescape(comment.text).replace(/(?:\r\n|\r|\n)/g, '<br>'))+'</p></blockquote><body>'));
                      }}
                      >
                      <i className="fa fa-reply" />
                    </label>
                    <label
                      className='btn btn-link btn-outline-blue waves-effect waves-light'
                      >
                      <i className="fa fa-share-square"
                        onClick={()=> {
                          setSubject(comment.subject);
                          setIsEmail(true);
                          setEmailBody(comment.html?comment.html:unescape(comment.text).replace(/(?:\r\n|\r|\n)/g, '<br>'));
                        }}
                        />
                    </label>
                  </DropdownMenu>
                </Dropdown>
                <p className="m-b-0">Subject: <span className="text-muted">{comment.subject}</span></p>
                <div
                  className="ignore-css"
                  dangerouslySetInnerHTML={{
                    __html: comment.html ? comment.html : unescape(comment.message).replace(/(?:\r\n|\r|\n)/g, '<br>')
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
          }
          { !isMulti && !comment.isMail &&
            <div>
                <div className="media m-b-30 m-t-30">
                <img
                  className="d-flex mr-3 rounded-circle thumb-sm"
                  src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
                  alt="Generic placeholder XX"
                  />
                <div className="flex">
                  <span className="media-meta pull-right text-muted">{timestampToString(comment.createdAt)}</span>
                  <h2 className="font-13 m-0"><Label>{comment.user!==undefined?(comment.user.fullName):'Unknown sender'}</Label></h2>
                </div>
              </div>
              <div className="m-l-40 m-b-15 font-13" style={{marginTop: "-40px"}} dangerouslySetInnerHTML={{__html: comment.isEmail? comment.message : comment.message.replace(/(?:\r\n|\r|\n)/g, '<br>') }}>
              </div>
              <div className="m-l-40 m-b-30">
                {comment.commentAttachments && comment.commentAttachments.map( (attachment) =>
                  <span key={attachment.id} className="comment-attachment link m-r-5" onClick={ () => getAttachment(attachment) }>
                    {`${attachment.filename} (${attachment.size/1000}kb)`}
                  </span>
                )}
              </div>
            </div>
          }
        </div>
      )}
  </div>
  );
}