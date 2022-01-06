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
import UPDATE_SHIPPING_ZIPCODE from "../../../mutations/update-shipping-zipcode";
import UPDATE_SHIPPING_METHOD from "../../../mutations/update-shipping-method";
import { isEmpty } from 'lodash'
import cx from 'classnames';
import LoadingButton from '../../LoadingButton';
import LoadingImg from '../../LoadingImg';

const CartItemsContainer = () => {


	// @TODO wil use it in future variations of the project.
	const [cart, setCart] = useContext(AppContext);
	const [requestError, setRequestError] = useState(null);
	const [shippingMethod, setShippingMethod] = useState('');
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

			setZipcode(updatedCart?.customer?.shipping?.postcode);
			setShippingMethod(updatedCart?.chosenShippingMethods[0] ?? '');
		}
	});

	const defaultOptions = {
		onCompleted: () => {
			console.log("completed");
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
	};

	// Update Cart Mutation.
	const [updateCart, {
		data: updateCartResponse,
		loading: updateCartProcessing,
		error: updateCartError
	}] = useMutation(UPDATE_CART, defaultOptions);

	// Update Cart Mutation.
	const [clearCart, {
		data: clearCartRes,
		loading: clearCartProcessing,
		error: clearCartError
	}] = useMutation(CLEAR_CART_MUTATION, defaultOptions);

	// Update Shipping Zipcode.
	const [updateShippinZipcode, {
		data: updatedShippingData,
		loading: updatingShippinZipcode,
		error: updateShippinZipcodeError
	}] = useMutation(UPDATE_SHIPPING_ZIPCODE, defaultOptions);

	// Update Shipping Method.
	const [chooseShippingMethod, {
		data: chosenShippingData,
		loading: choosingShippingMethod,
		error: chooseShippingError
	}] = useMutation(UPDATE_SHIPPING_METHOD, defaultOptions);

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
		if (zipcode?.length >= 8) {
			await updateShippinZipcode({
				variables: {
					input: {
						clientMutationId: v4(),
						shipping: {
							country: 'BR',
							postcode: zipcode,
							// overwrite: true
						},
					}
				},
			});
		}
	};

	const handleChooseShipping = async (event) => {
		const chosenShippingMethod = event.target.value;
		console.log("handleChooseShipping", chosenShippingMethod);
		setShippingMethod(chosenShippingMethod);
		await chooseShippingMethod({
			variables: {
				input: {
					clientMutationId: v4(),
					shippingMethods: [chosenShippingMethod],
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
									<th className="woo-next-cart-heading-el" scope="col">Produto</th>
									<th className="woo-next-cart-heading-el" scope="col">Preço</th>
									<th className="woo-next-cart-heading-el" scope="col">Quantidade</th>
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
						<div className="flex flex-wrap justify-between">
							<div className="my-6 mr-2 p-4 border border-solid flex-grow">
								<h2 className="my-2 text-xl text-bold">Calcular entrega</h2>
								<hr className="my-4 " />
								<input
									type="text"
									className="p-2 border w-32"
									value={zipcode}
									placeholder="CEP"
									data-placeholder="CEP"
									onChange={handleZipcodeChange}
								/>
								<LoadingButton
									label={"Atualizar"}
									loading={(choosingShippingMethod || updatingShippinZipcode)}
									type="button"
									handleClick={handleCalcShippingClick}
								/>

								{cart?.needsShippingAddress
									&& cart?.shippingMethods?.length
									&& <div className='mt-8'>
										<div className='flex'>
											<h2 className="my-2 self-center text-xl text-bold">Escolha o frete</h2>
											{(choosingShippingMethod || updatingShippinZipcode) &&
												<LoadingImg />
											}
										</div>
										<hr className="my-4 " />
										{cart?.shippingMethods.map(method => (
											<div key={method.id}>
												<label>
													<input
														type="radio"
														name="chosenShippingMethod"
														className="my-2"
														disabled={(choosingShippingMethod || updatingShippinZipcode)}
														value={method.id}
														onChange={handleChooseShipping}
														checked={shippingMethod == method.id}
													/> {method.label} - R${method.cost}
												</label>
											</div>
										))}
									</div>
								}
							</div>
							{/*Cart Total*/}
							<div className="my-6 p-4 border flex-grow">
								<h2 className="my-2 self-center text-xl text-bold">Total no Carrinho</h2>
								<hr className="my-4 " />
								<div className="flex justify-between">
									<h3 className="text-xl">Subtotal</h3>
									<div className="font-bold">
										{(cart?.subtotal && 'string' !== typeof cart.subtotal)
											? cart.subtotal.toFixed(2)
											: cart.subtotal}
									</div>
								</div>
								{cart?.needsShippingAddress
									&& cart?.shippingMethods?.length
									&& cart?.chosenShippingMethods
									&& <div className="flex justify-between">
										<h3 className="text-xl">Entrega</h3>
										<div className="font-bold">
											R$ {cart.shippingMethods.find(
												method => method.id == cart.chosenShippingMethods[0])
												.cost
											}
										</div>
									</div>
								}
								<hr className="my-4 " />
								<div className="mb-6 flex justify-between">
									<h3 className="text-xl">Total</h3>
									<div className="font-bold">
										{('string' !== typeof cart.totalProductsPrice)
											? cart.totalProductsPrice.toFixed(2)
											: cart.totalProductsPrice}
									</div>
								</div>
								<Link href="/checkout">
									<button 
										className={cx(
											'px-5 py-3 rounded mr-3 text-sm border-solid border border-current tracking-wide text-white font-bold bg-green-500',
											{ 'hover:bg-green-600 hover:text-white hover:border-green-600': true}
										)}
									>
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
							<span className="woo-next-cart-checkout-txt">Adicionar Produtos</span>
							<i className="fas fa-long-arrow-alt-right" />
						</button>
					</Link>
				</div>
			)}
		</div>

	);
};

export default CartItemsContainer;
