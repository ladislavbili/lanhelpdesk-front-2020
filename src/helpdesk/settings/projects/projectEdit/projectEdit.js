import React from 'react';
import Empty from 'components/Empty';
import {
  FormGroup,
  Label,
  Input,
  NavLink,
  NavItem,
  Nav,
  TabContent,
  TabPane,
} from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ck5config from 'configs/components/ck5config';
import {
  toSelArr,
  toSelItem,
} from 'helperFunctions';
import {
  allACLs,
  noDef,
  getEmptyAttributes,
} from 'configs/constants/projects';
import booleanSelects from 'configs/constants/boolSelect';
import {
  noSelect
} from "../components/attributes";
import classnames from 'classnames';
import DeleteReplacement from 'components/deleteReplacement';
import Loading from 'components/loading';
import Switch from "components/switch";
import Radio from "components/radio";

import Attributes from "../components/attributes";
import Tags from '../components/tags';
import Statuses from '../components/statuses';
import Users from "../components/users";
import Groups from '../components/group';
import GroupAdd from '../components/group/groupAdd';
import ProjectAcl from "../components/acl";
import CustomAttributes from "../components/customAttributes";
import ProjectFilters from "../components/projectFilters";
import Attachments from '../components/attachments';
import ProjectErrorDisplay from '../components/errorDisplay';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import axios from 'axios';
import moment from 'moment';
import {
  remapRightsToBackend,
  remapRightsFromBackend,
  getGroupsProblematicAttributes,
  mergeGroupRights,
  mergeGroupAttributeRights,
} from '../helpers';

import {
  REST_URL,
} from 'configs/restAPI';
import {
  GET_PROJECT,
} from '../queries';
let fakeID = -1;

