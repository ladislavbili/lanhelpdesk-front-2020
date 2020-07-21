import React, { Component } from 'react';
import { rebase, database } from '../../index';
import { FormGroup, Label, Input, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { toSelArr, snapshotToArray } from '../../helperFunctions';
import Select from 'react-select';
import { selectStyle } from 'configs/components/select';
import Subtasks from './subtasks';
import Comments from './comments';
import Attachements from './attachements';
import MilestoneAdd from '../milestones/milestoneAdd';

const statuses = [{ id: 0, title: 'New', color: '#1087e2' }, { id: 1, title: 'Open', color: '#155724' }, { id: 2, title: 'Pending', color: '#f3ba0d' },
{ id: 3, title: 'Closed', color: '#e2e3e5' }, { id: 4, title: 'No status', color: '#777' }]


export default class TaskEditColumn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      project: null,
      hours: 0,
      assignedBy: null,
      assignedTo: null,
      deadline: '',
      description: '',
      status: 4,
      tags: [],
      attachements: [],
      milestone: null,
    //  price:0,

      saving: false,
      loading: true,
      projects: [],
      allTags: [],
      users: [],
      milestones: [{value: -1, label: "+ Add Milestone"}],
    }
    this.submitTask.bind(this);
    this.canSave.bind(this);
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData(this.props.id);
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.taskID!==props.match.params.taskID){
      this.setState({loading:true})
      this.getData(props.match.params.taskID);
    }
  }

  getData(id) {
    Promise.all([
      rebase.get('proj-tasks/' + id, {
        context: this,
      }),
      database.collection('proj-projects').get(),
      database.collection('users').get(),
      database.collection('proj-tags').get(),
      database.collection('proj-milestones').get(),
    ])
      .then(([task, projects, users, tags, milestones]) => {
        this.setData(task, toSelArr(snapshotToArray(projects)), toSelArr(snapshotToArray(users), 'email'), toSelArr(snapshotToArray(tags)), toSelArr(snapshotToArray(milestones)), id);
      });
  }

  setData(task, projects, users, allTags, milestones, id) {
    let project = projects.find((item) => item.id === task.project);
    if (project === undefined) {
      project = null;
    }
    let assignedBy = users.find((item) => item.id === task.assignedBy);
    if (assignedBy === undefined) {
      assignedBy = null;
    }
    let assignedTo = users.find((item) => item.id === task.assignedTo);
    if (assignedTo === undefined) {
      assignedTo = null;
    }
    let milestone = milestones.find((item) => item.id === task.milestone);
    if (milestone === undefined) {
      milestone = null;
    }

    /*let status = 4;
    if (task.deadline && milestone){
      if (task.deadline < milestone.od) {
        status = 2;
      } else if (task.deadline >= milestone.od && task.deadline <= milestone.do) {
        status = 1;
      } else if (task.deadline >= milestone.do) {
        status = 3;
      }
    }*/

    let tags = allTags.filter((item) => (task.tags !== undefined ? task.tags : []).includes(item.id));
    this.setState({
      title: task.title,
      project,
      hours: task.hours ? task.hours : 0,
      assignedBy,
      assignedTo,
      milestone,
      deadline: task.deadline ? new Date(task.deadline).toISOString().replace('Z', '') : '',
      description: task.description ? task.description : '',
      status: task.status,
      attachements: task.attachements ? task.attachements : [],
      tags,
  //    price:task.price?task.price:0,

      loading: false,
      users,
      projects,
      allTags,
      milestones,
    });
  }

  canSave() {
    return this.state.title !== '' && this.state.project !== null && !this.state.loading
  }

  submitTask() {
    if (!this.canSave()) {
      return;
    }
    this.setState({ saving: true });
    let body = {
      title: this.state.title,
      project: this.state.project.id,
      hours: this.state.hours,
      assignedBy: this.state.assignedBy ? this.state.assignedBy.id : null,
      assignedTo: this.state.assignedTo ? this.state.assignedTo.id : null,
      deadline: isNaN(new Date(this.state.deadline).getTime()) ? null : (new Date(this.state.deadline).getTime()),
      tags: this.state.tags.map((item) => item.id),
      milestone: this.state.milestone ? this.state.milestone.id : null,
      description: this.state.description,
      status: this.state.status,
      attachements: this.state.attachements,
  //    price:this.state.price,
    }

    rebase.updateDoc('/proj-tasks/' + this.props.id, body).then(() => this.setState({ saving: false }));
  }

  render() {
    const MILESTONES = [{value: -1, label: "+ Add Milestone"}].concat(this.state.project ? this.state.milestones.filter(mile => mile.project === this.state.project.id) : []);

    return (
      <div className='card-box flex fit-with-header-and-commandbar scrollable p-20'>
        {/*TOOLBAR*/}
        <div className="row m-b-10">


          <div className="toolbar-item">
            <button type="button" className="btn-link"
              onClick={() => { this.setState({ status: 1 }, this.submitTask.bind(this)) }}
            >
              <i className="fa fa-play" /> Open
              </button>
          </div>
          <div className="toolbar-item">
            <button type="button" className="btn-link"
              onClick={() => { this.setState({ status: 2 }, this.submitTask.bind(this)) }}
            >
              <i className="fa fa-pause" /> Pending
              </button>
          </div>
          <div className="toolbar-item">
            <button type="button" className="btn-link"
              onClick={() => { this.setState({ status: 3 }, this.submitTask.bind(this)) }}
            >
              <i className="fa fa-check-circle" /> Close
              </button>
          </div>


          {
            this.state.saving &&
            <div className="toolbar-item">
              <button type="button" className="btn-link">
                <i className="fas fa-save"
                /> Saving
                </button>
            </div>
          }

          <div className="toolbar-item">
            <button type="button" className="btn-link"
              onClick={() => {
                if (window.confirm('Are you sure?')) {
                  rebase.removeDoc('/proj-tasks/' + this.props.id).then(() => {
                    this.props.toggle ? this.props.toggle() : this.props.history.goBack();
                  });
                }
              }}
            >
              <i className="fa fa-trash" /> Delete
            </button>
          </div>
        </div>

        {/*MAIN*/}
        <div>
          <FormGroup className="row">
            <p className="task-title-input" style={{paddingTop:5}}># 100</p>
            <div className="flex">

              <Input type="text" placeholder="Task name" className="task-title-input text-extra-slim hidden-input m-0" value={this.state.title} onChange={(e) => this.setState({ title: e.target.value }, this.submitTask.bind(this))} />
            </div>
          </FormGroup>

          <FormGroup>
            <Label className="label m-r-5 center-hor center-ver" style={{ backgroundColor: statuses.find((item) => item.id === this.state.status).color }}>
              {statuses.find((item) => item.id === this.state.status).title}
            </Label>
          </FormGroup>
          <FormGroup>
            <Label className="text-slim">Tags</Label>
            <Select
              styles={selectStyle}
              options={this.state.allTags}
              value={this.state.tags}
              onChange={(tags) => this.setState({ tags }, this.submitTask.bind(this))}
              isMulti
              />
          </FormGroup>
          <div className="flex m-l-5">
            <div className="col-lg-12">
              <div className="col-lg-6 p-r-5">
                <FormGroup >
                  <Label className="text-slim">Project</Label>
                  <Select
                    styles={selectStyle}
                    options={this.state.projects}
                    value={this.state.project}
                    onChange={e => {
                      this.setState({
                        milestone: this.state.project ? (e.id !== this.state.project.id ? null : this.state.milestone) : null,
                        project: e,
                       }, this.submitTask.bind(this)); }}
                  />
                </FormGroup>

                <FormGroup>
                  <Label className="text-slim">Requester</Label>
                  <Select
                    styles={selectStyle}
                    options={this.state.users}
                    value={this.state.assignedBy}
                    onChange={e => { this.setState({ assignedBy: e }, this.submitTask.bind(this)); }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label className="text-slim">Assigned to</Label>
                  <Select
                    styles={selectStyle}
                    options={this.state.users}
                    value={this.state.assignedTo}
                    onChange={e => { this.setState({ assignedTo: e }, this.submitTask.bind(this)); }}
                  />
                </FormGroup>

              </div>
              <div className="col-lg-6 p-l-5">

                <FormGroup>
                  <Label className="text-slim">Deadline</Label>
                  <Input type="datetime-local" placeholder="Enter deadline" value={this.state.deadline} onChange={(e) => {
                      let deadline = isNaN(new Date(e.target.value).getTime()) ? null : (new Date(e.target.value).getTime());
                      let status = 4;
                      if (deadline && this.state.milestone){
                        if (deadline < this.state.milestone.od) {
                          status = 2;
                        } else if (deadline >= this.state.milestone.od && deadline <= this.state.milestone.do) {
                          status = 1;
                        } else if (deadline >= this.state.milestone.do) {
                          status = 3;
                        }
                      }
                      this.setState({
                        deadline: e.target.value,
                        status,
                      }, this.submitTask.bind(this))
                    }} />
                </FormGroup>

                <FormGroup>
                  <Label className="text-slim">Hours</Label>
                  <Input type="number" placeholder="Enter hours" value={this.state.hours} onChange={(e) => this.setState({ hours: e.target.value }, this.submitTask.bind(this))} />
                </FormGroup>

                <FormGroup>
                  <Label className="text-slim">Milestone</Label>
                  <Select
                    styles={selectStyle}
                    options={MILESTONES}
                    value={this.state.milestone}
                    onChange={e => {
                      if (e.value === -1){
                        this.setState({
                          milestoneAddOpen: true,
                        })
                      } else {
                        this.setState({ milestone: e }, this.submitTask.bind(this));
                      }
                    }}
                  />
                </FormGroup>

              </div>
            </div>
            { false &&
            <FormGroup>
              <Label className="text-slim">Price</Label>
              <Input type="number" placeholder="Enter price" value={this.state.price} onChange={(e) => this.setState({ price: e.target.value }, this.submitTask.bind(this))} />
            </FormGroup> }
            <FormGroup>
              <Label className="text-slim">Description</Label>
              <Input type="textarea" placeholder="Description" value={this.state.description} onChange={(e) => this.setState({ description: e.target.value }, this.submitTask.bind(this))} />
            </FormGroup>
          </div>

          <Modal isOpen={this.state.milestoneAddOpen} >
            <ModalHeader>
              Add milestone
            </ModalHeader>
            <ModalBody>
              <MilestoneAdd
                project={this.state.project}
                close={() => this.setState({milestoneAddOpen: false,})}
                addMilestone={(milestone) => {
                  let newMilestones = this.state.milestones.concat([milestone]);
                  this.setState({
                    milestones: newMilestones,
                    milestoneAddOpen: false,
                  })
                }}/>
            </ModalBody>
          </Modal>

          <div className="flex m-r-5">
            <Subtasks id={this.props.id} />
            <Attachements id={this.props.id} attachements={this.state.attachements} onChange={(attachements) => this.setState({ attachements }, this.submitTask.bind(this))} />
            <Comments id={this.props.id} users={this.state.users} />

          </div>
        </div>
      </div>
    );
  }
}
