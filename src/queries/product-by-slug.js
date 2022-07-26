import { gql } from "@apollo/client";
import SeoFragment from "./fragments/seo";
import {HeaderFooter} from "./get-menus";
import MenuFragment from './fragments/menus';

export const PRODUCT_BY_SLUG_QUERY = gql` query Product($slug: ID!) {
	${HeaderFooter}
	product(id: $slug, idType: SLUG) {
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
	  galleryImages {
          nodes {
            id
            title
            altText
            mediaItemUrl
          }
      }
	  image {
		id
		uri
		title
		srcSet
		sourceUrl
	  }
	  name
	  ... on SimpleProduct {
		price
		id
		regularPrice
		seo {
			...SeoFragment
		}	
	  }
	  ... on VariableProduct {
		price
		id
		regularPrice
		seo {
			...SeoFragment
		}
	  }
	  ... on ExternalProduct {
		price
		id
		regularPrice
		externalUrl
		seo {
			...SeoFragment
		}
	  }
	  ... on GroupProduct {
		products {
		  nodes {
			... on SimpleProduct {
			  id
			  price
			  regularPrice
			  seo {
					...SeoFragment
				}
			}
		  }
		}
		id
	  }
	}
  }
  ${MenuFragment}
  ${SeoFragment}	
`;

export const PRODUCT_SLUGS = gql` query Products {
  products(first: 5000) {
    nodes {
      id
      slug
    }
  }
}
`;
