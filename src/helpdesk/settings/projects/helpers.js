export const remapRightsToBackend = ( group ) => {
  return {
    id: group.id,
    title: group.title,
    def: group.def,
    admin: group.admin,
    description: group.description,
    order: parseInt( group.order ),
    attributeRights: {
      status: {
        required: group.attributeRights.status.required,
        add: group.attributeRights.status.add,
        view: group.attributeRights.status.view || group.attributeRights.status.edit,
        edit: group.attributeRights.status.edit
      },
      tags: {
        required: group.attributeRights.tags.required,
        add: group.attributeRights.tags.add,
        view: group.attributeRights.tags.view || group.attributeRights.tags.edit,
        edit: group.attributeRights.tags.edit
      },
      assigned: {
        required: group.attributeRights.assigned.required,
        add: group.attributeRights.assigned.add,
        view: group.attributeRights.assigned.view || group.attributeRights.assigned.edit,
        edit: group.attributeRights.assigned.edit
      },
      requester: {
        required: group.attributeRights.requester.required,
        add: group.attributeRights.requester.add,
        view: group.attributeRights.requester.view || group.attributeRights.requester.edit,
        edit: group.attributeRights.requester.edit
      },
      company: {
        required: group.attributeRights.company.required,
        add: group.attributeRights.company.add,
        view: group.attributeRights.company.view || group.attributeRights.company.edit,
        edit: group.attributeRights.company.edit
      },
      taskType: {
        required: group.attributeRights.taskType.required,
        add: group.attributeRights.taskType.add,
        view: group.attributeRights.taskType.view || group.attributeRights.taskType.edit,
        edit: group.attributeRights.taskType.edit
      },
      pausal: {
        required: group.attributeRights.pausal.required,
        add: group.attributeRights.pausal.add,
        view: group.attributeRights.pausal.view || group.attributeRights.pausal.edit,
        edit: group.attributeRights.pausal.edit
      },
      overtime: {
        required: group.attributeRights.overtime.required,
        add: group.attributeRights.overtime.add,
        view: group.attributeRights.overtime.view || group.attributeRights.overtime.edit,
        edit: group.attributeRights.overtime.edit
      },
      startsAt: {
        required: group.attributeRights.startsAt.required,
        add: group.attributeRights.startsAt.add,
        view: group.attributeRights.startsAt.view || group.attributeRights.startsAt.edit,
        edit: group.attributeRights.startsAt.edit
      },
      deadline: {
        required: group.attributeRights.deadline.required,
        add: group.attributeRights.deadline.add,
        view: group.attributeRights.deadline.view || group.attributeRights.deadline.edit,
        edit: group.attributeRights.deadline.edit
      },
      repeat: {
        add: group.attributeRights.repeat.add,
        view: group.attributeRights.repeat.view || group.attributeRights.repeat.edit,
        edit: group.attributeRights.repeat.edit
      },
    },
    rights: {
      projectRead: group.rights.projectRead,
      projectWrite: group.rights.projectWrite,
      companyTasks: group.rights.companyTasks,
      allTasks: group.rights.allTasks,
      tasklistDnD: group.rights.tasklistDnD,
      tasklistKalendar: group.rights.tasklistKalendar,
      tasklistGantt: group.rights.tasklistGantt,
      tasklistStatistics: group.rights.tasklistStatistics,
      addTask: group.rights.addTask,
      deleteTask: group.rights.deleteTask,
      taskImportant: group.rights.taskImportant,
      taskTitleWrite: group.rights.taskTitleWrite,
      taskProjectWrite: group.rights.taskProjectWrite,
      taskDescriptionRead: group.rights.taskDescription.read,
      taskDescriptionWrite: group.rights.taskDescription.write,
      taskAttachmentsRead: group.rights.taskAttachments.read,
      taskAttachmentsWrite: group.rights.taskAttachments.write,
      taskSubtasksRead: group.rights.taskSubtasks.read,
      taskSubtasksWrite: group.rights.taskSubtasks.write,
      taskWorksRead: group.rights.taskWorks.read,
      taskWorksWrite: group.rights.taskWorks.write,
      taskWorksAdvancedRead: group.rights.taskWorksAdvanced.read,
      taskWorksAdvancedWrite: group.rights.taskWorksAdvanced.write,
      taskMaterialsRead: group.rights.taskMaterials.read,
      taskMaterialsWrite: group.rights.taskMaterials.write,
      taskPausalInfo: group.rights.taskPausalInfo,
      viewComments: group.rights.viewComments,
      addComments: group.rights.addComments,
      internal: group.rights.internal,
      emails: group.rights.emails,
      history: group.rights.history,
    },
  }
}

