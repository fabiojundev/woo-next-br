import { isEmpty } from 'lodash';
import Link from 'next/link';
import {useState} from 'react';
import PropTypes from 'prop-types';
import CartIcon from "../../cart/CartIcon";
import Image from "../../image";

import { isCustomPageUri } from '../../../utils/slug';
import NavSearch from '../../search/nav-search';

const Nav = ( {header, headerMenus, slug} ) => {

	if ( isEmpty( headerMenus ) ) {
		return null;
	}

	const [ isMenuVisible, setMenuVisibility ] = useState( false );
console.log("header",header, "headerMenus",headerMenus, "slug:",slug);

	return (
		<nav className="flex items-center justify-between flex-wrap bg-white p-6">
			<div className="flex items-center flex-shrink-0 mr-6">			
				<Link href="/">
					<a>
						<Image src="/logo-250x100.png" alt="logo do site" width="250" height="100" className="mr-4"/>
					</a>
				</Link>
			</div>
			<div className="block lg:hidden">
				<button
					onClick={() => setMenuVisibility( ! isMenuVisible )}
					className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
					data-cy="mmenu-btn"
				>
					<svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
						<title>Menu</title>
						<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
					</svg>
				</button>
			</div>
			<div className={`${ isMenuVisible ? 'max-h-full' : 'h-0' } overflow-hidden w-full lg:h-full block flex-grow lg:flex lg:items-center lg:w-auto`}>
				{ headerMenus?.length ? (
					<div className="text-sm lg:flex-grow">
						{ headerMenus?.map( menu => {
							if ( ! isCustomPageUri( menu?.node?.path ) ) {
								return  (
									<Link key={menu?.node.id} href={menu?.node?.path}>
										<a
											className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
											data-cy="nav-item"
										>
											{menu?.node?.label}
										</a>
									</Link>
								);
							}
						} ) }
						<Link href={'/blog/'}>
							<a
								className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
								data-cy="nav-item"
							>
                			Blog
							</a>
						</Link>
						<div className="text-sm font-medium">
							<a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
							<svg xmlns="http://www.w3.org/2000/svg" className="hidden lg:block m-auto" fill="none" viewBox="0 0 24 24" width="18" height="auto" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
								Profile
							</a>
							<a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
							<svg xmlns="http://www.w3.org/2000/svg" className="hidden lg:block m-auto" fill="none" viewBox="0 0 24 24" width="18" height="auto" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
								Wishlist
							</a>
							<CartIcon/>
						</div>
					</div>
				) : null }
				<div className="flex-col-reverse flex lg:flex-row">
          { 'search' !== slug ? <NavSearch/> : null }
          <div className="lg:flex items-center">
            <a href="#"
               className="lg:ml-2 inline-block text-sm px-4 py-3 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">
              Contact
            </a>
          </div>
				</div>
			</div>
		</nav>
	);
};

Nav.propTypes = {
  header: PropTypes.object,
  headerMenus: PropTypes.array,
  slug: PropTypes.string
};

Nav.defaultProps = {
  header: {},
  headerMenus: [],
  slug: ''
};


export default Nav;
