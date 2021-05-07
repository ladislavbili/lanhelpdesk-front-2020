import React from 'react';
import {
  useQuery,
  useMutation
} from "@apollo/client";
import {
  gql
} from '@apollo/client';;

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
import Loading from 'components/loading';
import {
  toSelArr,
  toSelItem
} from 'helperFunctions';
import Checkbox from 'components/checkbox';
import {
  pickSelectStyle
} from 'configs/components/select';

import {
  setFilter,
} from 'apollo/localSchema/actions';

import {
  GET_BASIC_ROLES
} from 'helpdesk/settings/roles/queries';
import {
  GET_FILTER
} from 'apollo/localSchema/queries';

import {
  GET_MY_FILTERS,
  ADD_FILTER,
  UPDATE_FILTER,
  GET_MY_DATA
} from './queries';

import {
  GET_MY_PROJECTS,
} from 'helpdesk/settings/projects/queries';

export default function FilterAdd( props ) {
  //data & queries
  const {
    filter,
    projectId,
    close,
    history
  } = props;

  //queries

  const [ addFilter, {
    client
  } ] = useMutation( ADD_FILTER );

  const {
    data: currentUserData
  } = useQuery( GET_MY_DATA );

  const {
    data: roleData,
    loading: roleLoading
  } = useQuery( GET_BASIC_ROLES );

  const {
    data: myProjectsData,
    loading: myProjectsLoading
  } = useQuery( GET_MY_PROJECTS );

  const {
    data: filterData,
    loading: filterLoading
  } = useQuery( GET_FILTER );

  const [ updateFilter ] = useMutation( UPDATE_FILTER );
  const dataLoading = (
    roleLoading ||
    myProjectsLoading ||
    filterLoading
  )
  const id = filterData.localFilter.id;

  //state
  const [ pub, setPub ] = React.useState( false );
  const [ global, setGlobal ] = React.useState( false );
  const [ dashboard, setDashboard ] = React.useState( false );
  const [ roles, setRoles ] = React.useState( [] );
  const [ saving, setSaving ] = React.useState( false );
  const [ opened, setOpened ] = React.useState( false );
  const [ title, setTitle ] = React.useState( id ? filterData.localFilter.title : '' );


  React.useEffect( () => {
    if ( !dataLoading ) {
      let filter = filterData.localFilter;
      setPub( filter.pub );
      setGlobal( filter.global );
      setDashboard( filter.dashboard );
      setRoles( filter.roles ? toSelArr( filter.roles ) : [] );
      setTitle( id ? filter.title : '' )
    }
  }, [ id, dataLoading ] );

  const addFilterFunc = () => {
    setSaving( true );
    if ( id === null || id === undefined ) {
      addFilter( {
          variables: {
            title,
            pub,
            global,
            dashboard,
            projectId,
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
            __typename: "BasicFilter"
          };
          const newFilters = [ ...allFilters, newFilter ];
          client.writeQuery( {
            query: GET_MY_FILTERS,
            data: {
              myFilters: [ ...newFilters ]
            }
          } );
          setFilter( newFilter );
          history.push( `/helpdesk/taskList/i/${newFilter.id}` );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    } else {
      updateFilter( {
          variables: {
            id,
            title,
            pub,
            global,
            dashboard,
            projectId,
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
            if ( item.id !== id ) {
              return item;
            }
            return ( {
              ...response.data.updateFilter,
              __typename: "BasicFilter"
            } );
          } );
          client.writeQuery( {
            query: GET_MY_FILTERS,
            data: {
              myFilters: [ ...newFilters ]
            }
          } );
          setFilter( {
            ...response.data.updateFilter,
            __typename: "BasicFilter"
          } );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
    close();
    setOpened( false );
    setSaving( false );
  }

  if ( dataLoading ) {
    return <Loading />
  }

  const canCreatePublicFilters = currentUserData.getMyData.role.accessRights.publicFilters;

  return (
    <div className="filter-add-btn">
      <button className="btn-link inner m-l-19" onClick={() => setOpened(!opened)}>
        <i className="far fa-save icon-M"/>
      </button>

      <Modal style={{width: "800px"}} isOpen={opened}>
        <ModalHeader>
          { projectId ? "Add filter to project ": "Add general filter"  }
        </ModalHeader>
        <ModalBody>
          {/* Filter name */}
          <Label>Filter name</Label>
          <Input
            type="text"
            className="from-control m-t-5 m-b-5"
            placeholder="Enter filter name"
            autoFocus
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            />

          {/* PUBLIC - every user can see */}
          { canCreatePublicFilters &&
            <Checkbox
              className = "m-l-5 m-r-5"
              label = "Public (everyone see this filter)"
              value = { pub }
              onChange={(e)=> setPub(!pub)}
              />
          }

          {/* ROLES - what role in case of public */}
          { canCreatePublicFilters && pub &&
            <FormGroup>{/* Roles */}
              <Label className="">Roles</Label>
              <Select
                placeholder="Choose roles"
                value={roles}
                isMulti
                onChange={(newRoles)=>{
                  if(newRoles.some((role) => role.id === 'all' )){
                    if( roleData.basicRoles.length === roles.length ){
                      setRoles([]);
                    }else{
                      setRoles(toSelArr(roleData.basicRoles))
                    }
                  }else{
                    setRoles(newRoles);
                  }
                }}
                options={toSelArr([{id: 'all', title: roleData.basicRoles.length === roles.length ? 'Clear' : 'All' }].concat(roleData.basicRoles))}
                styles={pickSelectStyle()}
                />
            </FormGroup>
          }
          {/* In all projects - FILTER ONLY */}
          { !projectId &&
            <Checkbox
              className = "m-l-5 m-r-5"
              label = "Global (shown in all projects)"
              value = { global }
              onChange={(e)=> setGlobal(!global)}
              />
          }
          {/* In DASHBOARD - FILTER ONLY */}
          { !projectId &&
            <Checkbox
              className = "m-l-5 m-r-5"
              label = "Dashboard (shown in dashboard)"
              value = { dashboard }
              onChange={(e)=>setDashboard(!dashboard)}
              />
          }

        </ModalBody>
        <ModalFooter>
          <button className="mr-auto btn-link" disabled={saving} onClick={() => setOpened(!opened)}>
            Close
          </button>

          <button
            className="btn"
            disabled={saving || title === "" || (!global && !dashboard && !projectId)}
            onClick={addFilterFunc}
            >
            {id !== null ? (saving?'Saving...':'Save filter') : (saving ? 'Adding...' : 'Add filter' )}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}