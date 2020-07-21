import React, { Component } from 'react';

export default class Test extends Component{
  constructor(props){
    super(props);
    this.state={
      text:'',
    }
  }

  render(){
    return (
      <div className="scroll-visible p-20 fit-with-header-and-commandbar" style={{marginTop:200}}>
        <hr/>
        <div dangerouslySetInnerHTML={{__html:this.state.text}}/>
      </div>
    );
  }
}
