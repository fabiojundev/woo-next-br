import Link from 'next/link';
import Layout from '../src/components/Layout';

function Error404( {data} ) {
	const {header, footer, headerMenus, footerMenus} = data || {};
	return (
		<Layout>
			<div className="h-almost-screen">
				<section className="text-gray-600 body-font">
					<div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
						<div
							className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
							<h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                                Página não encontrada
							</h1>
							<div className="flex justify-center">
								<Link href="/">
									<a
										className="px-5 py-3 rounded mr-3 text-sm border-solid border border-current tracking-wide text-white font-bold bg-green-500">
											Voltar ao Início
									</a>
								</Link>
							</div>
						</div>
					</div>
				</section>
			</div>
		</Layout>
	);
}

export default Error404;

export async function getStaticProps() {

	// const {data} = await client.query( {
	// 	query: GET_MENUS,
	// } );
	const data = {};
	return {
		props: {
			data: data || {}
		},
	};
}
