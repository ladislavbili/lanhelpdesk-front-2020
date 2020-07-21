import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { connect } from "react-redux";
import { Button, FormGroup, Label,Input, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';
import {rebase} from '../../../index';

class MilestoneAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title: '',
			description: '',
			startsAt:null,
			endsAt:null,

      saving: false,
      opened: true
    }
  }


  toggle(){
    if(!this.state.opened){
			this.setState({
				title: '',
				description: '',
				startsAt:null,
				endsAt:null,
			})
    }
		this.props.close();
    this.setState({opened:!this.state.opened});
  }
  render(){
    return (
      <div>
          <Modal isOpen={this.state.opened}>
            <ModalHeader>Add milestone</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="title">Milestone title</Label>
                <Input type="text" id="title" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>

              <FormGroup>
    						<Label htmlFor="description">Popis</Label>
    						<Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})}/>
    					</FormGroup>
            </ModalBody>

						<DatePicker
							selected={this.state.startsAt}
							onChange={date => {
								this.setState({ startsAt: date });
							}}
							locale="en-gb"
							placeholderText="No starting date"
							showTimeSelect
							className="form-control hidden-input"
							todayButton="Today"
							timeFormat="HH:mm"
							timeIntervals={15}
							dateFormat="HH:mm DD.MM.YYYY"
						/>

						<DatePicker
							selected={this.state.endsAt}
							onChange={date => {
								this.setState({ endsAt: date });
							}}
							locale="en-gb"
							placeholderText="No ending date"
							showTimeSelect
							className="form-control hidden-input"
							todayButton="Today"
							timeFormat="HH:mm"
							timeIntervals={15}
							dateFormat="HH:mm DD.MM.YYYY"
						/>

            <ModalFooter>
              <Button className="btn mr-auto" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>

              <Button className="btn"
                disabled={this.state.saving||this.state.title===""}
                onClick={()=>{
                  this.setState({saving:true});
                  let body = {
                    title: this.state.title,
                    description: this.state.description,
										startsAt:this.state.startsAt!==null?this.state.startsAt.unix()*1000:null,
										endsAt:this.state.endsAt!==null?this.state.endsAt.unix()*1000:null,
										project:this.props.project
                  };
                  rebase.addToCollection('/help-milestones', body)
                  .then(()=>{
										this.setState({
											title: '',
											description: '',
											startsAt:null,
											endsAt:null,
											saving:false,
											open:false,
										});
										this.props.close();
									});
                }}>
                {this.state.saving?'Adding...':'Add milestone'}
              </Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}

const mapStateToProps = ({ filterReducer }) => {
	const { project } = filterReducer;
	return { project };
};

export default connect(mapStateToProps, {})(MilestoneAdd);