export const remapRightsFromBackend = ( group ) => {
  const attributeRights = group.attributeRights;
  return {
    id: group.id,
    title: group.title,
    def: group.def,
    admin: group.admin,
    description: group.description,
    order: parseInt( group.order ),
    attributeRights: {
      assigned: {
        required: attributeRights.assigned.required,
        add: attributeRights.assigned.add,
        view: attributeRights.assigned.view,
        edit: attributeRights.assigned.edit
      },
      company: {
        required: attributeRights.company.required,
        add: attributeRights.company.add,
        view: attributeRights.company.view,
        edit: attributeRights.company.edit
      },
      deadline: {
        required: attributeRights.deadline.required,
        add: attributeRights.deadline.add,
        view: attributeRights.deadline.view,
        edit: attributeRights.deadline.edit
      },
      overtime: {
        required: attributeRights.overtime.required,
        add: attributeRights.overtime.add,
        view: attributeRights.overtime.view,
        edit: attributeRights.overtime.edit
      },
      pausal: {
        required: attributeRights.pausal.required,
        add: attributeRights.pausal.add,
        view: attributeRights.pausal.view,
        edit: attributeRights.pausal.edit
      },
      repeat: {
        add: attributeRights.repeat.add,
        view: attributeRights.repeat.view,
        edit: attributeRights.repeat.edit
      },
      requester: {
        required: attributeRights.requester.required,
        add: attributeRights.requester.add,
        view: attributeRights.requester.view,
        edit: attributeRights.requester.edit
      },
      startsAt: {
        required: attributeRights.startsAt.required,
        add: attributeRights.startsAt.add,
        view: attributeRights.startsAt.view,
        edit: attributeRights.startsAt.edit
      },
      status: {
        required: attributeRights.status.required,
        add: attributeRights.status.add,
        view: attributeRights.status.view,
        edit: attributeRights.status.edit
      },
      tags: {
        required: attributeRights.tags.required,
        add: attributeRights.tags.add,
        view: attributeRights.tags.view,
        edit: attributeRights.tags.edit
      },
      taskType: {
        required: attributeRights.taskType.required,
        add: attributeRights.taskType.add,
        view: attributeRights.taskType.view,
        edit: attributeRights.taskType.edit
      },
    },
    rights: {
      projectRead: group.rights.projectRead,
      projectWrite: group.rights.projectWrite,
      companyTasks: group.rights.companyTasks,
      allTasks: group.rights.allTasks,
      tasklistDnD: group.rights.tasklistDnD,
      tasklistKalendar: group.rights.tasklistKalendar,
      tasklistGantt: group.rights.tasklistGantt,
      tasklistStatistics: group.rights.tasklistStatistics,
      addTask: group.rights.addTask,
      deleteTask: group.rights.deleteTask,
      taskImportant: group.rights.taskImportant,
      taskTitleWrite: group.rights.taskTitleWrite,
      taskProjectWrite: group.rights.taskProjectWrite,
      taskDescription: {
        read: group.rights.taskDescriptionRead,
        write: group.rights.taskDescriptionWrite,
      },
      taskAttachments: {
        read: group.rights.taskAttachmentsRead,
        write: group.rights.taskAttachmentsWrite,
      },
      taskSubtasks: {
        read: group.rights.taskSubtasksRead,
        write: group.rights.taskSubtasksWrite,
      },
      taskWorks: {
        read: group.rights.taskWorksRead,
        write: group.rights.taskWorksWrite,
      },
      taskWorksAdvanced: {
        read: group.rights.taskWorksAdvancedRead,
        write: group.rights.taskWorksAdvancedWrite,
      },
      taskMaterials: {
        read: group.rights.taskMaterialsRead,
        write: group.rights.taskMaterialsWrite,
      },
      taskPausalInfo: group.rights.taskPausalInfo,
      viewComments: group.rights.viewComments,
      addComments: group.rights.addComments,
      internal: group.rights.internal,
      emails: group.rights.emails,
      history: group.rights.history,
    },
  }
}

