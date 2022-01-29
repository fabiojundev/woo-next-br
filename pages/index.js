import Layout from '../src/components/Layout';
import Product from "../src/components/Product";
import client from '../src/components/ApolloClient';
import ParentCategoriesBlock from "../src/components/category/category-block/ParentCategoriesBlock";
import PRODUCTS_AND_CATEGORIES_QUERY from "../src/queries/product-and-categories";
import HeroCarousel from "../src/components/home/hero-carousel";

export default function Home(props) {

	const { 
		data, 
		products, 
		productCategories, 
		heroCarousel 
	} = props || {};

	return (
		<Layout data={data}>
			{/*Hero Carousel*/}
			{/* <HeroCarousel heroCarousel={heroCarousel} /> */}
			{/*Categories*/}
			{/* <div className="product-categories-container mx-auto my-32 px-4 xl:px-0">
				<h2 className="main-title text-xl mb-5 uppercase">
					<span className="main-title-inner">Categorias</span>
				</h2>
				<ParentCategoriesBlock productCategories={productCategories} />
			</div> */}
			{/*Products*/}
			<div className="products mx-auto my-10 px-4 xl:px-0">
				<h2 className="products-main-title main-title mb-5 text-xl uppercase">
					<span className="main-title-inner">
						Produtos
					</span>
				</h2>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
					{products.length ? (
						products.map(product =>
							<Product
								key={product.id}
								product={product}
							/>
						)
					) : ''}
				</div>
			</div>

		</Layout>
	)
};

export async function getStaticProps() {

	const { data } = await client.query({
		query: PRODUCTS_AND_CATEGORIES_QUERY,
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
			heroCarousel: data?.heroCarousel?.nodes[0]?.children?.nodes
				? data.heroCarousel.nodes[0].children.nodes
				: [],
		},
		revalidate: 1
	}

};
