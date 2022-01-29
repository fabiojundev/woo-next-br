import React, { useState, useEffect } from 'react';
export const AppContext = React.createContext([
	{},
	() => { }
]);

export const AppProvider = (props) => {

	const [cart, setCart] = useState(null);
	const WOO_NEXT_CART = 'woo-next-cart';

	useEffect(() => {

		// @TODO Will add option to show the cart with localStorage later.
		if (process.browser) {

			let cartData = localStorage.getItem(WOO_NEXT_CART);
			cartData = ( cartData && cartData !== "undefined" && cartData !== null )
				? JSON.parse(cartData)
				: {};

			setCart(cartData);
		}

	}, []);

	const saveCartLocal = (updatedCart) => {
		if(updatedCart) {
			localStorage.setItem(
				WOO_NEXT_CART,
				JSON.stringify(updatedCart)
			);	
		}
	};

	return (
		<AppContext.Provider value={[cart, setCart, saveCartLocal]}>
			{props.children}
		</AppContext.Provider>
	);
};
