import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { connect } from "react-redux";
import { FormGroup, Label, Button } from 'reactstrap';
import moment from 'moment';

import datePickerConfig from 'configs/components/datepicker';
import {selectStyle} from 'configs/components/select';
import { setReportMonth, setReportYear, setReportFrom, setReportTo } from '../../redux/actions';

var months = [{value:1,label:'January'},{value:2,label:'February'},{value:3,label:'March'},{value:4,label:'April'},{value:5,label:'May'},{value:6,label:'June'},
{value:7,label:'July'},{value:8,label:'August'},{value:9,label:'September'},{value:10,label:'October'},{value:11,label:'November'},{value:12,label:'December'}]
var years = [];

for (let i = (new Date().getFullYear()); i >= 2000; i--) {
  years.push({value:i,label:i});
}

class MonthSelector extends Component {
	constructor(props){
		super(props);
		this.state={
			month:this.props.month,
			year:this.props.year,
      from:moment(this.props.from),
      to:moment(this.props.to),
		}
	}

	render() {
		return (
				<div className="p-20">
  					<FormGroup>
  						<Label>Select month and year</Label>
  							<div className="flex-row">
  							<div className="w-50 p-r-20">
  								<Select
  									value={this.state.month}
  									onChange={(e)=> this.setState({month: e})}
  									options={months}
  									styles={selectStyle}
  									/>
  							</div>
  							<div className="w-50 p-r-20">
  								<Select
  									value={this.state.year}
  									onChange={(e)=> this.setState({year: e})}
  									options={years}
  									styles={selectStyle}
  									/>
  							</div>
                <Button type="button" disabled={this.state.year===null || this.state.month===null} className="btn-primary flex" onClick={()=>{
                    this.props.setReportYear(this.state.year);
                    this.props.setReportMonth(this.state.month);
                    let firstDay = new Date(this.state.year.value, this.state.month.value-1, 1).getTime();
                    let lastDay = new Date(this.state.year.value, this.state.month.value, 1).getTime();
                    this.props.setReportFrom(firstDay);
                    this.props.setReportTo(lastDay);
                    this.setState({from: moment(firstDay), to: moment(lastDay)});
                  }}>
                  Show
                </Button>
  						</div>
  					</FormGroup>
            <FormGroup>
              <Label>Select date range you preffer</Label>
                <div className="flex-row">
                <div className="w-50 p-r-20">
                  <DatePicker
                    className="form-control datepicker-width-185"
                    selected={this.state.from}
                    onChange={date => {
                      this.setState({ from: date });
                    }}
                    placeholderText="From"
                    {...datePickerConfig}
                    showTimeSelect={false}
                    dateFormat="DD.MM.YYYY"
                  />
                </div>
                <div className="w-50 p-r-20">
                  <DatePicker
                    className="form-control datepicker-width-185"
                    selected={this.state.to}
                    onChange={date => {
                      this.setState({ to: date });
                    }}
                    placeholderText="To"
                    {...datePickerConfig}
                    showTimeSelect={false}
                    dateFormat="DD.MM.YYYY"
                  />
                </div>
                <Button type="button" disabled={this.state.from.unix() > this.state.to.unix()} className="btn-primary flex" onClick={()=>{
                    this.props.setReportFrom(this.state.from.unix()*1000);
                    this.props.setReportTo(this.state.to.unix()*1000);
                  }}>
                  Show
                </Button>
              </div>
            </FormGroup>
			 </div>
			);
		}
	}

	const mapStateToProps = ({ reportReducer }) => {
		const { year, month, from, to } = reportReducer;

		return { year, month, from, to }
	};

	export default connect(mapStateToProps, { setReportMonth, setReportYear, setReportFrom, setReportTo })(MonthSelector);
