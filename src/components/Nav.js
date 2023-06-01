import Link from 'next/link';
import CartIcon from "./cart/CartIcon";
import { useState } from 'react';
import Image from "./image";

import NavSearch from './search/nav-search';
import MenuPrincipal from './Menu';

const Nav = ({ slug }) => {

	const [isMenuVisible, setMenuVisibility] = useState(false);

	return (
		<nav className="bg-white p-4 shadow-sm">
			<div className="flex items-center justify-between flex-wrap container mx-auto">

				<div className="flex items-center flex-shrink-0 text-black mr-20">
					<Link href="/">
						<a>
							<Image 
								src="/logo-500x400.png" 
								alt="Cama de Cultivo - logo" 
								width="75" 
								height="75" 
								className="mr-4" 
							/>
						</a>
					</Link>
				</div>

				{/*Menu button*/}
				<div className="block lg:hidden">
					<button
						onClick={() => setMenuVisibility(!isMenuVisible)}
						className="flex items-center px-3 py-2 border bg-white rounded text-black border-black hover:text-black hover:border-black"
					>
						<svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
							<title>Menu</title>
							<path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
						</svg>
					</button>
				</div>

				{/*MMenu in mobile*/}
				<div className={` ${isMenuVisible ? 'visible' : 'hidden'} 
							px-4
							w-full 
							overflow-hidden 
							lg:h-full 
							flex-grow 
							lg:flex lg:items-center lg:w-auto`}
				>
					<MenuPrincipal
						className="text-gray-900"
						linkClassName="block lg:inline-block"
					/>

					<div className="
							flex flex-col 
							md:flex-nowrap 
							lg:flex-row lg:items-baseline 
							gap-4
							flex-grow 
							self-start 
							items-start"
					>
						{/* <div className="">
							<a href="#responsive-header" className="block pt-1 lg:inline-block lg:mt-0 text-black hover:text-black">
								<svg xmlns="http://www.w3.org/2000/svg" className="lg:block m-auto" fill="none" viewBox="0 0 24 24" width="18" length="auto" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
							</a>

						</div> */}
						<div className="">
							<CartIcon />
						</div>
						<div className="pt-1">
							<NavSearch />

						</div>
					</div>

					<div className="flex-col-reverse flex lg:flex-row">

					</div>
				</div>

			</div>
		</nav>
	)
};

export default Nav;
