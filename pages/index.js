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
			{/*Products*/}
			<div className="products 
							mx-auto 
							my-10 
							px-4 
							xl:px-0 
							flex flex-wrap flex-row-reverse
							md:flex-nowrap 
							gap-4"
			>
				<section
					id="content"
					className="flex-grow"
				>
					<h2 className="products-main-title main-title mb-5 text-xl">
						<span className="main-title-inner">
							Produtos
						</span>
					</h2>
					<div
						className="grid grid-cols-1 
									sm:grid-cols-2 
									md:grid-cols-2 
									lg:grid-cols-3 
									xl:grid-cols-4 
									gap-4"
					>
						{products.length ? (
							products.map(product =>
								<Product
									key={product.id}
									product={product}
								/>
							)
						) : ''}
					</div>
				</section>
				<aside
					id="siderbar"
					className="w-full 
								md:w-1/3 
								lg:w-1/3 
								xl:w-1/3"
				>
					<h2>Categorias</h2>
					<ParentCategoriesBlock 
						productCategories={productCategories} 
					/>
				</aside>
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
