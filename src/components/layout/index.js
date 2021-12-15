import Header from './header';
import Footer from './footer';
import Head from 'next/head';
import Seo from '../seo';
import {isEmpty} from 'lodash';
import {sanitize} from '../../utils/miscellaneous';
import PropTypes from 'prop-types';
import { AppProvider } from "../context/AppContext";
import client from '../../apollo/client';
import { ApolloProvider } from "@apollo/client";



const Layout = ( {data, isPost, children} ) => {

	const {page, post, posts, products, productCategories, header, footer, headerMenus, footerMenus} = data || {};

	const empty = [page, post, posts, products, productCategories].reduce( 
		( empty, obj ) => ( empty && isEmpty( obj ) ) 
	);
	if( empty ) {
		return null;
	}

	const seo = isPost ? ( post?.seo ?? {} ) : ( page?.seo ?? {} );
	const uri = isPost ? ( post?.uri ?? {} ) : ( page?.uri ?? {} );

	return (
		<AppProvider>
		<ApolloProvider client={client}>
			<div>
				<Seo seo={seo} uri={uri}/>
				<Head>
					<link rel="shortcut icon" href={header?.favicon}/>
					{seo?.schemaDetails ? (
						<script
							type='application/ld+json'
							className='yoast-schema-graph'
							key='yoastSchema'
							dangerouslySetInnerHTML={{__html: sanitize( seo.schemaDetails )}}
						/>
					) : null}
				</Head>
				<Header header={header} headerMenus={headerMenus?.edges}/>
				<div className="md:container px-5 py-24 mx-auto min-h-almost-screen">
					{children}
				</div>
				<Footer footer={footer} footerMenus={footerMenus?.edges}/>
			</div>
		</ApolloProvider>
		</AppProvider>
	);
};

Layout.propTypes = {
	data: PropTypes.object,
	isPost: PropTypes.bool,
	children: PropTypes.any
};

Layout.defaultProps = {
	data: {},
	isPost: false,
	children: {}
};

export default Layout;

