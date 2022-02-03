import { gql } from "@apollo/client";

export const PRODUCT_BY_CATEGORY_SLUG = gql` query PRODUCT_BY_CATEGORY_SLUG($slug: ID!, $first: Int) {
	productCategory(id: $slug, idType: SLUG) {
	  id
	  name
	  products(first: $first) {
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
			uri
			title
			srcSet
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
			regularPrice
			id
		  }
		  ... on ExternalProduct {
			price
			id
			regularPrice
			externalUrl
		  }
		  ... on GroupProduct {
			products {
			  nodes {
				... on SimpleProduct {
				  id
				  regularPrice
				  price
				}
			  }
			}
			id
		  }
		}
	  }
	}
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
  }
  `;

export const PRODUCT_CATEGORIES_SLUGS = gql` query PRODUCT_CATEGORIES_SLUGS {
	productCategories(where: {exclude: [16]}) {
	  nodes {
		id
		slug
		productsCount: products {
		  pageInfo {
			offsetPagination {
			  total
			}
		  }
		}
	  }
	}
  }`;
