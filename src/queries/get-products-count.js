import { gql } from "@apollo/client";

export const GET_TOTAL_PRODUCTS_COUNT = gql`
  query GET_TOTAL_PRODUCTS_COUNT {
  productsCount: products {
      pageInfo {
        offsetPagination {
          total
        }
      }
    }
  }
`;