export const mergeGroupRights = ( right1, right2 ) => {
  return {
    projectRead: right1.projectRead || right2.projectRead,
    projectWrite: right1.projectWrite || right2.projectWrite,
    companyTasks: right1.companyTasks || right2.companyTasks,
    allTasks: right1.allTasks || right2.allTasks,
    tasklistDnD: right1.tasklistDnD || right2.tasklistDnD,
    tasklistKalendar: right1.tasklistKalendar || right2.tasklistKalendar,
    tasklistGantt: right1.tasklistGantt || right2.tasklistGantt,
    tasklistStatistics: right1.tasklistStatistics || right2.tasklistStatistics,
    addTask: right1.addTask || right2.addTask,
    deleteTask: right1.deleteTask || right2.deleteTask,
    taskImportant: right1.taskImportant || right2.taskImportant,
    taskTitleWrite: right1.taskTitleWrite || right2.taskTitleWrite,
    taskProjectWrite: right1.taskProjectWrite || right2.taskProjectWrite,
    taskDescriptionRead: right1.taskDescriptionRead || right2.taskDescriptionRead,
    taskDescriptionWrite: right1.taskDescriptionWrite || right2.taskDescriptionWrite,
    taskAttachmentsRead: right1.taskAttachmentsRead || right2.taskAttachmentsRead,
    taskAttachmentsWrite: right1.taskAttachmentsWrite || right2.taskAttachmentsWrite,
    taskSubtasksRead: right1.taskSubtasksRead || right2.taskSubtasksRead,
    taskSubtasksWrite: right1.taskSubtasksWrite || right2.taskSubtasksWrite,
    taskWorksRead: right1.taskWorksRead || right2.taskWorksRead,
    taskWorksWrite: right1.taskWorksWrite || right2.taskWorksWrite,
    taskWorksAdvancedRead: right1.taskWorksAdvancedRead || right2.taskWorksAdvancedRead,
    taskWorksAdvancedWrite: right1.taskWorksAdvancedWrite || right2.taskWorksAdvancedWrite,
    taskMaterialsRead: right1.taskMaterialsRead || right2.taskMaterialsRead,
    taskMaterialsWrite: right1.taskMaterialsWrite || right2.taskMaterialsWrite,
    taskPausalInfo: right1.taskPausalInfo || right2.taskPausalInfo,
    viewComments: right1.viewComments || right2.viewComments,
    addComments: right1.addComments || right2.addComments,
    internal: right1.internal || right2.internal,
    emails: right1.emails || right2.emails,
    history: right1.history || right2.history,
  }
}

export const mergeGroupAttributeRights = ( right1, right2 ) => {
  return {
    assigned: {
      required: right1.assigned.required && right2.assigned.required,
      add: right1.assigned.add || right2.assigned.add,
      view: right1.assigned.view || right2.assigned.view,
      edit: right1.assigned.edit || right2.assigned.edit,
    },
    company: {
      required: right1.company.required && right2.company.required,
      add: right1.company.add || right2.company.add,
      view: right1.company.view || right2.company.view,
      edit: right1.company.edit || right2.company.edit,
    },
    deadline: {
      required: right1.deadline.required && right2.deadline.required,
      add: right1.deadline.add || right2.deadline.add,
      view: right1.deadline.view || right2.deadline.view,
      edit: right1.deadline.edit || right2.deadline.edit,
    },
    overtime: {
      required: right1.overtime.required && right2.overtime.required,
      add: right1.overtime.add || right2.overtime.add,
      view: right1.overtime.view || right2.overtime.view,
      edit: right1.overtime.edit || right2.overtime.edit,
    },
    pausal: {
      required: right1.pausal.required && right2.pausal.required,
      add: right1.pausal.add || right2.pausal.add,
      view: right1.pausal.view || right2.pausal.view,
      edit: right1.pausal.edit || right2.pausal.edit,
    },
    repeat: {
      add: right1.repeat.add || right2.repeat.add,
      view: right1.repeat.view || right2.repeat.view,
      edit: right1.repeat.edit || right2.repeat.edit,
    },
    requester: {
      required: right1.requester.required && right2.requester.required,
      add: right1.requester.add || right2.requester.add,
      view: right1.requester.view || right2.requester.view,
      edit: right1.requester.edit || right2.requester.edit,
    },
    startsAt: {
      required: right1.startsAt.required && right2.startsAt.required,
      add: right1.startsAt.add || right2.startsAt.add,
      view: right1.startsAt.view || right2.startsAt.view,
      edit: right1.startsAt.edit || right2.startsAt.edit,
    },
    status: {
      required: right1.status.required && right2.status.required,
      add: right1.status.add || right2.status.add,
      view: right1.status.view || right2.status.view,
      edit: right1.status.edit || right2.status.edit,
    },
    tags: {
      required: right1.tags.required && right2.tags.required,
      add: right1.tags.add || right2.tags.add,
      view: right1.tags.view || right2.tags.view,
      edit: right1.tags.edit || right2.tags.edit,
    },
    taskType: {
      required: right1.taskType.required || right2.taskType.required,
      add: right1.taskType.add || right2.taskType.add,
      view: right1.taskType.view || right2.taskType.view,
      edit: right1.taskType.edit || right2.taskType.edit,
    },
  }
}

