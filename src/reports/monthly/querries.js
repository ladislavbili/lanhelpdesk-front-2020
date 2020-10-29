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
        projectTasks{
          id
          title
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
        pausalTasks{
          task {
            id
						title
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
          }
          trips {
            id
            type {
              title
            }
          }
        }
        overPausalTasks{
          task {
            id
						title
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
          }
          trips {
            id
            type {
              title
            }
          }
        }
        materials {
          material {
            id
            title
          }
          totalPrice
          price
        }
        customItems {
          customItem{
            id
            title
          }
          price
          totalPrice
        }
        totalMaterialAndCustomItemPriceWithoutDPH
        totalMaterialAndCustomItemPriceWithDPH
  }
}
`;

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
