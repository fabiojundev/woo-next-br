import { gql } from "@apollo/client";

/**
 * Update Shipping method.
 *
 * This query is used for updating the selected shipping method option.
 */
const UPDATE_SHIPPING_ADDRESS = gql`
mutation UPDATE_SHIPPING_ADDRESS ($input: UpdateCustomerInput!) {
  updateCustomer(input: $input) {
    customer {
      shipping {
        address1
        address2
        city
        state
        postcode
        phone
        email
        firstName
        lastName
      }
    }
  }
}
`;

export default UPDATE_SHIPPING_ADDRESS;
