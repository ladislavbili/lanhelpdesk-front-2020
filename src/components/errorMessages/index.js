import React, { Component } from 'react';
import { ListGroupItem, Label } from 'reactstrap';
import Select from 'react-select';
import classnames from 'classnames';
import { rebase } from 'index';
import { invisibleSelectStyleNoArrow } from 'configs/components/select';
import ErrorInfo from './errorInfo';

import { timestampToString } from 'helperFunctions';
import { connect } from "react-redux";
import { storageErrorMessagesStart } from 'redux/actions';

const noTypeFilter = { value: null, label:'All types' }

class ErrorList extends Component {
  constructor(props){
    super(props);
    this.state={
      searchFilter: '',
      selectedErrorID: null,
      type: noTypeFilter
    }
  }

  componentWillMount(){
    if(!this.props.errorMessagesActive){
      this.props.storageErrorMessagesStart();
    }
  }

  filterErrors(){
    let search = this.state.searchFilter.toLowerCase();
    return this.props.errorMessages.filter((errorMessage)=>(
      (
        this.state.type.value === null || errorMessage.type === this.state.type.value
      ) && (
        ( timestampToString(errorMessage.createdAt).includes(search) ) ||
        ( errorMessage.errorMessage && errorMessage.errorMessage.toLowerCase().includes(search) ) ||
        ( errorMessage.source && errorMessage.source.toLowerCase().includes(search) ) ||
        ( errorMessage.sourceID && errorMessage.sourceID.toLowerCase().includes(search) ) ||
        ( errorMessage.type && errorMessage.type.toLowerCase().includes(search) )
      )
    )).sort( (errorMessage1, errorMessage2) => errorMessage1.createdAt > errorMessage2.createdAt ? -1 : 1 )
  }

  getTypes(){
    let typeFilter = [ noTypeFilter ];
    this.props.errorMessages.forEach((errorMessage) => {
      if(!typeFilter.some((type) => type.value === errorMessage.type)){
        typeFilter.push({ value: errorMessage.type, label: errorMessage.type })
      }
    });
    return typeFilter;
  }

  markAllAsRead(){
    if(window.confirm('Ste si istý že chcete všetky správy označiť ako prečítané?')){
      this.filterErrors().filter((errorMessage)=>!errorMessage.read).forEach((errorMessage) => rebase.updateDoc('error_messages/' + errorMessage.id, {read:true}));
    }
  }
  deleteAll(){
    if(window.confirm('Ste si istý že chcete všetky správy vymazať?')){
      this.filterErrors().forEach((errorMessage) => rebase.removeDoc('/error_messages/'+ errorMessage.id));
      this.setState({ selectedErrorID: null });
    }
  }
  deleteRead(){
    if(window.confirm('Ste si istý že chcete všetky prečítané správy vymazať?')){
      this.filterErrors().filter((errorMessage)=>errorMessage.read).forEach((errorMessage) => rebase.removeDoc('/error_messages/'+ errorMessage.id));
      this.setState({ selectedErrorID: null });
    }
  }

  render(){
    const errors = this.filterErrors();
    return (
			<div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.searchFilter}
                    onChange={(e)=>this.setState({searchFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <span className="ml-3 center-hor mr-3" style={{width:175}}>
              <Select
                value={this.state.type}
                onChange={(type)=> this.setState({ type }) }
                options={this.getTypes()}
                styles={invisibleSelectStyleNoArrow}
                />
            </span>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className=" p-l-10 p-b-10 row">
                <h2>
                  Error messages
                </h2>
              </div>
              <div>
                <button type="button" className="btn btn-link waves-effect" onClick={this.markAllAsRead.bind(this)} disabled={errors.every((error)=>error.read)}>Označit všetky ako prečítané</button>
                <button type="button" className="btn btn-link waves-effect" onClick={this.deleteAll.bind(this)} disabled={errors.length === 0}>Vymazať všetky</button>
                <button type="button" className="btn btn-link waves-effect" onClick={this.deleteRead.bind(this)} disabled={errors.filter((error)=>error.read).length === 0}>Vymazať prečítané</button>
              </div>
              <div>
                <table className="table table-hover">
                  <tbody>
                    {
                      errors.map((error) =>
                      <tr
                        key={error.id}
                        className={classnames({ 'notification-read': error.read,
                          'notification-not-read': !error.read,
                          'sidebar-item-active': this.state.selectedErrorID === error.id },
                          "clickable")}
                          onClick={()=> {
                            this.setState({ selectedErrorID: error.id })
                            if(!error.read){
                              rebase.updateDoc('error_messages/' + error.id, {read:true} );
                            }
                          }}>
                          <td className={(this.state.selectedErrorID === error.id ? "text-highlight":"")}>
                            <i className={classnames({ 'far fa-envelope-open': error.read, 'fas fa-envelope': !error.read })} /> {error.errorMessage}
                            <div>
                              <Label>{timestampToString(error.createdAt)}</Label>
                            </div>
                            <div style={{overflowX:'hidden'}}>{error.source}</div>
                            </td>
                          </tr>
                        )
                      }
                    </tbody>
                </table>
                {this.props.errorMessages.length === 0 && <ListGroupItem>There are no errors!</ListGroupItem>}
              </div>

            </div>
          </div>
          <div className="col-lg-8">
            { this.state.selectedErrorID !== null &&
              <ErrorInfo errorMessage={ this.props.errorMessages.find((errorMessage) => errorMessage.id === this.state.selectedErrorID )} history={this.props.history} />
            }
            { this.state.selectedErrorID === null &&
              <div className="commandbar"></div>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageErrorMessages }) => {
const { errorMessagesActive, errorMessages } = storageErrorMessages;
  return { errorMessagesActive, errorMessages };
};

export default connect(mapStateToProps, { storageErrorMessagesStart })(ErrorList);
