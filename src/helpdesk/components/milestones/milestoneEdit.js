import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import DatePicker from 'components/DatePicker';

import moment from 'moment';

import {
  GET_MY_PROJECTS
} from 'helpdesk/settings/projects/queries';
import {
  GET_MILESTONE as GET_LOCAL_MILESTONE,
  GET_PROJECT
} from 'apollo/localSchema/queries';

import {
  UPDATE_MILESTONE,
  GET_MILESTONE,
  DELETE_MILESTONE,
} from './queries';

export default function MilestoneEdit( props ) {

  const {
    milestoneDeleted,
    closeModal,
    label,
    buttonClassName,
    containerClassName,
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
  const [ order, setOrder ] = React.useState( 0 );
  const [ description, setDescription ] = React.useState( "" );
  const [ startsAt, setStartsAt ] = React.useState( null );
  const [ endsAt, setEndsAt ] = React.useState( null );

  const [ saving, setSaving ] = React.useState( false );
  const [ opened, setOpened ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setTitle( data ? data.milestone.title : null );
      setOrder( data ? data.milestone.order : 0 );
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
          order: isNaN( parseInt( order ) ) ? ( data ? data.milestone.order : 0 ) : parseInt( order ),
          startsAt: startsAt ? ( startsAt.unix() * 1000 )
            .toString() : null,
          endsAt: endsAt ? ( endsAt.unix() * 1000 )
            .toString() : null,
        }
      } )
      .then( ( response ) => {
        closeModal( response.data.updateMilestone );
        setOpened( false );
      } )
      .catch( ( err ) => {
        addLocalError( err );
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
            return {
              ...item,
              project: {
                ...item.project,
                milestones: item.project.milestones.filter( item => item.id !== id )
              }
            };
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
          addLocalError( err );
        } );
    }
  };

  return (
    <div className={containerClassName}>
			<button
				className={buttonClassName}
				onClick={toggle}
				>
				<i className="fa fa-cog"/>
        { label }
			</button>

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
              <Label for="order">Order</Label>
              <Input type="number" id="order" placeholder="Enter order" value={order} onChange={(e)=>setOrder(e.target.value)} />
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
            <button className="btn-link-cancel btn-distance" disabled={saving} onClick={toggle}>
              Close
            </button>

            <button className="btn-red" disabled={saving} onClick={deleteMilestoneFunc}>
              Delete
            </button>

            <button className="btn ml-auto"
              disabled={ saving || title === "" }
              onClick={updateMilestoneFunc}>
              {saving?'Saving...':'Save milestone'}
            </button>
          </ModalFooter>
        </Modal>
        </div>
  );
}