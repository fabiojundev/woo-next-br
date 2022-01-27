import { useContext, useState } from 'react';
import { AppContext } from "../context/AppContext";
import { v4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import UPDATE_SHIPPING_ADDRESS from "../../mutations/update-shipping-address";
import UPDATE_SHIPPING_METHOD from "../../mutations/update-shipping-method";
import LoadingButton from '../LoadingButton';
import LoadingImg from '../LoadingImg';
import { calculateCartTotals, formatCurrency } from '../../functions';
import { CollectionPageJsonLd } from 'next-seo';
import CartItem from './cart-page/CartItem';

const ChooseShipping = ({
	requestDefaultOptions,
	showOnlyRates,
	needCartUpdate,
	setNeedCartUpdate
}) => {

	const [cart, setCart] = useContext(AppContext);
	const [
		shippingMethod,
		setShippingMethod
	] = useState(cart?.shippingMethod ?? '');

	const [
		zipcode,
		setZipcode
	] = useState(cart?.customer?.shipping?.postcode ?? '');

	// Update Shipping Zipcode.
	const [updateShippingAddress, {
		data: updatedShippingData,
		loading: updatingShippinZipcode,
		error: updateShippingAddressError
	}] = useMutation(UPDATE_SHIPPING_ADDRESS, requestDefaultOptions);

	// Update Shipping Method.
	const [chooseShippingMethod, {
		data: chosenShippingData,
		loading: choosingShippingMethod,
		error: chooseShippingError
	}] = useMutation(UPDATE_SHIPPING_METHOD, requestDefaultOptions);

	const handleZipcodeChange = event => {
		setZipcode(event.target.value);
	};

	const handleCalcShippingClick = async (event) => {
		console.log("handleCalcShippingClick");
		if (zipcode?.length >= 8) {
			await updateShippingAddress({
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

	const handleChooseShipping = (event) => {
		const chosenShippingMethod = event.target.value;

		setShippingMethod(chosenShippingMethod);

		const updatedCart = calculateCartTotals({
			...cart,
			shippingMethod: chosenShippingMethod,
		});
		console.log("updatedCart", updatedCart);
		setCart(updatedCart);

		setNeedCartUpdate({
			...needCartUpdate,
			shipping: true,
		})

		// if (chosenShippingMethod != shippingMethod) {
		// 	console.log("mutate shipping method", chosenShippingMethod, shippingMethod);
		// 	chooseShippingMethod({
		// 		variables: {
		// 			input: {
		// 				clientMutationId: v4(),
		// 				shippingMethods: [chosenShippingMethod],
		// 			}
		// 		},
		// 	});
		// }
	};


	return (
		<div className="choose-shipping-wrap">
			{cart &&
				<div className="flex flex-wrap justify-between">
					<div className="p-4 border border-solid flex-grow">
						{!showOnlyRates && (
							<>
								<h2 className="mb-2 text-xl text-bold">Calcular entrega</h2>
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
									loading={updatingShippinZipcode}
									type="button"
									handleClick={handleCalcShippingClick}
								/>
								<p className="my-4 text-xs opacity-75">
									{cart?.customer?.shipping?.address1}
									- {cart?.customer?.shipping?.city}
									/ {cart?.customer?.shipping?.state}
								</p>
							</>
						)}
						{cart?.needsShippingAddress
							&& cart?.shippingMethods?.length
							&& <div className='shipping-methods-wrap'>
								<div className='flex'>
									<h2 className="my-2 self-center text-xl text-bold">
										Escolha o frete
									</h2>
									{updatingShippinZipcode &&
										<LoadingImg />
									}
								</div>
								<hr className="my-2" />
								{cart?.shippingMethods?.map(method => (
									<div key={method.id}>
										<label>
											<input
												type="radio"
												name="chosenShippingMethod"
												className="my-2"
												disabled={updatingShippinZipcode}
												value={method.id}
												onChange={handleChooseShipping}
												checked={shippingMethod == method.id}
											/> {method.label} - {formatCurrency(method.cost)}
										</label>
									</div>
								))}
							</div>
						}
					</div>
				</div>
			}
		</div>
	)
};

export default ChooseShipping;
