import React, { Component } from 'react';

import {Button } from 'reactstrap';
import TagAdd from './tagAdd';
import TagEdit from './tagEdit';

import { connect } from "react-redux";
import {storageHelpTagsStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class TagList extends Component{
  constructor(props){
    super(props);
    this.state={
      tags:[],
      tagFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.tags,this.props.tags)){
      this.setState({tags:props.tags})
    }
  }

  componentWillMount(){
    if(!this.props.tagsActive){
      this.props.storageHelpTagsStart();
    }
    this.setState({tags:this.props.tags});
  }

  render(){
    return (
      <div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.tagFilter}
                    onChange={(e)=>this.setState({tagFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>this.props.history.push('/helpdesk/settings/tags/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Tag
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
  							Tag
  						</h2>
              <table className="table table-hover">
                <tbody>
                  {this.state.tags.filter((item)=>item.title.toLowerCase().includes(this.state.tagFilter.toLowerCase())).map((tag)=>
                    <tr
                      key={tag.id}
                      className={"clickable" + (this.props.match.params.id === tag.id ? " active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/tags/'+tag.id)}>
                      <td>
                        {tag.title}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <TagAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.tags.some((item)=>item.id===this.props.match.params.id) && <TagEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpTags}) => {
  const { tagsActive, tags } = storageHelpTags;
  return { tagsActive, tags };
};

export default connect(mapStateToProps, { storageHelpTagsStart })(TagList);
