import Layout from '../src/components/Layout';
import client from '../src/components/ApolloClient';
import ParentCategoriesBlock from "../src/components/category/category-block/ParentCategoriesBlock";
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";
import { PER_PAGE_FIRST, totalPagesCount } from '../src/utils/pagination';
import HeroCarousel from "../src/components/home/hero-carousel";
import ContactWhatsApp from '../src/components/ContactWhatsApp';
import InstagramEmbed from '../src/components/InstagramEmbed.html';
import Products from '../src/components/products';
import ProductsLayout from '../src/components/products/ProductsLayout';

export default function Home(props) {

	return (
		<ProductsLayout 
			{...props}
		/>
	)
};

export async function getStaticProps() {

	const { data } = await client.query({
		query: PRODUCTS_AND_CATEGORIES_QUERY,
		variables: {
			uri: '/produtos/',
			perPage: PER_PAGE_FIRST,
			offset: null,
		},
	});

	return {
		props: {
			data,
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
