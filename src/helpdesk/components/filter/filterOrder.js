import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import { connect } from "react-redux";
import { storageHelpFiltersStart } from '../../../redux/actions';
import { rebase } from '../../../index';
import {} from '../../../helperFunctions';

class FilterOrder extends Component{
  constructor(props){
    super(props);
    this.state={
      saving: false,
    }
  }

	componentWillMount(){
		if(!this.props.filtersActive){
			this.props.storageHelpFiltersStart();
		}
	}

  toggle(){
    this.setState({opened: !this.state.opened})
  }


  render(){
    if(this.props.currentUser.userData.role.value < 2){
      return null;
    }
    let publicFilters = this.props.filters.filter((filter)=>filter.public)
    .sort((item1,item2)=> item1.order - item2.order)
    .map((filter, index)=>{
      return {
        ...filter,
        order:index
      }
    });
    return (
      <div className='p-l-15 p-r-15'>
				<hr className='m-t-10 m-b-10'/>
	        <Button
	          className='btn-link p-0'
	          onClick={this.toggle.bind(this)}
	          >
	          Filter order
	        </Button>
        <Modal isOpen={this.state.opened} size="width-1000">
            <ModalHeader>
              Order filter
            </ModalHeader>
            <ModalBody>
							<h2  className='m-t-20'>Public filters order</h2>
							<hr className='m-t-10 m-b-10' />
                <table className="table">
                  <tbody>
                    { publicFilters.map((filter, index )=>
                      <tr key={filter.id}>
                        <td>
                          {filter.title}
                        </td>
                        <td width="75">
                          <button
                            className="btn waves-effect"
                            disabled={filter.order === 0}
                            onClick={()=>{
                              let currentIndex = publicFilters.findIndex((item) => item.id === filter.id );
                              let targetIndex = publicFilters.findIndex((item) => item.order === publicFilters[currentIndex].order - 1 );
                              publicFilters[currentIndex].order --;
                              publicFilters[targetIndex].order ++;
                              let copy = {...publicFilters[currentIndex]};
                              publicFilters[currentIndex] = publicFilters[targetIndex];
                              publicFilters[targetIndex] = copy;
                              let changedFilters = publicFilters.filter((filter)=>filter.order !== this.props.filters.find((item)=>item.id === filter.id ).order);
                              changedFilters.forEach((filter)=>rebase.updateDoc('/help-filters/'+filter.id, {order:filter.order}));
                            }}
                            >
                            <i className="fa fa-arrow-up"  />
                          </button>
                          <button
                            className="btn waves-effect"
                            disabled={filter.order === publicFilters.length - 1}
                            onClick={()=>{
                              let currentIndex = publicFilters.findIndex((item) => item.id === filter.id );
                              let targetIndex = publicFilters.findIndex((item) => item.order === publicFilters[currentIndex].order + 1 );
                              publicFilters[currentIndex].order ++;
                              publicFilters[targetIndex].order --;
                              let copy = {...publicFilters[currentIndex]};
                              publicFilters[currentIndex] = publicFilters[targetIndex];
                              publicFilters[targetIndex] = copy;
                              let changedFilters = publicFilters.filter((filter)=>filter.order !== this.props.filters.find((item)=>item.id === filter.id ).order);
                              changedFilters.forEach((filter)=>rebase.updateDoc('/help-filters/'+filter.id, {order:filter.order}));
                            }}
                            >
                            <i className="fa fa-arrow-down"  />
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </ModalBody>
              <ModalFooter>
              <Button className="btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}

const mapStateToProps = ({ storageHelpFilters, userReducer }) => {
const { filtersActive, filters, filtersLoaded } = storageHelpFilters;
	return {
		filtersActive, filters, filtersLoaded,
      currentUser:userReducer,
	 };
};

export default connect(mapStateToProps, { storageHelpFiltersStart })(FilterOrder);
