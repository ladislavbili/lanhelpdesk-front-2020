import React from 'react';
import {
  useQuery,
  useMutation
} from "@apollo/client";
import {
  gql
} from '@apollo/client';

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
  toSelItem,
  getMyData,
  translateSelectItem,
} from 'helperFunctions';
import Checkbox from 'components/checkbox';
import {
  pickSelectStyle
} from 'configs/components/select';

import {
  setFilter,
  addLocalError,
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
  UPDATE_FILTER
} from './queries';

import {
  GET_MY_PROJECTS,
} from 'helpdesk/settings/projects/queries';

import {
  useTranslation
} from "react-i18next";

export default function FilterAdd( props ) {
  //data & queries
  const {
    filter,
    projectId,
    global,
    close,
    history
  } = props;
  //queries

  const {
    t
  } = useTranslation();

  const [ addFilter, {
    client
  } ] = useMutation( ADD_FILTER );

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
  const [ dashboard, setDashboard ] = React.useState( false );
  const [ roles, setRoles ] = React.useState( [] );
  const [ saving, setSaving ] = React.useState( false );
  const [ opened, setOpened ] = React.useState( false );
  const [ title, setTitle ] = React.useState( id ? filterData.localFilter.title : '' );

  React.useEffect( () => {
    if ( !global && projectId === null ) {
      setDashboard( true );
    } else {
      setDashboard( filterData.localFilter.dashboard );
    }
  }, [ global, projectId ] );


  React.useEffect( () => {
    if ( !dataLoading ) {
      let filter = filterData.localFilter;
      setPub( filter.pub );
      setDashboard( filter.dashboard );
      setRoles( filter.roles ? toSelArr( filter.roles ) : [] );
      setTitle( id ? filter.title : '' )
    }
  }, [ id, dataLoading ] );


  const currentUser = getMyData();
  if ( dataLoading ) {
    return <Loading />
  }

  const canCreatePublicFilters = currentUser.role.accessRights.publicFilters;
  const canCreateCustomFilters = currentUser.role.accessRights.customFilters;

  const addFilterFunc = () => {
    setSaving( true );
    if ( id === null || id === undefined ) {
      addFilter( {
          variables: {
            title,
            pub: pub || !canCreateCustomFilters,
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
          addLocalError( err );
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
          addLocalError( err );
        } );
    }
    close();
    setOpened( false );
    setSaving( false );
  }

  return (
    <div className="filter-add-btn">
      <button className="btn-link inner m-l-19" onClick={() => setOpened(!opened)}>
        <i className="far fa-save icon-M"/>
      </button>

      <Modal style={{width: "800px"}} isOpen={opened}>
        <ModalHeader>
          { projectId ? t('addFilterToProject'): t('addGeneralFilter')  }
        </ModalHeader>
        <ModalBody>
          {/* Filter name */}
          <Label>{t('filterTitle')}</Label>
          <Input
            type="text"
            className="from-control m-t-5 m-b-5"
            placeholder={t('filterTitlePlaceholder')}
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
              label = {t('publicFilter')}
              value = { pub || !canCreateCustomFilters }
              blocked = { !canCreateCustomFilters }
              onChange={(e)=> setPub(!pub)}
              />
          }

          {/* ROLES - what role in case of public */}
          { canCreatePublicFilters && ( pub || !canCreateCustomFilters ) &&
            <FormGroup>{/* Roles */}
              <Label className="">{t('roles')}</Label>
              <Select
                placeholder={t('rolesLabel')}
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
                options={toSelArr([
                    {id: 'all', title: roleData.basicRoles.length === roles.length ? t('clear') : t('all') }
                ].concat(roleData.basicRoles))}
                styles={pickSelectStyle()}
                />
            </FormGroup>
          }
          {/* In DASHBOARD - FILTER ONLY */}
            <Checkbox
              className = "m-l-5 m-r-5"
              label = {t('dashboard')}
              disabled = { !global && projectId === null }
              value = { dashboard }
              onChange={(e)=>setDashboard(!dashboard)}
              />

        </ModalBody>
        <ModalFooter>
          <button className="mr-auto btn-link" disabled={saving} onClick={() => setOpened(!opened)}>
            {t('close')}
          </button>

          <button
            className="btn"
            disabled={saving || title === "" || (!global && !dashboard && !projectId)}
            onClick={addFilterFunc}
            >
            {id !== null ? (saving?`${saving}...`:t('saveFilter')) : (saving ? `${t('adding')}...` : t('addFilter') )}
          </button>
        </ModalFooter>
      </Modal>
    </div>
  );
}