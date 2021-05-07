import React, {
  Component
} from 'react';
import {
  Input
} from 'reactstrap';
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";
import {
  calculateTextAreaHeight,
  htmlFixNewLines
} from '../../helperFunctions';

export default class Links extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      note: '',
      link: null,
      noteHeight: 29,
      newItemID: 0
    }
    this.editItem.bind( this );
  }

  editItem( item, target, value ) {
    let newItems = [ ...this.props.items ];
    newItems.find( ( item2 ) => item.id === item2.id )[ target ] = value;
    this.props.onChange( newItems );
  }
  //className="invisible-input"

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Connection</th>
            <th>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          { this.props.items.map((item,index)=>
            <tr key={item.id}>
              <td>
                {item.opened && <Select
                  styles={pickSelectStyle(['invisible','noArrow'])}
                  options={this.props.links}
                  value={item.link}
                  onChange={e =>{
                    let newItems = [...this.props.items];
                    newItems.find((item2)=>item.id===item2.id).link = e;
                    this.props.onChange(newItems);
                  }}
                  />}
                  {!item.opened &&
                    <a href={'/cmdb/i/'+item.link.sidebarID+'/'+item.link.id} without="true" target="_blank" rel="noopener noreferrer">{item.link.title}</a>
                  }
              </td>
              <td>
                {!item.opened && <div dangerouslySetInnerHTML ={{__html:htmlFixNewLines(item.note)}}></div>}
                {item.opened && <Input
                  type="textarea"
                  value={item.note}
                  style={{height:item.noteHeight}}
                  className="form-control hidden-input"
                  onChange={(e) =>{
                    let newItems = [...this.props.items];
                    newItems.find((item2)=>item.id===item2.id).note = e.target.value;
                    newItems.find((item2)=>item.id===item2.id).noteHeight = calculateTextAreaHeight(e);
                    this.props.onChange(newItems);
                  }}
                  />}
              </td>
              <td>
                {
                  !item.opened &&
                  <button className="btn btn-link waves-effect"
                    onClick={()=>{
                      let newItems = [...this.props.items];
                      newItems.find((item2)=>item.id===item2.id).opened = true;
                      this.props.onChange(newItems);
                    }}
                    >
                    <i className="fa fa-pen" />
                  </button>
                }
                {
                  item.opened &&
                  <button className="btn btn-link waves-effect"
                    onClick={()=>{
                      let newItems = [...this.props.items];
                      newItems.find((item2)=>item.id===item2.id).opened = false;
                      this.props.onChange(newItems);
                    }}
                    >
                    <i className="fa fa-save" />
                  </button>
                }
                <button className="btn btn-link waves-effect"
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
        <tr>
          <td>
            <Select
              styles={pickSelectStyle()}
              options={this.props.links}
              value={this.state.link}
              onChange={e =>{ this.setState({ link: e }); }}
              />
          </td>
          <td>
            <Input
              type="textarea"
              style={{height:this.state.noteHeight}}
              value={this.state.note}
              onChange={(e)=>this.setState({note:e.target.value,noteHeight:calculateTextAreaHeight(e)})}
              className="form-control"
              id="inlineFormInput"
              placeholder=""
              />
          </td>
          <td>
            <button className="btn-link waves-effect"
              disabled={this.state.link===null}
              onClick={()=>{
                let body={
                  note:this.state.note,
                  noteHeight:this.state.noteHeight,
                  link:this.state.link,
                  id:this.state.newItemID,
                  opened:false,
                  fake:true
                }
                this.setState({
                  note:'',
                  noteHeight:29,
                  newItemID:this.state.newItemID+1,
                  link:null
                });

                this.props.onChange([...this.props.items,body]);
              }
            }
            >
            <i className="fa fa-plus" /> Link
            </button>
          </td>

        </tr>
      </tbody>

    </table>
    );
  }
}