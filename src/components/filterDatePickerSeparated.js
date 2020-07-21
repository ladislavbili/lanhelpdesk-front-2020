import React, { Component } from 'react';
import { Button, FormGroup } from 'reactstrap';

import DatePicker from 'react-datepicker';
import datePickerConfig from 'configs/components/datepicker';
import Checkbox from 'components/checkbox';
import {rebase} from 'index';

export default class FilterDatePickerSeparated extends Component{
  constructor(props){
    super(props);
    this.state={
      showCalendarFrom: false,
      showCalendarTo: false,
    }
  }

  render(){
    const { label, showNowFrom, dateFrom, showNowTo, dateTo } = this.props;
    const { setShowNowFrom, setDateFrom, setShowNowTo, setDateTo } = this.props;
    const { showCalendarFrom, showCalendarTo } = this.state;

    return (
      <FormGroup>
        <label>{label}</label>
        <div className="row">
          <div className="col-6">
            { !showCalendarFrom && !showNowFrom &&
              <div className="flex">
                <Button
                  className="btn-link-reversed center-hor"
                  onClick={()=>{
                    setShowNowFrom(true)
                  }}
                  >
                  Set now
                </Button>
                |
                <Button
                  className="btn-link-reversed center-hor"
                  onClick={()=>{
                    this.setState({ showCalendarFrom: true })
                  }}
                  >
                  Set date
                </Button>
              </div>
            }
            { showCalendarFrom &&
              <FormGroup className="flex-input-with-icon">
                <DatePicker
                  className="form-control"
                  selected={dateFrom}
                  onChange={(e)=>{ setDateFrom(e) }}
                  placeholderText="No date"
                  {...datePickerConfig}
                  />
                <i className="fa fa-times center-hor m-l-10 m-r-10 clickable" onClick={ () => { setDateFrom(null); this.setState({showCalendarFrom: false}) } } />
              </FormGroup>
            }
            { showNowFrom &&
              <FormGroup className="display-flex">
                <span>
                Current date
              </span>
                <i className="fa fa-times center-hor ml-auto m-r-10 clickable" onClick={ () => setShowNowFrom(false) } />
              </FormGroup>
            }
          </div>
          <div className="col-6">
            { !showCalendarTo && !showNowTo &&
              <div className="flex">
                <Button
                  className="btn-link-reversed center-hor"
                  onClick={()=>{
                    setShowNowTo(true)
                  }}
                  >
                  Set now
                </Button>
                |
                <Button
                  className="btn-link-reversed center-hor"
                  onClick={()=>{
                    this.setState({ showCalendarTo: true })
                  }}
                  >
                  Set date
                </Button>
              </div>
            }
            { showCalendarTo &&
              <FormGroup className="flex-input-with-icon">
                <DatePicker
                  className="form-control"
                  selected={dateTo}
                  onChange={(e)=>{ setDateTo(e) }}
                  placeholderText="No date"
                  {...datePickerConfig}
                  />
                <i className="fa fa-times center-hor m-l-10 m-r-10 clickable" onClick={ () => { setDateTo(null); this.setState({showCalendarTo: false}) } } />
              </FormGroup>
            }
            { showNowTo &&
              <FormGroup className="display-flex">
                <span>
                Current date
              </span>
                <i className="fa fa-times center-hor ml-auto clickable" onClick={ () => setShowNowTo(false) } />
              </FormGroup>
            }
          </div>
        </div>
      </FormGroup>
    );
  }
}
