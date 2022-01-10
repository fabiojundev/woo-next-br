import client from '../src/apollo/client';
import { useRouter } from 'next/router';
import Layout from '../src/components/Layout';
import { FALLBACK, handleRedirectsAndReturnData } from '../src/utils/slug';
import { GET_PAGE } from '../src/queries/pages/get-page';
import { sanitize } from '../src/utils/miscellaneous';
import Image from '../src/components/image';

const EnvioEPrazoDeEntrega = ({ data }) => {
	const router = useRouter();

	// If the page is not yet generated, this will be displayed
	// initially until getStaticProps() finishes running
	if (router.isFallback) {
		return <div>Carregando...</div>;
	}

	return (
		<Layout data={data}>
			<div 
                className="single-post container mx-auto my-16 px-4 xl:px-0"
            >
			<h1 
				className="font-bold mb-3 text-lg hover:text-blue-500" 
			>
				<span
					dangerouslySetInnerHTML={{ __html: sanitize(data?.page?.title ?? '') }} 
				/>
			</h1>
			<div 
				dangerouslySetInnerHTML={{ __html: sanitize(data?.page?.content ?? {}) }} 
			/>
            </div>
		</Layout>
	);
};

export default EnvioEPrazoDeEntrega;

export async function getStaticProps({ params }) {
	const { data, errors } = await client.query({
		query: GET_PAGE,
        variables: {
			uri: '/envio-e-prazo-de-entrega',
		},
	});

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

	return handleRedirectsAndReturnData(defaultProps, data, errors, 'page');
}


