import { gql } from "@apollo/client";
import SeoFragment from "./fragments/seo";

/**
 * GraphQL categories and products query.
 */
const PRODUCTS_AND_CATEGORIES_QUERY = gql`query( $slug: [String], $perPage: Int, $offset: Int) {
  productCategories(where:{exclude:[16]}) {
    nodes {
      id
      name
      slug
      image {
        id
        sourceUrl
        srcSet
      }
    }
  }
  products(where: { offsetPagination: { size: $perPage, offset: $offset }, categoryIn: $slug }) {
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
      visibleProducts {
        nodes {
          slug
          count
        }
      }
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

export default PRODUCTS_AND_CATEGORIES_QUERY;
