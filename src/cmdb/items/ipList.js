import React from 'react';
import {
  Input
} from 'reactstrap';

export default function IPList( props ) {

  const {
    onChange,
    items
  } = props;

  const [ editItemID, setEditItemID ] = React.useState( null );

  const [ editNIC, setEditNIC ] = React.useState( "" );
  const [ editIP, setEditIP ] = React.useState( '' );
  const [ editMask, setEditMask ] = React.useState( '' );
  const [ editGateway, setEditGateway ] = React.useState( '' );
  const [ editDNS1, setEditDNS1 ] = React.useState( '' );
  const [ editDNS2, setEditDNS2 ] = React.useState( '' );
  const [ editVLAN, setEditVLAN ] = React.useState( '' );
  const [ editNote, setEditNote ] = React.useState( '' );
  const [ editFake, setEditFake ] = React.useState( true );

  const [ newNIC, setNewNIC ] = React.useState( "" );
  const [ newIP, setNewIP ] = React.useState( "" );
  const [ newMask, setNewMask ] = React.useState( '' );
  const [ newGateway, setNewGateway ] = React.useState( '' );
  const [ newDNS1, setNewDNS1 ] = React.useState( '' );
  const [ newDNS2, setNewDNS2 ] = React.useState( '' );
  const [ newVLAN, setNewVLAN ] = React.useState( '' );
  const [ newNote, setNewNote ] = React.useState( '' );
  const [ newItemID, setNewItemID ] = React.useState( 0 );

  const [ addingItem, setAddingItem ] = React.useState( false );

  const onBlur = () => {
    /*let body={
      NIC:this.state.editNIC,
      IP:this.state.editIP,
      mask:this.state.editMask,
      gateway:this.state.editGateway,
      DNS1:this.state.editDNS1,
      DNS2:this.state.editDNS2,
      id:this.state.editItemID,
      fake:this.state.editFake,
    }
    let newData = [...this.props.items];
    let index = newData.findIndex((item)=>item.id===body.id);
    newData[index]=body;
    this.props.onChange(newData);
    this.setState({ editItemID: null });*/
  }

  const onFocus = ( item ) => {
    /*  this.setState({
        editNIC:item.NIC,
        editIP:item.IP,
        editMask:item.mask,
        editGateway:item.gateway,
        editDNS1:item.DNS1,
        editDNS2:item.DNS2,
        editItemID:item.id,
        editFake:item.fake,
      });*/
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>NIC</th>
          <th>IP</th>
          <th>Mask</th>
          <th>Gateway</th>
          <th>DNS 1</th>
          <th>DNS 2</th>
          <th>VLAN</th>
          <th colSpan={2}>Note</th>
        </tr>
      </thead>
      <tbody>
        {
          items.map((item,index) => (
            <tr key={item.id}>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === editItemID
                    ? editNIC
                    : item.NIC
                  }
                  onBlur={onBlur}
                  onFocus={ () => onFocus(item) }
                  className="form-control hidden-input"
                  onChange={ e => setEditNIC(e.target.value) }
                  />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === editItemID
                    ? editIP
                    : item.IP
                  }
                  onBlur={ onBlur }
                  onFocus={ () =>  onFocus(item) }
                  className="form-control hidden-input"
                  onChange={ e => setEditIP(e.target.value) }
                  />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === editItemID
                    ? editMask
                    : item.mask
                  }
                  className="form-control hidden-input"
                  onChange={ e => setEditMask(e.target.value) }
                  onBlur={ onBlur }
                  onFocus={ () => onFocus(item) }
                  />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === editItemID
                    ? editGateway
                    : item.gateway
                  }
                  className="form-control hidden-input"
                  onChange={e => setEditGateway(e.target.value) }
                  onBlur={ onBlur }
                  onFocus={ () => onFocus(item) }
                  />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === editItemID
                    ? editDNS1
                    : item.DNS1
                  }
                  className="form-control hidden-input"
                  onChange={ e => setEditDNS1(e.target.value) }
                  onBlur={ onBlur }
                  onFocus={ () => onFocus(item) }
                  />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === editItemID
                    ? editDNS2
                    : item.DNS2
                  }
                  className="form-control hidden-input"
                  onChange={e => setEditDNS2(e.target.value) }
                  onBlur={ onBlur }
                  onFocus={ () => onFocus(item) }
                  />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === editItemID
                    ? editVLAN
                    : item.VLAN
                  }
                  className="form-control hidden-input"
                  onChange={ e => setEditVLAN(e.target.value) }
                  onBlur={ onBlur }
                  onFocus={ () => onFocus(item) }
                  />
              </td>
              <td>
                <Input
                  type="text"
                  value={
                    item.id === editItemID
                    ? editNote
                    : item.Note
                  }
                  className="form-control hidden-input"
                  onChange={ e => setEditNote(e.target.value) }
                  onBlur={ onBlur }
                  onFocus={ () => onFocus(item) }
                  />
              </td>
              <td>
                <button className="btn btn-link waves-effect"
                  onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      //    let newData = [...IPs];
                      //newData.splice(index,1);
                      //this.props.onChange(newData);
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
                value={ newNIC }
                onChange={(e) => setNewNIC(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                />
            </td>
            <td>
              <Input
                type="text"
                value={ newIP }
                onChange={(e) => setNewIP(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                />
            </td>
            <td>
              <Input
                type="text"
                value={ newMask }
                onChange={(e) => setNewMask(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                />
            </td>
            <td>
              <Input
                type="text"
                value={ newGateway }
                onChange={(e) => setNewGateway(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                />
            </td>
            <td>
              <Input
                type="text"
                value={ newDNS1 }
                onChange={(e) => setNewDNS1(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                />
            </td>
            <td>
              <Input
                type="text"
                value={ newDNS2 }
                onChange={(e) => setNewDNS2(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                />
            </td>
            <td>
              <Input
                type="text"
                value={ newVLAN }
                onChange={(e) => setNewVLAN(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                />
            </td>
            <td>
              <Input
                type="text"
                value={ newNote }
                onChange={(e) => setNewNote(e.target.value)}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                />
            </td>

            <td>
              <button className="btn-link waves-effect"
                disabled={newIP===''}
                onClick={()=>{
                  let body={
                    NIC:newNIC,
                    IP:newIP,
                    mask:newMask,
                    gateway:newGateway,
                    DNS1:newDNS,
                    DNS2:newDNS2,
                    VLAN:newVLAN,
                    note:newNote,
                    id:newItemID,
                    fake:true
                  }
                  setNewNIC('');
                  setNewIP('');
                  setNewMask('');
                  setNewGateway('');
                  setNewDNS1('');
                  setNewDNS2('');
                  setNewVLAN('');
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
          <tr className="add-item" onClick={() =>setAddingItem(true)}>
            <td> + Add item </td>
          </tr>
        }
      </tbody>
    </table>
  );
}