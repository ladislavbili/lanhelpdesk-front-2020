import React from 'react';
import {
  useMutation,
  useSubscription,
  useQuery,
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
  pickSelectStyle
} from 'configs/components/select';
import axios from 'axios';

import {
  REST_URL,
} from 'configs/restAPI';
import {
  GET_COMMENTS,
  COMMENTS_SUBSCRIPTION,
} from './queries';
import Loading from 'components/loading';

import Comment from './comment';
import Email from './email';

import downloadjs from 'downloadjs';

export default function Comments( props ) {

  const {
    id,
    isMulti,
    users,
    userRights,
    submitComment,
    submitEmail,
  } = props;

  const {
    data: commentsData,
    loading: commentsLoading,
    refetch: commentsRefetch,
  } = useQuery( GET_COMMENTS, {
    variables: {
      task: id
    },
    fetchPolicy: 'network-only'
  } );

  useSubscription( COMMENTS_SUBSCRIPTION, {
    variables: {
      taskId: id,
    },
    onSubscriptionData: () => {
      commentsRefetch( {
        variables: {
          task: id
        }
      } );
    }
  } );

  const [ attachments, setAttachments ] = React.useState( [] );
  const [ emailBody, setEmailBody ] = React.useState( "" );
  const [ hasError ] = React.useState( false );
  const [ isEmail, setIsEmail ] = React.useState( !userRights.addComments );
  const [ isInternal, setIsInternal ] = React.useState( false );
  const [ newComment, setNewComment ] = React.useState( "" );
  const [ saving, setSaving ] = React.useState( false );
  const [ subject, setSubject ] = React.useState( "" );
  const [ tos, setTos ] = React.useState( [] );
  const [ openedComments, setOpenedComments ] = React.useState( [] );
  React.useEffect( () => {
    setOpenedComments( [] )
    setIsEmail( !userRights.addComments );
    commentsRefetch( {
      variables: {
        task: id
      }
    } );
  }, [ id ] );

  const getAttachment = ( attachment ) => {
    axios.get( `${REST_URL}/get-attachments`, {
        params: {
          type: "comment",
          path: attachment.path
        },
        headers: {
          'authorization': `Bearer ${sessionStorage.getItem('acctok')}`
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

  if ( commentsLoading ) {
    return <Loading />
  }

  return (
    <div>
      { (userRights.addComments || userRights.emails) &&
        <div>
          { isEmail &&
            <FormGroup className="row m-b-10">
              <Label className="m-r-10 center-hor" style={{width:50}}>To:</Label>
              <div className="flex">
                <Creatable
                  isMulti
                  value={tos}
                  onChange={(newData) => setTos(newData)}
                  options={users}
                  styles={pickSelectStyle()}/>
              </div>
            </FormGroup>
          }
          {isEmail &&
            <FormGroup className="row m-b-10">
              <Label className="m-r-10 center-hor" style={{width:50}}>Subject:</Label>
              <Input className="form-control-secondary flex" type="text" placeholder="Enter subject" value={subject} onChange={(e)=>setSubject(e.target.value)}/>
            </FormGroup>
          }
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
              <Input type="textarea" placeholder="Enter comment" style={{ border: 'none' }} value={newComment} onChange={(e)=>setNewComment(e.target.value)}/>
            </FormGroup>
          }
          {isEmail && hasError &&
            <div style={{color:'red'}}>
              E-mail failed to send! Check console for more information
            </div>
          }

          <div className="row m-b-30">

            <button
              className="btn center-hor m-t-0 btn-distance"
              disabled={(!isEmail && newComment==='')|| (isEmail&&(tos.length < 1 ||subject===''||emailBody===''))||saving}
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
                    setSaving,
                    () => {
                    }
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
                    setSaving,
                    () => {
                    }
                  );
                }
                setSaving(true);
                setAttachments( [] );
                setEmailBody( '' );
                setNewComment( '' );
                setSubject( '' );
                setTos( [] );
              }}
              >
              {`Add ${ isEmail ? 'e-mail' : 'comment'}`}
            </button>
            { userRights.emails && userRights.addComments &&
              <Checkbox
                className = "m-r-15 center-hor "
                centerHor
                disabled={ !userRights.emails || !userRights.addComments }
                label = "E-mail"
                value = { isEmail }
                onChange={() => setIsEmail(!isEmail) }
                />
            }
            {userRights.internal && !isEmail &&
              <Checkbox
                className = "m-r-15 center-hor"
                centerHor
                label = "Internal"
                value = { isInternal }
                onChange={()=>setIsInternal(!isInternal)}
                />
            }

            <div className='center-hor'>
              <button
                className="btn-link v-a-m"
                htmlFor="uploadCommentAttachments"
                >
                <i className="fa fa-plus" />
                Attachement
              </button>
              <input
                type="file"
                id="uploadCommentAttachments"
                multiple={true}
                style={{display:'none'}}
                onChange={(e)=>{
                  if(e.target.files.length>0){
                    let files = [...e.target.files];
                    setAttachments([...attachments,...files]);
                  }
                }}
                />
            </div>
            { attachments.map((attachment,index) =>
              <div className="comment-attachment"
                style={{    height: "25px", marginTop: "11px", marginRight:"5px"}}
                >
                <span style={{color: "#0078D4"}}>
                  {`${attachment.name} (${Math.round(parseInt(attachment.size)/1024)}kB)`}
                </span>
                <button
                  className="btn-link"
                  style={{
                    height: "15px",
                    marginTop: "-8px",
                    marginLeft: "5px",
                    padding: "0px"
                  }}
                  onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      let newAttachments=[...attachments];
                      newAttachments.splice(index,1);
                      setAttachments(newAttachments)
                    }
                  }}
                  >
                  <i className="fa fa-times"  />
                </button>
              </div>
            )}
          </div>
        </div>
      }

      { !isMulti && commentsData.comments.filter((comment)=> userRights.internal || !comment.isInternal).sort((item1,item2)=>item2.createdAt-item1.createdAt).map((comment)=>
        <div key={comment.id} >
          { comment.isEmail &&
            <Email
              openedComments={openedComments}
              setOpenedComments={setOpenedComments}
              getAttachment={getAttachment}
              comment={comment}
              sendEmail={() => {
                setTos( users.filter((user) => user.id === comment.user.id ) );
                setSubject(comment.subject);
                setIsEmail(true);
                setEmailBody(('<body><br><blockquote><p>'+(comment.html?comment.html:unescape(comment.text).replace(/(?:\r\n|\r|\n)/g, '<br>'))+'</p></blockquote><body>'));
              }}
              />
          }
          { !comment.isEmail &&
            <Comment getAttachment={getAttachment} comment={comment} />
          }
        </div>
      )}
    </div>
  );
}