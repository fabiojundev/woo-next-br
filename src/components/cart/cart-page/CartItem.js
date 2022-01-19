import { useState } from 'react';
import { v4 } from "uuid";
import { getUpdatedItems } from "../../../functions";
import { Cross, Loading } from "../../icons";
import Link from 'next/link';

const CartItem = ({
	item,
	products,
	updateCartProcessing,
	handleRemoveProductClick,
	updateCart,
}) => {

	const [productCount, setProductCount] = useState(item.qty);

	/*
	 * When user changes the qty from product input update the cart in localStorage
	 * Also update the cart in global context
	 *
	 * @param {Object} event event
	 *
	 * @return {void}
	 */
	const handleQtyChange = (event, cartKey) => {

		if (process.browser) {

			event.stopPropagation();

			// If the previous update cart mutation request is still processing, then return.
			if (updateCartProcessing) {
				return;
			}

			// If the user tries to delete the count of product, set that to 1 by default ( This will not allow him to reduce it less than zero )
			const newQty = (event.target.value) 
				? parseInt(event.target.value) 
				: 1;

			// Set the new qty in state.
			setProductCount(newQty);

			if (products.length) {

				const updatedItems = getUpdatedItems(products, newQty, cartKey);

				updateCart({
					variables: {
						input: {
							clientMutationId: v4(),
							items: updatedItems
						}
					},
				});
			}

		}
	};

	return (
		<tr className="woo-next-cart-item block relative sm:table-row" key={item.productId}>
			<td className="woo-next-cart-element block text-center w-full sm:table-cell">
				<Link href={`/product/${item?.slug}`} >
					<a className="flex flex-wrap justify-center items-center sm:flex-no-wrap sm:justify-start">
						<span className="my-4">
							<img
								className="w-32 sm:w-24"
								width="90px"
								src={item.image.sourceUrl}
								srcSet={item.image.srcSet}
								alt={item.image.title}
							/>
						</span>
						<span className="m-4">
							{item.name}
						</span>
					</a>
				</Link>
			</td>
			<td className="woo-next-cart-element block text-center w-full sm:table-cell">
				{ 'string' !== typeof item.price
					? item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
					: item.price
				}
			</td>

			{/* Qty Input */}
			<td className="woo-next-cart-element block text-center w-full sm:table-cell">
				{/* @TODO Need to update this with graphQL query */}
				<input
					type="number"
					min="1"
					data-cart-key={item.cartKey}
					className={`woo-next-cart-qty-input form-control border border-solid p-2 w-16 text-center ${updateCartProcessing ? 'opacity-25 cursor-not-allowed' : ''} `}
					value={productCount}
					onChange={(event) => handleQtyChange(event, item.cartKey)}
				/>
			</td>
			<td className="woo-next-cart-element block text-center w-full sm:table-cell">
				{('string' !== typeof item.totalPrice) 
					? item.totalPrice.toFixed(2) 
					: item.totalPrice
				}
			</td>
			<td className="woo-next-cart-element block text-center w-full sm:table-cell">
				{/* Remove item */}
				<span className="woo-next-cart-close-icon m-3 cursor-pointer text-green-500 absolute top-0 right-0 sm:relative"
					onClick={(event) => handleRemoveProductClick(event, item.cartKey, products)}>
					<Cross />
				</span>
			</td>
		</tr>
	)
};

export default CartItem;
