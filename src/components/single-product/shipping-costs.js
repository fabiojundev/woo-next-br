import { isEmpty } from "lodash";
import { useState } from "react";
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import cx from 'classnames';
import { GET_CUSTOMER } from "../../queries/get-customer";
import GET_SHIPPING_COSTS from "../../queries/get-shipping-costs";
import UPDATE_SHIPPING_ZIPCODE from "../../mutations/update-shipping-zipcode";
import Image from "../image";

const ShippingCosts = ({ productId, quantity = 1 }) => {

    if (!productId) {
        return null;
    }

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
    }] = useMutation(UPDATE_SHIPPING_ZIPCODE);

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
                if(address?.postcode && customer?.shipping?.postcode != address?.postcode ) {
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

    const handleGetShippingClick = () => {
        console.log("handleGetShippingClick", zipcode);
        setRequestError(null);
        if (zipcode?.length == 9) {
            const address = getShippingCosts(
                {
                    skip: shippingQryInput?.zipcode?.length < 8,
                    variables: {
                        productId,
                        zipcode,
                        quantity,
                    },
                }
            );
            console.log(address);
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

    return (
        <>
            <div className="w-full block my-6">
                <div>
                    Calcular frete
                </div>
                <input
                    className="border border-solid rounded p-2 mr-2 w-32"
                    type="text"
                    id="wppdev_wt_zipcode"
                    value={zipcode}
                    onChange={handleZipcodeChange}
                    maxLength="9"
                    placeholder="00000-000"
                    autoComplete="postal-code"
                />
                {loading
                    ? <span className="align-middle">
                        <Image src='/cart-spinner.gif' width="54px" height="54px" />
                    </span>
                    : <button
                        disabled={loading}
                        className={cx(
                            'px-5 py-3 rounded mr-3 text-sm border-solid border border-current tracking-wide text-white font-bold bg-green-500',
                            { 'hover:bg-green-600 hover:text-white hover:border-green-600': !loading },
                            { 'opacity-50 cursor-not-allowed': loading }
                        )}
                        type="button"
                        id="wppdev_wt_shipping_btn"
                        onClick={handleGetShippingClick}
                    >
                        Ok
                    </button>
                }
            </div>
            {data?.shippingCosts && (
                <div className="w-full block my-2 text-sm">
                    <div className="text-xs opacity-75">
                        {data?.shippingCosts?.address?.desc}
                    </div>
                    <table className="mb-6">
                        <tbody>
                            {data?.shippingCosts?.shippingCosts.map(rate => (
                                <tr key={rate.name}>
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
