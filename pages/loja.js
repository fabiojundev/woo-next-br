import Layout from '../src/components/Layout';
import client from '../src/components/ApolloClient';
import GET_PRODUCTS from "../src/queries/get-products";
import Products from '../src/components/products';
import { PER_PAGE_FIRST, totalPagesCount } from '../src/utils/pagination';

export default function Produtos(props) {

	const { data, products } = props || {};

	return (
		<Layout data={data}>
			{/*Products*/}
			<div className="products container mx-auto my-32 px-4 xl:px-0">
				<h1 className="products-main-title main-title mb-5 text-xl uppercase">
					<span className="main-title-inner">
						Loja
					</span>
				</h1>
				<Products 
					products={products}

				/>
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
			productsPageCount: totalPagesCount( data?.products?.pageInfo?.pagesCount ?? 0 ),
		},
		revalidate: 1
	}

};
