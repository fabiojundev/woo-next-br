import { gql } from "@apollo/client";

export const GetCustomer = `
customer {
  email
  shipping {
    cpf
    address1
    number
    address2
    city
    company
    country
    email
    firstName
    lastName
    phone
    postcode
    state
  }
}
`;

export const GET_CUSTOMER = gql`
query GET_CUSTOMER {
  ${GetCustomer}
}
`;
