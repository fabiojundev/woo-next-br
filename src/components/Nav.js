import Link from 'next/link';
import CartIcon from "./cart/CartIcon";
import { useState } from 'react';
import Image from "./image";

import NavSearch from './search/nav-search';

const Nav = ( {slug} ) => {

	const [ isMenuVisible, setMenuVisibility ] = useState(false);

	return (
		<nav className="bg-white p-4 shadow-sm">
			<div className="flex items-center justify-between flex-wrap container mx-auto">

				<div className="flex items-center flex-shrink-0 text-black mr-20">
					<Link href="/">
						<a>
							<Image src="/logo-125x50.png" alt="Cama de Cultivo - logo" width="125" height="50" className="mr-4"/>
						</a>
					</Link>
				</div>

				{/*Menu button*/}
				<div className="block lg:hidden">
					<button onClick={() => setMenuVisibility(! isMenuVisible)} className="flex items-center px-3 py-2 border rounded text-black border-black hover:text-black hover:border-black">
					<svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
					</button>
				</div>

				{/*MMenu in mobile*/}
				<div className={`${ isMenuVisible ? 'max-h-full h-full' : 'h-0' } w-full overflow-hidden lg:h-full flex-grow lg:flex lg:items-center lg:w-auto`}>
					<div className="text-sm font-medium uppercase lg:flex-grow">
					<Link href="/produtos">
						<a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
							Produtos
						</a>
					</Link>
					<Link href="/blog">
						<a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
							Blog
						</a>
					</Link>
					<Link href="/">
						<a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
							Camas de Cultivo
						</a>
					</Link>
					<Link href="/">
						<a className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
							Vasos
						</a>
					</Link>
					</div>

					<div className="text-sm font-medium">
						<a href="#responsive-header" className="block mt-4 lg:inline-block lg:mt-0 text-black hover:text-black mr-10">
						<svg xmlns="http://www.w3.org/2000/svg" className="hidden lg:block m-auto" fill="none" viewBox="0 0 24 24" width="18" height="auto" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
							Entrar
						</a>
						<CartIcon/>
					</div>

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

			</div>
		</nav>
	)
};

export default Nav;
