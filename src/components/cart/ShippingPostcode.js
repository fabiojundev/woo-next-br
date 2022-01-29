import { useContext, useState } from 'react';
import { AppContext } from "../context/AppContext";
import { v4 } from 'uuid';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import GET_CART from '../../queries/get-cart';
import UPDATE_SHIPPING_ADDRESS from "../../mutations/update-shipping-address";
import LoadingButton from '../LoadingButton';
import InputMask from 'react-input-mask';
import { getFormattedCart } from '../../functions';
import isEmpty from '../../validator/isEmpty';
import InputField from '../checkout/form-elements/InputField';

const ShippingPostcode = ({
	requestDefaultOptions,
	inputValue,
	showAddress,
	refetchCart,
	handleOnChange,
	...props
}) => {

	const [cart, setCart] = useContext(AppContext);

	

	const defaultOptions = {
		onCompleted: () => {
			console.log("completed");
			// getCart();
			console.log('refetch cart');
			// refetchCart();
			refetchCart('shipping', true);

			// setRequestError('');
			// updateCustomerFromCart('shipping', true);
		},
		onError: (error) => {
			if (error) {
				const errorMessage = !isEmpty(error?.graphQLErrors?.[0])
					? error.graphQLErrors[0]?.message
					: '';
				// setRequestError(errorMessage);
			}
		}
	};

	// Update Shipping Zipcode.
	const [updateShippingAddress, {
		data: updatedShippingData,
		loading: updatingShippinZipcode,
		error: updateShippingAddressError
	}] = useMutation(UPDATE_SHIPPING_ADDRESS, defaultOptions);

	const handleZipcodeChange = event => {
		// const zipcode = event.target.value;
		// setZipcode(zipcode);
		handleOnChange(event);
		// getShippingRates(event.target.value);
	};

	const getShippingRates = async (postcode) => {
		console.log("getShippingRates", postcode);
		if (postcode?.replace(/\D/g, '')?.length === 8) {
			console.log("getShippingRates1", postcode.replace(/\D/g, ''));
			const resp = await updateShippingAddress({
				variables: {
					input: {
						clientMutationId: v4(),
						shipping: {
							country: 'BR',
							postcode: postcode.replace(/\D/g, ''),
							// overwrite: true
						},
					}
				},
			});
			console.log("resp", resp, updatedShippingData);
		}
	};

	const handleCalcShippingClick = async (event) => {
		await getShippingRates(inputValue);
	};

	return (
		<>
			<InputField
				{...props}
				mask="99999-999"
				type="text"
				className="p-2 border w-32"
				inputValue={inputValue}
				placeholder="CEP"
				data-placeholder="CEP"
				handleOnChange={handleZipcodeChange}
			/>
			<LoadingButton
				label={"Atualizar"}
				loading={updatingShippinZipcode}
				type="button"
				handleClick={handleCalcShippingClick}
			/>
			{showAddress &&
				<p className="my-4 text-xs opacity-75">
					{cart?.customer?.shipping?.address1}
					- {cart?.customer?.shipping?.city}
					/ {cart?.customer?.shipping?.state}
				</p>
			}
		</>
	)
};

export default ShippingPostcode;
