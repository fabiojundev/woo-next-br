import client from '../../src/components/ApolloClient';
import Layout from '../../src/components/layout/index.js';
import { PER_PAGE_FIRST, totalPagesCount } from '../../src/utils/pagination';
import Pagination from '../../src/components/blog/pagination';
import Posts from '../../src/components/blog/posts';
import {handleRedirectsAndReturnData} from '../../src/utils/slug';
import {GET_POSTS} from '../../src/queries/posts/get-posts';

const Blog = ({ data }) => {
	console.log("djooow1", data);
	const pagesCount = totalPagesCount( data?.posts?.pageInfo?.offsetPagination?.total ?? 0 );
	return (
		<Layout data={data}>
			<Posts posts={data?.posts?.edges ?? []}/>
			<Pagination pagesCount={pagesCount} postName="blog" />
		</Layout>
	);
};

export default Blog;

export async function getStaticProps() {


	let ret = { data: {}, error: {} };

	try {
		// console.log(client);
		ret = await client.query( {
			query: GET_POSTS,
			variables: {
				uri: '/blog/',
				perPage: PER_PAGE_FIRST,
				offset: null,
			},
		} ).catch(console.errors).then( console.error("RET", ret) );
	} catch (e) {
        console.error("DERROR", e);
    }

	const { data, errors } = ret;
	const defaultProps = {
		props: {
			data: data || {}
		},
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 1,
	};
	return handleRedirectsAndReturnData(defaultProps, data, errors, 'posts');
}
