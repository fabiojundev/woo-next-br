import Layout from "../src/components/Layout";
import CheckoutForm from "../src/components/checkout/CheckoutForm";
//import GET_COUNTRIES from "../src/queries/get-countries";
import client from "../src/components/ApolloClient";

const Checkout = ({ data }) => (
	<Layout>
		<div className="checkout mx-auto my-8">
			<h1 className="mb-5 text-2xl uppercase">Finalizar Compra</h1>
			<CheckoutForm countriesData={data?.wooCountries ?? {}} />
		</div>
	</Layout>
);

export default Checkout;

export async function getStaticProps() {
	const countries = [
		{
			countryCode: 'BR',
			countryName: 'Brasil'
		},
	];

	const data = {
		wooCountries: {
			billingCountries: countries,
			shippingCountries: countries,
		}
	};

	return {
		props: {
			data: data || {}
		},
		revalidate: 1
	};

}
