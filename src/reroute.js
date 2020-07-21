import {Component} from 'react';

export default class Reroute extends Component {
  constructor(props){
    super(props);
    this.props.history.push('./helpdesk/taskList/i/all');
  }
  render(){
    return null;
  }
}