export const getGroupsProblematicAttributes = ( groups, filterData ) => {
  const filter = filterData.filter;
  const filterGroups = groups.filter( ( group ) => filterData.groups.includes( group.id ) );

  let groupsWithProblematicAttributes = [];
  filterGroups.forEach( ( group ) => {
    const attributeRights = group.attributeRights;
    const rights = group.rights;
    let problematicAttributes = [];
    if (
      !attributeRights.assigned.view && !attributeRights.assigned.edit && (
        filter.assignedToCur ||
        filter.assignedTos.length !== 0
      )
    ) {
      problematicAttributes.push( 'assigned users' );
    }

    if (
      !attributeRights.requester.view && !attributeRights.requester.edit && (
        filter.requesterCur ||
        filter.requesters.length !== 0
      )
    ) {
      problematicAttributes.push( 'requester' );
    }

    if (
      !attributeRights.taskType.view && !attributeRights.taskType.edit &&
      filter.taskTypes.length !== 0
    ) {
      problematicAttributes.push( 'task type' );
    }

    if (
      !attributeRights.company.view && !attributeRights.company.edit && (
        filter.companyCur ||
        filter.companies.length !== 0
      )
    ) {
      problematicAttributes.push( 'company' );
    }

    if (
      !attributeRights.overtime.view && !attributeRights.overtime.edit &&
      filter.overtime !== null
    ) {
      problematicAttributes.push( 'overtime' );
    }

    if (
      !attributeRights.pausal.view && !attributeRights.pausal.edit &&
      filter.pausal !== null
    ) {
      problematicAttributes.push( 'pausal' );
    }

    if (
      !attributeRights.deadline.view && !attributeRights.deadline.edit && (
        filter.deadlineFromNow ||
        filter.deadlineFrom !== null ||
        filter.deadlineToNow ||
        filter.deadlineTo !== null
      )
    ) {
      problematicAttributes.push( 'deadline' );
    }

    if (
      !attributeRights.status.view && !attributeRights.status.edit && (
        filter.statuses.length !== 0 ||
        filter.statusDateFromNow ||
        filter.statusDateFrom !== null ||
        filter.statusDateToNow ||
        filter.statusDateTo !== null ||
        filter.closeDateFromNow ||
        filter.closeDateFrom !== null ||
        filter.closeDateToNow ||
        filter.closeDateTo !== null ||
        filter.pendingDateFromNow ||
        filter.pendingDateFrom !== null ||
        filter.pendingDateToNow ||
        filter.pendingDateTo !== null
      )
    ) {
      problematicAttributes.push( 'status (statuses, status date, close date, pending date)' );
    }

    if (
      !rights.taskWorks.read && (
        filter.scheduledFromNow ||
        filter.scheduledFrom !== null ||
        filter.scheduledToNow ||
        filter.scheduledTo !== null
      )
    ) {
      problematicAttributes.push( 'task works (scheduled date)' );
    }
    if ( problematicAttributes.length !== 0 ) {
      groupsWithProblematicAttributes.push( {
        group,
        attributes: problematicAttributes
      } )
    }
  } )
  return groupsWithProblematicAttributes;
}