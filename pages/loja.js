import Layout from '../src/components/Layout';
import Product from "../src/components/Product";
import client from '../src/components/ApolloClient';
import GET_PRODUCTS from "../src/queries/get-products";

export default function Produtos(props) {

	const { data, products } = props || {};

	return (
		<Layout data={data}>
			{/*Products*/}
			<div className="products container mx-auto my-32 px-4 xl:px-0">
				<h1 className="products-main-title main-title mb-5 text-xl uppercase"><span className="main-title-inner">Loja</span></h1>
				<div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
					{products.length ? (
						products.map(product => <Product key={product.id} product={product} />)
					) : ''}
				</div>
			</div>

		</Layout>
	)
};

export async function getStaticProps() {

	const { data } = await client.query({
		query: GET_PRODUCTS,
	});

	return {
		props: {
			data,
			products: data?.products?.nodes ? data.products.nodes : [],
		},
		revalidate: 1
	}

};
