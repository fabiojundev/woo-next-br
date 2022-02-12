import Head from "next/head";
import { AppProvider } from "./context/AppContext";
import Header from "./Header";
import Footer from "./Footer";
import Seo from './seo';
import client from "./ApolloClient";
import Router from "next/router";
import NProgress from "nprogress";
import { ApolloProvider } from "@apollo/client";
import { sanitize } from '../utils/miscellaneous';
import { isEmpty } from 'lodash';

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const Layout = ({ data, isPost, children }) => {

	const {
		page,
		post,
		posts,
		products,
		productCategories,
		header
	} = data || {};

	const empty = [
		null,
		page,
		post,
		posts,
		products,
		productCategories
	].reduce(
		(empty, obj) => {
			return (empty && isEmpty(obj))
		}
	);
	if (empty) {
		return null;
	}

	const seo = isPost
		? (post?.seo ?? {})
		: (page?.seo ?? {});

	const uri = isPost
		? (post?.uri ?? {})
		: (page?.uri ?? {});
	// console.log(seo, uri);
	return (
		<AppProvider>
			<ApolloProvider client={client}>
				<div>
					<Seo seo={seo} uri={uri} />
					<Head>
						<link
							rel="shortcut icon"
							href={header?.favicon}
						/>
						{seo?.schemaDetails
							? (
								<script
									type='application/ld+json'
									className='yoast-schema-graph'
									key='yoastSchema'
									dangerouslySetInnerHTML={{
										__html: sanitize(seo.schemaDetails)
									}}
								/>
							)
							: null
						}
					</Head>
					<Header />
					<div
						className="p-5 md:p-6 xl:p-8 mx-auto min-h-almost-screen"
					>
						{children}
					</div>
					<Footer />
				</div>
			</ApolloProvider>
		</AppProvider>
	);
};

export default Layout;
