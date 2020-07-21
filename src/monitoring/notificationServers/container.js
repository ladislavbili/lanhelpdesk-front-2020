import React, { Component } from 'react';

import Edit from './edit';
import Info from './info';


export default class NotificationContainer extends Component{
  constructor(props){
    super(props);
    this.state={
			showEdit: false,
      openedID: props.id,
    }
		this.toggleEdit.bind(this);
  }

  componentWillReceiveProps(props){
    if (this.props !== props){
      this.setState({
        openedID: props.id,
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
        <div className={"flex p-t-15 scrollable " + (this.props.isModal ? "" : " card-box ")}>
					{ this.state.showEdit
						&&
						<Edit id={this.state.openedID} toggleEdit={() => this.toggleEdit()} />
					}
					{
						!this.state.showEdit
						&&
						<Info id={this.state.openedID} toggleEdit={() => this.toggleEdit()} />
					}
  			</div>
      )
  }
}
