import React, {
  Component
} from 'react';
import {
  Input
} from 'reactstrap';

export default function Passwords( props ) {

  const {
    items,
    onChange
  } = props;

  const [ newItemID, setNewItemID ] = React.useState( 0 );

  const [ editItemID, setEditItemID ] = React.useState( null );
  const [ editFake, setEditFake ] = React.useState( true );

  const [ editTitle, setEditTitle ] = React.useState( '' );
  const [ editIP, setEditIP ] = React.useState( '' );
  const [ editLogin, setEditLogin ] = React.useState( '' );
  const [ editPassword, setEditPassword ] = React.useState( '' );
  const [ editNote, setEditNote ] = React.useState( '' );

  const [ newTitle, setNewTitle ] = React.useState( '' );
  const [ newIP, setNewIP ] = React.useState( '' );
  const [ newLogin, setNewLogin ] = React.useState( '' );
  const [ newPassword, setNewPassword ] = React.useState( '' );
  const [ newNote, setNewNote ] = React.useState( '' );

  const [ addingItem, setAddingItem ] = React.useState( false );

  const onBlur = () => {
    /*let body={
      title:editTitle,
      IP:editIP,
      login:editLogin,
      password:editPassword,
      note:editNote,
      id:editItemID,
      fake:editFake,
    }
    let newData = [...onFocusprops.items];
    newData[newData.findIndex((item)=>item.id===editItemID)]=body;
    onFocusprops.onChange(newData);
    onFocussetState({ editItemID: null });*/
  }

  const onFocus = ( item ) => {
    /*  onFocussetState({
        editTitle:item.title,
        editIP:item.IP,
        editLogin:item.login,
        editPassword:item.password,
        editNote:item.note,
        editItemID:item.id,
        editFake:item.fake,
      });*/
  }

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
        {
          items.map((item,index)=> (
            <tr key={item.id}>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                    item.id === editItemID
                    ? editTitle
                    : item.title
                  }
                  onBlur={onBlur}
                  onFocus={()=>onFocus(item)}
                  onChange={e => setEditTitle( e.target.value )}
                  />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                    item.id === editItemID
                    ? editIP
                    : item.IP
                  }
                  onBlur={onBlur}
                  onFocus={()=>onFocus(item)}
                  onChange={e => setEditIP( e.target.value )}
                  />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                    item.id === editItemID
                    ? editLogin
                    : item.login
                  }
                  onBlur={onBlur}
                  onFocus={()=>onFocus(item)}
                  onChange={e => setEditLogin( e.target.value )}
                  />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                    item.id === editItemID
                    ? editPassword
                    : item.password
                  }
                  onBlur={onBlur}
                  onFocus={()=>onFocus(item)}
                  onChange={e => setEditPassword( e.target.value )}
                  />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control hidden-input"
                  value={
                    item.id === editItemID
                    ? editNote
                    : item.note
                  }
                  onBlur={onBlur}
                  onFocus={()=>onFocus(item)}
                  onChange={e => setEditNote( e.target.value )}
                  />
              </td>
              <td>
                <button className="btn-link waves-effect"
                  onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      let newData = [...items];
                      newData.splice(index,1);
                      onChange(newData);
                    }
                  }}
                  >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
          ))
        }
        {
          addingItem &&
          <tr>
            <td>
              <Input
                type="text"
                value={newTitle}
                onChange={(e)=>setNewTitle(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder="Enter title"
                />
            </td>
            <td>
              <Input
                type="text"
                value={newIP}
                onChange={(e)=>setNewIP(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder="Enter IP"
                />
            </td>
            <td>
              <Input
                type="text"
                value={newLogin}
                onChange={(e)=>setNewLogin(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder="Enter login"
                />
            </td>
            <td>
              <Input
                type="text"
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder="Enter password"
                />
            </td>
            <td>
              <Input
                type="text"
                value={newNote}
                onChange={(e)=>setNewNote(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder="Enter note"
                />
            </td>
            <td>
              <button className="btn-link waves-effect"
                disabled={newIP===''}
                onClick={()=>{
                  let body={
                    title:newTitle,
                    IP:newIP,
                    login:newLogin,
                    password:newPassword,
                    note:newNote,
                    id:newItemID,
                    fake:true,
                  };

                  setNewTitle('');
                  setNewIP('');
                  setNewLogin('');
                  setNewPassword('');
                  setNewNote('');
                  setNewItemID(newItemID+1);
                  setAddingItem( false);
                  onChange([...items,body]);
                }}
                >
                <i className="fa fa-plus" />
              </button>
            </td>
          </tr>
        }
        {
          !addingItem &&
          <tr className="add-item" onClick={() => setAddingItem( true)}>
            <td> + Add item </td>
          </tr>
        }
      </tbody>
    </table>
  );
}