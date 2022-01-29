import { v4 } from 'uuid';
import { useMutation } from '@apollo/client';
import UPDATE_SHIPPING_ADDRESS from "../../mutations/update-shipping-address";
import LoadingImg from '../LoadingImg';
import isEmpty from '../../validator/isEmpty';
import InputField from '../checkout/form-elements/InputField';
import CountrySelection from '../checkout/CountrySelection';

const ShippingPostcode = ({
	inputValue,
	refetchCart,
	handleOnChange,
	disabled,
	setDisabled,
	isShipping,
	...props
}) => {

	// Update Shipping Zipcode.
	const [updateShippingAddress, {
		data,
		loading,
		error
	}] = useMutation(UPDATE_SHIPPING_ADDRESS);

	const handleZipcodeChange = event => {
		handleOnChange(event);
		getShippingRates(event.target.value);
	};

	const getShippingRates = async (postcode) => {

		const zipcode = postcode?.replace(/\D/g, '');
		if (zipcode?.length === 8) {
			console.log("getShippingRates, zipcode:", zipcode);
			setDisabled(true);
			const field = isShipping
				? 'shipping'
				: 'billing';
			const resp = await updateShippingAddress({
				variables: {
					input: {
						clientMutationId: v4(),
						[field]: {
							country: 'BR',
							postcode: zipcode,
							// overwrite: true
						},
					}
				},
				onCompleted: async () => {
					console.log("getShippingRates completed refetchCart field:", field);

					await refetchCart(field, true);
					setDisabled(false);
				},
				onError: (error) => {
					if (error) {
						const errorMessage = !isEmpty(error?.graphQLErrors?.[0])
							? error.graphQLErrors[0]?.message
							: '';
						console.warn({ error, errorMessage });
						// setRequestError(errorMessage);
					}
					setDisabled(false);
				}
			});
			console.log("resp", {resp, data});
		}
	};

	return (
		<div
			className="w-full sm:my-2 sm:px-2 md:w-1/2 relative"
		>
			<InputField
				{...props}
				mask="99999-999"
				type="text"
				className="p-2 border w-32"
				inputValue={inputValue}
				placeholder="CEP"
				data-placeholder="CEP"
				handleOnChange={handleZipcodeChange}
				isShipping={isShipping}
				containerClassNames=""
			/>
			{(loading || disabled)
				&& <LoadingImg
					className="absolute fill-black top-5 right-0"
				/>
			}
		</div>
	)
};

export default ShippingPostcode;
