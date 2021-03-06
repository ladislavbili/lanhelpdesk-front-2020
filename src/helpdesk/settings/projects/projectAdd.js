import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import moment from 'moment';
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
  getMyData,
} from 'helperFunctions';
import {
  fetchNetOptions
} from "configs/constants/apollo";
import {
  defList,
  defBool,
  defItem,
  defaultGroups,
  noDef,
} from 'configs/constants/projects';
import classnames from 'classnames';
import axios from 'axios';
import Loading from 'components/loading';
import Checkbox from 'components/checkbox';

import UserGroups from "./components/userGroups";
import CustomAttributes from "./components/customAttributes";
import Tags from './components/tags';
import Statuses from './components/statuses';
import Groups from './components/group/groupAdd';
import ProjectDefaultValues from "./components/defaultValues";
import ProjectAcl from "./components/acl";
import ACLErrors from './components/aclErrors';
import Attachments from './components/attachments';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  remapRightsToBackend
} from './helpers';
import {
  REST_URL,
} from 'configs/restAPI';

import {
  GET_BASIC_COMPANIES,
} from '../companies/queries';
import {
  GET_BASIC_USERS,
} from '../users/queries';
import {
  GET_STATUS_TEMPLATES,
} from '../templateStatuses/queries';
import {
  GET_TASK_TYPES,
} from '../taskTypes/queries';
import {
  ADD_PROJECT,
} from './queries';

let fakeID = -1;

