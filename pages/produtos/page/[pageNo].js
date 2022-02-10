import { useRouter } from 'next/router';
import {
	getPageOffset,
	totalPagesCount,
	PER_PAGE_FIRST,
	PER_PAGE_REST
} from '../../../src/utils/pagination';
import client from '../../../src/components/ApolloClient';
import PRODUCTS_AND_CATEGORIES_QUERY from '../../../src/queries/product-and-categories';
import { GET_TOTAL_PRODUCTS_COUNT } from '../../../src/queries/get-products-count';
import { handleRedirectsAndReturnData } from '../../../src/utils/slug';
import ProductsLayout from '../../../src/components/products/ProductsLayout';

const Page = (props) => {
	const router = useRouter();

	// Redirecting to /blog if we are on page 1
	const pageNo = router?.query?.pageNo ?? 1;

	if ('undefined' !== typeof window && '1' === pageNo) {
		router.push('/');
	}

	return (
		<ProductsLayout
			{...props}
		/>
	);
};

export default Page;

export async function getStaticProps({ params }) {

	let { pageNo } = params || {};

	const offset = getPageOffset( pageNo );
	pageNo = pageNo ? pageNo : 1;
	const { data, errors } = await client.query({
		query: PRODUCTS_AND_CATEGORIES_QUERY,
		variables: {
			perPage: '1' === pageNo ? PER_PAGE_FIRST : PER_PAGE_REST,
			offset,
		},
	});

	return {
		props: {
			data: data || {},
			productCategories: data?.productCategories?.nodes
				? data.productCategories.nodes
				: [],
			products: data?.products?.nodes || [],
			productsPageCount: totalPagesCount(data?.products?.pageInfo?.offsetPagination?.total ?? 0),
			heroCarousel: data?.heroCarousel?.nodes[0]?.children?.nodes
				? data.heroCarousel.nodes[0].children.nodes
				: [],
		},
		revalidate: 1
	}

};

export async function getStaticPaths() {
	const { data } = await client.query({
		query: GET_TOTAL_PRODUCTS_COUNT,
	});
	const totalProductsCount = data?.productsCount?.pageInfo?.offsetPagination?.total ?? 0;
	//* since the first page products and other page products will be different, we subtract the no of products we'll show on first page and then divide the result with the no of products we'll show on other pages and then will add 1 for the first page that we subtracted.
	const pagesCount = Math.ceil((totalProductsCount - PER_PAGE_FIRST) / PER_PAGE_REST + 1);
	const paths = new Array(pagesCount).fill('').map((_, index) => ({
		params: {
			pageNo: (index + 1).toString(),
		},
	}));

	return {
		paths: [...paths],
		fallback: false,
	};
}
