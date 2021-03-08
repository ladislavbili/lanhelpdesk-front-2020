import React, { Component } from 'react';
import { Input } from 'reactstrap';

export default class Passwords extends Component{
  constructor(props){
    super(props);
    this.state={
      newItemID:0,

      editItemID:null,
      editFake: true,

      editTitle:'',
      editIP:'',
      editLogin:'',
      editPassword:'',
      editNote:'',

      newTitle:'',
      newIP:'',
      newLogin:'',
      newPassword:'',
      newNote:'',

      addingItem: false,
    }
    this.onBlur.bind(this);
    this.onFocus.bind(this);
  }

onBlur(){
  let body={
    title:this.state.editTitle,
    IP:this.state.editIP,
    login:this.state.editLogin,
    password:this.state.editPassword,
    note:this.state.editNote,
    id:this.state.editItemID,
    fake:this.state.editFake,
  }
  let newData = [...this.props.items];
  newData[newData.findIndex((item)=>item.id===this.state.editItemID)]=body;
  this.props.onChange(newData);
  this.setState({ editItemID: null });
}

onFocus(item) {
  this.setState({
    editTitle:item.title,
    editIP:item.IP,
    editLogin:item.login,
    editPassword:item.password,
    editNote:item.note,
    editItemID:item.id,
    editFake:item.fake,
  });
}

//className="invisible-input"

  render(){
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>IP/URL</th>
            <th>Login</th>
            <th>Password</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.props.items.map((item,index)=>
            <tr key={item.id}>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                  item.id === this.state.editItemID
                    ? this.state.editTitle
                    : item.title
                  }
                  onBlur={this.onBlur.bind(this)}
                  onFocus={()=>this.onFocus(item)}
                  onChange={e =>{
                    this.setState({ editTitle: e.target.value })}
                  }
                />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                    item.id === this.state.editItemID
                    ? this.state.editIP
                    : item.IP
                  }
                  onBlur={this.onBlur.bind(this)}
                  onFocus={()=>this.onFocus(item)}
                  onChange={e =>{
                    this.setState({ editIP: e.target.value })}
                  }
                  />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                  item.id === this.state.editItemID
                    ? this.state.editLogin
                    : item.login
                  }
                  onBlur={this.onBlur.bind(this)}
                  onFocus={()=>this.onFocus(item)}
                  onChange={e =>{
                    this.setState({ editLogin: e.target.value })}
                  }
                />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                  item.id === this.state.editItemID
                    ? this.state.editPassword
                    : item.password
                  }
                  onBlur={this.onBlur.bind(this)}
                  onFocus={()=>this.onFocus(item)}
                  onChange={e =>{
                    this.setState({ editPassword: e.target.value })}
                  }
                />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                  item.id === this.state.editItemID
                    ? this.state.editNote
                    : item.note
                  }
                  onBlur={this.onBlur.bind(this)}
                  onFocus={()=>this.onFocus(item)}
                  onChange={e =>{
                    this.setState({ editNote: e.target.value })}
                  }
                />
              </td>

              <td>
                <button className="btn-link waves-effect"
                  onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      let newData = [...this.props.items];
                      newData.splice(index,1);
                      this.props.onChange(newData);
                    }
                  }}
                  >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
            )
          }
          {this.state.addingItem &&
              <tr>
                <td>
                  <Input
                    type="text"
                    value={this.state.newTitle}
                    onChange={(e)=>this.setState({newTitle:e.target.value})}
                    className="form-control"
                    id="inlineFormInput"
                    placeholder="Enter title"
                    />
                </td>
                <td>
                  <Input
                    type="text"
                    value={this.state.newIP}
                    onChange={(e)=>this.setState({newIP:e.target.value})}
                    className="form-control"
                    id="inlineFormInput"
                    placeholder="Enter IP"
                    />
                </td>
                <td>
                  <Input
                    type="text"
                    value={this.state.newLogin}
                    onChange={(e)=>this.setState({newLogin:e.target.value})}
                    className="form-control"
                    id="inlineFormInput"
                    placeholder="Enter login"
                    />
                </td>
                <td>
                  <Input
                    type="text"
                    value={this.state.newPassword}
                    onChange={(e)=>this.setState({newPassword:e.target.value})}
                    className="form-control"
                    id="inlineFormInput"
                    placeholder="Enter password"
                    />
                </td>
                <td>
                  <Input
                    type="text"
                    value={this.state.newNote}
                    onChange={(e)=>this.setState({newNote:e.target.value})}
                    className="form-control"
                    id="inlineFormInput"
                    placeholder="Enter note"
                    />
                </td>
                <td>
                  <button className="btn-link waves-effect"
                    disabled={this.state.newIP===''}
                    onClick={()=>{
                      let body={
                        title:this.state.newTitle,
                        IP:this.state.newIP,
                        login:this.state.newLogin,
                        password:this.state.newPassword,
                        note:this.state.newNote,
                        id:this.state.newItemID,
                        fake:true,
                      }

                      this.setState({
                        newTitle:'',
                        newIP:'',
                        newLogin:'',
                        newPassword:'',
                        newNote:'',
                        newItemID:this.state.newItemID+1,
                        addingItem: false,
                      });

                      this.props.onChange([...this.props.items,body]);
                      }
                    }
                    >
                    <i className="fa fa-plus" />
                  </button>
                </td>
              </tr>
            }
            {!this.state.addingItem &&
              <tr className="add-item" onClick={() => this.setState({addingItem: true,})}>
                <td>
                  + Add item
                </td>
              </tr>
            }
        </tbody>

      </table>
    );
  }
}
