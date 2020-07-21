import React, { Component } from 'react';
import {Button } from 'reactstrap';
import UnitAdd from './unitAdd';
import UnitEdit from './unitEdit';

import { connect } from "react-redux";
import {storageHelpUnitsStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class UnitsList extends Component {
  constructor(props){
    super(props);
    this.state={
      units:[],
      unitFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.units,this.props.units)){
      this.setState({units:props.units})
    }
  }

  componentWillMount(){
    if(!this.props.unitsLoaded){
      this.props.storageHelpUnitsStart();
    }
    this.setState({units:this.props.units});
  }

  render(){
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
                    value={this.state.unitFilter}
                    onChange={(e)=>this.setState({unitFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>this.props.history.push('/helpdesk/settings/units/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Unit
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
  							Unit name
  						</h2>
              <table className="table table-hover">
                <tbody>
                  {this.state.units.filter((item)=>item.title.toLowerCase().includes(this.state.unitFilter.toLowerCase())).map((unit)=>
                    <tr
                      key={unit.id}
                      className={"clickable" + (this.props.match.params.id === unit.id ? " active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/units/'+unit.id)}>
                      <td>
                        {unit.title}
                      </td>
                    </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <UnitAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.units.some((item)=>item.id===this.props.match.params.id) && <UnitEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpUnits}) => {
  const { unitsActive, units } = storageHelpUnits;
  return { unitsActive, units };
};

export default connect(mapStateToProps, { storageHelpUnitsStart })(UnitsList);