export default function ProjectEdit( props ) {
  //data & queries
  const {
    history,
    match,
    tabId,
    closeModal,
    projectDeleted,
    projectData,
    projectLoading,
    refetch,
    updateProject,
    deleteProjectAttachment,
    deleteProject,
    client,
    companiesData,
    companiesLoading,
    usersData,
    usersLoading,
    taskTypesData,
    taskTypesLoading,
    numberOfTasksData,
    numberOfTasksLoading,
    numberOfTasksError,
    allProjects,
    filteredProjects,
    theOnlyOneLeft,
    currentUser,
    dataLoading,
    id,
    setting,
  } = props;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ lockedRequester, setLockedRequester ] = React.useState( true );
  const [ autoApproved, setAutoApproved ] = React.useState( true );
  const [ hideApproved, setHideApproved ] = React.useState( false );
  const [ archived, setArchived ] = React.useState( false );
  const [ groups, setGroups ] = React.useState( [] );
  const [ attributes, setAttributes ] = React.useState( getEmptyAttributes() );
  const [ userGroups, setUserGroups ] = React.useState( [] );
  const [ companyGroups, setCompanyGroups ] = React.useState( [] );

  const [ addFilters, setAddFilters ] = React.useState( [] );
  const [ updateFilters, setUpdateFilters ] = React.useState( [] );
  const [ deleteFilters, setDeleteFilters ] = React.useState( [] );

  const [ addTags, setAddTags ] = React.useState( [] );
  const [ updateTags, setUpdateTags ] = React.useState( [] );
  const [ deleteTags, setDeleteTags ] = React.useState( [] );

  const [ addStatuses, setAddStatuses ] = React.useState( [] );
  const [ updateStatuses, setUpdateStatuses ] = React.useState( [] );
  const [ deleteStatuses, setDeleteStatuses ] = React.useState( [] );

  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ saving, setSaving ] = React.useState( false );
  const [ openedTab, setOpenedTab ] = React.useState( tabId ? tabId : 'description' );
  const [ editingDescription, setEditingDescription ] = React.useState( false );
  const [ showProjectErrors, setShowProjectErrors ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );

  const [ dataChanged, setDataChanged ] = React.useState( false );

  // sync
  React.useEffect( () => {
    setData();
  }, [ projectLoading, usersLoading, companiesLoading, taskTypesLoading ] );

  React.useEffect( () => {
    setAddTags( [] );
    setUpdateTags( [] );
    setDeleteTags( [] );
    refetch( {
        variables: {
          id
        }
      } )
      .then( setData );
    setDataChanged( false );
  }, [ id ] );

  React.useEffect( () => {
    if ( !dataLoading ) {
      updateDefAssigned();
    }
  }, [ userGroups, companyGroups ] );

  const setData = () => {
    if ( dataLoading ) {
      return;
    }
    //PROJECT
    const project = projectData.project;
    setTitle( project.title );
    setDescription( project.description );
    setLockedRequester( project.lockedRequester );
    setAutoApproved( project.autoApproved );
    setHideApproved( project.hideApproved );
    setArchived( project.archived );

    //ATTRIBUTES
    const attributes = project.projectAttributes;
    const tagsIds = attributes.tags.value.map( v => v.id );
    const users = toSelArr( usersData.basicUsers, 'email' );
    const companies = toSelArr( companiesData.basicCompanies );
    const taskTypes = toSelArr( taskTypesData.taskTypes );
    const statuses = toSelArr( project.statuses );
    setAttributes( {
      assigned: {
        fixed: attributes.assigned.fixed,
        value: attributes.assigned.value.map( user1 => users.find( user2 => user2.id === user1.id ) ),
      },
      company: {
        fixed: attributes.company.fixed,
        value: ( attributes.company.value ? companies.find( company => company.id === attributes.company.value.id ) : null ),
      },
      deadline: {
        fixed: attributes.deadline.fixed,
        value: attributes.deadline.value ? moment( parseInt( attributes.deadline.value ) ) : null,
      },
      overtime: {
        fixed: attributes.overtime.fixed,
        value: attributes.overtime.value === null ? null : [ ...booleanSelects, noSelect ].find( ( selectVal ) => selectVal.value === attributes.overtime.value ),
      },
      pausal: {
        fixed: attributes.pausal.fixed,
        value: attributes.pausal.value === null ? null : [ ...booleanSelects, noSelect ].find( ( selectVal ) => selectVal.value === attributes.pausal.value ),
      },
      requester: {
        fixed: attributes.requester.fixed,
        value: attributes.requester.value,
        value: attributes.requester.value ? users.find( user => user.id === attributes.requester.value.id ) : null,
      },
      startsAt: {
        fixed: attributes.startsAt.fixed,
        value: attributes.startsAt.value ? moment( parseInt( attributes.startsAt.value ) ) : null,
      },
      status: {
        fixed: attributes.status.fixed,
        value: attributes.status.value ? statuses.find( status => status.id === attributes.status.value.id ) : null,
      },
      tags: {
        fixed: attributes.tags.fixed,
        value: toSelArr( getAllTags() )
          .filter( t => tagsIds.includes( t.id ) ),
      },
      taskType: {
        fixed: attributes.taskType.fixed,
        value: attributes.taskType.value,
        value: ( attributes.taskType.value ? taskTypes.find( type => type.id === attributes.taskType.value.id ) : null ),
      },
    } )
    setDataChanged( false );
    //groups
    const {
      groups,
      userGroups,
      companyGroups,
    } = getDefaultGroupData();
    setGroups( groups );
    setUserGroups( userGroups );
    setCompanyGroups( companyGroups );
  }

  const updateDefAssigned = () => {
    const companyIds = companyGroups.filter( ( companyGroup ) => companyGroup.group.attributeRights.assigned.write )
      .map( ( companyGroup ) => companyGroup.company.id );
    const assignableUsers = [
      ...userGroups.filter( ( userGroup ) => userGroup.group.attributeRights.assigned.write )
      .map( ( userGroup ) => userGroup.user ),
      ...toSelArr( usersData.basicUsers, 'email' )
      .filter( ( user ) => companyIds.includes( user.company.id ) )
    ];
    setAttributes( {
      ...attributes,
      assigned: {
        ...attributes.assigned,
        value: attributes.assigned.value.filter( ( user1 ) => assignableUsers.some( ( user2 ) => user1.id === user2.id ) )
      }
    } )
  }

  const getAllTags = () => {
    let allTags = projectData.project.tags.filter( ( tag ) => !deleteTags.includes( tag.id ) );
    updateTags.map( ( tagChange ) => {
      let index = allTags.findIndex( ( tag ) => tag.id === tagChange.id );
      if ( index !== -1 ) {
        allTags[ index ] = {
          ...allTags[ index ],
          ...tagChange
        };
      }
    } );
    return allTags.concat( addTags );
  }

  const getAllFilters = () => {
    let allFilters = projectData.project.projectFilters.filter( ( projectFilter ) => !deleteFilters.includes( projectFilter.id ) )
      .map( ( filterData ) => {
        return {
          ...filterData,
          groups: filterData.groups.map( ( group ) => group.id ),
          filter: {
            ...filterData.filter,
            assignedTos: filterData.filter.assignedTos.map( ( user ) => user.id ),
            companies: filterData.filter.companies.map( ( company ) => company.id ),
            requesters: filterData.filter.requesters.map( ( user ) => user.id ),
            statuses: filterData.filter.statuses.map( ( status ) => status.id ),
            tags: filterData.filter.tags.map( ( tag ) => tag.id ),
            taskTypes: filterData.filter.taskTypes.map( ( taskType ) => taskType.id ),
          }
        }
      } );
    updateFilters.map( ( filterChange ) => {
      let index = allFilters.findIndex( ( projectFilter ) => projectFilter.id === filterChange.id );
      if ( index !== -1 ) {
        allFilters[ index ] = {
          ...allFilters[ index ],
          ...filterChange
        };
      }
    } );
    return allFilters.concat( addFilters );
  }

  const getDefaultGroupData = () => {
    const project = projectData.project;
    const users = toSelArr( usersData.basicUsers, 'email' );
    const companies = toSelArr( companiesData.basicCompanies );
    const groups = toSelArr( project.groups.map( ( group ) => remapRightsFromBackend( group ) ) );
    const userGroups = project.groups.reduce( ( acc, cur ) => {
      let group = groups.find( ( group ) => group.id === cur.id );
      let userGroups = cur.users.map( ( user1 ) => ( {
        user: users.find( ( user2 ) => user2.id === user1.id ),
        group,
      } ) )
      return [ ...acc, ...userGroups ]
    }, [] )

    const companyGroups = project.groups.reduce( ( acc, cur ) => {
      let group = groups.find( ( group ) => group.id === cur.id );
      let companyGroups = cur.companies.map( ( company1 ) => ( {
        company: companies.find( ( company2 ) => company2.id === company1.id ),
        group,
      } ) )
      return [ ...acc, ...companyGroups ]
    }, [] )

    return {
      groups,
      userGroups,
      companyGroups
    }
  }

  if ( dataLoading ) {
    return <Loading />
  }
  // functions
  const getAllStatuses = () => {
    let allStatuses = projectData.project.statuses.filter( ( status ) => !deleteStatuses.includes( status.id ) );
    updateStatuses.map( ( statusChange ) => {
      let index = allStatuses.findIndex( ( status ) => status.id === statusChange.id );
      if ( index !== -1 ) {
        allStatuses[ index ] = {
          ...allStatuses[ index ],
          ...statusChange
        };
      }
    } );
    return allStatuses.concat( addStatuses );
  }

  const filterGroupChanges = () => {
    const {
      groups: originalGroups,
    } = getDefaultGroupData();
    const addGroups = groups.filter( ( group ) => group.id < 0 )
      .map( ( group ) => remapRightsToBackend( group ) );
    const updateGroups = groups.filter( ( group ) => group.id > -1 )
      .filter( ( group ) => {
        const originalGroup = originalGroups.find( ( orGroup ) => orGroup.id === group.id );
        const rights = group.rights;
        const originalRights = originalGroup.rights;
        const attributeRights = group.attributeRights;
        const originalAttributeRights = originalGroup.attributeRights;
        return (
          group.title !== originalGroup.title ||
          group.description !== originalGroup.description ||
          group.order !== originalGroup.order ||
          (
            allACLs.filter( ( acl ) => !acl.separator && !acl.header && !acl.fake )
            .some( ( acl ) => {
              if ( acl.both ) {
                return ( rights[ acl.id ].read !== originalRights[ acl.id ].read || rights[ acl.id ].write !== originalRights[ acl.id ].write )
              } else {
                return rights[ acl.id ] !== originalRights[ acl.id ];
              }
            } )
          ) || [ 'assigned', 'company', 'deadline', 'overtime', 'pausal', 'requester', 'startsAt', 'status', 'tags', 'taskType', 'repeat' ].some( ( right ) => (
            attributeRights[ right ].required !== originalAttributeRights[ right ].required ||
            attributeRights[ right ].add !== originalAttributeRights[ right ].add ||
            attributeRights[ right ].view !== originalAttributeRights[ right ].view ||
            attributeRights[ right ].edit !== originalAttributeRights[ right ].edit
          ) )
        )
      } )
      .map( ( group ) => remapRightsToBackend( group ) );
    const deleteGroups = originalGroups.filter( ( orGroup ) => !groups.some( ( group ) => group.id === orGroup.id ) )
      .map( ( group ) => group.id );
    return {
      addGroups,
      updateGroups,
      deleteGroups
    }
  }

  const compactUserGroups = () => {
    let compactUserGroups = [];
    userGroups.forEach( ( userGroup ) => {
      const index = compactUserGroups.findIndex( ( compactUserGroup ) => compactUserGroup.groupId === userGroup.group.id );
      if ( index === -1 ) {
        compactUserGroups.push( {
          groupId: userGroup.group.id,
          userIds: [ userGroup.user.id ]
        } );
      } else {
        compactUserGroups[ index ].userIds.push( userGroup.user.id );
      }
    } )
    groups.filter( ( group ) => group.id > -1 )
      .forEach( ( group ) => {
        if ( !compactUserGroups.some( ( userGroup ) => userGroup.groupId === group.id ) ) {
          compactUserGroups.push( {
            groupId: group.id,
            userIds: []
          } );
        }
      } )
    return compactUserGroups;
  }

  const compactCompanyGroups = () => {
    let compactCompanyGroups = [];
    companyGroups.forEach( ( companyGroup ) => {
      const index = compactCompanyGroups.findIndex( ( compactCompanyGroup ) => compactCompanyGroup.groupId === companyGroup.group.id );
      if ( index === -1 ) {
        compactCompanyGroups.push( {
          groupId: companyGroup.group.id,
          companyIds: [ companyGroup.company.id ]
        } );
      } else {
        compactCompanyGroups[ index ].companyIds.push( companyGroup.company.id );
      }
    } )
    groups.filter( ( group ) => group.id > -1 )
      .forEach( ( group ) => {
        if ( !compactCompanyGroups.some( ( companyGroup ) => companyGroup.groupId === group.id ) ) {
          compactCompanyGroups.push( {
            groupId: group.id,
            companyIds: []
          } );
        }
      } )
    return compactCompanyGroups;
  }

  const updateProjectFunc = () => {
    setSaving( true );

    let projectAttributes = {
      assigned: {
        ...attributes.assigned,
        value: attributes.assigned.value.map( user => user.id )
      },
      company: {
        ...attributes.company,
        value: attributes.company.value ? attributes.company.value.id : null,
      },
      deadline: {
        ...attributes.deadline,
        value: attributes.deadline.value ? attributes.deadline.value.valueOf()
          .toString() : null,
      },
      overtime: {
        ...attributes.overtime,
        value: attributes.overtime.value ? attributes.overtime.value.value : null,
      },
      pausal: {
        ...attributes.pausal,
        value: attributes.pausal.value ? attributes.pausal.value.value : null,
      },
      requester: {
        ...attributes.requester,
        value: ( attributes.requester.value ? attributes.requester.value.id : null )
      },
      startsAt: {
        ...attributes.startsAt,
        value: attributes.startsAt.value ? attributes.startsAt.value.valueOf()
          .toString() : null,
      },
      status: {
        ...attributes.status,
        value: ( attributes.status.value ? attributes.status.value.id : null )
      },
      tags: {
        ...attributes.tags,
        value: attributes.tags.value.map( tag => tag.id )
      },
      taskType: {
        ...attributes.taskType,
        value: ( attributes.taskType.value ? attributes.taskType.value.id : null )
      },
    }
    updateProject( {
        variables: {
          id,
          title,
          description,
          lockedRequester,
          autoApproved,
          hideApproved,
          archived,
          projectAttributes,
          addTags,
          updateTags,
          deleteTags,
          deleteStatuses,
          updateStatuses,
          addStatuses,
          addFilters,
          updateFilters,
          deleteFilters,
          userGroups: compactUserGroups(),
          companyGroups: compactCompanyGroups(),
          ...filterGroupChanges(),
        }
      } )
      .then( ( response ) => {
        setAddTags( [] );
        setUpdateTags( [] );
        setDeleteTags( [] );
        if ( closeModal ) {
          let myUserGroup1 = userGroups.find( ( userGroup ) => userGroup.user.id === currentUser.id );
          let myUserGroup2 = companyGroups.find( ( companyGroup ) => companyGroup.company.id === currentUser.company.id );
          let myRights = remapRightsToBackend( groups.find( ( group ) => group.admin && group.def ) )
            .rights;
          let myAttributeRights = remapRightsToBackend( groups.find( ( group ) => group.admin && group.def ) )
            .attributeRights;
          if ( myUserGroup1 !== undefined && myUserGroup2 !== undefined ) {
            myRights = mergeGroupRights(
              remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup1.group.id ) )
              .rights,
              remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup2.group.id ) )
              .rights
            );
            myAttributeRights = mergeGroupAttributeRights(
              remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup1.group.id ) )
              .attributeRights,
              remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup2.group.id ) )
              .attributeRights
            );
          } else if ( myUserGroup1 !== undefined ) {
            myRights = remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup1.group.id ) )
              .rights;
            myAttributeRights = remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup1.group.id ) )
              .attributeRights;
          } else if ( myUserGroup2 !== undefined ) {
            myRights = remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup2.group.id ) )
              .rights;
            myAttributeRights = remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup2.group.id ) )
              .attributeRights;
          }

          if ( myUserGroup1 || myUserGroup2 ) {
            closeModal( response.data.updateProject, myRights, myAttributeRights );
          } else {
            closeModal( null, null, null );
          }
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
    setDataChanged( false );
  };

  const deleteProjectFunc = ( replacement ) => {
    setDeleteOpen( false );
    if ( window.confirm( "Deleting a project deletes all tasks in the project. Do you still want to delete the project?" ) ) {
      deleteProject( {
          variables: {
            id,
            newId: parseInt( replacement.id ),
          }
        } )
        .then( ( response ) => {
          if ( closeModal ) {
            projectDeleted();
            closeModal( null, null );
          } else {
            history.push( '/helpdesk/settings/projects/add' );
          }
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  const fixedNotDef = () => {
    return [ 'deadline', 'overtime', 'pausal', 'startsAt', 'status', 'taskType' ].some( ( attr ) => attributes[ attr ].fixed && attributes[ attr ].value === null );
  }

  const addAttachments = ( attachments ) => {
    const formData = new FormData();
    attachments.forEach( ( file ) => formData.append( `file`, file ) );
    formData.append( "token", `Bearer ${sessionStorage.getItem('acctok')}` );
    formData.append( "projectId", id );
    axios.post( `${REST_URL}/upload-project-attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      } )
      .then( ( response ) => {
        const newAttachments = response.data.attachments.map( ( attachment ) => ( {
          ...attachment,
          __typename: "ProjectAttachment",
        } ) );
        const oldProject = client.readQuery( {
            query: GET_PROJECT,
            variables: {
              id
            }
          } )
          .project;
        client.writeQuery( {
          query: GET_PROJECT,
          variables: {
            id
          },
          data: {
            project: {
              ...oldProject,
              attachments: [ ...oldProject.attachments, ...newAttachments ]
            }
          }
        } )
      } )
  }

  const removeAttachment = ( attachment ) => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteProjectAttachment( {
          variables: {
            id: attachment.id,
          }
        } )
        .then( ( response ) => {
          const oldProject = client.readQuery( {
              query: GET_PROJECT,
              variables: {
                id
              }
            } )
            .project;
          client.writeQuery( {
            query: GET_PROJECT,
            variables: {
              id
            },
            data: {
              project: {
                ...oldProject,
                attachments: oldProject.attachments.filter( ( projectAttachment ) => projectAttachment.id !== attachment.id )
              }
            }
          } )
        } )
    }
  }

  const cannotSave = (
    saving ||
    title === "" ||
    fixedNotDef() ||
    addTags.some( ( tag ) => (
      tag.title.length === 0 ||
      !tag.color.includes( '#' ) ||
      isNaN( parseInt( tag.order ) )
    ) ) ||
    updateTags.some( ( tag ) => (
      ( tag.title !== undefined && tag.title.length === 0 ) ||
      ( tag.color !== undefined && !tag.color.includes( '#' ) ) ||
      ( tag.order !== undefined && isNaN( parseInt( tag.order ) ) )
    ) ) ||
    !getAllStatuses()
    .some( ( status ) => status.action === 'IsNew' ) ||
    !getAllStatuses()
    .some( ( status ) => status.action === 'CloseDate' ) ||
    !groups.some( ( group ) => (
      group.rights.projectRead &&
      group.rights.projectWrite &&
      (
        userGroups.some( ( userGroup ) => userGroup.group.id === group.id ) ||
        companyGroups.some( ( companyGroup ) => companyGroup.group.id === group.id )
      )
    ) ) ||
    getAllFilters()
    .some( ( filter ) => filter.active && getGroupsProblematicAttributes( groups, filter )
      .length !== 0 )
  )

  const myRights = currentUser.role.accessRights.projects ?
    projectData.project.groups.find( ( group ) => group.def && group.admin )
    .rights :
    projectData.project.groups.find( ( group ) => group.users.some( ( user ) => user.id === currentUser.id ) )
    .rights;
  const allTags = getAllTags();
  const allStatuses = getAllStatuses();

  const renderAttachments = () => {
    return (
      <Attachments
        disabled={!myRights.projectWrite}
        projectId={id}
        type="project"
        top={false}
        attachments={projectData.project.attachments}
        addAttachments={addAttachments}
        removeAttachment={removeAttachment}
        />
    )
  }

  const renderDescription = () => {
    let RenderDescription = null;
    if ( !myRights.projectWrite ) {
      if ( description.length !== 0 ) {
        RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
      } else {
        RenderDescription = <div className="task-edit-popis">Projekt nemá popis</div>
      }
    } else {
      if ( editingDescription ) {
        RenderDescription = <div>
          <CKEditor
            editor={ ClassicEditor }
            data={description}
            onInit={(editor) => {
              editor.editing.view.document.on( 'keydown', ( evt, data ) => {
                if ( data.keyCode === 27 ) {
                  setEditingDescription(false);
                  data.preventDefault();
                  evt.stop();
                }
              });
            }}
            onChange={(e,editor)=>{
              setDescription(editor.getData());
              setDataChanged( true );
            }}
            config={ck5config}
            />
        </div>
      } else {
        if ( description.length !== 0 ) {
          RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
        } else {
          RenderDescription = <div className="task-edit-popis">Úloha nemá popis</div>
        }
      }
    }
    return (
      <div className="m-b-15">
        <div className="row" style={{alignItems: "baseline"}}>
          <Label>
            Popis
          </Label>
          { myRights.projectWrite &&
            <button
              className="btn-link btn-distance m-l-5"
              style={{height: "20px"}}
              onClick={()=>{
                setEditingDescription(!editingDescription);
              }}
              >
              <i className={`fa fa-${!editingDescription ? 'pen' : 'save' }`} />
              { !editingDescription ? 'edit' : 'save' }
            </button>
          }
          { myRights.projectWrite &&
            <label htmlFor={`upload-project-attachment-${id}`} className="btn-link btn-distance m-l-0 clickable" >
              <i className="fa fa-plus" />
              Attachment
            </label>
          }
        </div>
        <div className="form-section-rest">
          {RenderDescription}
          {renderAttachments()}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        className={ classnames(
          "p-20",
          "scroll-visible",
          "fit-with-header",
        )}
        >

        <h2 className="m-b-17" >
          Edit project
        </h2>

        <Nav tabs className="no-border m-b-25">
          <NavItem>
            <NavLink
              className={classnames({ active: openedTab === 'description'}, "clickable", "")}
              onClick={() => setOpenedTab('description') }
              >
              Description
            </NavLink>
          </NavItem>
          { myRights.projectWrite &&
            <Empty>
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: openedTab === 'statuses' }, "clickable", "")}
                  onClick={() => setOpenedTab('statuses') }
                  >
                  Statuses
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: openedTab === 'tags' }, "clickable", "")}
                  onClick={() => setOpenedTab('tags') }
                  >
                  Tags
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: openedTab === 'groups' }, "clickable", "")}
                  onClick={() => setOpenedTab('groups') }
                  >
                  Groups
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: openedTab === 'accRights' }, "clickable", "")}
                  onClick={() => setOpenedTab('accRights') }
                  >
                  Group rights
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: openedTab === 'users' }, "clickable", "")}
                  onClick={() => setOpenedTab('users') }
                  >
                  Users
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: openedTab === 'attributes' }, "clickable", "")}
                  onClick={() => setOpenedTab('attributes') }
                  >
                  Attributes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: openedTab === 'custom' }, "clickable", "")}
                  onClick={() => setOpenedTab('custom') }
                  >
                  Custom attributes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: openedTab === 'projectFilters' }, "clickable", "")}
                  onClick={() => setOpenedTab('projectFilters') }
                  >
                  Project filters
                </NavLink>
              </NavItem>
            </Empty>
          }
        </Nav>

        <TabContent activeTab={openedTab}>

          <TabPane tabId={'description'}>
            { myRights.projectRead &&
              <Empty>
                <FormGroup className="m-b-25">
                  <Label for="name">Project name <span className="warning-big">*</span></Label>
                  <Input
                    disabled={!myRights.projectWrite}
                    type="text"
                    className="medium-input m-t-15"
                    id="name"
                    placeholder="Enter project name"
                    value={title}
                    onChange={(e)=>{
                      setTitle(e.target.value);
                      setDataChanged( true );
                    }}
                    />
                </FormGroup>

                { renderDescription() }

                <Switch
                  value={archived}
                  disabled={!myRights.projectWrite}
                  onChange={() => {
                    setArchived(!archived)
                    setDataChanged( true );
                  }}
                  label="Archived"
                  labelClassName="text-normal font-normal"
                  simpleSwitch
                  />
                <Radio
                  options={ [
                    {
                      key: 'autoApprovedOn',
                      value: autoApproved,
                      label: 'Invoice On',
                    },
                    {
                      key: 'autoApprovedOff',
                      value: !autoApproved,
                      label: 'Invoice Off',
                    },
                  ] }
                  name="autoApproved"
                  disabled={ !myRights.projectWrite }
                  onChange={ () => {
                    setAutoApproved(!autoApproved);
                    setDataChanged( true );
                  } }
                  />

                <Switch
                  value={hideApproved}
                  onChange={() => {
                    setHideApproved(!hideApproved);
                    setDataChanged( true );
                  }}
                  disabled={!myRights.projectWrite}
                  label="Don't show invoice"
                  labelClassName="text-normal font-normal"
                  simpleSwitch
                  />

                { myRights.projectWrite &&
                  <button className="btn btn-full-red m-l-5" disabled={saving || theOnlyOneLeft} onClick={() => setDeleteOpen(true)}>
                    DELETE PROJECT
                  </button>
                }
              </Empty>
            }
          </TabPane>
          { myRights.projectWrite &&
            <Empty>
              <TabPane tabId={'statuses'}>
                <Statuses
                  statuses={allStatuses}
                  addStatus={(newStatus) => {
                    setAddStatuses([ ...addStatuses, {...newStatus, id: fakeID -- } ]);
                    setDataChanged( true );
                  }}
                  deleteStatus={(id) => {
                    if(id > -1){
                      setUpdateStatuses(updateStatuses.filter((status) => status.id !== id ));
                      setDeleteStatuses([ ...deleteStatuses, id ]);
                    }else{
                      setAddStatuses(addStatuses.filter((status) => status.id !== id ));
                    }
                    setDataChanged( true );
                  }}
                  updateStatus={(newStatus) => {
                    if(newStatus.id > -1){
                      let newStatuses = [...updateStatuses];
                      let index = newStatuses.findIndex((status) => status.id === newStatus.id );
                      if(index === -1){
                        newStatuses = newStatuses.concat(newStatus);
                      }else{
                        newStatuses[index] = { ...newStatuses[index], ...newStatus }
                      }
                      setUpdateStatuses(newStatuses);
                    }else{
                      let newStatuses = [...addStatuses];
                      let index = newStatuses.findIndex((status) => status.id === newStatus.id );
                      newStatuses[index] = { ...newStatuses[index], ...newStatus }
                      setAddStatuses(newStatuses);
                    }
                    setDataChanged( true );
                  }}
                  />
              </TabPane>
              <TabPane tabId={'tags'}>
                <Tags
                  tags={allTags}
                  addTag={(newTag) => {
                    setAddTags([ ...addTags, {...newTag, id: fakeID -- } ]);
                    setDataChanged( true );
                  }}
                  deleteTag={(id) => {
                    if(id > -1){
                      setUpdateTags(updateTags.filter((tag) => tag.id !== id ));
                      setDeleteTags([ ...deleteTags, id ]);
                    }else{
                      setAddTags(addTags.filter((tag) => tag.id !== id ));
                    }
                    setDataChanged( true );
                  }}
                  updateTag={(newTag) => {
                    if(newTag.id > -1){
                      let newTags = [...updateTags];
                      let index = newTags.findIndex((tag) => tag.id === newTag.id );
                      if(index === -1){
                        newTags = newTags.concat(newTag);
                      }else{
                        newTags[index] = { ...newTags[index], ...newTag }
                      }
                      setUpdateTags(newTags);
                    }else{
                      let newTags = [...addTags];
                      let index = newTags.findIndex((tag) => tag.id === newTag.id );
                      newTags[index] = { ...newTags[index], ...newTag }
                      setAddTags(newTags);
                    }
                    setDataChanged( true );
                  }}
                  />
              </TabPane>
              <TabPane tabId={'groups'}>
                <Groups
                  groups={groups}
                  addGroup={(newGroup) => {
                    setGroups([...groups, newGroup ]);
                    setDataChanged( true );
                  }}
                  updateGroup={(newGroup) => {
                    let newGroups = [...groups];
                    let index = newGroups.findIndex((group) => group.id === newGroup.id );
                    newGroups[index] = { ...newGroups[index], ...newGroup }
                    setGroups(newGroups);
                    setUserGroups(userGroups.map((userGroup) => (
                      (userGroup.group.id !== newGroup.id) ?
                      userGroup :
                      ({...userGroup, group: {...userGroup.group,...newGroup}})
                    ) ));
                    setCompanyGroups(companyGroups.map((companyGroup) => (
                      (companyGroup.group.id !== newGroup.id) ?
                      companyGroup :
                      ({...companyGroup, group: {...companyGroup.group,...newGroup}})
                    ) ));
                    setDataChanged( true );
                  }}
                  deleteGroup={(id) => {
                    setGroups( groups.filter((group) => group.id !== id ) );
                    setUserGroups( userGroups.filter((userGroup) => userGroup.group.id !== id ) );
                    setCompanyGroups( companyGroups.filter((companyGroup) => companyGroup.group.id !== id ) );
                    setDataChanged( true );
                  }}
                  />
              </TabPane>
              <TabPane tabId={'accRights'}>
                <ProjectAcl
                  groups={ groups }
                  updateGroupRight={ (groupID, acl, newVal) => {
                    let newGroups = [...groups];
                    let index = newGroups.findIndex((group) => group.id === groupID );
                    newGroups[index]['rights'][acl] = newVal;
                    setUserGroups(userGroups.map((userGroup) => {
                      if(userGroup.group.id === groupID){
                        return {...userGroup, group: toSelItem(newGroups[index])  }
                      }else{
                        return userGroup;
                      }
                    } ));
                    setCompanyGroups(companyGroups.map((companyGroup) => {
                      if(companyGroup.group.id === groupID){
                        return {...companyGroup, group: toSelItem(newGroups[index])  }
                      }else{
                        return companyGroup;
                      }
                    } ));
                    setGroups(newGroups);
                    setDataChanged( true );
                  }}
                  />
              </TabPane>
              <TabPane tabId={'users'}>
                <Users
                  users={(usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))}
                  userGroups={ userGroups }
                  companies={ companiesLoading ? [] : toSelArr( companiesData.basicCompanies ) }
                  companyGroups={ companyGroups }
                  groups={ toSelArr(groups) }
                  lockedRequester={ lockedRequester }
                  setLockedRequester={(lockedRequester) => {
                    setLockedRequester(lockedRequester);
                    setDataChanged( true );
                  }}
                  addUserRight={ (userGroup) => {
                    setUserGroups([...userGroups, userGroup]);
                    setDataChanged( true );
                  }}
                  deleteUserRight={ (userGroup) => {
                    setUserGroups(userGroups.filter((oldGroup) => oldGroup.user.id !== userGroup.user.id ));
                    setDataChanged( true );
                  }}
                  updateUserRight={ (userGroup) => {
                    let newUserGroups = [...userGroups];
                    let index = newUserGroups.findIndex((userG) => userG.user.id === userGroup.user.id );
                    newUserGroups[index] = { ...newUserGroups[index], ...userGroup }
                    setUserGroups(newUserGroups);
                    setDataChanged( true );
                  }}
                  addCompanyRight={ (companyGroup) => {
                    setCompanyGroups([...companyGroups, companyGroup]);
                    setDataChanged( true );
                  }}
                  deleteCompanyRight={ (companyGroup) => {
                    setCompanyGroups(companyGroups.filter((oldGroup) => oldGroup.company.id !== companyGroup.company.id ));
                    setDataChanged( true );
                  }}
                  updateCompanyRight={ (companyGroup) => {
                    let newCompanyGroups = [...companyGroups];
                    let index = newCompanyGroups.findIndex((companyG) => companyG.company.id === companyGroup.company.id );
                    newCompanyGroups[index] = { ...newCompanyGroups[index], ...companyGroup }
                    setCompanyGroups(newCompanyGroups);
                    setDataChanged( true );
                  }}
                  />
              </TabPane>
              <TabPane tabId={'attributes'}>
                <Attributes
                  statuses={toSelArr(allStatuses)}
                  companies={(companiesLoading ? [] : toSelArr(companiesData.basicCompanies))}
                  users={
                    lockedRequester ?
                    userGroups.map( (userGroup) => userGroup.user ) :
                    (usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))
                  }
                  assignableUsers={[
                    ...userGroups.filter((userGroup) => userGroup.group.attributeRights.assigned.write ).map( (userGroup) => userGroup.user ),
                    ...companyGroups.reduce((acc, companyGroup) => {
                      return [...acc, ...(usersLoading ? [] : toSelArr(usersData.basicUsers, 'email')).filter((user) => user.company.id === companyGroup.company.id ) ]
                    },[])
                  ]}
                  allTags={toSelArr(allTags)}
                  taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
                  groups={groups}
                  setGroups={setGroups}
                  attributes={attributes}
                  setAttributes={setAttributes}
                  />
              </TabPane>
              <TabPane tabId={'custom'}>
                <CustomAttributes
                  disabled={false}
                  customAttributes={customAttributes}
                  addCustomAttribute={(newCustomAttribute) => {
                    setCustomAttributes([...customAttributes, {...newCustomAttribute, id: fakeID-- }]);
                    setDataChanged( true );
                  }}
                  updateCustomAttribute={(changedCustomAttribute) => {
                    let newCustomAttributes = [...customAttributes];
                    let index = newCustomAttributes.findIndex((attribute) => attribute.id === changedCustomAttribute.id);
                    newCustomAttributes[index] = {...newCustomAttributes[index],...changedCustomAttribute};
                    setCustomAttributes(newCustomAttributes);
                    setDataChanged( true );
                  }}
                  deleteCustomAttribute={(id) => {
                    setCustomAttributes(customAttributes.filter((customAttribute) => customAttribute.id !== id ));
                    setDataChanged( true );
                  }}
                  />
              </TabPane>
              <TabPane tabId={'projectFilters'}>
                <ProjectFilters
                  groups={groups}
                  statuses={allStatuses}
                  filters={getAllFilters()}
                  addFilter={(newFilter) => {
                    setAddFilters([ ...addFilters, {...newFilter, id: fakeID -- } ]);
                    setDataChanged( true );
                  }}
                  deleteFilter={(id) => {
                    if(id > -1){
                      setUpdateFilters(updateFilters.filter((filter) => filter.id !== id ));
                      setDeleteFilters([ ...deleteFilters, id ]);
                    }else{
                      setAddFilters(addFilters.filter((filter) => filter.id !== id ));
                    }
                    setDataChanged( true );
                  }}
                  updateFilter={(newFilter) => {
                    if(newFilter.id > -1){
                      let newFilters = [...updateFilters];
                      let index = newFilters.findIndex((filter) => filter.id === newFilter.id );
                      if(index === -1){
                        newFilters = newFilters.concat(newFilter);
                      }else{
                        newFilters[index] = { ...newFilters[index], ...newFilter }
                      }
                      setUpdateFilters(newFilters);
                    }else{
                      let newFilters = [...addFilters];
                      let index = newFilters.findIndex((filter) => filter.id === newFilter.id );
                      newFilters[index] = { ...newFilters[index], ...newFilter }
                      setAddFilters(newFilters);
                    }
                    setDataChanged( true );
                  }}
                  />
              </TabPane>
            </Empty>
          }
        </TabContent>

        <div className="form-buttons-row">
          { !numberOfTasksLoading && !numberOfTasksError &&
            <div className="ml-auto center-hor p-r-5">
              { `This project includes ${numberOfTasksData.getNumberOfTasks} tasks.` }
            </div>
          }

          { myRights.projectWrite &&
            <button
              className={classnames(
                {
                  'ml-auto': false,
                }
                ,"btn"
              )}
              disabled={showProjectErrors && cannotSave}
              onClick={() => {
                if(cannotSave){
                  setShowProjectErrors(true);
                  return;
                }else{
                  updateProjectFunc();
                }
              }}
              >
              {(saving?'Saving...':'Save project')}
            </button>
          }
        </div>
        { showProjectErrors &&
          <ProjectErrorDisplay
            attributes={attributes}
            title={title}
            allTags={getAllTags()}
            allStatuses={getAllStatuses()}
            groups={groups}
            userGroups={userGroups}
            filters={getAllFilters()}
            />
        }
        <DeleteReplacement
          isOpen={deleteOpen}
          label="project"
          options={filteredProjects}
          close={()=>setDeleteOpen(false)}
          finishDelete={deleteProjectFunc}
          />
      </div>
    </div>
  );
}