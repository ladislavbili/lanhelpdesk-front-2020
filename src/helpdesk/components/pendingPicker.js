import React, {
  Component
} from 'react';
import Select from 'react-select';
import {
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import DatePicker from 'components/DatePicker';
import {
  invisibleSelectStyleNoArrow
} from 'configs/components/select';
import moment from 'moment';

export default class PendingPicker extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      pendingDate: null,
      milestone: null,
    }
  }

  componentWillReceiveProps( props ) {
    if ( !this.props.open && props.open ) {
      this.setState( {
        pendingDate: props.pendingDate || ( moment() )
          .add( 1, 'day' ),
        milestone: props.milestones.some( ( milestone ) => props.prefferedMilestone && milestone.id === props.prefferedMilestone.id ) ? props.prefferedMilestone : null,
      } )
    }
  }

  render() {
    const {
      prefferedMilestone,
      milestones,
      milestonesBlocked
    } = this.props;
    const milestoneActive = milestones.some( ( milestone ) => prefferedMilestone && milestone.id === prefferedMilestone.id );
    return (
      <Modal isOpen={this.props.open} >
            <ModalHeader>
              Pending until
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label className="p-r-5 center-hor">Date</Label>
                <DatePicker
                  selected={this.state.pendingDate}
                  disabled={this.state.milestone !== null}
                  onChange={date => {
                    this.setState({ pendingDate: date });
                  }}
                  placeholderText="No pending date"
                />
              { this.state.pendingDate !== null &&
                <i className="fa fa-times center-hor m-l-10 m-r-10 clickable" onClick={ () => { this.setState({ pendingDate: null }) } } />
              }
              </FormGroup>

              <h3>OR</h3>

              <FormGroup className="flex row">
                <Label className="p-r-5 center-hor">Milestone</Label>
                <div className="flex">
                <Select
                  placeholder="Vyberte milestone"
                  value={ this.state.milestone }
                  isDisabled={ this.state.pendingDate !== null || milestonesBlocked }
                  onChange={(milestone)=> {
                    this.setState( { milestone } );
                  }}
                  options={this.props.milestones}
                  styles={invisibleSelectStyleNoArrow}
                  />
                </div>
                  { this.state.milestone !== null &&
                    <i className="fa fa-times center-hor m-l-10 m-r-10 clickable" onClick={ () => { this.setState({ milestone: null }) } } />
                  }
              </FormGroup>

              </ModalBody>
              <ModalFooter>
              <button className="mr-auto btn-link" onClick={this.props.closeModal}>
                Close
              </button>


              <button
                className="btn"
                disabled={ milestoneActive ? (this.state.milestone===null):(this.state.pendingDate===null)}
                onClick={()=>{
                  this.props.savePending({...this.state})
                }}
                >
                Save pending
              </button>
            </ModalFooter>
          </Modal>
    );
  }
}