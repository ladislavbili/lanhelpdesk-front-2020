import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Modal, ModalBody, ModalFooter, ModalHeader, Button, FormGroup, Label, Input } from 'reactstrap';
import DatePicker from 'react-datepicker';
import { timestampToString } from 'helperFunctions';

import moment from 'moment';

import { GET_PROJECTS } from 'helpdesk/components/sidebar/tasksSidebar';

const UPDATE_MILESTONE = gql`
mutation updateMilestone($id: Int!, $title: String, $description: String, $startsAt: String, $endsAt: String) {
  updateMilestone(
    id: $id,
    title: $title,
    description: $description,
    startsAt: $startsAt,
    endsAt: $endsAt
){
  id
  title
  }
}
`;

const GET_MILESTONE = gql`
query milestone($id: Int!) {
  milestone(
    id: $id
){
  id
  title
  description
  startsAt
  endsAt
  }
}
`;

const DELETE_MILESTONE = gql`
mutation deleteMilestone($id: Int!) {
  deleteMilestone(
    id: $id
  ){
    id
  }
}
`;

export default function MilestoneEdit (props){
  //data & queries
  const { milestoneID, projectID } = props;
  const [ updateMilestone, {client} ] = useMutation(UPDATE_MILESTONE);
  const [ deleteMilestone ] = useMutation(DELETE_MILESTONE);
  const { data, loading } = useQuery(GET_MILESTONE, { variables: {id: milestoneID} });

  //state
  const [ title, setTitle ] = React.useState("");
  const [ description, setDescription ] = React.useState("");
  const [ startsAt, setStartsAt ] = React.useState(null);
  const [ endsAt, setEndsAt ] = React.useState(null);

  const [ saving, setSaving ] = React.useState(false);
  const [ opened, setOpened ] = React.useState(false);

  // sync
  React.useEffect( () => {
      if (!loading){
        setTitle( data ? data.milestone.title : null);
        setDescription( data ? data.milestone.description : null);
        setStartsAt( data && data.milestone.startsAt ? moment(parseInt(data.milestone.startsAt)) : null );
        setEndsAt( data && data.milestone.endsAt ? moment(parseInt(data.milestone.endsAt)) : null );
      }
  }, [loading]);

  const toggle = () => {
    setOpened(!opened);
  }

    // functions
    const updateMilestoneFunc = () => {
      setSaving( true );

      updateMilestone({ variables: {
        id: milestoneID,
        title,
        description,
        startsAt: startsAt ? (startsAt.unix()*1000).toString() : null,
        endsAt: endsAt ? (endsAt.unix()*1000).toString() : null,
      } }).then( ( response ) => {
        let allProjects = client.readQuery({query: GET_PROJECTS}).projects;
        const newProjects = allProjects.map(item => {
          if (item.id !== projectID){
            return item;
          }
          let newProject = {...item};
          newProject.milestones =newProject.milestones.map(item => {
            if (item.id !== milestoneID) {
              return item;
            }
            return {...response.data.updateMilestone, __typename: "Milestone"}
          });
          return newProject;
        });
        /*
        if(body.startsAt){
          let milestoneTasks = this.props.tasks.map((task)=>{return {...task,status:this.props.statuses.find((status)=>status.id===task.status)}}).filter((task)=>task.milestone === this.props.item.id && task.status.action==='pending');
          milestoneTasks.map((task)=>rebase.updateDoc(`/help-tasks/${task.id}`, {pendingDate:body.startsAt}))
        }
        */
        client.writeQuery({ query: GET_PROJECTS, data: {projects: [...newProjects] } });
        setOpened(false);
      }).catch( (err) => {
        console.log(err.message);
      });

       setSaving( false );
    };

    const deleteMilestoneFunc = () => {
      if(window.confirm("Are you sure?")){
        deleteMilestone({ variables: {
          id: milestoneID,
        } }).then( ( response ) => {
          const allProjects = client.readQuery({query: GET_PROJECTS}).projects;
          const newProjects = allProjects.filter(item => item.id !== milestoneID);
          client.writeQuery({ query: GET_PROJECTS, data: {projects: [...newProjects] } });
          setOpened(false);
        }).catch( (err) => {
          console.log(err.message);
          console.log(err);
        });
      }
    };

  return (
		<div className='p-l-15 p-r-15'>
			<Button
				className='btn-link p-0'
				onClick={toggle}
				>
				Milestone settings
			</Button>

        <Modal isOpen={opened}>
          <ModalHeader>
            Edit milestone
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Milestone title</Label>
              <Input type="text" id="title" placeholder="Enter project name" value={title} onChange={(e)=> setTitle(e.target.value)} />
            </FormGroup>

            <FormGroup>
  						<Label htmlFor="description">Popis</Label>
  						<Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={description} onChange={(e) => setDescription( e.target.value)}/>
  					</FormGroup>
            <div className="col-lg-12">
              <FormGroup className="col-lg-6">
                <div>
                  <Label htmlFor="od">OD</Label>
                </div>
                <div>
                  <DatePicker
    							selected={startsAt}
    							onChange={date => setStartsAt(date)}
                  id="od"
    							locale="en-gb"
    							placeholderText="No starting date"
    							showTimeSelect
    							className="form-control hidden-input center-ver"
    							todayButton="Today"
    							timeFormat="HH:mm"
    							timeIntervals={15}
    							dateFormat="HH:mm DD.MM.YYYY"
    						/>
              </div>
              </FormGroup>
              <FormGroup className="col-lg-6">
                <div>
                  <Label htmlFor="do">DO</Label>
                </div>
                <div>
                  <DatePicker
    							selected={endsAt}
    							onChange={date => setEndsAt(date)}
                  id="do"
    							locale="en-gb"
    							placeholderText="No ending date"
    							showTimeSelect
    							className="form-control hidden-input center-ver"
    							todayButton="Today"
    							timeFormat="HH:mm"
    							timeIntervals={15}
    							dateFormat="HH:mm DD.MM.YYYY"
    						/>
              </div>
              </FormGroup>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button className="btn-link mr-auto" disabled={saving} onClick={toggle}>
              Close
            </Button>

            <Button className="ml-auto btn-danger" disabled={saving} onClick={deleteMilestoneFunc}>
              Delete
            </Button>

            <Button className="btn"
              disabled={ saving || title === "" }
              onClick={updateMilestoneFunc}>
              {saving?'Saving...':'Save milestone'}
            </Button>
          </ModalFooter>
        </Modal>
        </div>
  );
}
