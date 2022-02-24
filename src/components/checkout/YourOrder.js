import { Fragment } from 'react';
import CheckoutCartItem from "./CheckoutCartItem";
import ChooseShipping from '../cart/ChooseShipping';
import { AppContext } from "../context/AppContext";
import { useContext, useState } from 'react';
import { isEmpty } from 'lodash';
import { formatCurrency } from '../../functions';

const YourOrder = ({
	loadingCart,
	refetchCart,
	setRequestError
}) => {

	const [cart, setCart] = useContext(AppContext);

	return (
		<Fragment>
			{cart ? (
				<Fragment>
					{/*Product Listing*/}
					<table className="checkout-cart table table-hover w-full mb-4 border border-solid">
						<thead>
							<tr className="woo-next-cart-head-container text-left">
								<th className="woo-next-cart-heading-el" scope="col" />
								<th className="woo-next-cart-heading-el" scope="col">
									Produto
								</th>
								<th className="woo-next-cart-heading-el" scope="col">
									Subtotal
								</th>
							</tr>
						</thead>
						<tbody>
							{cart?.products?.length && (
								cart.products.map(item => (
									<CheckoutCartItem 
										key={item.productId} 
										item={item} 
									/>
								))
							)}
						</tbody>
					</table>
					<ChooseShipping
						loadingCart={loadingCart}
						showOnlyRates={true}
						refetchCart={refetchCart}
						setRequestError={setRequestError}
					/>
					<div className="my-2 p-4 bg-gray-300 flex justify-between">
						<span className="woo-next-checkout-total font-normal text-xl">
							Total
						</span>
						<span className="woo-next-checkout-total font-bold text-xl">
							{formatCurrency(cart.total)}
						</span>
					</div>
				</Fragment>
			) : ''}
		</Fragment>
	)
};

export default YourOrder;
