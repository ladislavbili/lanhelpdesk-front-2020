import React, { Component } from 'react';
import { rebase } from '../../index';
import { Container, Row, Col } from 'reactstrap';

import firebase from 'firebase';
import FileUploader from "react-firebase-file-uploader";

export default class PictureUpload extends Component{
  constructor(props){
    super(props);
    this.state = {
      name: "",
      isUploading: false,
      progress: 0,
      picURL: "",
      names : [],
      images: [],
      storageRef: firebase.storage().ref(),
    }

    this.loadImages.bind(this);
    this.fetchData.bind(this);
    this.fetchData();

  }

  fetchData(){
    rebase.get('/lanwiki-image-names', {
      context: this,
      withIds: true,
    }).then((names) =>
        this.setState({names}));
  }

  loadImages(){
      this.state.names.map(name =>
        this.state.storageRef.child(`lanwiki-note-pictures/${name.name}`).getDownloadURL().then((url) => {
          if (!this.state.images.includes(url)) {
            this.setState({images: this.state.images.concat([url])});
          }
    }));

  }
    handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });

    handleProgress = progress => this.setState({ progress });

    handleUploadError = error => {
      this.setState({ isUploading: false });
      console.error(error);
    };

    handleUploadSuccess = filename => {
      this.setState({ name: filename, progress: 100, isUploading: false });
      firebase
        .storage()
        .ref("lanwiki-note-pictures")
        .child(filename)
        .getDownloadURL()
        .then(url => {
          this.setState({ images: [...this.state.images, url], names: [...this.state.names, url] });
          this.setState({saving:true});
          rebase.addToCollection('/lanwiki-image-names', {name: filename});
        })

    };

    /*
https://firebasestorage.googleapis.com/v0/b/lanwiki.appspot.com/o/notes%2Fbird.jpg?alt=media&token=06c38967-a5fb-4900-90e4-a7ececf8beec
https://firebasestorage.googleapis.com/v0/b/lanwiki.appspot.com/o/notes%2Fbird.jpg?alt=media&token=06c38967-a5fb-4900-90e4-a7ececf8beec
    */

  render() {
    if (this.state.images.length === 0 && this.state.names.length !== 0){
        this.loadImages();
      }

    return (
         <div>
              <FileUploader
                accept="image/*"
                name="avatar"
                filename={file => file.name.split('.')[0]}
                storageRef={firebase.storage().ref("lanwiki-note-pictures")}
                onUploadStart={this.handleUploadStart}
                onUploadError={this.handleUploadError}
                onUploadSuccess={this.handleUploadSuccess}
                onProgress={this.handleProgress}
              />
              {this.state.isUploading && <p>Progress: {this.state.progress}</p>}


              <div>
                <Container>
                 {
                   this.state.images.map((_, index) =>
                     {
                       if(index%3 !== 0) return null;
                       return (
                         <Row key={index}>
                           {
                             [...this.state.images]
                             .splice(index, index+3)
                             .map((url) =>
                                 <Col key={url} xs={4} >
                                   <img style={{width: '100%', height: '200px', marginTop: '10px' , objectFit: 'cover', overflow: 'hidden'}} src={url} key={index} alt={url} onClick={() => this.props.appendImage(`<p><img src=${url} /></p>`)}/>
                                 </Col>
                             )
                           }
                           <p> </p>
                         </Row>
                       );
                     }
                   )
                 }
               </Container>
              </div>

            </div>
    );
  }
}
