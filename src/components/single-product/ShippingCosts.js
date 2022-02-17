import { isEmpty } from "lodash";
import { useState } from "react";
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { GET_CUSTOMER } from "../../queries/get-customer";
import GET_SHIPPING_COSTS from "../../queries/get-shipping-costs";
import UPDATE_SHIPPING_ADDRESS from "../../mutations/update-shipping-address";
import LoadingButton from "../LoadingButton";
import InputMask from 'react-input-mask';

const ShippingCosts = ({ productId, quantity = 1 }) => {

    const [zipcode, setZipcode] = useState('');
    const [customer, setCustomer] = useState({});
    const [requestError, setRequestError] = useState(null);

    const shippingQryInput = {
        productId,
        zipcode,
        quantity: quantity,
    };

    const handleZipcodeChange = (event) => {
        const zip = event.target.value;
        shippingQryInput.zipcode = zip;
        setZipcode(zip);
    };

    const defaultOptions = {
        onCompleted: () => {
            console.log("completed");
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

    // Update Shipping Zipcode.
    const [updateShippinAddress, {
        data: updatedShippingData,
        loading: updatingShippinZipcode,
        error: updateShippinZipcodeError
    }] = useMutation(UPDATE_SHIPPING_ADDRESS);

    // Get shipping costs.
    const [getShippingCosts, {
        data,
        loading,
        error
    }] = useLazyQuery(GET_SHIPPING_COSTS, {
        ...defaultOptions,
        onCompleted: async () => {
            console.log("completed", data);
            if (data?.shippingCosts?.address) {
                const { desc, __typename, ...address } = data.shippingCosts.address;
                if (address?.postcode && customer?.shipping?.address1 != address?.address1) {
                    console.log("updateShippinZipcode", address, customer);
                    await updateShippinAddress({
                        variables: {
                            input: {
                                shipping: {
                                    ...address
                                },
                            }
                        },
                    });
                }
            }
        },
    });

    const handleGetShippingClick = async () => {
        setRequestError(null);
        if (zipcode?.length == 9) {
            await getShippingCosts(
                {
                    skip: shippingQryInput?.zipcode?.length < 8,
                    variables: {
                        productId,
                        zipcode,
                        quantity,
                    },
                }
            );
        }
    };

    // Get shipping costs.
    const {
        data: customerData,
        loading: gettingCustomer,
        error: getCustomerError
    } = useQuery(GET_CUSTOMER, {
        ...defaultOptions,
        onCompleted: async () => {
            console.log("customerData completed", customerData);
            if (customerData?.customer?.shipping) {
                setCustomer(customerData.customer);
            }
            if (customerData?.customer?.shipping?.postcode?.length >= 8) {
                const postcode = customerData.customer.shipping.postcode;
                setZipcode(postcode);
                console.log("set zipcode", customerData.customer.shipping.postcode);
                getShippingCosts(
                    {
                        skip: postcode?.length < 8,
                        variables: {
                            productId,
                            zipcode: postcode,
                            quantity,
                        },
                    }
                );
            }
        },
    });

    return ( productId &&
        <>
            <div className="w-full block my-6">
                <div>
                    Calcular frete
                </div>
                <InputMask
                    className="border border-solid rounded p-2 mr-2 w-32"
                    type="text"
                    value={zipcode}
                    onChange={handleZipcodeChange}
                    placeholder="00000-000"
                    mask="99999-999"
                    autoComplete="postal-code"
                    title="Digite o CEP"
                />
                <LoadingButton
                    label={"OK"}
                    loading={loading}
                    type="button"
                    handleClick={handleGetShippingClick}
                    title="Calcular Frete"
                />
            </div>
            {data?.shippingCosts && (
                <div className="w-full block my-2 text-sm">
                    <div className="text-xs opacity-75">
                        {data?.shippingCosts?.address?.desc}
                    </div>
                    <table className="mb-6">
                        <tbody>
                            {data?.shippingCosts?.shippingCosts.map(rate => (
                                <tr 
                                    key={rate.name}
                                    title="Frete e prazo de entrega"
                                >
                                    <td className="pr-8">{rate.name}</td>
                                    <td className="pr-8">{rate.cost}</td>
                                    <td className="pr-8">{rate.forecast}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {requestError ? (
                <div className="my-2">
                    <span className="p-2 text-sm text-white bg-red-500">
                        Erro ao calcular o frete. Tente novamente mais tarde.
                    </span>
                </div>
            ) : ''}
        </>

    )
}

export default ShippingCosts
