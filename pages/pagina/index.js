
// import client from '../../src/components/ApolloClient';
import client from '../../src/components/ApolloClient';
import Layout from '../../src/components/Layout';
import { PER_PAGE_FIRST, totalPagesCount } from '../../src/utils/pagination';
import Pagination from '../../src/components/blog/pagination';
import { Pages, Page } from '../../src/components/page';
import { handleRedirectsAndReturnData } from '../../src/utils/slug';
import { GET_PAGES_URI } from '../../src/queries/pages/get-pages';

const Pagina = ({ data }) => {
	console.log( data);
	const pagesCount = totalPagesCount(data?.pages?.pageInfo?.offsetPagination?.total ?? 0);
	return (
		<Layout data={data}>
			<Pages pages={data?.pages?.nodes ?? []} />
		</Layout>
	);
};

export default Pagina;

export async function getStaticProps() {
	console.log( "qery", GET_PAGES_URI );
	const { data, errors } = await client.query({
		query: GET_PAGES_URI,
	});

	console.log( data);

	const defaultProps = {
		props: {
			data: data || {}
		},
		/**
		 * Revalidate means that if a new request comes to server, then every 1 sec it will check
		 * if the data is changed, if it is changed then it will update the
		 * static file inside .next folder with the new data, so that any 'SUBSEQUENT' requests should have updated data.
		 */
		revalidate: 5,
	};

	return handleRedirectsAndReturnData(defaultProps, data, errors, 'pages');
}
