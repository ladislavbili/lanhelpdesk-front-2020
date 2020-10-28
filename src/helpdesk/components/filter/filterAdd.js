import React from 'react';
import {
  useQuery,
  useMutation
} from "@apollo/client";
import { gql } from '@apollo/client';;

import Select from 'react-select';
import {
  Button,
  FormGroup,
  Label,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from 'reactstrap';
import {
  toSelArr,
  toSelItem
} from 'helperFunctions';
import Checkbox from 'components/checkbox';
import {
  selectStyle
} from 'configs/components/select';

import {
  GET_BASIC_ROLES
} from 'helpdesk/settings/roles/querries';
import {
  GET_MY_FILTERS
} from './querries';

const GET_MY_DATA = gql `
query {
  getMyData{
    id
    email
    role {
      id
      accessRights {
        publicFilters
      }
    }
  }
}
`;

const ADD_FILTER = gql `
mutation addFilter(
  $title: String!,
  $pub: Boolean!,
  $global: Boolean!,
  $dashboard: Boolean!,
  $order: Int,
  $roles: [Int],
  $filter: FilterInput!
  $projectId: Int,
) {
  addFilter(
    title: $title,
    pub: $pub,
    global: $global,
    dashboard: $dashboard,
    order: $order,
    roles: $roles,
    filter: $filter,
    projectId: $projectId
){
    title
    id
    createdAt
    updatedAt
    createdBy {
      id
    }
    pub
    global
    dashboard
    filter {
      taskType {
        id
      }
    }
    project {
      id
    }
    roles {
      id
    }
  }
}
`;


const UPDATE_FILTER = gql `
mutation updateFilter( $id: Int!, $title: String, $pub: Boolean!, $global: Boolean!, $dashboard: Boolean!, $order: Int, $roles: [Int], $filter: FilterInput, $projectId: Int,) {
  updateFilter(
    id: $id,
    title: $title,
    pub: $pub,
    global: $global,
    dashboard: $dashboard,
    order: $order,
    roles: $roles,
    filter: $filter,
    projectId: $projectId
){
    title
    id
    createdAt
    updatedAt
    id
    title
    pub
    global
    dashboard
    project {
      id
      title
    }
    roles {
      id
      title
    }
    filter {
      assignedToCur
      assignedTo {
        id
        email
      }
      requesterCur
      requester {
        id
        email
      }
      companyCur
      company {
        id
        title
      }
      taskType {
        id
        title
      }
      statusDateFrom
      statusDateFromNow
      statusDateTo
      statusDateToNow
      pendingDateFrom
      pendingDateFromNow
      pendingDateTo
      pendingDateToNow
      closeDateFrom
      closeDateFromNow
      closeDateTo
      closeDateToNow
      deadlineFrom
      deadlineFromNow
      deadlineTo
      deadlineToNow
    }
  }
}
`;

const GET_PROJECTS = gql `
query {
  projects {
    title
    id
    projectRights {
			read
			write
			delete
			internal
			admin
			user {
				id
        email
			}
    }
  }
}
`;

export default function FilterAdd( props ) {
  //data & queries
  const {
    filter,
    filterID,
    generalFilter
  } = props;
  const {
    data
  } = useQuery( GET_MY_DATA );
  const {
    data: roleData,
    loading: roleLoading
  } = useQuery( GET_BASIC_ROLES );
  const {
    data: projectData,
    loading: projectLoading
  } = useQuery( GET_PROJECTS );
  const [ addFilter, {
    client
  } ] = useMutation( ADD_FILTER );
  const [ updateFilter ] = useMutation( UPDATE_FILTER );
  const roles = ( roleLoading ? [] : toSelArr( roleData.basicRoles ) );
  const projects = ( projectLoading ? [] : toSelArr( projectData ? projectData.projects : [] ) );

  const [ title, setTitle ] = React.useState( "" );
  const [ pub, setPub ] = React.useState( false );
  const [ global, setGlobal ] = React.useState( false );
  const [ dashboard, setDashboard ] = React.useState( false );
  const [ project, setProject ] = React.useState( null );
  const [ chosenRoles, setChosenRoles ] = React.useState( [] );
  const [ saving, setSaving ] = React.useState( false );
  const [ opened, setOpened ] = React.useState( false );

  let currentUser = {};
  let accessRights = {};

  if ( data ) {
    currentUser = data.getMyData;
    accessRights = currentUser.role.accessRights;
  }

  React.useEffect( () => {
    if ( filterID && generalFilter ) {
      setTitle( generalFilter.title );
      setPub( generalFilter.pub );
      setGlobal( generalFilter.global );
      setDashboard( generalFilter.dashboard );
      setProject( generalFilter.project ? toSelItem( generalFilter.project ) : null );
      setChosenRoles( generalFilter.roles ? toSelArr( generalFilter.roles ) : [] );
    }
  }, [ filterID ] );

  const addFilterFunc = () => {
    setSaving( true );
    if ( filterID === null || filterID === undefined ) {
      addFilter( {
          variables: {
            title,
            pub,
            global,
            dashboard,
            projectId: project ? project.id : null,
            filter,
            roles: roles.map( item => item.id )
          }
        } )
        .then( ( response ) => {
          const allFilters = client.readQuery( {
              query: GET_MY_FILTERS
            } )
            .myFilters;
          const newFilter = {
            ...response.data.addFilter,
            __typename: "Filter"
          };
          const newFilters = [ ...allFilters, newFilter ];
          client.writeQuery( {
            query: GET_MY_FILTERS,
            data: {
              myFilters: [ ...newFilters ]
            }
          } );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    } else {
      updateFilter( {
          variables: {
            id: filterID,
            title,
            pub,
            global,
            dashboard,
            projectId: project ? project.id : null,
            filter,
            roles: roles.map( item => item.id )
          }
        } )
        .then( ( response ) => {
          let allFilters = client.readQuery( {
              query: GET_MY_FILTERS
            } )
            .myFilters;
          const newFilters = allFilters.map( item => {
            if ( item.id !== filterID ) {
              return item;
            }
            return ( {
              ...response.data.updateFilter,
              __typename: "Filter"
            } );
          } );
          client.writeQuery( {
            query: GET_MY_FILTERS,
            data: {
              myFilters: [ ...newFilters ]
            }
          } );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
    setOpened( false );
    setSaving( false );
  }

  return (
    <div>
    <Button className="btn-link-reversed m-2" onClick={() => setOpened(!opened)}>
      <i className="far fa-save icon-M"/>
    </Button>

    <Modal style={{width: "800px"}} isOpen={opened}>
      <ModalHeader>
        Add filter
      </ModalHeader>
      <ModalBody>
        <FormGroup className="m-t-15">
          <Label>Filter name</Label>
          <Input type="text" className="from-control" placeholder="Enter filter name" value={title} onChange={(e)=> setTitle(e.target.value)} />
        </FormGroup>

        { accessRights.publicFilters &&
          <Checkbox
            className = "m-l-5 m-r-5"
            label = "Public (everyone see this filter)"
            value = { pub }
            onChange={(e)=> setPub(!pub)}
            />
        }

        { accessRights.publicFilters && pub &&
          <FormGroup>{/* Roles */}
            <Label className="">Roles</Label>
            <Select
              placeholder="Choose roles"
              value={chosenRoles}
              isMulti
              onChange={(newRoles)=>{
                if(newRoles.some((role) => role.id === 'all' )){
                  if( roles.length === chosenRoles.length ){
                    setChosenRoles([]);
                  }else{
                    setChosenRoles(roles)
                  }
                }else{
                  setChosenRoles(newRoles);
                }
              }}
              options={toSelArr([{id: 'all', title: roles.length === chosenRoles.length ? 'Clear' : 'All' }].concat(roles))}
              styles={selectStyle}
              />
          </FormGroup>
        }

        <Checkbox
          className = "m-l-5 m-r-5"
          label = "Global (shown in all projects)"
          value = { global }
          onChange={(e)=> setGlobal(!global)}
          />

        <div className="m-b-10">
          <Label className="form-label">Projekt</Label>
          <Select
            placeholder="Vyberte projekt"
            value={project}
            isDisabled={global}
            onChange={(pro)=> setProject(pro)}
            options={projects.filter((project)=>{
              if (project.projectRights === undefined){
                return false;
              }
              let permission = project.projectRights.find((permission)=>permission.user.id === currentUser.id);
              return permission && permission.read;
            })}
            styles={selectStyle}
            />
        </div>

        <Checkbox
          className = "m-l-5 m-r-5"
          label = "Dashboard (shown in dashboard)"
          value = { dashboard }
          onChange={(e)=>setDashboard(!dashboard)}
          />

      </ModalBody>
      <ModalFooter>
        <Button className="mr-auto btn-link" disabled={saving} onClick={() => setOpened(!opened)}>
          Close
        </Button>


        <Button
          className="btn"
          disabled={saving || title === "" || (!global && project===null)}
          onClick={addFilterFunc}>{filterID!==null?(saving?'Saving...':'Save filter'):(saving?'Adding...':'Add filter')}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}