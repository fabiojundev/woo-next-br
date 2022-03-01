import Link from 'next/link';
import { useContext, useState } from 'react';
import { AppContext } from "../../context/AppContext";
import { getFormattedCart, getUpdatedItems, calculateCartTotals, formatCurrency } from '../../../functions';
import CartItem from "./CartItem";
import { v4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import UPDATE_CART from "../../../mutations/update-cart";
import GET_CART from "../../../queries/get-cart";
import CLEAR_CART_MUTATION from "../../../mutations/clear-cart";
import { isEmpty } from 'lodash'
import cx from 'classnames';
import EmptyCart from '../EmptyCart';
import ChooseShipping from '../ChooseShipping';
import { useRouter } from 'next/router';
import LoadingButton from '../../LoadingButton';
import TrashIcon from '../../icons/TrashIcon';

const CartItemsContainer = () => {


	// @TODO wil use it in future variations of the project.
	const [cart, setCart, saveCartLocal] = useContext(AppContext);
	const [requestError, setRequestError] = useState('');

	const [needCartUpdate, setNeedCartUpdate] = useState(false);
	const router = useRouter();

	// Get Cart Data.
	const { loading, error, data, refetch } = useQuery(GET_CART, {
		notifyOnNetworkStatusChange: true,
		onCompleted: () => {

			// Update cart in the localStorage.
			const updatedCart = getFormattedCart(data);
			saveCartLocal(updatedCart);

			console.log('cart fetch completed', { data, updatedCart });
			// Update cart data in React Context.
			setCart(updatedCart);

			//cart updated!
			setNeedCartUpdate(false);
		}
	});

	const defaultOptions = {
		onCompleted: () => {
			console.log("completed");
			refetch();
			// setRequestError('');
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

			const updatedCart = calculateCartTotals({
				...cart,
				products: products.filter(prod =>
					prod.cartKey !== cartKey
				),
			});

			saveCartLocal(updatedCart);
			setCart(updatedCart);

			const newQty = 0;
			const updatedItems = getUpdatedItems(products, newQty, cartKey);

			updateCart({
				variables: {
					input: {
						clientMutationId: v4(),
						items: updatedItems
					},
					shippingMethod: {
						clientMutationId: v4(),
						shippingMethods: [cart?.shippingMethod],
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

	const updateRemoteCart = async () => {
		if (needCartUpdate) {
			console.log("mutate products and shipping in cart",
				getUpdatedItems(cart.products, 1, 1),
				cart.shippingMethod
			);
			await updateCart({
				variables: {
					input: {
						clientMutationId: v4(),
						items: getUpdatedItems(cart.products, 1, 1)
					},
					shippingMethod: {
						clientMutationId: v4(),
						shippingMethods: [cart.shippingMethod],
					}
				},
			});
		}
	}

	const handleCheckout = async () => {
		await updateRemoteCart();
		router.push('/finalizar-compra');
	};

	return (
		<div className="cart product-cart-container mx-auto my-10 px-4 xl:px-0">
			{cart ? (
				<div className="woo-next-cart-wrapper container">
					<div className="border border-solid p-4">
						<div className="cart-header flex flex-nowrap justify-between">
							<h1 className="text-2xl mb-5">
								Você possui {cart.totalProductsCount} itens no Carrinho
							</h1>
							{/*Clear entire cart*/}
							{/* <div className="clear-cart text-right mb-2">
								<button
									className="mr-0 ml-2 p-2 bg-gray-500 text-white rounded-md"
									onClick={(event) => handleClearCart(event)}
									disabled={clearCartProcessing}
									title="Esvaziar Carrinho"
								>
									<TrashIcon
										className="fill-white inline-block"
									/>
								</button>
							</div> */}
						</div>
						<hr />
						<div className="grid grid-cols-1 gap-0 xl:gap-4 mb-5">
							<table className="cart-products table-auto col-span-3 mb-5">
								<thead className="text-left hidden sm:table-header-group">
									<tr className="woo-next-cart-head-container">
										<th className="woo-next-cart-heading-el" scope="col">Produto</th>
										<th className="woo-next-cart-heading-el" scope="col">Preço</th>
										<th className="woo-next-cart-heading-el" scope="col">Quantidade</th>
										<th className="woo-next-cart-heading-el" scope="col">Subtotal</th>
										<th className="woo-next-cart-heading-el" scope="col" />
									</tr>
								</thead>
								<tbody>
									{cart?.products?.length > 0 && (
										cart?.products?.map(item => (
											<CartItem
												key={item.productId}
												item={item}
												updateCartProcessing={updateCartProcessing}
												products={cart.products}
												handleRemoveProductClick={handleRemoveProductClick}
												setNeedCartUpdate={setNeedCartUpdate}
											/>
										))
									)}
								</tbody>
							</table>
						</div>
					</div>

					<div className="pt-8 flex flex-wrap gap-2 justify-between">
						{/* Shipping Calculator */}
						<ChooseShipping
							setNeedCartUpdate={setNeedCartUpdate}
							loadingCart={loading}
							refetchCart={refetch}
							setRequestError={setRequestError}
						/>
						{/*Cart Total*/}
						<div className="p-4 border flex-grow">
							<h2 className="self-center text-xl text-bold">Total no Carrinho</h2>
							<hr className="my-4 " />
							<div className="flex justify-between">
								<h3 className="text-xl">Produtos</h3>
								<div className="font-bold">
									{formatCurrency(cart.productsTotal)}
								</div>
							</div>
							{cart?.needsShippingAddress
								&& cart?.shippingMethods?.length
								&& cart?.shippingMethod
								&& <div className="flex justify-between">
									<h3 className="text-xl">Entrega</h3>
									<div className="font-bold" title="Custo de Entrega">
										{formatCurrency(cart.shippingTotal)}
									</div>
								</div>
							}
							<hr className="my-4 " />
							<div className="mb-6 flex justify-between">
								<h3 className="text-xl">Total</h3>
								<div className="font-bold text-green-600">
									{formatCurrency(cart.total)}
								</div>
							</div>
							<div className="flex flex-wrap justify-end ">
								<LoadingButton
									className={"checkout-btn"}
									loading={updateCartProcessing}
									handleClick={handleCheckout}
									label={"Finalizar Compra"}
								/>
							</div>
							{clearCartProcessing ? <p>Esvaziando...</p> : ''}
							{updateCartProcessing ? <p>Atualizando...</p> : null}
							{/* Display Errors if any */}
							{requestError
								? <div className="row woo-next-cart-total-container mt-5 text-red-700">
									{requestError}
								</div>
								: ''
							}
						</div>
					</div>
				</div>
			) : <EmptyCart />}
		</div>

	);
};

export default CartItemsContainer;
