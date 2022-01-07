import { gql } from "@apollo/client";

const GET_SHIPPING_COSTS = gql`
query GET_SHIPPING_COSTS($zipcode: String, $productId: Int, $quantity: Int) {
  shippingCosts(productId: $productId, quantity: $quantity, zipcode: $zipcode) {
    address {
      address1
      address2
      city
      country
      state
      postcode
      desc
    }
    shippingCosts {
      name
      cost
      forecast
    } 
  }
}
`;

export default GET_SHIPPING_COSTS;