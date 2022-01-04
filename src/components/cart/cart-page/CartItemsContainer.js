import Link from 'next/link';
import { useContext, useState } from 'react';
import { AppContext } from "../../context/AppContext";
import { getFormattedCart, getUpdatedItems } from '../../../functions';
import CartItem from "./CartItem";
import { v4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import UPDATE_CART from "../../../mutations/update-cart";
import GET_CART from "../../../queries/get-cart";
import CLEAR_CART_MUTATION from "../../../mutations/clear-cart";
import UPDATE_SHIPPING_METHOD from "../../../mutations/update-shipping-method";
import { isEmpty } from 'lodash'


const CartItemsContainer = () => {


	// @TODO wil use it in future variations of the project.
	const [cart, setCart] = useContext(AppContext);
	const [requestError, setRequestError] = useState(null);
	const [zipcode, setZipcode] = useState('');

	// Get Cart Data.
	const { loading, error, data, refetch } = useQuery(GET_CART, {
		notifyOnNetworkStatusChange: true,
		onCompleted: () => {

			// Update cart in the localStorage.
			const updatedCart = getFormattedCart(data);
			localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));

			console.log('cart', data, updatedCart);
			// Update cart data in React Context.
			setCart(updatedCart);
		}
	});

	// Update Cart Mutation.
	const [updateCart, { data: updateCartResponse, loading: updateCartProcessing, error: updateCartError }] = useMutation(UPDATE_CART, {
		onCompleted: () => {
			refetch();
		},
		onError: (error) => {
			if (error) {
				const errorMessage = error?.graphQLErrors?.[0]?.message ? error.graphQLErrors[0].message : '';
				setRequestError(errorMessage);
			}
		}
	});

	// Update Cart Mutation.
	const [clearCart, { data: clearCartRes, loading: clearCartProcessing, error: clearCartError }] = useMutation(CLEAR_CART_MUTATION, {
		onCompleted: () => {
			refetch();
		},
		onError: (error) => {
			if (error) {
				const errorMessage = !isEmpty(error?.graphQLErrors?.[0]) ? error.graphQLErrors[0]?.message : '';
				setRequestError(errorMessage);
			}
		}
	});

	// Update Shipping Method.
	const [chooseShippingMethod, {
		data: chosenShippingData,
		loading: chooseShippingProcessing,
		error: chooseShippingError
	}] = useMutation(UPDATE_SHIPPING_METHOD, {
		onCompleted: () => {
			refetch();
		},
		onError: (error) => {
			if (error) {
				const errorMessage = !isEmpty(error?.graphQLErrors?.[0])
					? error.graphQLErrors[0]?.message
					: '';
				setRequestError(errorMessage);
			}
		}
	});

	/*
	 * Handle remove product click.
	 *
	 * @param {Object} event event
	 * @param {Integer} Product Id.
	 *
	 * @return {void}
	 */
	const handleRemoveProductClick = (event, cartKey, products) => {

		event.stopPropagation();
		if (products.length) {

			// By passing the newQty to 0 in updateCart Mutation, it will remove the item.
			const newQty = 0;
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
	};

	// Clear the entire cart.
	const handleClearCart = (event) => {

		event.stopPropagation();

		if (clearCartProcessing) {
			return;
		}

		clearCart({
			variables: {
				input: {
					clientMutationId: v4(),
					all: true
				}
			},
		});
	};

	const handleZipcodeChange = event => {
		setZipcode(event.target.value);
	};

	const handleCalcShippingClick = async (event) => {
		console.log("handleCalcShippingClick");
	};

	const handleChooseShipping = async (event) => {
		console.log("handleChooseShipping");
		await chooseShippingMethod( {
			variables: {
				input : {
					shippingMethods: [event.target.value],
				}
			},
		});
	};

	return (
		<div className="cart product-cart-container container mx-auto my-32 px-4 xl:px-0">
			{cart ? (
				<div className="woo-next-cart-wrapper container">
					<div className="cart-header grid grid-cols-2 gap-4">
						<h1 className="text-2xl mb-5">
							Você tem {cart.totalProductsCount} itens no Carrinho
						</h1>
						{/*Clear entire cart*/}
						<div className="clear-cart text-right">
							<button
								className="px-4 py-1 bg-gray-500 text-white rounded-sm w-auto"
								onClick={(event) => handleClearCart(event)}
								disabled={clearCartProcessing}
							>
								<span className="woo-next-cart">Esvaziar Carrinho</span>
								<i className="fa fa-arrow-alt-right" />
							</button>
							{clearCartProcessing ? <p>Esvaziando...</p> : ''}
							{updateCartProcessing ? <p>Atualizando...</p> : null}
						</div>
					</div>
					<div className="grid grid-cols-1 xl:grid-cols-4 gap-0 xl:gap-4 mb-5">
						<table className="cart-products table-auto col-span-3 mb-5">
							<thead className="text-left">
								<tr className="woo-next-cart-head-container">
									<th className="woo-next-cart-heading-el" scope="col" />
									<th className="woo-next-cart-heading-el" scope="col" />
									<th className="woo-next-cart-heading-el" scope="col">Product</th>
									<th className="woo-next-cart-heading-el" scope="col">Price</th>
									<th className="woo-next-cart-heading-el" scope="col">Quantity</th>
									<th className="woo-next-cart-heading-el" scope="col">Total</th>
								</tr>
							</thead>
							<tbody>
								{cart.products.length && (
									cart.products.map(item => (
										<CartItem
											key={item.productId}
											item={item}
											updateCartProcessing={updateCartProcessing}
											products={cart.products}
											handleRemoveProductClick={handleRemoveProductClick}
											updateCart={updateCart}
										/>
									))
								)}
							</tbody>
						</table>
						{/* Shipping Calculator */}
						<div className="flex">
							<div className="shipping-calculator-form">
								<h2 className="my-2">Calcular entrega</h2>
								<input
									type="text"
									className="p-2 border"
									value={zipcode}
									placeholder="CEP"
									data-placeholder="CEP"
									onChange={handleZipcodeChange}
								/>
								<button
									type="submit"
									name="calc_shipping"
									value="1"
									className="px-5 py-3 rounded mr-3 text-sm border-solid border border-current tracking-wide text-white font-bold bg-green-500"
									onClick={handleCalcShippingClick}
								>
									Atualizar
								</button>
								{cart?.needsShippingAddress
									&& cart?.shippingMethods?.length
									&& <div className='mt-4'>
										<h3 className="my-2">Escolha o frete</h3>
										{cart?.shippingMethods.map(method => (
											<div key={method.id}>
												<input
													type="radio"
													name="chosenShippingMethod"
													value={method.id}
													onChange={handleChooseShipping}
												/> {method.label} - R${method.cost}
											</div>
										))}
									</div>
								}
							</div>
						</div>
						{/*Cart Total*/}
						<div className="row woo-next-cart-total-container border p-5 bg-gray-200">
							<div className="">
								{/* <h2 className="text-2xl">Cart Total</h2> */}
								<table className="table table-hover mb-5">
									<tbody>
										<tr className="table-light flex flex-col">
											<td className="woo-next-cart-element-total text-2xl font-normal">
												Subtotal
											</td>
											<td className="woo-next-cart-element-amt text-xl font-bold">
												{('string' !== typeof cart.totalProductsPrice)
													? cart.totalProductsPrice.toFixed(2)
													: cart.totalProductsPrice}
											</td>
										</tr>
										{cart?.needsShippingAddress
											&& cart?.shippingMethods?.length
											&& cart?.chosenShippingMethods
											&&
											<tr className="table-light flex flex-col">
												<td className="woo-next-cart-element-total text-2xl font-normal">
													Entrega
												</td>
												<td className="woo-next-cart-element-amt text-xl font-bold">
													R$ {cart.shippingMethods.find(
														method => method.id == cart.chosenShippingMethods[0])
														.cost
													}
												</td>
											</tr>
										}
										{/* <tr className="table-light">
										<td className="woo-next-cart-element-total">Total</td>
										<td className="woo-next-cart-element-amt">{ ( 'string' !== typeof cart.totalProductsPrice ) ? cart.totalProductsPrice.toFixed(2) : cart.totalProductsPrice }</td>
									</tr> */}
									</tbody>
								</table>
								<Link href="/checkout">
									<button className="bg-green-600 text-white px-5 py-3 rounded-sm w-auto xl:w-full">
										<span className="woo-next-cart-checkout-txt">Concluir Compra</span>
										<i className="fas fa-long-arrow-alt-right" />
									</button>
								</Link>
							</div>
						</div>
					</div>

					{/* Display Errors if any */}
					{requestError ? <div className="row woo-next-cart-total-container mt-5"> {requestError} </div> : ''}
				</div>
			) : (
				<div className="container mx-auto my-32 px-4 xl:px-0">
					<h2 className="text-2xl mb-5">No items in the cart</h2>
					<Link href="/">
						<button className="bg-purple-600 text-white px-5 py-3 rounded-sm">
							<span className="woo-next-cart-checkout-txt">Add New Products</span>
							<i className="fas fa-long-arrow-alt-right" />
						</button>
					</Link>
				</div>
			)}
		</div>

	);
};

export default CartItemsContainer;
