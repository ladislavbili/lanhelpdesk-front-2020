import React, { Component } from 'react';
import firebase from 'firebase';
import { Button } from 'reactstrap';

import "../../../scss/unused/CRMMertel.scss";

export default class Attachements extends Component{

  constructor(props){
    super(props);
    this.state={
      files:[]
    }
    this.getData.bind(this);
    this.getData(this.props.attachements);
  }

  componentWillReceiveProps(props){
    if(this.props.attachements.length!==props.attachements.length){
      this.getData(props.attachements);
    }
  }

  getData(attachements){
    let storageRef = firebase.storage().ref();
    let paths = this.state.files.map((item)=>item.ref);

    attachements.filter((path)=>!paths.includes(path)).forEach((path) =>{
      Promise.all([
        storageRef.child(path).getDownloadURL(),
        storageRef.child(path).getMetadata()
      ]).then(([url,metadata])=>{
        this.setState({files: [...this.state.files,{url,name:metadata.name,size:metadata.size,path}]});
      })
    });
  }

  getFile(path){
    let storageRef = firebase.storage().ref();
    Promise.all([
      storageRef.child(path).getDownloadURL(),
      storageRef.child(path).getMetadata()
    ]).then(([url,metadata])=>{
      if (!this.state.files.map((item)=>item.name).includes(metadata.name)) {
        this.setState({files: [...this.state.files,{url,name:metadata.name,size:metadata.size,path}]});
      }else{
        let newFiles=[...this.state.files];
        newFiles[newFiles.findIndex((item)=>item.name===metadata.name)]={url,name:metadata.name,size:metadata.size,path};
        this.setState({files:newFiles});
      }
    })
  }


  render(){
    return (
      <div className="m-b-20">
        <label style={{display: 'block'}}>Attachements</label>
        <div className="m-r-5" style={{display: 'inline'}}>
          <input
            type="file"
            id="fileUpload"
            style={{ display: "none" }}
            onChange={e => {
              let file = e.target.files[0];
              if(file===undefined){
                return;
              }
              let storageRef = firebase.storage().ref();
              let fileRef = storageRef.child('projects-attachements/'+this.props.id+'/'+file.name);
              fileRef.put(file).then((response)=>{
                if(!this.props.attachements.includes('projects-attachements/'+this.props.id+'/'+file.name)){
                  let newAttachements=[...this.props.attachements,'projects-attachements/'+this.props.id+'/'+file.name];
                  this.props.onChange(newAttachements);
                }
                this.getFile('projects-attachements/'+this.props.id+'/'+file.name);
              });
            }}
            />
            <Button
              htmlFor="fileUpload"
              className="btn"
              >
              +
              </Button>
          </div>
            {
              this.state.files.map((file)=>
                <div className="m-r-5 file" style={{display: "inline"}}>
                  <label className="file-name">
                    <a href={file.url} rel="noopener noreferrer" target="_blank">{file.name}</a>
                  </label>
                  <button
                    className="btn"
                    type="button"
                    onClick={()=>{
                        if(window.confirm('Are you sure?')){
                          let storageRef = firebase.storage().ref();
                          storageRef.child(file.path).delete().then((resp)=>{
                            let newAttachements=[...this.props.attachements];
                            newAttachements.splice(newAttachements.findIndex((item)=>item===file.path),1);
                            let newFiles=[...this.state.files];
                            newFiles.splice(newFiles.findIndex((item)=>item.path===file.path),1);
                            this.setState({files:newFiles});
                            this.props.onChange(newAttachements);
                          });

                        }
                      }}
                    >
                    X
                  </button>
                </div>
              )
            }
        </div>
      );
    }
  }
