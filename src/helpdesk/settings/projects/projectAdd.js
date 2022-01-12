import React from 'react';
import {
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import axios from 'axios';
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
import CKEditor from 'components/CKEditor';
import {
  toSelArr,
  toSelItem,
  getMyData,
  filterUnique,
} from 'helperFunctions';
import {
  defaultGroups,
  getEmptyAttributes,
} from 'configs/constants/projects';
import classnames from 'classnames';
import Loading from 'components/loading';
import Switch from "components/switch";
import Radio from "components/radio";

import Users from "./components/users";
import CustomAttributes from "./components/customAttributes";
import Tags from './components/tags';
import Statuses from './components/statuses';
import Groups from './components/group';
import Attributes from "./components/attributes";
import ProjectAcl from "./components/acl";
import Attachments from './components/attachments';
import ProjectFilters from "./components/projectFilters";
import ProjectErrorDisplay from './components/errorDisplay';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  remapRightsToBackend,
  getGroupsProblematicAttributes,
  mergeGroupAttributeRights,
} from './helpers';

import {
  useTranslation
} from "react-i18next";

import {
  REST_URL,
} from 'configs/restAPI';

import {
  GET_BASIC_COMPANIES,
} from '../companies/queries';
import {
  GET_BASIC_USERS,
  USERS_SUBSCRIPTION,
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
    match,
    closeModal,
  } = props;

  const {
    t
  } = useTranslation();

  const [ addProject ] = useMutation( ADD_PROJECT );

  const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUS_TEMPLATES, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );

  const {
    data: usersData,
    loading: usersLoading,
    refetch: usersRefetch
  } = useQuery( GET_BASIC_USERS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( USERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      usersRefetch()
    }
  } );

  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES, {
    fetchPolicy: 'network-only'
  } );

  const currentUser = getMyData();

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ lockedRequester, setLockedRequester ] = React.useState( true );
  const [ autoApproved, setAutoApproved ] = React.useState( true );
  const [ hideApproved, setHideApproved ] = React.useState( false );
  const [ archived, setArchived ] = React.useState( false );
  const [ groups, setGroups ] = React.useState( defaultGroups );
  const [ attributes, setAttributes ] = React.useState( getEmptyAttributes() );
  const [ userGroups, setUserGroups ] = React.useState( [] );
  const [ companyGroups, setCompanyGroups ] = React.useState( [] );

  const [ filters, setFilters ] = React.useState( [] );

  const [ tags, setTags ] = React.useState( [] );
  const [ attachments, setAttachments ] = React.useState( [] );
  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ saving, setSaving ] = React.useState( false );
  const [ openedTab, setOpenedTab ] = React.useState( "description" );
  const [ editingDescription, setEditingDescription ] = React.useState( false );
  const [ showProjectErrors, setShowProjectErrors ] = React.useState( false );
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
  }, [ dataLoading ] );

  React.useEffect( () => {
    if ( !usersLoading ) {
      updateDefAssigned();
    }
  }, [ userGroups, companyGroups, usersLoading ] );
  const updateDefAssigned = () => {
    const assignableUsers = filterUnique( [
      ...userGroups.filter( ( userGroup ) => userGroup.group.attributeRights.assigned.edit )
      .map( ( userGroup ) => userGroup.user ),
      ...companyGroups.filter( ( companyGroup ) => companyGroup.group.attributeRights.assigned.edit )
      .reduce( ( acc, companyGroup ) => {
        return [ ...acc, ...( usersLoading ? [] : toSelArr( usersData.basicUsers, 'email' ) )
          .filter( ( user ) => user.company.id === companyGroup.company.id ) ]
      }, [] )
    ], 'id' )
    setAttributes( {
      ...attributes,
      assigned: {
        ...attributes.assigned,
        value: attributes.assigned.value.filter( ( user1 ) => assignableUsers.some( ( user2 ) => user1.id === user2.id ) )
      }
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
    if ( taskTypesData.taskTypes.length > 0 ) {
      setAttributes( {
        ...attributes,
        taskType: {
          ...attributes.taskType,
          value: toSelArr( taskTypesData.taskTypes )
            .sort( ( taskType1, taskType2 ) => taskType1.order > taskType2.order ? 1 : -1 )[ 0 ]
        }
      } )
    }
  }

  if (
    dataLoading
  ) {
    return <Loading />
  }

  //functions
  const addProjectFunc = () => {
    setSaving( true );
    let newGroups = groups.map( ( group ) => remapRightsToBackend( group ) )
    let newUserGroups = userGroups.map( ( userGroup ) => ( {
      userId: userGroup.user.id,
      groupId: userGroup.group.id
    } ) );
    let newCompanyGroups = companyGroups.map( ( companyGroup ) => ( {
      companyId: companyGroup.company.id,
      groupId: companyGroup.group.id
    } ) );
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

    addProject( {
        variables: {
          title,
          description,
          lockedRequester,
          autoApproved,
          hideApproved,
          archived,
          projectAttributes,
          tags,
          statuses,
          filters,
          userGroups: newUserGroups,
          companyGroups: newCompanyGroups,
          groups: newGroups,
        }
      } )
      .then( ( response ) => {
        setSaving( false );
        if ( attachments.length > 0 ) {
          const formData = new FormData();
          attachments.map( ( attachment ) => attachment.data )
            .forEach( ( file ) => formData.append( `file`, file ) );
          formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
          formData.append( "newProject", true );
          formData.append( "projectId", response.data.addProject.id );
          axios.post( `${REST_URL}/upload-project-attachments`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            } )
            .then( ( response2 ) => {
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
                  closeModal( {
                      ...response.data.addProject,
                      __typename: "Project"
                    },
                    myRights,
                    myAttributeRights,
                  );
                } else {
                  closeModal( null, null );
                }
              } else {
                if ( match.path.includes( 'settings' ) ) {
                  history.push( '/helpdesk/settings/projects/' + response.data.addProject.id + '/description' );
                } else {
                  history.push( '/helpdesk/taskList/i/all' );
                  //history.push( '/helpdesk/project/' + response.data.addProject.id + '/description' );
                }
              }
            } )
            .catch( ( err ) => {
              addLocalError( err );
            } );
        } else {
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
              closeModal( {
                  ...response.data.addProject,
                  __typename: "Project"
                },
                myRights,
                myAttributeRights,
              );
            } else {
              closeModal( null, null, null );
            }
          } else {
            let myUserGroup1 = userGroups.find( ( userGroup ) => userGroup.user.id === currentUser.id );
            let myUserGroup2 = companyGroups.find( ( companyGroup ) => companyGroup.company.id === currentUser.company.id );
            let myRights = remapRightsToBackend( groups.find( ( group ) => group.admin && group.def ) )
              .rights;
            if ( myUserGroup1 !== undefined && myUserGroup2 !== undefined ) {
              myRights = mergeGroupRights(
                remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup1.group.id ) )
                .rights,
                remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup2.group.id ) )
                .rights
              );
            } else if ( myUserGroup1 !== undefined ) {
              myRights = remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup1.group.id ) )
                .rights;
            }
            if ( match.path.includes( 'settings' ) ) {
              history.push( '/helpdesk/settings/projects/' + response.data.addProject.id + '/description' );
            } else {
              history.push( '/helpdesk/taskList/i/all' );
            }
          }
        }
      } )
      .catch( ( err ) => {
        setSaving( false );
        addLocalError( err );
      } );
  }

  const fixedNotDef = () => {
    return [ 'deadline', 'overtime', 'pausal', 'startsAt', 'status', 'taskType' ].some( ( attr ) => attributes[ attr ].fixed && attributes[ attr ].value === null );
  }

  const cannotSave = (
    saving ||
    title === "" ||
    fixedNotDef() ||
    tags.some( ( tag ) => (
      tag.title.length === 0 ||
      !tag.color.includes( '#' ) ||
      isNaN( parseInt( tag.order ) )
    ) ) ||
    !statuses.some( ( status ) => status.action === 'IsNew' ) ||
    !statuses.some( ( status ) => status.action === 'CloseDate' ) ||
    !groups.some( ( group ) => (
      group.rights.projectRead &&
      group.rights.projectWrite &&
      (
        userGroups.some( ( userGroup ) => userGroup.group.id === group.id ) ||
        companyGroups.some( ( companyGroup ) => companyGroup.group.id === group.id )
      )
    ) ) ||
    filters.some( ( filter ) => filter.active && getGroupsProblematicAttributes( groups, filter, t )
      .length !== 0 ) ||
    attributes.taskType.value === null
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
        value={description}
        onReady={(editor) => {
          editor.editing.view.document.on( 'keydown', ( evt, data ) => {
            if ( data.keyCode === 27 ) {
              setEditingDescription(false);
              data.preventDefault();
              evt.stop();
            }
          });
        }}
        onChange={(description)=>{
          setDescription(description);
        }}
        type="basic"
        />
    </div>
    } else {
      if ( description.length !== 0 ) {
        RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
      } else {
        RenderDescription = <div className="task-edit-popis">{t('projectNoDescription')}</div>
      }
    }
    return (
      <div>
      <div className="row" style={{alignItems: "baseline"}}>
        <Label>
          {t('description')}
        </Label>
        <button
          className="btn-link btn-distance m-l-5"
          style={{height: "20px"}}
          onClick={()=>{
            setEditingDescription(!editingDescription);
          }}
          >
          <i className={`fa fa-${!editingDescription ? 'pen' : 'save' }`} />
          { !editingDescription ? t('edit') : t('save') }
        </button>
        <label htmlFor={`upload-project-attachment-add`} className="btn-link btn-distance m-l-0 clickable" >
          <i className="fa fa-plus" />
          {t('attachment')}
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
    <div
    className={ classnames(
      {
        "scroll-visible": !closeModal,
        "fit-with-header": !closeModal,
      },
      "p-20",
    )}
    >
    <h2 className="m-b-17">
      {`${t('add')} ${t('project').toLowerCase()}`}
    </h2>

    <Nav tabs className="no-border m-b-25">
      <NavItem>
        <NavLink
          className={classnames({ active: openedTab === 'description'}, "clickable", "")}
          onClick={() => setOpenedTab('description') }
          >
          {t('description')}
        </NavLink>
      </NavItem>
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
          {t('statuses')}
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
          {t('tags')}
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
          {t('groups')}
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
          {t('groupRights')}
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
          {t('users')}
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
          {t('attributesRights')}
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
          {t('customAttributes')}
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
          {t('projectFilters')}
        </NavLink>
      </NavItem>
    </Nav>

    <TabContent activeTab={openedTab}>

      <TabPane tabId={'description'}>
        <FormGroup className="m-b-25">
          <Label for="name">{t('projectName')}<span className="warning-big">*</span></Label>
          <Input
            type="text"
            className="medium-input m-t-15"
            id="name"
            placeholder={t('projectNamePlaceholder')}
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
        </FormGroup>

        { renderDescription() }

        <Switch
          value={archived}
          onChange={() => {
            setArchived(!archived)
          }}
          label={t('archived')}
          labelClassName="text-normal font-normal"
          simpleSwitch
          />

          <Radio
            options={ [
              {
                key: 'autoApprovedOn',
                value: autoApproved,
                label: t('invoiceOn'),
              },
              {
                key: 'autoApprovedOff',
                value: !autoApproved,
                label: t('invoiceOff'),
              },
            ] }
            name="autoApproved"
            onChange={ () => {
              setAutoApproved(!autoApproved);
            } }
            />

        <Switch
          value={hideApproved}
          onChange={() => {
            setHideApproved(!hideApproved);
          }}
          label={t('hideInvoice')}
          labelClassName="text-normal font-normal"
          simpleSwitch
          />

      </TabPane>

      <TabPane tabId={'statuses'}>
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
      </TabPane>
      <TabPane tabId={'tags'}>
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
      </TabPane>
      <TabPane tabId={'groups'}>
        <Groups
          groups={groups}
          addGroup={(newGroup) => {
            setGroups([...groups, newGroup])
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
            setCompanyGroups(companyGroups.map((companyGroup) => (
              (companyGroup.group.id !== newGroup.id) ?
              companyGroup :
              ({...companyGroup, group: {...companyGroup.group,...newGroup}})
            ) ));
          }}
          deleteGroup={(id) => {
            setGroups( groups.filter((group) => group.id !== id ) );
            setUserGroups( userGroups.filter((userGroup) => userGroup.group.id !== id ) );
            setcompanyGroups( companyGroups.filter((companyGroup) => companyGroup.group.id !== id ) );
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
          }}
          addUserRight={ (userGroup) => {
            setUserGroups([...userGroups, userGroup]);
          }}
          deleteUserRight={ (userGroup) => {
            setUserGroups(userGroups.filter((oldGroup) => oldGroup.user.id !== userGroup.user.id ));
          }}
          updateUserRight={ (userGroup) => {
            let newUserGroups = [...userGroups];
            let index = newUserGroups.findIndex((userG) => userG.user.id === userGroup.user.id );
            newUserGroups[index] = { ...newUserGroups[index], ...userGroup }
            setUserGroups(newUserGroups);
          }}
          addCompanyRight={ (companyGroup) => {
            setCompanyGroups([...companyGroups, companyGroup]);
          }}
          deleteCompanyRight={ (companyGroup) => {
            setCompanyGroups(companyGroups.filter((oldGroup) => oldGroup.company.id !== companyGroup.company.id ));
          }}
          updateCompanyRight={ (companyGroup) => {
            let newCompanyGroups = [...companyGroups];
            let index = newCompanyGroups.findIndex((companyG) => companyG.company.id === companyGroup.company.id );
            newCompanyGroups[index] = { ...newCompanyGroups[index], ...companyGroup }
            setCompanyGroups(newCompanyGroups);
          }}
          />
      </TabPane>
      <TabPane tabId={'attributes'}>
        <Attributes
          statuses={toSelArr(statuses)}
          companies={(companiesLoading ? [] : toSelArr(companiesData.basicCompanies))}
          users={
            lockedRequester ?
            userGroups.map( (userGroup) => userGroup.user ) :
            (usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))
          }
          assignableUsers={filterUnique([
            ...userGroups.filter((userGroup) => userGroup.group.attributeRights.assigned.edit ).map( (userGroup) => userGroup.user ),
            ...companyGroups.filter((companyGroup) => companyGroup.group.attributeRights.assigned.edit ).reduce((acc, companyGroup) => {
              return [...acc, ...(usersLoading ? [] : toSelArr(usersData.basicUsers, 'email')).filter((user) => user.company.id === companyGroup.company.id ) ]
            },[])
          ], 'id')}
          allTags={toSelArr(tags)}
          taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
          groups={groups}
          setGroups={(newGroups) => {
            setGroups(newGroups);
            setUserGroups(userGroups.map((userGroup) => ({
              ...userGroup,
              group: newGroups.find((newGroup) => newGroup.id === userGroup.group.id),
            }) ));
            setCompanyGroups(companyGroups.map((companyGroup) => ({
              ...companyGroup,
              group: newGroups.find((newGroup) => newGroup.id === companyGroup.group.id),
            }) ));
          } }
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
      <TabPane tabId={'projectFilters'}>
        <ProjectFilters
          groups={groups}
          statuses={statuses}
          filters={filters}
          addFilter={(newFilter) => {
            setFilters([ ...filters, {...newFilter, id: fakeID -- } ]);
          }}
          deleteFilter={(id) => {
              setFilters(filters.filter((filter) => filter.id !== id ));
          }}
          updateFilter={(newFilter) => {
            let newFilters = [...filters];
            let index = newFilters.findIndex((filter) => filter.id === newFilter.id );
            newFilters[index] = { ...newFilters[index], ...newFilter }
            setFilters(newFilters);
          }}
          />
      </TabPane>
    </TabContent>

    <div className="row form-buttons-row">
      {  closeModal &&
        <button className="btn-link mr-auto" onClick={() => closeModal(null, null)}>{t('cancel')}</button>
      }

      <button className={classnames(
          "btn",
          "ml-auto",
        )}
        disabled={ showProjectErrors && cannotSave }
        onClick={() => {
          if(cannotSave){
            setShowProjectErrors(true);
            return;
          }else{
            addProjectFunc();
          }
        }}
        >
        { saving ? `${t('adding')}...` : `${t('add')} ${t('project').toLowerCase()}` }
      </button>
    </div>
    { showProjectErrors &&
      <ProjectErrorDisplay
        attributes={attributes}
        title={title}
        allTags={tags}
        allStatuses={statuses}
        groups={groups}
        userGroups={userGroups}
        filters={filters}
        />
    }
  </div>
  );
}