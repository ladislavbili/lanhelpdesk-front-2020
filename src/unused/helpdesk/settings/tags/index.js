import React, { Component } from 'react';

import {Button } from 'reactstrap';
import {rebase} from '../../../index';
import TagAdd from './tagAdd';
import TagEdit from './tagEdit';

export default class TagList extends Component{
  constructor(props){
    super(props);
    this.state={
      tags:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/help-tags', {
      context: this,
      withIds: true,
      then:content=>{this.setState({tags:content, tagFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return (
      <div className="content-page">
        <div className="content" style={{ paddingTop: 0 }}>
          <div className="commandbar">
            <div className="row align-items-center">
              <div className="p-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control search"
                    value={this.state.tagFilter}
                    onChange={(e)=>this.setState({tagFilter:e.target.value})}
                    placeholder="Search"
                  />
                  <div className="input-group-append">
                    <button className="search-btn" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>

                <Button
                  className="btn-link t-a-l"
                  onClick={()=>this.props.history.push('/helpdesk/settings/tags/add')}>
                 <i className="fa fa-plus m-r-5 m-l-5 "/> Tag
                </Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr>
                    <th>Company name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.tags.filter((item)=>item.title.toLowerCase().includes(this.state.tagFilter.toLowerCase())).map((tag)=>
                    <tr
                      key={tag.id}
                      className={"clickable" + (this.props.match.params.id === tag.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/tags/'+tag.id)}>
                      <td className={(this.props.match.params.id === tag.id ? "text-highlight":"")}>
                        {tag.title}
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
          </div>
          <div className="col-lg-8 p-0">
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <TagAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.tags.some((item)=>item.id===this.props.match.params.id) && <TagEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    </div>
    );
  }
}
