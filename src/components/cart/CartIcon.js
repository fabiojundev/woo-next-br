import { useContext } from 'react';
import { AppContext } from "../context/AppContext";
import Link from 'next/link';

const CartIcon = () => {

	const [cart] = useContext(AppContext);
	const productsCount = (null !== cart && Object.keys(cart).length)
		? cart.totalProductsCount
		: '';
	const totalPrice = (null !== cart && Object.keys(cart).length)
		? cart.totalProductsPrice
		: '';

	return (
		<Link href="/carrinho">
			<a
				className="block lg:inline-block lg:mt-0 text-black hover:text-black"
				title="Carrinho"
			>
				<span className='flex flex-nowrap'>
					<svg xmlns="http://www.w3.org/2000/svg" className="m-auto" fill="none" viewBox="0 0 24 24" width="18" length="auto" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
					{
						productsCount
							? <span className='cart-items-qty'>({productsCount})</span>
							: ''
					}
					{/*{ totalPrice ? <span>{ totalPrice }</span> : '' }*/}
				</span>
			</a>
		</Link>

	)
};

export default CartIcon;
