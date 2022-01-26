import { useState, useContext, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import cx from 'classnames'

import YourOrder from "./YourOrder";
import PaymentModes from "./PaymentModes";
import { AppContext } from "../context/AppContext";
import validateAndSanitizeCheckoutForm from '../../validator/checkout';
import { getFormattedCart, createCheckoutData, } from "../../functions";
import OrderSuccess from "./OrderSuccess";
import GET_CART from "../../queries/get-cart";
import CHECKOUT_MUTATION from "../../mutations/checkout";
import Address from "./Address";
import {
    handleBillingDifferentThanShipping,
    handleCreateAccount, handleStripeCheckout,
    setStatesForCountry
} from "../../utils/checkout-stripe";
import {
    MercadoPagoCheckout,
    handleMercadoPagoCheckout
} from './MercadoPagoCheckout';
import CheckboxField from "./form-elements/CheckboxField";
import CLEAR_CART_MUTATION from "../../mutations/clear-cart";
import LoadingButton from '../LoadingButton';
import EmptyCart from '../cart/EmptyCart';

// import { useMercadopago } from 'react-sdk-mercadopago';

// Use this for testing purposes, so you dont have to fill the checkout form over an over again.
// const defaultCustomerInfo = {
// 	firstName: 'Imran',
// 	lastName: 'Sayed',
// 	address1: '123 Abc farm',
// 	address2: 'Hill Road',
// 	city: 'Mumbai',
// 	country: 'IN',
// 	state: 'Maharastra',
// 	postcode: '221029',
// 	email: 'codeytek.academy@gmail.com',
// 	phone: '9883778278',
// 	company: 'The Company',
// 	errors: null
// }

const defaultCustomerInfo = {
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    number: '',
    persontype: '1',
    cpf: '',
    cnpj: '',
    city: '',
    country: 'BR',
    state: '',
    postcode: '',
    email: '',
    phone: '',
    company: '',
    errors: null,
}

const CheckoutForm = (props) => {

    const { billingCountries, shippingCountries } = {};

    const initialState = {
        billing: {
            ...defaultCustomerInfo,
        },
        shipping: {
            ...defaultCustomerInfo
        },
        createAccount: false,
        orderNotes: '',
        billingDifferentThanShipping: false,
        paymentMethod: 'mercado-pago',
        shippingMethod: '',
        preference: '',
    };

    const [cart, setCart] = useContext(AppContext);
    const [input, setInput] = useState(initialState);
    const [orderData, setOrderData] = useState(null);
    const [requestError, setRequestError] = useState(null);
    const [theShippingStates, setTheShippingStates] = useState([]);
    const [isFetchingShippingStates, setIsFetchingShippingStates] = useState(false);
    const [theBillingStates, setTheBillingStates] = useState([]);
    const [isFetchingBillingStates, setIsFetchingBillingStates] = useState(false);
    const [isStripeOrderProcessing, setIsStripeOrderProcessing] = useState(false);
    const [createdOrderData, setCreatedOrderData] = useState({});

    // Get Cart Data.
    const { data, refetch } = useQuery(GET_CART, {
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {
            // Update cart in the localStorage.
            const updatedCart = getFormattedCart(data);
            localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));

            console.log('refetch cart', data, updatedCart);
            // Update cart data in React Context.
            setCart(updatedCart);

            const shipping = updatedCart?.customer?.shipping;
            //console.log(shipping, input);
            if (shipping) {
                setInput({
                    ...input,
                    shipping
                });
            }
        }
    });

    // Create New order: Checkout Mutation.
    const [checkout, {
        data: checkoutResponse,
        loading: checkoutLoading,
    }] = useMutation(CHECKOUT_MUTATION, {
        variables: {
            input: orderData
        },
        onError: (error) => {
            if (error) {
                setRequestError(error?.graphQLErrors?.[0]?.message ?? '');
            }
        }
    });

    const [clearCartMutation] = useMutation(CLEAR_CART_MUTATION);

    /*
     * Handle form submit.
     *
     * @param {Object} event Event Object.
     *
     * @return {void}
     */
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        /**
         * Validate Billing and Shipping Details
         *
         * Note:
         * 1. If billing is different than shipping address, only then validate billing.
         * 2. We are passing theBillingStates?.length and theShippingStates?.length, so that
         * the respective states should only be mandatory, if a country has states.
         */
        const billingValidationResult = input?.billingDifferentThanShipping
            ? validateAndSanitizeCheckoutForm(input?.billing, theBillingStates?.length)
            : { errors: null, isValid: true };

        const shippingValidationResult = validateAndSanitizeCheckoutForm(
            input?.shipping,
            theShippingStates?.length
        );

        if (!shippingValidationResult.isValid || !billingValidationResult.isValid) {
            setInput({
                ...input,
                billing: {
                    ...input.billing,
                    errors: billingValidationResult.errors
                },
                shipping: {
                    ...input.shipping,
                    errors: shippingValidationResult.errors
                }
            });

            return;
        }

        if (cart?.needsShippingAddress
            && cart.shippingMethod
            && cart.shippingMethods) {
            const ship_method = cart.shippingMethods?.find(ship =>
                (ship.id == cart.shippingMethod)
            );
            input.shippingMethod = cart.shippingMethod;
            input.shippingMethods = cart.shippingMethods;
            input.shippingTotal = ship_method?.cost;
            input.shippingLabel = ship_method?.label;
        }
        //console.log("input", input);

        handlePayment(input, cart);


        const checkOutData = createCheckoutData(input);
        setRequestError(null);
        /**
         *  When order data is set, checkout mutation will automatically be called,
         *  because 'orderData' is added in useEffect as a dependency.
         */
        setOrderData(checkOutData);
    };

    const handlePayment = async (input, cart) => {
        switch (input.paymentMethod) {
            case 'stripe':
                await handleStripeCheckout(
                    input,
                    cart?.products,
                    setRequestError,
                    clearCartMutation,
                    setIsStripeOrderProcessing,
                    setCreatedOrderData
                );
                break;

            case 'mercado-pago':
                console.log("mercago pago pay");
                await handleMercadoPagoCheckout(
                    input,
                    cart?.products,
                    setRequestError,
                    clearCartMutation,
                    setIsStripeOrderProcessing,
                    setCreatedOrderData
                );
                break;
        }
    };
    /*
     * Handle onchange input.
     *
     * @param {Object} event Event Object.
     * @param {bool} isShipping If this is false it means it is billing.
     * @param {bool} isBillingOrShipping If this is false means its standard input and not billing or shipping.
     *
     * @return {void}
     */
    const handleOnChange = async (event, isShipping = false, isBillingOrShipping = false) => {

        const { target } = event || {};

        if ('createAccount' === target.name) {
            handleCreateAccount(
                input,
                setInput,
                target
            )
        } else if ('billingDifferentThanShipping' === target.name) {
            handleBillingDifferentThanShipping(
                input,
                setInput, target
            );
        } else if (isBillingOrShipping) {
            if (isShipping) {
                await handleShippingChange(target)
            } else {
                await handleBillingChange(target)
            }
        } else {
            const newState = {
                ...input,
                [target.name]: target.value
            };
            setInput(newState);
        }
    };

    const handleShippingChange = async (target) => {
        const newState = {
            ...input,
            shipping: {
                ...input?.shipping,
                [target.name]: target.value
            }
        };
        setInput(newState);
        await setStatesForCountry(
            target,
            setTheShippingStates,
            setIsFetchingShippingStates
        );
    }

    const handleBillingChange = async (target) => {
        const newState = {
            ...input,
            billing: {
                ...input?.billing,
                [target.name]: target.value
            }
        };
        setInput(newState);
        await setStatesForCountry(
            target,
            setTheBillingStates,
            setIsFetchingBillingStates
        );
    }

    useEffect(async () => {

        if (null !== orderData) {
            // Call the checkout mutation when the value for orderData changes/updates.
            await checkout();
        }

    }, [orderData]);

    // Loading state
    const isOrderProcessing = checkoutLoading || isStripeOrderProcessing;

    return (
        <>
            {cart ? (
                <form
                    id="payment-form"
                    onSubmit={handleFormSubmit}
                    className="woo-next-checkout-form"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                        <div>
                            {/*Shipping Details*/}
                            <div className="billing-details">
                                <h2 className="text-xl font-medium mb-4">
                                    Endereço de Entrega
                                </h2>
                                <Address
                                    states={theShippingStates}
                                    countries={shippingCountries}
                                    input={input?.shipping}
                                    handleOnChange={(event) => handleOnChange(event, true, true)}
                                    isFetchingStates={isFetchingShippingStates}
                                    isShipping
                                    isBillingOrShipping
                                />
                            </div>
                            <div>
                                <CheckboxField
                                    name="billingDifferentThanShipping"
                                    type="checkbox"
                                    checked={input?.billingDifferentThanShipping}
                                    handleOnChange={handleOnChange}
                                    label="Endereço de faturamento diferente da entrega"
                                    containerClassNames="mb-4 pt-4"
                                />
                            </div>
                            {/*Billing Details*/}
                            {input?.billingDifferentThanShipping ? (
                                <div className="billing-details">
                                    <h2 className="text-xl font-medium mb-4">
                                        Endereço de Faturamento
                                    </h2>
                                    <Address
                                        states={theBillingStates}
                                        countries={billingCountries}
                                        input={input?.billing}
                                        handleOnChange={(event) => handleOnChange(event, false, true)}
                                        isFetchingStates={isFetchingBillingStates}
                                        isShipping={false}
                                        isBillingOrShipping
                                    />
                                </div>
                            ) : null}

                        </div>
                        {/* Order & Payments*/}
                        <div className="your-orders">
                            {/*	Order*/}
                            <h2 className="text-xl font-medium mb-4">Seu pedido</h2>
                            <YourOrder
                                cart={cart}
                                refetchCart={refetch}
                            />

                            {/*Payment*/}
                            <PaymentModes input={input} handleOnChange={handleOnChange} />

                            <div className="woo-next-place-order-btn-wrap mt-5">
                                <LoadingButton
                                    label={"Finalizar Compra"}
                                    loading={isOrderProcessing}
                                    type="submit"
                                />
                            </div>
                            <MercadoPagoCheckout
                                products={cart?.products}
                                orderId={createdOrderData?.orderId}
                                input={input}
                                preference={createdOrderData?.preference}
                            />

                            {/* Checkout Loading*/}
                            {
                                isOrderProcessing
                                && <p>Procesando Pedido...</p>
                            }
                            {
                                requestError
                                && <p>Erro : {requestError} :( Por favor, tente novamente.</p>
                            }
                        </div>
                    </div>
                </form>
            ) : <EmptyCart />}
            {/*	Show message if Order Success*/}
            <OrderSuccess response={checkoutResponse} />
        </>
    );
};

export default CheckoutForm;
