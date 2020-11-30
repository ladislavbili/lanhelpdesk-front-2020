import {
  gql
} from '@apollo/client';

export const ADD_TASK = gql `
mutation addTask(
  $title: String!,
  $closeDate: String,
  $assignedTo: [Int]!,
  $company: Int!,
  $deadline: String,
  $description: String!,
  $milestone: Int,
  $overtime: Boolean!,
  $pausal: Boolean!,
  $pendingChangable: Boolean,
  $pendingDate: String,
  $project: Int!,
  $requester: Int,
  $status: Int!,
  $tags: [Int]!,
  $taskType: Int!,
  $repeat: RepeatInput,
  $subtasks: [SubtaskInput],
  $workTrips: [WorkTripInput],
  $materials: [MaterialInput],
  $customItems: [CustomItemInput]
){
  addTask(
    title: $title,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    deadline: $deadline,
    description: $description,
    milestone: $milestone,
    overtime: $overtime,
    pausal: $pausal,
    pendingChangable: $pendingChangable,
    pendingDate: $pendingDate,
    project: $project,
    requester: $requester,
    status: $status,
    tags: $tags,
    taskType: $taskType,
    repeat: $repeat,
    subtasks: $subtasks,
    workTrips: $workTrips,
    materials: $materials,
    customItems: $customItems,
  ){
    id
    title
  }
}
`;

export const ADD_USER_TO_PROJECT = gql `
mutation addUserToProject(
  $userId: Int!,
  $projectId: Int!,
){
  addTask(
    userId: $userId
    projectId: $projectId,
  ){
    id
  }
}
`;

export const GET_TASKS = gql `
query tasks($filter: FilterInput, $projectId: Int){
  tasks (
    filter: $filter,
    projectId: $projectId,
  ){
		tasks {
			id
			title
			updatedAt
			createdAt
			important
			closeDate
			overtime
			pausal
			pendingChangable
			statusChange
			assignedTo {
				id
				fullName
				email
			}
			company {
				id
				title
			}
			createdBy {
				id
				name
				surname
			}
			deadline
			description
			milestone{
				id
				title
			}
			pendingDate
			project{
				id
				title
        right{
          write
          delete
        }
			}
			requester{
				id
				name
				surname
				fullName
				email
			}
			status {
				id
				title
				color
				action
			}
			tags {
				id
				title
			}
			taskType {
				id
				title
			}
			repeat {
				repeatEvery
				repeatInterval
				startsAt
			}
		}
    execTime
    secondaryTimes {
      time
      source
    }
  }
}
`;

export const DELETE_TASK = gql `
mutation deleteTask($id: Int!) {
  deleteTask(
    id: $id,
  ){
    id
  }
}
`;

export const GET_MY_DATA = gql `
query {
  getMyData{
    id
		statuses {
			id
			title
			color
			action
		}
		company {
			id
			title
		}
    role {
			level
      accessRights {
        projects
        mailViaComment
        viewInternal
        publicFilters
        users
        companies
        vykazy
      }
    }
  }
}
`;

export const GET_EMAILS = gql `
query emails($task: Int!){
	emails(
		task: $task
	)  {
		id
		createdAt
    subject
    message
    user {
      id
      fullName
    }
    toEmails
  }
}
`;

export const GET_TASK = gql `
query task($id: Int!){
	task(
		id: $id
	)  {
		id
		important
		title
		updatedAt
		createdAt
		closeDate
    taskAttachments{
      id
      path
      filename
      size
      mimetype
    }
		assignedTo {
			id
			name
			surname
			email
		}
		company {
			id
			title
      dph
      usedTripPausal
      usedSubtaskPausal
      taskWorkPausal
      taskTripPausal
      monthly
      monthlyPausal
      pricelist {
        id
        title
        materialMargin
        prices {
          type
          price
          taskType {
            id
          }
          tripType {
            id
          }
        }
      }
		}
    taskChanges{
      createdAt
      user{
        id
        fullName
      }
      taskChangeMessages{
        type
        message
      }
    }
		createdBy {
			id
			name
			surname
		}
		deadline
		description
		milestone{
			id
			title
		}
		pendingDate
		project{
			id
			title
		}
		requester{
			id
			fullName
		}
		status {
			id
			title
			color
			action
		}
		tags {
			id
			title
			color
		}
		taskType {
			id
			title
		}
		repeat {
			repeatEvery
			repeatInterval
			startsAt
		}
		subtasks {
      invoicedData{
        price
        quantity
        type
        assignedTo
      }
			id
			title
			order
			done
			quantity
			discount
			type {
				id
				title
			}
			assignedTo {
				id
				email
				company {
					id
				}
			}
		}
		workTrips {
      invoicedData{
        price
        quantity
        type
        assignedTo
      }
			id
			order
			done
			quantity
			discount
			type {
				id
				title
			}
			assignedTo {
				id
				email
				company {
					id
				}
			}
		}
		materials {
      invoicedData{
        title
        quantity
        price
        totalPrice
        margin
      }
			id
			title
			order
			done
			quantity
			margin
			price
		}
		customItems {
      invoicedData{
        title
        quantity
        price
        totalPrice
      }
			id
			title
			order
			done
			quantity
			price
		}
		comments {
      id
      createdAt
      internal
      isEmail
      message
      html
      subject
      tos
      emailSend
      emailError
      user{
        id
        fullName
        email
      }
      commentAttachments{
        id
        path
        filename
        size
        mimetype
      }
      childComments {
        id
        createdAt
        internal
        isEmail
        message
        html
        subject
        tos
        emailSend
        emailError
        user{
          id
          fullName
          email
        }
        commentAttachments{
        id
        path
        filename
        size
        mimetype
        }
      }
		}
    invoicedTasks {
      assignedTo {
        title
        UserId
      }
      tags {
        title
        color
        TagId
      }
      project
      requester
      taskType
      company
      milestone
    }
	}
}
`;

