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
  defList,
  defBool,
  defItem,
  allACLs,
  backendCleanRights,
  noDef,
} from 'configs/constants/projects';
import classnames from 'classnames';
import Checkbox from 'components/checkbox';
import DeleteReplacement from 'components/deleteReplacement';
import Loading from 'components/loading';

import ProjectDefaultValues from "../components/defaultValues";
import Tags from '../components/tags';
import Statuses from '../components/statuses';
import UserGroups from "../components/userGroups";
import Groups from '../components/group/groupAdd';
import ProjectAcl from "../components/acl";
import CustomAttributes from "../components/customAttributes";
import ACLErrors from '../components/aclErrors';
import Attachments from '../components/attachments';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import axios from 'axios';
import {
  REST_URL,
} from 'configs/restAPI';
import {
  remapRightsToBackend,
  remapRightsFromBackend
} from '../helpers';

import {
  GET_PROJECT,
} from '../queries';
let fakeID = -1;

export default function ProjectEdit( props ) {
  //data & queries
  const {
    history,
    match,
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
  const [ groups, setGroups ] = React.useState( [] );
  const [ userGroups, setUserGroups ] = React.useState( [] );
  const [ addTags, setAddTags ] = React.useState( [] );
  const [ updateTags, setUpdateTags ] = React.useState( [] );
  const [ deleteTags, setDeleteTags ] = React.useState( [] );

  const [ assignedTo, setAssignedTo ] = React.useState( defList( noDef.assignedTo.required ) );
  const [ company, setCompany ] = React.useState( defItem( noDef.company.required ) );
  const [ overtime, setOvertime ] = React.useState( defBool( noDef.overtime.required ) );
  const [ pausal, setPausal ] = React.useState( defBool( noDef.pausal.required ) );
  const [ requester, setRequester ] = React.useState( defItem( noDef.requester.required ) );
  const [ type, setType ] = React.useState( defItem( noDef.type.required ) );
  const [ status, setStatus ] = React.useState( defItem( noDef.status.required ) );
  const [ defTag, setDefTag ] = React.useState( defList( noDef.tag.required ) );

  const [ addStatuses, setAddStatuses ] = React.useState( [] );
  const [ updateStatuses, setUpdateStatuses ] = React.useState( [] );
  const [ deleteStatuses, setDeleteStatuses ] = React.useState( [] );

  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ saving, setSaving ] = React.useState( false );
  const [ openedTab, setOpenedTab ] = React.useState( "description" );
  const [ editingDescription, setEditingDescription ] = React.useState( false );
  const [ addTaskErrors, setAddTaskErrors ] = React.useState( false );
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
  }, [ userGroups ] );

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

    //STATUS
    let newStatus = {
      def: true,
      fixed: project.def.status.fixed,
      required: true,
      value: ( project.def.status.value ? project.statuses.find( c => c.id === project.def.status.value.id ) : null )
    };
    setStatus( newStatus );
    setDataChanged( false );

    let newOvertime = {
      def: true,
      fixed: project.def.overtime.fixed,
      required: true,
      value: ( project.def.overtime.value ? {
        value: true,
        label: 'Yes'
      } : {
        value: false,
        label: 'No'
      } )
    };
    setOvertime( newOvertime );

    let newPausal = {
      def: true,
      fixed: project.def.pausal.fixed,
      required: true,
      value: ( project.def.pausal.value ? {
        value: true,
        label: 'Yes'
      } : {
        value: false,
        label: 'No'
      } )
    };
    setPausal( newPausal );

    //TAGS
    let tags = toSelArr( getAllTags() );
    let tagIds = project.def.tag.value.map( v => v.id );
    let newValue = tags.filter( t => tagIds.includes( t.id ) );
    let newDefTag = {
      def: project.def.tag.def || project.def.tag.required,
      fixed: project.def.tag.fixed,
      required: project.def.tag.required,
      value: newValue
    };
    setDefTag( newDefTag );
    setDataChanged( false );

    //USERS
    let users = toSelArr( usersData.basicUsers, 'email' );
    let newAssignedTo = {
      def: true,
      fixed: project.def.assignedTo.fixed,
      required: true,
      value: project.def.assignedTo.value.map( user => users.find( u => u.id === user.id ) )
    };
    setAssignedTo( newAssignedTo );
    let newRequester = {
      def: project.def.requester.def || project.def.requester.required,
      fixed: project.def.requester.fixed,
      required: project.def.requester.required,
      value: ( project.def.requester.value ? users.find( u => u.id === project.def.requester.value.id ) : null )
    };
    setRequester( newRequester );
    const {
      groups,
      userGroups
    } = getDefaultGroupData();
    setGroups( groups );
    setUserGroups( userGroups );
    setDataChanged( false );

    //COMPANY
    let companies = toSelArr( companiesData.basicCompanies );
    let newCompany = {
      def: true,
      fixed: project.def.company.fixed,
      required: true,
      value: ( project.def.company.value ? companies.find( c => c.id === project.def.company.value.id ) : null )
    };
    setCompany( newCompany );

    //TASK TYPE
    let taskTypes = toSelArr( taskTypesData.taskTypes );
    let newType = {
      def: project.def.type.def || project.def.type.required,
      fixed: project.def.type.fixed,
      required: project.def.type.required,
      value: ( project.def.type.value ? taskTypes.find( type => type.id === project.def.type.value.id ) : null )
    };
    setType( newType );

    if ( ![
      !project.def.type.required || project.def.type.def,
      !project.def.tag.required || project.def.tag.def,
      !project.def.requester.required || project.def.requester.def,
      [
        project.def.status.required,
        project.def.status.def,
        project.def.assignedTo.required,
        project.def.assignedTo.def,
        project.def.company.required,
        project.def.company.def,
        project.def.pausal.required,
        project.def.pausal.def,
        project.def.overtime.required,
        project.def.overtime.def,
      ].every( ( bool ) => bool )
    ].every( ( bool ) => bool ) ) {
      setDataChanged( true );
    }
  }

  const updateDefAssigned = () => {
    const assignableUsers = userGroups.filter( ( userGroup ) => userGroup.group.rights.assigned.write )
      .map( ( userGroup ) => userGroup.user );
    setAssignedTo( {
      ...assignedTo,
      value: assignedTo.value.filter( ( user1 ) => assignableUsers.some( ( user2 ) => user1.id === user2.id ) )
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

  const getDefaultGroupData = () => {
    const project = projectData.project;
    const users = toSelArr( usersData.basicUsers, 'email' );
    const groups = toSelArr( project.groups.map( ( group ) => remapRightsFromBackend( group ) ) );
    const userGroups = project.groups.reduce( ( acc, cur ) => {
      let group = groups.find( ( group ) => group.id === cur.id );
      let userGroups = cur.users.map( ( user1 ) => ( {
        user: users.find( ( user2 ) => user2.id === user1.id ),
        group,
      } ) )
      return [ ...acc, ...userGroups ]
    }, [] )
    return {
      groups,
      userGroups
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
      userGroups: originalUserGroups
    } = getDefaultGroupData();
    const addGroups = groups.filter( ( group ) => group.id < 0 )
      .map( ( group ) => remapRightsToBackend( group ) );
    const updateGroups = groups.filter( ( group ) => group.id > -1 )
      .filter( ( group ) => {
        const originalGroup = originalGroups.find( ( orGroup ) => orGroup.id === group.id );
        const rights = group.rights;
        const originalRights = originalGroup.rights;
        return (
          group.title !== originalGroup.title ||
          group.order !== originalGroup.order ||
          (
            allACLs.filter( ( acl ) => !acl.separator )
            .some( ( acl ) => {
              if ( acl.both ) {
                return ( rights[ acl.id ].read !== originalRights[ acl.id ].read || rights[ acl.id ].write !== originalRights[ acl.id ].write )
              } else {
                return rights[ acl.id ] !== originalRights[ acl.id ];
              }
            } )
          )
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

  const updateProjectFunc = () => {
    setSaving( true );

    let newDef = {
      assignedTo: {
        ...assignedTo,
        value: assignedTo.value.map( u => u.id )
      },
      company: {
        ...company,
        value: ( company.value ? company.value.id : null )
      },
      overtime: {
        ...overtime,
        value: overtime.value.value
      },
      pausal: {
        ...pausal,
        value: pausal.value.value
      },
      requester: {
        ...requester,
        value: ( requester.value ? requester.value.id : null )
      },
      type: {
        ...type,
        value: ( type.value ? type.value.id : null )
      },
      status: {
        ...status,
        value: ( status.value ? status.value.id : null )
      },
      tag: {
        ...defTag,
        value: defTag.value.map( u => u.id )
      },
    }
    updateProject( {
        variables: {
          id,
          title,
          description,
          lockedRequester,
          autoApproved,
          def: newDef,
          addTags,
          updateTags,
          deleteTags,
          deleteStatuses,
          updateStatuses,
          addStatuses,
          ...filterGroupChanges(),
          userGroups: compactUserGroups(),
        }
      } )
      .then( ( response ) => {
        setAddTags( [] );
        setUpdateTags( [] );
        setDeleteTags( [] );
        if ( closeModal ) {
          const myUserGroup = userGroups.find( ( userGroup ) => userGroup.user.id === currentUser.id );
          const myRights = myUserGroup === undefined ? backendCleanRights() : remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup.group.id ) )
            .rights;
          if ( myUserGroup ) {
            closeModal( response.data.updateProject, myRights );
          } else {
            closeModal( null, null );
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

  const doesDefHasValue = () => {
    return (
      [
        type,
      ].every( ( defAttr ) => !defAttr.required || defAttr.value !== null ) && [
        defTag,
        //assignedTo,
      ].every( ( defAttr ) => !defAttr.required || defAttr.value.length !== 0 )
    )
  }

  const addTaskIssue = groups.filter( ( group ) => group.rights.addTasks )
    .some( ( group ) => (
      ( !group.rights.status.write && !status.def ) ||
      ( !group.rights.tags.write && !defTag.def && defTag.required ) ||
      //( !group.rights.assigned.write && !assignedTo.def ) ||
      ( !group.rights.requester.write && !requester.def && requester.required ) ||
      ( !group.rights.type.write && !type.def && type.required ) ||
      ( !group.rights.company.write && !company.def )
    ) )

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
    !doesDefHasValue() ||
    ( company && company.value === null && company.fixed ) ||
    ( status && status.value === null && status.fixed ) ||
    ( assignedTo && assignedTo.value.length === 0 && assignedTo.fixed ) ||
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
      group.rights.projectPrimary.read &&
      group.rights.projectPrimary.write &&
      group.rights.projectSecondary &&
      userGroups.some( ( userGroup ) => userGroup.group.id === group.id )
    ) ) ||
    addTaskIssue
  )
  const myRights = currentUser.role.accessRights.projects ?
    backendCleanRights( true ) :
    projectData.project.groups.find( ( group ) => group.users.some( ( user ) => user.id === currentUser.id ) )
    .rights;
  const allTags = getAllTags();
  const allStatuses = getAllStatuses();

  const renderAttachments = () => {
    return (
      <Attachments
        disabled={myRights.projectPrimaryWrite}
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
    if ( !myRights.projectPrimaryWrite ) {
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
      <div>
        <div className="row" style={{alignItems: "baseline"}}>
          <Label>
            Popis
          </Label>
          { myRights.projectPrimaryWrite &&
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
          { myRights.projectPrimaryWrite &&
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

        <Nav tabs className="b-0 m-b-25">
          <NavItem>
            <NavLink
              className={classnames({ active: openedTab === 'description'}, "clickable", "")}
              onClick={() => setOpenedTab('description') }
              >
              Description
            </NavLink>
          </NavItem>
          { myRights.projectSecondary &&
            <NavItem>
              <NavLink>
                |
              </NavLink>
            </NavItem>
          }
          { myRights.projectSecondary &&
            <NavItem>
              <NavLink
                className={classnames({ active: openedTab === 'settings' }, "clickable", "")}
                onClick={() => setOpenedTab('settings') }
                >
                Settings
              </NavLink>
            </NavItem>
          }
        </Nav>
        <TabContent activeTab={openedTab}>
          <TabPane tabId={'description'}>
            { myRights.projectPrimaryRead &&
              <Empty>
                <FormGroup className="m-b-25">
                  <Label for="name">Project name<span className="warning-big">*</span></Label>
                  <Input
                    disabled={!myRights.projectPrimaryWrite}
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
              </Empty>
            }
          </TabPane>
          { myRights.projectSecondary &&
            <TabPane tabId={'settings'}>
              <Checkbox
                className="m-b-25"
                labelClassName="normal-weight font-normal"
                centerHor
                disabled={false}
                value={ autoApproved}
                onChange={() => setAutoApproved( !autoApproved) }
                label="All subtasks, work trips, materials and custom items are automatically approved."
                />
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

              <Checkbox
                className = "m-b-5 m-t-25"
                labelClassName="normal-weight font-normal"
                label="A requester can be only a user with rights to this project."
                centerHor
                disabled={false}
                value = { lockedRequester}
                onChange={() => {
                  setLockedRequester( !lockedRequester);
                  setDataChanged( true );
                }}
                />

              <Groups
                addGroup={(newGroup) => {
                  setGroups([...groups, newGroup]);
                  setDataChanged( true );
                }}
                />

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
                  setGroups(newGroups);
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
                  setDataChanged( true );
                }}
                deleteGroup={(id) => {
                  setGroups( groups.filter((group) => group.id !== id ) );
                  setUserGroups( userGroups.filter((userGroup) => userGroup.group.id !== id ) );
                  setDataChanged( true );
                }}
                />

              <UserGroups
                addRight={ (userGroup) => {
                  setUserGroups([...userGroups, userGroup]);
                  setDataChanged( true );
                }}
                deleteRight={ (userGroup) => {
                  setUserGroups(userGroups.filter((oldGroup) => oldGroup.user.id !== userGroup.user.id ));
                  setDataChanged( true );
                }}
                updateRight={ (userGroup) => {
                  let newUserGroups = [...userGroups];
                  let index = newUserGroups.findIndex((userG) => userG.user.id === userGroup.user.id );
                  newUserGroups[index] = { ...newUserGroups[index], ...userGroup }
                  setUserGroups(newUserGroups);
                  setDataChanged( true );
                }}
                users={(usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))}
                permissions={ userGroups }
                isAdmin={ true }
                groups={ toSelArr(groups) }
                />

              <ProjectDefaultValues
                assignedTo={assignedTo}
                setAssignedTo={(value) => {setAssignedTo(value); setDataChanged(true);}}
                company={company}
                setCompany={(value) => {setCompany(value); setDataChanged(true);}}
                overtime={overtime}
                setOvertime={(value) => {setOvertime(value); setDataChanged(true);}}
                pausal={pausal}
                setPausal={(value) => {setPausal(value); setDataChanged(true);}}
                requester={requester}
                setRequester={(value) => {setRequester(value); setDataChanged(true);}}
                type={type}
                setType={(value) => {setType(value); setDataChanged(true);}}
                status={status}
                setStatus={(value) => {setStatus(value); setDataChanged(true);}}
                tag={defTag}
                setTag={(value) => {setDefTag(value); setDataChanged(true);}}
                statuses={toSelArr(allStatuses)}
                companies={(companiesLoading ? [] : toSelArr(companiesData.basicCompanies))}
                users={
                  lockedRequester ?
                  userGroups.map( (userGroup) => userGroup.user ) :
                  (usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))
                }
                assignableUsers={userGroups.filter((userGroup) => userGroup.group.rights.assigned.write ).map( (userGroup) => userGroup.user )}
                allTags={toSelArr(allTags)}
                taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
                />

              { (( company.value === null && company.fixed) || ( status.value === null && status.fixed) || ( assignedTo.value.length === 0 && assignedTo.fixed)) &&
                <div className="red" style={{color:'red'}}>
                  Status, assigned to and company can't be empty if they are fixed!
                </div>
              }

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
          }
        </TabContent>
        { addTaskErrors && addTaskIssue &&
          <ACLErrors
            {
              ...{
                groups,
                status,
                defTag,
                assignedTo,
                requester,
                type,
                company
              }
            }
            />
        }
        <div className="form-buttons-row">
          {
            closeModal &&
            <button className="btn-link-red btn-distance" onClick={() => closeModal(null, null)}>
              Close
            </button>
          }
          { myRights.projectPrimaryWrite &&
            <button className="btn-red m-l-5" disabled={saving || theOnlyOneLeft} onClick={() => setDeleteOpen(true)}>
              Delete
            </button>
          }
          { !numberOfTasksLoading && !numberOfTasksError &&
            <div className="ml-auto center-hor p-r-5">
              { `This project includes ${numberOfTasksData.getNumberOfTasks} tasks.` }
            </div>
          }

          { (myRights.projectPrimaryWrite || myRights.projectSecondary) &&
            <button
              className={classnames(
                {
                  'ml-auto': false,
                }
                ,"btn"
              )}
              disabled={addTaskErrors && cannotSave}
              onClick={() => {
                if(cannotSave){
                  setAddTaskErrors(true);
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