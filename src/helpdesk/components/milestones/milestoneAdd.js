import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import DatePicker from 'components/DatePicker';
import {
  FormGroup,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/queries';

import {
  ADD_MILESTONE
} from './queries';

import {
  GET_PROJECT,
} from 'apollo/localSchema/queries';

export default function MilestoneAdd( props ) {
  //data & queries
  const {
    open,
    closeModal
  } = props;
  const [ addMilestone, {
    client
  } ] = useMutation( ADD_MILESTONE );

  const {
    data: projectData,
    loading: projectLoading
  } = useQuery( GET_PROJECT );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ startsAt, setStartsAt ] = React.useState( null );
  const [ endsAt, setEndsAt ] = React.useState( null );

  const [ saving, setSaving ] = React.useState( false );

  const addMilestoneFunc = () => {
    setSaving( true );
    addMilestone( {
        variables: {
          title,
          description,
          startsAt: startsAt ? startsAt.unix()
            .toString() : null,
          endsAt: endsAt ? endsAt.unix()
            .toString() : null,
          projectId: projectData.localProject.project.id,
        }
      } )
      .then( ( response ) => {
        let allProjects = client.readQuery( {
            query: GET_MY_PROJECTS
          } )
          .myProjects;
        const newProjects = allProjects.map( item => {
          if ( item.project.id !== projectData.localProject.project.id ) {
            return {
              ...item
            };
          }
          let newProject = {
            ...item,
            project: {
              ...item.project,
              milestones: [
              ...item.project.milestones,
                {
                  ...response.data.addMilestone,
                  __typename: "Milestone"
              }
            ]
            }
          };
          return newProject;
        } );
        client.writeQuery( {
          query: GET_MY_PROJECTS,
          data: {
            myProjects: [ ...newProjects ]
          }
        } );
        closeModal( response.data.addMilestone );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
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
          <button className="btn-link-cancel mr-auto" disabled={saving} onClick={() => closeModal(null)}>
            Close
          </button>

          <button className="btn"
            disabled={saving || title === "" || projectLoading}
            onClick={addMilestoneFunc}>
            { saving ? 'Adding...' : 'Add milestone' }
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}