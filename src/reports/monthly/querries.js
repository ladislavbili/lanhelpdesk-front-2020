import {
	gql
} from "@apollo/client";

export const GET_INVOICE_COMPANIES = gql`
query getInvoiceCompanies(
  $fromDate: String!,
  $toDate: String!,
  $statuses: [Int]!
){
    getInvoiceCompanies(
      fromDate: $fromDate
      toDate: $toDate
      statuses: $statuses
    ) {
        company {
          id
          title
        }
        subtasksHours
        tripsHours
        materialsQuantity
        customItemsQuantity
        rentedItemsQuantity
  }
}
`;

export const GET_COMPANY_INVOICE_DATA = gql`
query getCompanyInvoiceData(
  $fromDate: String!,
  $toDate: String!,
  $companyId: Int!,
  $statuses: [Int]!
){
    getCompanyInvoiceData(
      fromDate: $fromDate
      toDate: $toDate
      companyId: $companyId
      statuses: $statuses
    ) {
			company{
				companyRents {
					id
					title
					quantity
					cost
					price
					total
				}
			}
    companyRentsCounts {
      totalWithoutDPH
      totalWithDPH
    }
		pausalTasks{
			task {
				id
				title
				overtime
				assignedTo {
					email
					id
				}
				requester {
					email
					id
				}
				status {
					id
					title
					action
					color
				}
				closeDate
				company {
					title
				}
			}
			subtasks {
				id
				title
				quantity
				type {
					title
				}
			}
			trips {
				id
				quantity
				type {
					title
				}
			}
		}
		pausalCounts{
			subtasks
			subtasksAfterHours
			subtasksAfterHoursTaskIds
			subtasksAfterHoursPrice
			trips
			tripsAfterHours
			tripsAfterHoursTaskIds
			tripsAfterHoursPrice
		}
		overPausalCounts{
			subtasks
			subtasksAfterHours
			subtasksAfterHoursTaskIds
			subtasksAfterHoursPrice
			subtasksTotalPriceWithoutDPH
			subtasksTotalPriceWithDPH
			trips
			tripsAfterHours
			tripsAfterHoursTaskIds
			tripsAfterHoursPrice
			tripsTotalPriceWithoutDPH
			tripsTotalPriceWithDPH
		}
		overPausalTasks{
			task {
				id
				title
				overtime
				assignedTo {
					id
					email
				}
				requester {
					email
					id
				}
				status {
					id
					title
					action
					color
				}
				closeDate
				company {
					title
				}
			}
			subtasks {
				id
				title
				quantity
				discount
				type {
					title
				}
			}
			trips {
				id
				quantity
				discount
				type {
					title
				}
			}
		}
		projectTasks{
			id
			title
			overtime
			assignedTo {
				email
				id
			}
			requester {
				email
				id
			}
			status {
				id
				title
				action
				color
			}
			closeDate
			company {
				title
			}
			subtasks {
				id
				title
				quantity
				discount
				type {
					title
				}
			}
			workTrips {
				id
				quantity
				discount
				type {
					title
				}
			}
		}
		projectCounts{
			subtasks
			subtasksAfterHours
			subtasksAfterHoursTaskIds
			subtasksAfterHoursPrice
			subtasksTotalPriceWithoutDPH
			subtasksTotalPriceWithDPH
			trips
			tripsAfterHours
			tripsAfterHoursTaskIds
			tripsAfterHoursPrice
			tripsTotalPriceWithoutDPH
			tripsTotalPriceWithDPH
		}
		materialTasks{
			task {
				id
				title
				status{
					id
					title
					color
				}
				statusChange
				assignedTo{
					id
					email
				}
				requester{
					id
					email
				}
			}
			materials {
				id
				title
				quantity
				price
				totalPrice
			}
			customItems {
				id
				title
				quantity
				price
				totalPrice
			}
		}
		totalMaterialAndCustomItemPriceWithoutDPH
		totalMaterialAndCustomItemPriceWithDPH
  }
}
`;

/*



}

*/

export const GET_STATUSES = gql `
query {
  statuses {
    title
    id
    action
    order
    color
  }
}
`;

export const GET_LOCAL_CACHE = gql `
query getLocalCache {
  reportsYear @client
  reportsMonth @client
  reportsToDate @client
  reportsFromDate @client
  reportsChosenStatuses @client
}
`;
