import client from '../src/components/ApolloClient';
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";
import { PER_PAGE_FIRST, totalPagesCount } from '../src/utils/pagination';
import ProductsLayout from '../src/components/products/ProductsLayout';

export default function Home(props) {

	return (
		<ProductsLayout 
			{...props}
		/>
	)
};

export async function getStaticProps() {

	const { data, errors } = await client.query({
		query: PRODUCTS_AND_CATEGORIES_QUERY,
		variables: {
			perPage: PER_PAGE_FIRST,
			offset: 0,
		},
	});

	return {
		props: {
			data: data || {},
			productCategories: data?.productCategories?.nodes
				? data.productCategories.nodes
				: [],
			products: data?.products?.nodes
				? data.products.nodes
				: [],
			productsPageCount: totalPagesCount( data?.products?.pageInfo?.offsetPagination?.total ?? 0 ),
			heroCarousel: data?.heroCarousel?.nodes[0]?.children?.nodes
				? data.heroCarousel.nodes[0].children.nodes
				: [],
		},
		revalidate: 1
	}

};
