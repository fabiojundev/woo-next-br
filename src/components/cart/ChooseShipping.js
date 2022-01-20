import { useState } from 'react';
import { v4 } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import UPDATE_SHIPPING_ZIPCODE from "../../mutations/update-shipping-zipcode";
import UPDATE_SHIPPING_METHOD from "../../mutations/update-shipping-method";
import LoadingButton from '../LoadingButton';
import LoadingImg from '../LoadingImg';

const ChooseShipping = ({
	cart,
	requestDefaultOptions,
	showOnlyRates
}) => {


	const [
		shippingMethod,
		setShippingMethod
	] = useState(cart?.chosenShippingMethods[0] ?? '');

	const [
		zipcode,
		setZipcode
	] = useState(cart?.customer?.shipping?.postcode ?? '');

	// Update Shipping Zipcode.
	const [updateShippinZipcode, {
		data: updatedShippingData,
		loading: updatingShippinZipcode,
		error: updateShippinZipcodeError
	}] = useMutation(UPDATE_SHIPPING_ZIPCODE, requestDefaultOptions);

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
		console.log("handleChooseShipping", chosenShippingMethod, shippingMethod);

		setShippingMethod(chosenShippingMethod);
		if (chosenShippingMethod != shippingMethod) {
			console.log("mutate shipping method", chosenShippingMethod, shippingMethod);
			await chooseShippingMethod({
				variables: {
					input: {
						clientMutationId: v4(),
						shippingMethods: [chosenShippingMethod],
					}
				},
			});
		}
	};


	return (
		<div className="choose-shipping-wrap mx-auto px-4 xl:px-0">
			{cart &&
				<div className="flex flex-wrap justify-between">
					<div className="my-6 mr-2 p-4 border border-solid flex-grow">
						{!showOnlyRates && (
							<>
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
							</>
						)}
						<p className="my-4 text-xs opacity-75">
							{cart?.customer?.shipping?.address1}
							- {cart?.customer?.shipping?.city}
							/ {cart?.customer?.shipping?.state}
						</p>
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
				</div>
			}
		</div>
	)
};

export default ChooseShipping;
