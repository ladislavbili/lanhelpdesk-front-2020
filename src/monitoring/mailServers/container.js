import React, { Component } from 'react';

import Edit from './edit';
import Info from './info';

export default class MailServerEditIndex extends Component{
  constructor(props){
    super(props);
    this.state={
      showEdit: false,
      id: props.id,
    }
		this.toggleEdit.bind(this);
  }

  componentWillReceiveProps(props){
    if (this.props !== props){
      this.setState({
        id: props.id,
      });
    }
  }

	toggleEdit(){
		this.setState({
			showEdit: !this.state.showEdit,
		})
	}

  render(){
      return (
        <div className={"flex p-t-15 scrollable " + (this.props.isModal ? "" : " card-box fit-with-header-and-commandbar ")}>
					{ this.state.showEdit
						&&
						<Edit id={this.props.id} toggleEdit={() => this.toggleEdit()} />
					}
					{
						!this.state.showEdit
						&&
						<Info id={this.props.id} toggleEdit={() => this.toggleEdit()} />
					}
  			</div>
      )
  }
}