export const UPDATE_TASK = gql `
mutation updateTask(
  $id: Int!,
  $important: Boolean,
  $title: String,
  $closeDate: String,
  $assignedTo: [Int],
  $company: Int,
  $deadline: String,
  $description: String,
  $milestone: Int,
  $overtime: Boolean,
  $pausal: Boolean,
  $pendingChangable: Boolean,
  $pendingDate: String,
  $project: Int,
  $requester: Int,
  $status: Int,
  $tags: [Int],
  $taskType: Int,
  $repeat: RepeatInput
) {
  updateTask(
		id: $id,
		important: $important,
    title: $title,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    deadline: $deadline,
    description: $description,
    milestone: $milestone,
    overtime: $overtime,
    pausal: $pausal,
    pendingChangable: $pendingChangable,
    pendingDate: $pendingDate,
    project: $project,
    requester: $requester,
    status: $status,
    tags: $tags,
    taskType: $taskType,
    repeat: $repeat,
  ){
      id
      important
      title
      updatedAt
      createdAt
      closeDate
      assignedTo {
        id
        name
        surname
        email
      }
      company {
        id
        title
        dph
        usedTripPausal
        usedSubtaskPausal
        taskWorkPausal
        taskTripPausal
        monthly
        monthlyPausal
        pricelist {
          id
          title
          materialMargin
          prices {
            type
            price
            taskType {
              id
            }
            tripType {
              id
            }
          }
        }
      }
      createdBy {
        id
        name
        surname
      }
      deadline
      description
      milestone{
        id
        title
      }
      pendingDate
      project{
        id
        title
      }
      requester{
        id
        name
        surname
      }
      status {
        id
        title
        color
        action
      }
      tags {
        id
        title
        color
      }
      taskType {
        id
        title
      }
      repeat {
        repeatEvery
        repeatInterval
        startsAt
      }
    }
}
`;
//table
export const ADD_SUBTASK = gql `
mutation addSubtask($title: String!, $order: Int!, $done: Boolean!, $quantity: Float!, $discount: Float!, $type: Int!, $task: Int!, $assignedTo: Int!) {
  addSubtask(
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		discount: $discount,
		type: $type,
		task: $task,
		assignedTo: $assignedTo,
  ){
    id
    title
    order
    done
    quantity
    discount
    type {
      id
      title
    }
    assignedTo {
      id
      email
      company {
        id
      }
    }
  }
}
`;

export const UPDATE_SUBTASK = gql `
mutation updateSubtask($id: Int!, $title: String, $order: Int, $done: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int) {
  updateSubtask(
		id: $id,
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		discount: $discount,
		type: $type,
		assignedTo: $assignedTo,
  ){
    id
    title
    order
    done
    quantity
    discount
    type {
      id
      title
    }
    assignedTo {
      id
      email
      company {
        id
      }
    }
  }
}
`;

export const DELETE_SUBTASK = gql `
mutation deleteSubtask($id: Int!) {
  deleteSubtask(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_WORKTRIP = gql `
