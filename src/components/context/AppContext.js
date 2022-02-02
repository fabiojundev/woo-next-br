import React, { useState, useEffect } from 'react';
export const AppContext = React.createContext([
	{},
	() => { }
]);

export const AppProvider = (props) => {

	const [cart, setCart] = useState(null);
	const WOO_NEXT_CART = 'woo-next-cart';

	useEffect(() => {

		if (typeof window !== "undefined") {

			let cartData = localStorage.getItem(WOO_NEXT_CART);
			cartData = (cartData && cartData !== "undefined" && cartData !== null)
				? JSON.parse(cartData)
				: {};

			//console.log("LOADING LOCAL", WOO_NEXT_CART, cartData, process.browser );
			setCart(cartData);
		}

	}, []);

	const saveCartLocal = (updatedCart) => {
		if (updatedCart) {
			//console.log("SAVING LOCAL", WOO_NEXT_CART, updatedCart );
			localStorage.setItem(
				WOO_NEXT_CART,
				JSON.stringify(updatedCart)
			);
		}
	};

	const deleteCartLocal = () => {
		//console.log("REMOVE CART LOCAL", WOO_NEXT_CART);
		localStorage.removeItem(WOO_NEXT_CART);
	};

	return (
		<AppContext.Provider
			value={[
				cart,
				setCart,
				saveCartLocal,
				deleteCartLocal
			]}
		>
			{props.children}
		</AppContext.Provider>
	);
};
