import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import TaskEdit from './taskEdit';

export default class TaskEditModal extends Component{

  render(){
    return (
      <Modal size="width-1023" isOpen={this.props.opened} toggle={this.props.toggle}>
        <ModalHeader style={{backgroundColor: "white", marginLeft: "-20px", marginRight: "-20px", padding: "0px"}} toggle={this.props.toggle}></ModalHeader>
        <ModalBody style={{backgroundColor: "white", marginLeft: "-20px", marginRight: "-20px", padding: "0px"}}>
          <TaskEdit id={this.props.id} toggle={this.props.toggle} />
        </ModalBody>
      </Modal>
    );
  }
}
