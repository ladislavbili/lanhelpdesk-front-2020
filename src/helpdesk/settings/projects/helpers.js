export const remapRightsToBackend = ( group ) => ( {
  id: group.id,
  title: group.title,
  order: parseInt( group.order ),
  rights: {
    assignedRead: group.rights.assigned.read,
    assignedWrite: group.rights.assigned.write,
    companyRead: group.rights.company.read,
    companyWrite: group.rights.company.write,
    deadlineRead: group.rights.deadline.read,
    deadlineWrite: group.rights.deadline.write,
    milestoneRead: group.rights.milestone.read,
    milestoneWrite: group.rights.milestone.write,
    overtimeRead: group.rights.overtime.read,
    overtimeWrite: group.rights.overtime.write,
    pausalRead: group.rights.pausal.read,
    pausalWrite: group.rights.pausal.write,
    projectRead: group.rights.project.read,
    projectWrite: group.rights.project.write,
    projectPrimaryRead: group.rights.projectPrimary.read,
    projectPrimaryWrite: group.rights.projectPrimary.write,
    repeatRead: group.rights.repeat.read,
    repeatWrite: group.rights.repeat.write,
    requesterRead: group.rights.requester.read,
    requesterWrite: group.rights.requester.write,
    rozpocetRead: group.rights.rozpocet.read,
    rozpocetWrite: group.rights.rozpocet.write,
    scheduledRead: group.rights.scheduled.read,
    scheduledWrite: group.rights.scheduled.write,
    statusRead: group.rights.status.read,
    statusWrite: group.rights.status.write,
    tagsRead: group.rights.tags.read,
    tagsWrite: group.rights.tags.write,
    taskAttachmentsRead: group.rights.taskAttachments.read,
    taskAttachmentsWrite: group.rights.taskAttachments.write,
    taskDescriptionRead: group.rights.taskDescription.read,
    taskDescriptionWrite: group.rights.taskDescription.write,
    taskShortSubtasksRead: group.rights.taskShortSubtasks.read,
    taskShortSubtasksWrite: group.rights.taskShortSubtasks.write,
    typeRead: group.rights.type.read,
    typeWrite: group.rights.type.write,
    vykazRead: group.rights.vykaz.write,
    vykazWrite: group.rights.vykaz.write,
    deleteTasks: group.rights.deleteTasks,
    important: group.rights.important,
    addComments: group.rights.addComments,
    emails: group.rights.emails,
    history: group.rights.history,
    internal: group.rights.internal,
    projectSecondary: group.rights.projectSecondary,
    pausalInfo: group.rights.pausalInfo,
    taskTitleEdit: group.rights.taskTitleEdit,
    viewComments: group.rights.viewComments,


  }
} )

export const remapRightsFromBackend = ( group ) => ( {
  id: group.id,
  title: group.title,
  order: parseInt( group.order ),
  rights: {
    assigned: {
      read: group.rights.assignedRead,
      write: group.rights.assignedWrite,
    },
    company: {
      read: group.rights.companyRead,
      write: group.rights.companyWrite,
    },
    deadline: {
      read: group.rights.deadlineRead,
      write: group.rights.deadlineWrite,
    },
    milestone: {
      read: group.rights.milestoneRead,
      write: group.rights.milestoneWrite,
    },
    overtime: {
      read: group.rights.overtimeRead,
      write: group.rights.overtimeWrite,
    },
    pausal: {
      read: group.rights.pausalRead,
      write: group.rights.pausalWrite,
    },
    project: {
      read: group.rights.projectRead,
      write: group.rights.projectWrite,
    },
    projectPrimary: {
      read: group.rights.projectPrimaryRead,
      write: group.rights.projectPrimaryWrite,
    },
    repeat: {
      read: group.rights.repeatRead,
      write: group.rights.repeatWrite,
    },
    requester: {
      read: group.rights.requesterRead,
      write: group.rights.requesterWrite,
    },
    rozpocet: {
      read: group.rights.rozpocetRead,
      write: group.rights.rozpocetWrite,
    },
    scheduled: {
      read: group.rights.scheduledRead,
      write: group.rights.scheduledWrite,
    },
    status: {
      read: group.rights.statusRead,
      write: group.rights.statusWrite,
    },
    tags: {
      read: group.rights.tagsRead,
      write: group.rights.tagsWrite,
    },
    taskAttachments: {
      read: group.rights.taskAttachmentsRead,
      write: group.rights.taskAttachmentsWrite,
    },
    taskDescription: {
      read: group.rights.taskDescriptionRead,
      write: group.rights.taskDescriptionWrite,
    },
    taskShortSubtasks: {
      read: group.rights.taskShortSubtasksRead,
      write: group.rights.taskShortSubtasksWrite,
    },
    type: {
      read: group.rights.typeRead,
      write: group.rights.typeWrite,
    },
    vykaz: {
      read: group.rights.vykazRead,
      write: group.rights.vykazWrite,
    },
    deleteTasks: group.rights.deleteTasks,
    important: group.rights.important,
    addComments: group.rights.addComments,
    emails: group.rights.emails,
    history: group.rights.history,
    internal: group.rights.internal,
    projectSecondary: group.rights.projectSecondary,
    pausalInfo: group.rights.pausalInfo,
    taskTitleEdit: group.rights.taskTitleEdit,
    viewComments: group.rights.viewComments,
  }
} )