import React, { Component } from 'react';
import {rebase, database} from '../../index';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import { Modal, ModalBody, Button } from 'reactstrap';
import TaskAdd from './taskAdd';

export default class TaskAddContainer extends Component{
  constructor(props){
    super(props);
    this.state={
			openAddTaskModal: false,
      loading: true,

      statuses: [],
      projects: [],
      users: [],
      companies: [],
      workTypes: [],
      taskTypes: [],
      allTags: [],
      units: [],

      defaultUnit: null,
    }
    this.fetchData.bind(this);
    this.setData.bind(this);
    this.fetchData();
  }

  fetchData(){
    Promise.all(
      [
        database.collection('help-statuses').get(),
        database.collection('help-projects').get(),
        database.collection('users').get(),
        database.collection('companies').get(),
        database.collection('help-work_types').get(),
        database.collection('help-units').get(),
        database.collection('help-prices').get(),
        database.collection('help-pricelists').get(),
        database.collection('help-tags').get(),
        database.collection('help-task_types').get(),
        rebase.get('metadata/0', {
          context: this,
        })
      ]).then(([statuses,projects,users, companies, workTypes,units, prices, pricelists,tags,taskTypes,meta])=>{
        this.setData(
          toSelArr(snapshotToArray(statuses)),
          toSelArr(snapshotToArray(projects)),
          toSelArr(snapshotToArray(users),'email'),
          toSelArr(snapshotToArray(companies)),
          toSelArr(snapshotToArray(workTypes)),
          toSelArr(snapshotToArray(units)),
          snapshotToArray(prices),
          snapshotToArray(pricelists),
          toSelArr(snapshotToArray(tags)),
          toSelArr(snapshotToArray(taskTypes)),
          meta.defaultUnit
        );
      });
    }

    setData(statuses, projects,users,companies,workTypes,units, prices, pricelists,tags,taskTypes,defaultUnit){

      let newCompanies=companies.map((company)=>{
        let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
        return newCompany;
      });
      let newWorkTypes=workTypes.map((workType)=>{
        let newWorkType = {...workType, prices:prices.filter((price)=>price.workType===workType.id)}
        return newWorkType;
      });

      this.setState({
        statuses,
        projects,
        users,
        companies:newCompanies,
        workTypes:newWorkTypes,
        taskTypes,
        allTags:tags,

        units,

        loading:false,

        defaultUnit
      });
    }

  render(){
	  return (
			<div className="display-inline">
			{
				!this.props.task &&
				<Button
					className="btn-link t-a-l sidebar-menu-item"
					onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}
				> <i className="fa fa-plus m-r-5 m-l-5 "/> Task
				</Button>
			}

			{
				this.props.task &&
				<button
					type="button"
					className="btn btn-link waves-effect"
					disabled={this.props.disabled}
					onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}>
					<i
						className="fas fa-copy icon-M"
						/> Copy
				</button>
			}


			<Modal size="width-1000"  isOpen={this.state.openAddTaskModal} toggle={()=>{this.setState({openAddTaskModal:!this.state.openAddTaskModal})}} >
					<ModalBody>
            {  this.state.openAddTaskModal &&
						   <TaskAdd {...this.props}
                 loading={this.state.loading}
                 statuses={this.state.statuses}
                 projects={this.state.projects}
                 users={this.state.users}
                 companies={this.state.companies}
                 workTypes={this.state.workTypes}
                 taskTypes={this.state.taskTypes}
                 allTags={this.state.allTags}
                 units={this.state.units}
                 defaultUnit={this.state.defaultUnit}
                 closeModal={ () => this.setState({openAddTaskModal: false,})}
                 />
            }
					</ModalBody>
				</Modal>
		</div>
    );
  }
}
