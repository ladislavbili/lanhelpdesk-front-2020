import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import { SketchPicker } from "react-color";
import {rebase} from '../../../index';

import { connect } from "react-redux";
import {storageHelpTagsStart} from '../../../redux/actions';

class TagEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      color:'FFF',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
  }

  componentWillReceiveProps(props){
    if(props.tagsLoaded && !this.props.tagsLoaded){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(props.tagsLoaded){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.tagsActive){
      this.props.storageHelpTagsStart();
    }
    if(this.props.tagsLoaded){
      this.setData(this.props);
    };
  }

  setData(props){
    let data = props.tags.find((item)=>item.id===props.match.params.id);
    this.setState({title:data.title,color:data.color?data.color:'#FFF',loading:false})
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        {
          this.state.loading &&
          <Alert color="success">
            Loading data...
          </Alert>
        }
        <FormGroup>
          <Label for="name">Tag name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter tag name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <SketchPicker
          id="color"
          color={this.state.color}
          onChangeComplete={value => this.setState({ color: value.hex })}
        />

      <div className="row">
        <Button className="btn m-t-5"  disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/help-tags/'+this.props.match.params.id, {title:this.state.title,color:this.state.color})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving tag...':'Save tag'}</Button>

        <Button className="btn-red m-l-5 m-t-5"  disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/help-tags/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
              }}>Delete</Button>

          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ storageHelpTags}) => {
  const { tagsActive, tags, tagsLoaded } = storageHelpTags;
  return { tagsActive, tags, tagsLoaded };
};

export default connect(mapStateToProps, { storageHelpTagsStart })(TagEdit);
