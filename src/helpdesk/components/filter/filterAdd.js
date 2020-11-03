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
  selectStyle
} from 'configs/components/select';

import {
  setFilter,
} from 'apollo/localSchema/actions';

import {
  GET_BASIC_ROLES
} from 'helpdesk/settings/roles/querries';
import {
  GET_FILTER
} from 'apollo/localSchema/querries';

import {
  GET_MY_FILTERS,
  ADD_FILTER,
  UPDATE_FILTER,
  GET_MY_DATA
} from './querries';

import {
  GET_MY_PROJECTS,
} from 'helpdesk/settings/projects/querries';

export default function FilterAdd( props ) {
  //data & queries
  const {
    filter,
    title,
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

  //state
  const [ pub, setPub ] = React.useState( false );
  const [ global, setGlobal ] = React.useState( false );
  const [ dashboard, setDashboard ] = React.useState( false );
  const [ project, setProject ] = React.useState( null );
  const [ roles, setRoles ] = React.useState( [] );
  const [ saving, setSaving ] = React.useState( false );
  const [ opened, setOpened ] = React.useState( false );

  const id = filterData.localFilter.id;

  React.useEffect( () => {
    if ( !dataLoading ) {
      let filter = filterData.localFilter;
      setPub( filter.pub );
      setGlobal( filter.global );
      setDashboard( filter.dashboard );
      setProject( filter.project ? toSelItem( filter.project ) : null );
      setRoles( filter.roles ? toSelArr( filter.roles ) : [] );
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
    <div>
    <Button className="btn-link-reversed m-2" onClick={() => setOpened(!opened)}>
      <i className="far fa-save icon-M"/>
    </Button>

    <Modal style={{width: "800px"}} isOpen={opened}>
      <ModalHeader>
        Add filter - "{title}"
      </ModalHeader>
      <ModalBody>

        { canCreatePublicFilters &&
          <Checkbox
            className = "m-l-5 m-r-5"
            label = "Public (everyone see this filter)"
            value = { pub }
            onChange={(e)=> setPub(!pub)}
            />
        }

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
            options={toSelArr(myProjectsData.myProjects.map((myProject) => myProject.project ))}
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
          onClick={addFilterFunc}>{id!==null?(saving?'Saving...':'Save filter'):(saving?'Adding...':'Add filter')}</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}