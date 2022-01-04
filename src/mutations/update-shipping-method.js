import { gql } from "@apollo/client";

/**
 * Update Shipping method.
 *
 * This query is used for updating the selected shipping method option.
 */
const UPDATE_SHIPPING_METHOD = gql`
mutation UPDATE_SHIPPING_METHOD ($input: UpdateShippingMethodInput!) {
  updateShippingMethod(input: $input) {
    cart {
      availableShippingMethods {
        packageDetails
        supportsShippingCalculator
        rates {
          id
          cost
          label
        }
      }
      chosenShippingMethods
      shippingTotal
      shippingTax
      subtotal
      subtotalTax
      total
    }
  }
}
`;

export default UPDATE_SHIPPING_METHOD;
