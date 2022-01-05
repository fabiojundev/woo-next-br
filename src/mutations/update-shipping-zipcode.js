import { gql } from "@apollo/client";

/**
 * Update Shipping method.
 *
 * This query is used for updating the selected shipping method option.
 */
const UPDATE_SHIPPING_ZIPCODE = gql`
mutation UPDATE_SHIPPING_ZIPCODE ($input: UpdateCustomerInput!) {
  updateCustomer(input: $input) {
    customer {
      id
      email
      firstName
      shipping {
        address1
        address2
        city
        state
        postcode
      }
    }
  }
}
`;

export default UPDATE_SHIPPING_ZIPCODE;
