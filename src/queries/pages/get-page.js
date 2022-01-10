import { gql } from "@apollo/client";
import SeoFragment from "../fragments/seo";

export const GET_PAGE = gql`
	query GET_PAGE($uri: String) {
	  page: pageBy(uri: $uri) {
	    id
	    title
	    content
	    slug
	    uri
	    seo {
          ...SeoFragment
        }
	  }
	}
	${SeoFragment}
`;

export const GET_PAGE_BY_ID = gql`
	query GET_PAGE_BY_ID($id: ID!) {
	  page(idType: DATABASE_ID, id: $id) {
	    id
	    title
	    content
	    slug
	    uri
	    seo {
          ...SeoFragment
        }
		status
	  }
	}
	${SeoFragment}
`;
