import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import DatePicker from 'react-datepicker';
import { Button, FormGroup, Label,Input, Modal, ModalHeader, ModalBody, ModalFooter  } from 'reactstrap';

import { GET_PROJECTS } from 'helpdesk/components/sidebar/tasksSidebar';

const ADD_MILESTONE = gql`
mutation addMilestone($title: String!, $description: String!, $startsAt: String, $endsAt: String, $projectId: Int!) {
  addMilestone(
    title: $title,
    description: $description,
    startsAt: $startsAt,
    endsAt: $endsAt,
    projectId: $projectId
){
  id
  title
  }
}
`;

export default function MilestoneAdd (props){
  //data & queries
  const { history, match, open, closeModal, projectID } = props;
  const [ addMilestone, {client} ] = useMutation(ADD_MILESTONE);

  //state
  const [ title, setTitle ] = React.useState("");
  const [ description, setDescription ] = React.useState("");
  const [ startsAt, setStartsAt ] = React.useState(null);
  const [ endsAt, setEndsAt ] = React.useState(null);

  const [ saving, setSaving ] = React.useState(false);

  const addMilestoneFunc = () => {
    setSaving( true );
    addMilestone({ variables: {
      title,
      description,
      startsAt: startsAt ? startsAt.unix().toString() : null,
      endsAt: endsAt ? endsAt.unix().toString() : null,
      projectId: projectID,
    } }).then( ( response ) => {
        let allProjects = client.readQuery({query: GET_PROJECTS}).projects;
        const newProjects = allProjects.map(item => {
          if (item.id !== projectID){
            return item;
          }
          let newProject = {...item};
          newProject.milestones = [...newProject.milestones, {...response.data.addMilestone, __typename: "Milestone"}];
          return newProject;
        });
        client.writeQuery({ query: GET_PROJECTS, data: {projects: [...newProjects] } });
        closeModal();
    }).catch( (err) => {
      console.log(err.message);
    });
    setSaving( false );
  }

  return (
    <div>
        <Modal isOpen={open} >
          <ModalHeader> Add milestone </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Milestone title</Label>
              <Input type="text" id="title" placeholder="Enter project name" value={title} onChange={(e)=>setTitle(e.target.value)} />
            </FormGroup>

            <FormGroup>
  						<Label htmlFor="description">Popis</Label>
  						<Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={description} onChange={(e) => setDescription(e.target.value)}/>
  					</FormGroup>
          </ModalBody>

          <div className="row">
						<DatePicker
							selected={startsAt}
							onChange={date => setStartsAt(date)}
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
  							selected={endsAt}
  							onChange={date => setEndsAt(date)}
  							locale="en-gb"
  							placeholderText="No ending date"
  							showTimeSelect
  							className="form-control hidden-input"
  							todayButton="Today"
  							timeFormat="HH:mm"
  							timeIntervals={15}
  							dateFormat="HH:mm DD.MM.YYYY"
  						/>
          </div>

          <ModalFooter>
            <Button className="btn mr-auto" disabled={saving} onClick={() => closeModal()}>
              Close
            </Button>

            <Button className="btn-link"
              disabled={saving || title === ""}
              onClick={addMilestoneFunc}>
            { saving ? 'Adding...' : 'Add milestone' }
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
