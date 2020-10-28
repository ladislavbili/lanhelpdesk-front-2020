import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  gql
} from '@apollo/client';;

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import DatePicker from 'react-datepicker';

import moment from 'moment';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/querries';
import {
  GET_MILESTONE as GET_LOCAL_MILESTONE,
  GET_PROJECT
} from 'apollo/localSchema/querries';

import {
  UPDATE_MILESTONE,
  GET_MILESTONE,
  DELETE_MILESTONE,
} from './querries';

export default function MilestoneEdit( props ) {

  const {
    milestoneDeleted,
    closeModal
  } = props;

  //data & queries
  const [ updateMilestone, {
    client
  } ] = useMutation( UPDATE_MILESTONE );
  const [ deleteMilestone ] = useMutation( DELETE_MILESTONE );

  const {
    data: projectData,
    loading: projectLoading
  } = useQuery( GET_PROJECT );

  const {
    data: milestoneData,
    loading: milestoneLoading
  } = useQuery( GET_LOCAL_MILESTONE );

  const id = milestoneData.localMilestone.id;
  const projectID = projectData.localProject.project.id;

  const {
    data,
    loading
  } = useQuery( GET_MILESTONE, {
    variables: {
      id
    }
  } );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ startsAt, setStartsAt ] = React.useState( null );
  const [ endsAt, setEndsAt ] = React.useState( null );

  const [ saving, setSaving ] = React.useState( false );
  const [ opened, setOpened ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setTitle( data ? data.milestone.title : null );
      setDescription( data ? data.milestone.description : null );
      setStartsAt( data && data.milestone.startsAt ? moment( parseInt( data.milestone.startsAt ) ) : null );
      setEndsAt( data && data.milestone.endsAt ? moment( parseInt( data.milestone.endsAt ) ) : null );
    }
  }, [ loading ] );

  const toggle = () => {
    setOpened( !opened );
  }

  // functions
  const updateMilestoneFunc = () => {
    setSaving( true );

    updateMilestone( {
        variables: {
          id,
          title,
          description,
          startsAt: startsAt ? ( startsAt.unix() * 1000 )
            .toString() : null,
          endsAt: endsAt ? ( endsAt.unix() * 1000 )
            .toString() : null,
        }
      } )
      .then( ( response ) => {
        let allProjects = client.readQuery( {
            query: GET_MY_PROJECTS
          } )
          .myProjects;
        const newProjects = allProjects.map( item => {
          if ( item.project.id !== projectID ) {
            return {
              ...item
            };
          }
          let newProject = {
            ...item
          };
          newProject.project.milestones = newProject.project.milestones.map( item => {
            if ( item.id !== id ) {
              return item;
            }
            return {
              ...response.data.updateMilestone,
              __typename: "Milestone"
            };
          } );
          return newProject;
        } );
        client.writeQuery( {
          query: GET_MY_PROJECTS,
          data: {
            myProjects: [ ...newProjects ]
          }
        } );
        editCacheMilestone( response.data.updateMilestone, newProjects.find( item => item.project.id === projectID ) );
        setOpened( false );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  };

  const deleteMilestoneFunc = () => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteMilestone( {
          variables: {
            id,
          }
        } )
        .then( ( response ) => {
          let allProjects = client.readQuery( {
              query: GET_MY_PROJECTS
            } )
            .myProjects;
          const newProjects = allProjects.map( item => {
            if ( item.project.id !== projectID ) {
              return {
                ...item
              };
            }
            let newProject = {
              ...item
            };
            newProject.project.milestones = newProject.project.milestones.filter( item => item.id !== id );
            return newProject;
          } );
          client.writeQuery( {
            query: GET_MY_PROJECTS,
            data: {
              myProjects: [ ...newProjects ]
            }
          } );
          milestoneDeleted()
          setOpened( false );
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
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