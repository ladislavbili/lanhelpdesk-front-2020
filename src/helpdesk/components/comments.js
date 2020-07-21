import React, { Component } from 'react';
import { Input, Label, Button, FormGroup, Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import firebase from 'firebase';
import { connect } from "react-redux";
import {rebase,database} from '../../index';
import Checkbox from '../../components/checkbox';
import {snapshotToArray, timestampToString} from '../../helperFunctions';
//import {} from '../../redux/actions'
import { Creatable } from 'react-select';
import CKEditor from 'ckeditor4-react';
import {selectStyle} from 'configs/components/select';
import { REST_URL } from 'configs/restAPI';

class Comments extends Component{

constructor(props){
  super(props);
  this.state={
    newComment:'',
    isEmail:false,
    hasError:false,
    comments:[],
    subject:'',
    emailBody:'',
    isInternal:false,
    attachments:[],
    tos:[]
  }
  this.getData.bind(this);
  this.getData(this.props.id);
}

componentWillReceiveProps(props){
	if(this.props.id!==props.id){
		this.getData(props.id);
	}
}

getData(id){
  Promise.all([
    database.collection('help-comments').where("task", "==", id).get(),
    database.collection('help-mails').where("taskID", "==", parseInt(id)).get(),
  ])
  .then(([data,hmails])=>{
    let comments = snapshotToArray(data).map((item)=>{
      return {
        ...item,
        isMail:false,
        user:this.props.users.find((user)=>user.id===item.user)
      };
    });
    let storageRef = firebase.storage().ref();
    let mails = snapshotToArray(hmails);
    let attachments = mails.reduce((acc,cur)=>acc.concat(cur.attachments),[]);
    Promise.all(
      attachments.map( (attachment) => storageRef.child(attachment.path).getDownloadURL() )
    ).then((urls)=>{
      attachments = attachments.map((attachment,index)=>{
        return {
          ...attachment,
          url:urls[index]
        }
      })
      let emails = mails.map((mail)=>{
        return {
          ...mail,
          isMail:true,
          open:false,
          attachments:attachments.filter((attachment1)=>mail.attachments.some((attachment2)=>attachment2.path === attachment1.path))
        }
      })
      this.setState({comments:[...comments,...emails]});
    })
  })
}

submitComment(){
  this.setState({saving:true});

  if (!this.props.isMulti) {
    let time = (new Date()).getTime();
    let storageRef = firebase.storage().ref();
    Promise.all([
      ...this.state.attachments.map((attachment)=>{
        return storageRef.child(`help-comments/${this.props.id}/${time}-${attachment.size}-${attachment.name}`).put(attachment)
      })
    ]).then((resp)=>{
        Promise.all([
          ...this.state.attachments.map((attachment)=>{
            return storageRef.child(`help-comments/${this.props.id}/${time}-${attachment.size}-${attachment.name}`).getDownloadURL()
          })
        ]).then((urls)=>{
            let newAttachments = this.state.attachments.map((attachment,index)=>{
              return {
                title:attachment.name,
                size:attachment.size,
                path:`help-comments/${this.props.id}/${time}-${attachment.size}-${attachment.name}`,
                url:urls[index]
              }
            });
            //mame ulozene attachmenty
            let body={
              user:this.props.userID,
              comment:this.state.isEmail?this.state.emailBody: this.state.newComment,
              subject:this.state.subject,
              isEmail: this.state.isEmail,
              isInternal:this.state.isInternal && this.props.showInternal && !this.state.isEmail,
              tos:this.state.tos.map((item)=>item.value),
                createdAt: (new Date()).getTime(),
              task:this.props.id,
              attachments:newAttachments
            }
            rebase.addToCollection('/help-comments',body).then(()=>{
              this.getData(this.props.id);
              this.props.addToHistory(this.state.isInternal);
              this.setState({saving:false,newComment:'',attachments:[],isInternal:false});
            })
            if(this.state.isEmail){
              this.setState({subject:'',tos:[], emailBody:''})
            }
          })
      })
  } else {
    let time = (new Date()).getTime();
    let storageRef = firebase.storage().ref();
    this.props.id.forEach((i, index) => {
      let id = i.toString();
      Promise.all([
        ...this.state.attachments.map((attachment)=>{
          return storageRef.child(`help-comments/${id}/${time}-${attachment.size}-${attachment.name}`).put(attachment)
        })
      ]).then((resp)=>{
          Promise.all([
            ...this.state.attachments.map((attachment)=>{
              return storageRef.child(`help-comments/${id}/${time}-${attachment.size}-${attachment.name}`).getDownloadURL()
            })
          ]).then((urls)=>{
              let newAttachments = this.state.attachments.map((attachment,index)=>{
                return {
                  title:attachment.name,
                  size:attachment.size,
                  path:`help-comments/${id}/${time}-${attachment.size}-${attachment.name}`,
                  url:urls[index]
                }
              });
              //mame ulozene attachmenty
              let body={
                user:this.props.userID,
                comment:this.state.isEmail?this.state.emailBody: this.state.newComment,
                subject:this.state.subject,
                isEmail: this.state.isEmail,
                isInternal:this.state.isInternal && this.props.showInternal && !this.state.isEmail,
                tos:this.state.tos.map((item)=>item.value),
                  createdAt: (new Date()).getTime(),
                task: id,
                attachments:newAttachments
              }
              rebase.addToCollection('/help-comments',body).then(()=>{
                this.getData(id);
                this.props.addToHistory(this.state.isInternal);
                if (index === this.props.id.length - 1){
                  this.setState({saving:false, newComment: "", attachments:[],isInternal:false});
                }
              })
              if(this.state.isEmail && index === this.props.id.length - 1){
                this.setState({subject:'',tos:[], emailBody:''})
              }
            })
        })
    })
  }
}

submitEmail(){
  if (!this.props.isMulti){
    this.setState({hasError:false});
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((token)=>{
      let body = {
        message: this.state.emailBody,
        tos:this.state.tos.map((item)=>item.label),
        subject:this.state.subject,
        taskID:this.props.id,
        token,
        email:this.props.users.find((user)=>user.id===this.props.userID).email,
        citations:this.state.comments,
        signature:this.props.signature,
      }
      var formData = new FormData();
      Object.keys(body).forEach((key)=>{
        formData.append(key, JSON.stringify(body[key]));
      })

      this.state.attachments.forEach((attachment)=>{
        formData.append('attachments', attachment);
      })

      fetch(`${REST_URL}/send-mail`,{
        method: 'POST',
        body:formData,
      }).then((response)=>response.json().then((response)=>{
        if(response.error){
          this.setState({hasError:true})
          console.log(response);
        }else{
          this.submitComment();
          console.log(response);
        }
      })).catch((error)=>{
        this.setState({hasError:true})
        console.log(error);
      })
    });
  } else {
    this.props.id.forEach((i) => {
      let id = i.toString();
      this.setState({hasError:false});
      firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((token)=>{
        let body = {
          message: this.state.emailBody,
          tos:this.state.tos.map((item)=>item.label),
          subject:this.state.subject,
          taskID: id,
          token,
          email:this.props.users.find((user)=>user.id===this.props.userID).email,
          citations:this.state.comments,
          signature:this.props.signature,
        }
        var formData = new FormData();
        Object.keys(body).forEach((key)=>{
          formData.append(key, JSON.stringify(body[key]));
        })

        this.state.attachments.forEach((attachment)=>{
          formData.append('attachments', attachment);
        })

        fetch(`${REST_URL}/send-mail`,{
          method: 'POST',
          body:formData,
        }).then((response)=>response.json().then((response)=>{
          if(response.error){
            this.setState({hasError:true})
            console.log(response);
          }else{
            this.submitComment();
            console.log(response);
          }
        })).catch((error)=>{
          this.setState({hasError:true})
          console.log(error);
        })
      });
    });

  }

}

  render(){
    return (
      <div>
        <div>
          {this.state.isEmail &&<FormGroup className="row m-b-10">
            <Label className="m-r-10 center-hor" style={{width:50}}>To:</Label>
            <div className="flex">
              <Creatable
                isMulti
                value={this.state.tos}
                onChange={(newData)=>this.setState({tos:newData})}
                options={this.props.users}
                styles={selectStyle}/>
            </div>
          </FormGroup>}
          {this.state.isEmail && <FormGroup className="row m-b-10">
            <Label className="m-r-10 center-hor" style={{width:50}}>Subject:</Label>
            <Input className="flex" type="text" placeholder="Enter subject" value={this.state.subject} onChange={(e)=>this.setState({subject:e.target.value})}/>
          </FormGroup>}
          {this.state.isEmail &&
            <FormGroup>
              <Label className="">Message</Label>
                <CKEditor
                  data={this.state.emailBody}
                  onChange={(evt)=>{this.setState({emailBody:evt.editor.getData()})}}
                  />
            </FormGroup>
          }
          {!this.state.isEmail &&
            <FormGroup>
              <Input type="textarea" placeholder="Enter comment" value={this.state.newComment} onChange={(e)=>this.setState({newComment:e.target.value})}/>
            </FormGroup>
          }
          {this.state.isEmail && this.state.hasError &&
            <div style={{color:'red'}}>
              E-mail failed to send! Check console for more information
            </div>
          }

          <div className="row m-b-30">

            <Button className="btn waves-effect m-t-5 p-l-20 p-r-20 center-hor"
              disabled={(!this.state.isEmail && this.state.newComment==='')||
                (this.state.isEmail&&(this.state.tos.length < 1 ||this.state.subject===''||this.state.emailBody===''))||this.state.saving}
                onClick={this.state.isEmail ? this.submitEmail.bind(this) : this.submitComment.bind(this)}>
                Submit
              </Button>
              <Checkbox
                className = "m-l-10 center-hor"
                centerHor
                label = "E-mail"
                value = { this.state.isEmail }
                onChange={()=>{
                  this.setState({isEmail:!this.state.isEmail})
                }}
                />

              {this.props.showInternal && !this.state.isEmail &&
                <Checkbox
                  className = "m-l-10 center-hor"
                  centerHor
                  label = "Internal"
                  value = { this.state.isInternal }
                  onChange={()=>{
                    this.setState({isInternal:!this.state.isInternal})
                  }}
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
                    this.setState({attachments:[...this.state.attachments,...files]})
                  }
                }}
                />
            </div>
            {
              this.state.attachments.map((attachment,index)=>
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
                        let newAttachments=[...this.state.attachments];
                        newAttachments.splice(index,1);
                        this.setState({attachments:newAttachments})
                      }
                    }}>
                    <i className="fa fa-times"  />
                  </button>
                </div>
              )
            }
          </div>
        </div>

        { !this.props.isMulti && this.state.comments.filter((comment)=>this.props.showInternal || !comment.isInternal).sort((item1,item2)=>item2.createdAt-item1.createdAt).map((comment)=>
          <div key={comment.id} >
            { comment.isMail &&
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
                      <h2 className="font-13 m-0"><Label>{comment.from.map((item)=>item.address).toString()}</Label></h2>
                    </p>
                    <Dropdown className="center-hor pull-right"
                      isOpen={comment.open}
                      toggle={()=>this.setState({comments:this.state.comments.map((com)=>{
                        if(com.id===comment.id){
                          return {...com,open:!comment.open}
                        }
                        return com
                      })
                    })}
                    >
                    <DropdownToggle className="header-dropdown">
                      <i className="fa fa-arrow-down" style={{color:'grey'}}/>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <label
                        className='btn btn-link btn-outline-blue waves-effect waves-light'
                        onClick={()=>this.setState({
                          tos: comment.from.map((item)=>{
                            return {
                              label:item.address,
                              value:item.address
                            }
                          }),
                          subject:comment.subject,
                          isEmail:true,
                          emailBody:('<body><br><blockquote><p>'+(comment.html?comment.html:unescape(comment.text).replace(/(?:\r\n|\r|\n)/g, '<br>'))+'</p></blockquote><body>')
                        })}
                        >
                        <i className="fa fa-reply" />
                      </label>
                      <label
                        className='btn btn-link btn-outline-blue waves-effect waves-light'
                        >
                        <i className="fa fa-share-square"
                          onClick={()=>this.setState({
                            subject:comment.subject,
                            isEmail:true,
                            emailBody:comment.html?comment.html:unescape(comment.text).replace(/(?:\r\n|\r|\n)/g, '<br>')
                          })}
                          />
                      </label>
                    </DropdownMenu>
                  </Dropdown>
                  <small className="text-muted">{comment.subject}</small>
                  <div className="ignore-css" dangerouslySetInnerHTML={{__html: comment.html?comment.html:unescape(comment.text).replace(/(?:\r\n|\r|\n)/g, '<br>') }}>
                  </div>
                </div>
              </div>
              <div className="m-l-40 m-b-30">
                {comment.attachments && comment.attachments.map((attachment)=>
                  <span key={attachment.url} className="comment-attachment m-r-5">
                    <a target="_blank" href={attachment.url} style={{cursor:'pointer'}} rel="noopener noreferrer">
                      {attachment.title}
                    </a>
                  </span>
                )}
              </div>
            </div>
            }
            { !this.props.isMulti && !comment.isMail &&
              <div>
                  <div className="media m-b-30 m-t-30">
                  <img
                    className="d-flex mr-3 rounded-circle thumb-sm"
                    src="https://i.pinimg.com/originals/08/a9/0a/08a90a48a9386c314f97a07ba1f0db56.jpg"
                    alt="Generic placeholder XX"
                    />
                  <div className="flex">
                    <span className="media-meta pull-right text-muted">{timestampToString(comment.createdAt)}</span>
                    <h2 className="font-13 m-0"><Label>{comment.user!==undefined?(comment.user.name + ' '+comment.user.surname):'Unknown sender'}</Label></h2>
                  </div>
                </div>
                <div className="m-l-40 m-b-15 font-13" style={{marginTop: "-40px"}} dangerouslySetInnerHTML={{__html: comment.isEmail? comment.comment : comment.comment.replace(/(?:\r\n|\r|\n)/g, '<br>') }}>
                </div>
                <div className="m-l-40 m-b-30">
                  {comment.attachments && comment.attachments.map((attachment)=>
                    <span key={attachment.url} className="comment-attachment m-r-5">
                      <a target="_blank" href={attachment.url} style={{cursor:'pointer'}} rel="noopener noreferrer">
                        {attachment.title}
                      </a>
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
}

const mapStateToProps = ({ userReducer }) => {
	const { id, userData } = userReducer;
	return { userID:id, signature:userData.signature };
};

export default connect(mapStateToProps, { })(Comments);
