import { gql } from "@apollo/client";
import SeoFragment from "./fragments/seo";

/**
 * GraphQL categories and products query.
 */
const GET_PRODUCTS = gql`query {
  products(first: 50) {
    pageInfo {
      offsetPagination {
        total
      }
    }
    nodes {
      id
      productId: databaseId
      averageRating
      slug
      description
      shortDescription
      image {
        id
        altText
        sourceUrl
      }
      name
      ... on SimpleProduct {
        price
        regularPrice
        id
      }
      ... on VariableProduct {
        price
        id
        regularPrice
      }
      ... on ExternalProduct {
        price
        id
        externalUrl
        regularPrice
      }
      ... on GroupProduct {
        id
        products {
          nodes {
            ... on SimpleProduct {
              id
              price
              regularPrice
            }
          }
        }
      }
    }
  }
}
`;

export default GET_PRODUCTS;