export default function ProjectAdd( props ) {
  //data & queries
  const {
    history,
    closeModal
  } = props;
  const [ addProject, {
    client
  } ] = useMutation( ADD_PROJECT );
  const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUS_TEMPLATES, fetchNetOptions );
  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES, fetchNetOptions );
  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS, fetchNetOptions );
  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES, fetchNetOptions );

  const currentUser = getMyData();

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ lockedRequester, setLockedRequester ] = React.useState( true );
  const [ autoApproved, setAutoApproved ] = React.useState( true );
  const [ groups, setGroups ] = React.useState( defaultGroups );
  const [ userGroups, setUserGroups ] = React.useState( [] );

  const [ assignedTo, setAssignedTo ] = React.useState( defList( noDef.assignedTo.required ) );
  const [ company, setCompany ] = React.useState( defItem( noDef.company.required ) );
  const [ overtime, setOvertime ] = React.useState( defBool( noDef.overtime.required ) );
  const [ pausal, setPausal ] = React.useState( defBool( noDef.pausal.required ) );
  const [ requester, setRequester ] = React.useState( defItem( noDef.requester.required ) );
  const [ type, setType ] = React.useState( defItem( noDef.type.required ) );
  const [ status, setStatus ] = React.useState( defItem( noDef.status.required ) );
  const [ defTag, setDefTag ] = React.useState( defList( noDef.tag.required ) );

  const [ tags, setTags ] = React.useState( [] );
  const [ attachments, setAttachments ] = React.useState( [] );
  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ saving, setSaving ] = React.useState( false );
  const [ openedTab, setOpenedTab ] = React.useState( "description" );
  const [ editingDescription, setEditingDescription ] = React.useState( true );
  const [ addTaskErrors, setAddTaskErrors ] = React.useState( false );
  const [ statuses, setStatuses ] = React.useState( [] );


  const dataLoading = (
    statusesLoading ||
    companiesLoading ||
    usersLoading ||
    taskTypesLoading ||
    !currentUser
  );

  //events
  React.useEffect( () => {
    setData();
  }, [ statusesLoading, usersLoading ] );

  React.useEffect( () => {
    updateDefAssigned();
  }, [ userGroups ] );

  const updateDefAssigned = () => {
    const assignableUsers = userGroups.filter( ( userGroup ) => userGroup.group.rights.assigned.write )
      .map( ( userGroup ) => userGroup.user );
    setAssignedTo( {
      ...assignedTo,
      value: assignedTo.value.filter( ( user1 ) => assignableUsers.some( ( user2 ) => user1.id === user2.id ) )
    } )
  }

  const setData = () => {
    if ( dataLoading ) {
      return;
    }
    setStatuses( statusesData.statusTemplates.map( ( statusTemplate ) => ( {
      id: fakeID--,
      title: statusTemplate.title,
      color: statusTemplate.color,
      icon: statusTemplate.icon,
      action: statusTemplate.action,
      order: statusTemplate.order,
    } ) ) );
    setUserGroups( [ {
      group: toSelArr( groups )
        .find( ( group ) => group.order === 0 ),
      user: toSelArr( usersData.basicUsers, 'email' )
        .find( ( user ) => user.id === currentUser.id )
    } ] );
  }

  if (
    dataLoading
  ) {
    return <Loading />
  }

  //functions
  const addProjectFunc = () => {
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
    let newGroups = groups.map( ( group ) => remapRightsToBackend( group ) )
    let newUserGroups = userGroups.map( ( userGroup ) => ( {
      userId: userGroup.user.id,
      groupId: userGroup.group.id
    } ) );

    addProject( {
        variables: {
          title,
          description,
          lockedRequester,
          autoApproved,
          def: newDef,
          groups: newGroups,
          userGroups: newUserGroups,
          tags,
          statuses
        }
      } )
      .then( ( response ) => {
        if ( attachments.length > 0 ) {
          const formData = new FormData();
          attachments.map( ( attachment ) => attachment.data )
            .forEach( ( file ) => formData.append( `file`, file ) );
          formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
          formData.append( "projectId", response.data.addProject.id );
          axios.post( `${REST_URL}/upload-project-attachments`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            } )
            .then( ( response2 ) => {
              if ( closeModal ) {
                const myUserGroup = userGroups.find( ( userGroup ) => userGroup.user.id === currentUser.id );
                const myRights = myUserGroup === undefined ? createCleanRights() : remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup.group.id ) )
                  .rights;
                if ( myUserGroup ) {
                  closeModal( {
                      ...response.data.addProject,
                      __typename: "Project"
                    },
                    myRights
                  );
                } else {
                  closeModal( null, null );
                }
              } else {
                history.push( '/helpdesk/settings/projects/' + response.data.addProject.id );
              }
            } )
            .catch( ( err ) => {
              addLocalError( err );
            } );
        } else {
          if ( closeModal ) {
            const myUserGroup = userGroups.find( ( userGroup ) => userGroup.user.id === currentUser.id );
            const myRights = myUserGroup === undefined ? createCleanRights() : remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup.group.id ) )
              .rights;
            if ( myUserGroup ) {
              closeModal( {
                  ...response.data.addProject,
                  __typename: "Project"
                },
                myRights
              );
            } else {
              closeModal( null, null );
            }
          } else {
            history.push( '/helpdesk/settings/projects/' + response.data.addProject.id );
          }
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const addTaskIssue = (
    groups.filter( ( group ) => group.rights.addTasks )
    .some( ( group ) => (
      ( !group.rights.status.write && !status.def ) ||
      ( !group.rights.tags.write && !defTag.def && defTag.required ) ||
      //( !group.rights.assigned.write && !assignedTo.def ) ||
      ( !group.rights.requester.write && !requester.def && requester.required ) ||
      ( !group.rights.type.write && !type.def && type.required ) ||
      ( !group.rights.company.write && !company.def )
    ) )
  )

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

  const cannotSave = (
    saving ||
    !doesDefHasValue() ||
    title === "" ||
    currentUser &&
    ( company.value === null && company.fixed ) ||
    ( status.value === null && status.fixed ) ||
    ( assignedTo.value.length === 0 && assignedTo.fixed ) ||
    !groups.some( ( group ) => (
      group.rights.projectPrimary.read &&
      group.rights.projectPrimary.write &&
      group.rights.projectSecondary &&
      userGroups.some( ( userGroup ) => userGroup.group.id === group.id )
    ) ) ||
    tags.some( ( tag ) => (
      tag.title.length === 0 ||
      !tag.color.includes( '#' ) ||
      isNaN( parseInt( tag.order ) )
    ) ) ||
    !statuses.some( ( status ) => status.action === 'IsNew' ) ||
    !statuses.some( ( status ) => status.action === 'CloseDate' ) ||
    addTaskIssue
  )

  const renderAttachments = () => {
    return (
      <Attachments
        disabled={false}
        projectId={null}
        type="project"
        top={false}
        attachments={attachments}
        addAttachments={(newAttachments)=>{
          let time = moment().valueOf();
          newAttachments = newAttachments.map((attachment)=>{
            return {
              title: attachment.name,
              size: attachment.size,
              filename: attachment.name,
              time,
              data: attachment
            }
          });
          setAttachments([...attachments, ...newAttachments]);
        }}
        removeAttachment={(attachment)=>{
          let newAttachments = [...attachments];
          newAttachments.splice(newAttachments.findIndex((item)=>item.title===attachment.title && item.size===attachment.size && item.time===attachment.time),1);
          setAttachments([...newAttachments]);
        }}
        />
    )
  }

  const renderDescription = () => {
    let RenderDescription = null;
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
          }}
          config={ck5config}
          />
      </div>
    } else {
      if ( description.length !== 0 ) {
        RenderDescription = <div className="project-description-text" dangerouslySetInnerHTML={{__html:description }} />
      } else {
        RenderDescription = <div className="project-description-text">Úloha nemá popis</div>
      }
    }
    return (
      <div>
        <div className="row" style={{alignItems: "baseline"}}>
          <Label>
            Popis
          </Label>
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
          <label htmlFor={`upload-project-attachment-add`} className="btn-link btn-distance m-l-0 clickable" >
            <i className="fa fa-plus" />
            Attachment
          </label>
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
      { !closeModal &&
        <div className="dynamic-bg-commandbar a-i-c p-l-20">
          { cannotSave &&
            <div className="message error-message" style={{ minWidth: 220 }}>
              Fill in all the required information!
            </div>
          }
        </div>
      }


      <div
        className={ classnames(
          {
            "scroll-visible": !closeModal,
            "fit-with-header-and-commandbar": !closeModal,
          },
          "p-t-10 p-l-20 p-r-20 p-b-20",
        )}
        >
        <h2 className="m-b-20" >
          Add project
        </h2>

        <Nav tabs className="b-0 m-b-10">
          <NavItem>
            <NavLink
              className={classnames({ active: openedTab === 'description'}, "clickable", "")}
              onClick={() => setOpenedTab('description') }
              >
              Description
            </NavLink>
          </NavItem>
            <NavItem>
              <NavLink>
                |
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: openedTab === 'settings' }, "clickable", "")}
                onClick={() => setOpenedTab('settings') }
                >
                Settings
              </NavLink>
            </NavItem>
        </Nav>

        <TabContent activeTab={openedTab}>

          <TabPane tabId={'description'}>
            <FormGroup>
              <Label for="name">Project name <span className="warning-big">*</span></Label>
              <Input type="text" className="medium-input" id="name" placeholder="Enter project name" value={title} onChange={(e)=>setTitle(e.target.value)} />
            </FormGroup>

            { renderDescription() }
          </TabPane>

          <TabPane tabId={'settings'}>
            <div className="row">
              <Checkbox
                className = "m-l-5 m-r-5"
                centerHor
                disabled={false}
                value = { autoApproved}
                onChange={() => setAutoApproved( !autoApproved) }
                />
              <span className="clickable" onClick = { () => setAutoApproved( !autoApproved) }>
                All subtasks, work trips, materials and custom items are automatically approved.
              </span>
            </div>

            <Statuses
              statuses={statuses}
              addStatus={(newStatus) => {
                setStatuses([ ...statuses, {...newStatus, id: fakeID -- } ])
              }}
              deleteStatus={(id) => {
                setStatuses( statuses.filter((tag) => tag.id !== id ) )
              }}
              updateStatus={(newStatus) => {
                let newStatuses = [...statuses];
                let index = newStatuses.findIndex((status) => status.id === newStatus.id );
                newStatuses[index] = { ...newStatuses[index], ...newStatus }
                setStatuses(newStatuses);
              }}
              />

            <Tags
              tags={tags}
              addTag={(newTag) => {
                setTags([ ...tags, {...newTag, id: fakeID -- } ])
              }}
              deleteTag={(id) => {
                setTags( tags.filter((tag) => tag.id !== id ) )
              }}
              updateTag={(newTag) => {
                let newTags = [...tags];
                let index = newTags.findIndex((tag) => tag.id === newTag.id );
                newTags[index] = { ...newTags[index], ...newTag }
                setTags(newTags);
              }}
              />

            <div className="row">
              <Checkbox
                className = "m-l-5 m-r-5"
                centerHor
                disabled={false}
                value = { lockedRequester}
                onChange={() => setLockedRequester( !lockedRequester) }
                />
              <span className="clickable" onClick = { () => setLockedRequester( !lockedRequester) }>
                A requester can be only a user with rights to this project.
              </span>
            </div>

            <Groups
              addGroup={(newGroup) => {
                setGroups([...groups, newGroup])
              }}
              />

            <UserGroups
              addRight={ (userGroup) => {
                setUserGroups([...userGroups, userGroup]);
              }}
              deleteRight={ (userGroup) => {
                setUserGroups(userGroups.filter((oldGroup) => oldGroup.user.id !== userGroup.user.id ));
              }}
              updateRight={ (userGroup) => {
                let newUserGroups = [...userGroups];
                let index = newUserGroups.findIndex((userG) => userG.user.id === userGroup.user.id );
                newUserGroups[index] = { ...newUserGroups[index], ...userGroup }
                setUserGroups(newUserGroups);
              }}
              users={(usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))}
              permissions={ userGroups }
              isAdmin={ true }
              groups={ toSelArr(groups) }
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
                ) ))
              }}
              deleteGroup={(id) => {
                setGroups( groups.filter((group) => group.id !== id ) );
                setUserGroups( userGroups.filter((userGroup) => userGroup.group.id !== id ) );
              }}
              />

            <ProjectDefaultValues
              assignedTo={assignedTo}
              setAssignedTo={setAssignedTo}
              company={company}
              setCompany={setCompany}
              overtime={overtime}
              setOvertime={setOvertime}
              pausal={pausal}
              setPausal={setPausal}
              requester={requester}
              setRequester={setRequester}
              type={type}
              setType={setType}
              status={status}
              setStatus={setStatus}
              tag={defTag}
              setTag={setDefTag}
              statuses={toSelArr(statuses)}
              companies={(companiesLoading ? [] : toSelArr(companiesData.basicCompanies))}
              users={
                lockedRequester ?
                userGroups.map( (userGroup) => userGroup.user ) :
                (usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))
              }
              assignableUsers={userGroups.filter((userGroup) => userGroup.group.rights.assigned.write ).map( (userGroup) => userGroup.user )}
              allTags={toSelArr(tags)}
              taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
              />

            { (( company.value === null && company.fixed) || ( status.value === null && status.fixed) || ( assignedTo.value.length === 0 && assignedTo.fixed) ) &&
              <div className="red" style={{color:'red'}}>
                Status, assigned to and company can't be empty if they are fixed!
              </div>
            }


            <CustomAttributes
              disabled={false}
              customAttributes={customAttributes}
              addCustomAttribute={(newCustomAttribute) => {
                setCustomAttributes([...customAttributes, {...newCustomAttribute, id: fakeID-- }]);
              }}
              updateCustomAttribute={(changedCustomAttribute) => {
                let newCustomAttributes = [...customAttributes];
                let index = newCustomAttributes.findIndex((attribute) => attribute.id === changedCustomAttribute.id);
                newCustomAttributes[index] = {...newCustomAttributes[index],...changedCustomAttribute};
                setCustomAttributes(newCustomAttributes);
              }}
              deleteCustomAttribute={(id) => {
                setCustomAttributes(customAttributes.filter((customAttribute) => customAttribute.id !== id ));
              }}
              />
          </TabPane>

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
        <div className="row form-buttons-row">
          {
            closeModal &&
            <button className="btn-link mr-auto" onClick={() => closeModal(null, null)}> Cancel </button>
          }

          {closeModal && cannotSave && addTaskErrors &&
            <div className="ml-auto message error-message" style={{ minWidth: 220 }}>
              Fill in all the required information!
            </div>
          }

          <button className={classnames(
              "btn",
              {"ml-auto": !closeModal}
            )}
            disabled={ addTaskErrors && cannotSave }
            onClick={() => {
              if(cannotSave){
                setAddTaskErrors(true);
                return;
              }else{
                addProjectFunc();
              }
            }}
            >
            {saving?'Adding...':'Add project'}
          </button>
        </div>
      </div>
    </div>
  );
}