mutation addWorkTrip($order: Int!, $done: Boolean!, $quantity: Float!, $discount: Float!, $type: Int!, $task: Int!, $assignedTo: Int!) {
  addWorkTrip(
		order: $order,
		done: $done,
		quantity: $quantity,
		discount: $discount,
		type: $type,
		task: $task,
		assignedTo: $assignedTo,
  ){
    id
    order
    done
    quantity
    discount
    type {
      id
      title
    }
    assignedTo {
      id
      email
      company {
        id
      }
    }
  }
}
`;

export const UPDATE_WORKTRIP = gql `
mutation updateWorkTrip($id: Int!, $order: Int, $done: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int) {
  updateWorkTrip(
		id: $id,
		order: $order,
		done: $done,
		quantity: $quantity,
		discount: $discount,
		type: $type,
		assignedTo: $assignedTo,
  ){
    id
    order
    done
    quantity
    discount
    type {
      id
      title
    }
    assignedTo {
      id
      email
      company {
        id
      }
    }
  }
}
`;

export const DELETE_WORKTRIP = gql `
mutation deleteWorkTrip($id: Int!) {
  deleteWorkTrip(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_MATERIAL = gql `
mutation addMaterial($title: String!, $order: Int!, $done: Boolean!, $quantity: Float!, $margin: Float!, $price: Float!, $task: Int!) {
  addMaterial(
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		margin: $margin,
		price: $price,
		task: $task,
  ){
    id
    title
    order
    done
    quantity
    margin
    price
  }
}
`;

export const UPDATE_MATERIAL = gql `
mutation updateMaterial($id: Int!, $title: String, $order: Int, $done: Boolean, $quantity: Float, $margin: Float, $price: Float) {
  updateMaterial(
		id: $id,
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		margin: $margin,
		price: $price,
  ){
    id
    title
    order
    done
    quantity
    margin
    price
  }
}
`;

export const DELETE_MATERIAL = gql `
mutation deleteMaterial($id: Int!) {
  deleteMaterial(
    id: $id,
  ){
    id
  }
}
`;

export const ADD_CUSTOM_ITEM = gql `
mutation addCustomItem($title: String!, $order: Int!, $done: Boolean!, $quantity: Float!, $price: Float!, $task: Int!) {
  addCustomItem(
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		price: $price,
		task: $task,
  ){
    id
    title
    order
    done
    quantity
    price
  }
}
`;

export const UPDATE_CUSTOM_ITEM = gql `
mutation updateCustomItem($id: Int!, $title: String, $order: Int, $done: Boolean, $quantity: Float, $price: Float) {
  updateCustomItem(
		id: $id,
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		price: $price,
  ){
    id
    title
    order
    done
    quantity
    price
  }
}
`;

export const DELETE_CUSTOM_ITEM = gql `
mutation deleteCustomItem($id: Int!) {
  deleteCustomItem(
    id: $id,
  ){
    id
  }
}
`;

export const DELETE_TASK_ATTACHMENT = gql `
mutation deleteTaskAttachment($id: Int!) {
  deleteTaskAttachment(
    id: $id,
  ){
    id
  }
}
`;

export const UPDATE_INVOICED_TASK = gql `
mutation updateInvoicedTask($id: Int!, $taskChanges: InvoicedTaskChange, $stmcChanges: InvoicedSMTCChanges) {
  updateInvoicedTask(
		id: $id,
    taskChanges: $taskChanges,
		stmcChanges: $stmcChanges,
  ){
		id
		important
		title
		updatedAt
		createdAt
		closeDate
    taskAttachments{
      id
      path
      filename
      size
      mimetype
    }
		assignedTo {
			id
			name
			surname
			email
		}
		company {
			id
			title
      dph
      usedTripPausal
      usedSubtaskPausal
      taskWorkPausal
      taskTripPausal
      monthly
      monthlyPausal
      pricelist {
        id
        title
        materialMargin
        prices {
          type
          price
          taskType {
            id
          }
          tripType {
            id
          }
        }
      }
		}
    taskChanges{
      createdAt
      user{
        id
        fullName
      }
      taskChangeMessages{
        type
        message
      }
    }
		createdBy {
			id
			name
			surname
		}
		deadline
		description
		milestone{
			id
			title
		}
		pendingDate
		project{
			id
			title
		}
		requester{
			id
			fullName
		}
		status {
			id
			title
			color
			action
		}
		tags {
			id
			title
			color
		}
		taskType {
			id
			title
		}
		repeat {
			repeatEvery
			repeatInterval
			startsAt
		}
		subtasks {
      invoicedData{
        price
        quantity
        type
        assignedTo
      }
			id
			title
			order
			done
			quantity
			discount
			type {
				id
				title
			}
			assignedTo {
				id
				email
				company {
					id
				}
			}
		}
		workTrips {
      invoicedData{
        price
        quantity
        type
        assignedTo
      }
			id
			order
			done
			quantity
			discount
			type {
				id
				title
			}
			assignedTo {
				id
				email
				company {
					id
				}
			}
		}
		materials {
      invoicedData{
        title
        quantity
        price
        totalPrice
        margin
      }
			id
			title
			order
			done
			quantity
			margin
			price
		}
		customItems {
      invoicedData{
        title
        quantity
        price
        totalPrice
      }
			id
			title
			order
			done
			quantity
			price
		}
		comments {
      id
      createdAt
      internal
      isEmail
      message
      html
      subject
      tos
      emailSend
      emailError
      user{
        id
        fullName
        email
      }
      commentAttachments{
        id
        path
        filename
        size
        mimetype
      }
      childComments {
        id
        createdAt
        internal
        isEmail
        message
        html
        subject
        tos
        emailSend
        emailError
        user{
          id
          fullName
          email
        }
        commentAttachments{
        id
        path
        filename
        size
        mimetype
        }
      }
		}
    invoicedTasks {
      assignedTo {
        title
        UserId
      }
      tags {
        title
        color
        TagId
      }
      project
      requester
      taskType
      company
      milestone
    }
	}
}
`