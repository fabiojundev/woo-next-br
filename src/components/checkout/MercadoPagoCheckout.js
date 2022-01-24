import { from } from '@apollo/client';
import { useEffect } from 'react';
import { useMercadopago } from 'react-sdk-mercadopago';
import { createTheOrder, getCreateOrderData} from '../../utils/order';
import { isEmpty, isArray } from 'lodash';

/**
* Handle MercadoPago checkout.
*
* 1. Create Formatted Order data.
* 2. Create Order using Next.js create-order endpoint.
* 3. Clear the cart session.
* 4. On success set show MercadoPago form to true
*
* @param input
* @param products
* @param setRequestError
* @param setShowMercadoPagoForm
* @param clearCartMutation
* @param setIsMercadoPagoOrderProcessing
*
*/
export const handleMercadoPagoCheckout = async (
    input,
    products,
    setRequestError,
    clearCartMutation,
    setIsMercadoPagoOrderProcessing,
    setCreatedOrderData
) => {
    setIsMercadoPagoOrderProcessing(true);
    const orderData = getCreateOrderData(
        input,
        products
    );
    const createCustomerOrder = await createTheOrder(
        orderData,
        setRequestError,
        ''
    );
    const cartCleared = 0 && await clearTheCart(
        clearCartMutation,
        createCustomerOrder?.error
    );
    setIsMercadoPagoOrderProcessing(false);

    //console.log("orderdata", orderData, createCustomerOrder, input )
    if (isEmpty(createCustomerOrder?.orderId) || cartCleared?.error) {
        console.log('empty orderId or error', createCustomerOrder, cartCleared);
        setRequestError('Clear cart failed');
        return null;
    }

    // On success show MercadoPago form.
    setCreatedOrderData(createCustomerOrder)
    // await createCheckoutSessionAndRedirect(
    //     products,
    //     input,
    //     createCustomerOrder?.orderId
    // );

    return createCustomerOrder;
}

const createCheckoutSessionAndRedirect = async (
    mercadopago,
    products,
    input,
    orderId
) => {

    try {

        if (mercadopago) {
            const opt = {
                preference: {
                    id: orderId,
                },
                tokenizer: getMercadoPagoLineItems(products, input, orderId),
                // theme: {
                //     elementsColor: '#2ddc52',
                //     headerColor: '#2ddc52'
                // },
                // render: {
                //     container: '.mp-container',
                //     label: 'Pagar MP'
                // },
                autoOpen: true,
                notificationUrl: 'https://cms.camadecultivo.com.br/?wc-api=WC_WooMercadoPago_Notification_IPN',
            };

            console.log(opt);
            const checkout = mercadopago.checkout(opt);
            console.log("checkout", checkout, checkout?.initPoint);
        }
    } catch (error) {
        console.log(error);
    }
}

export const getMercadoPagoLineItems = (products, input, orderId) => {
    if (isEmpty(products) && !isArray(products)) {
        return [];
    }

    const subtotal = products.reduce((prev, prod) => {
        return (prev + parseInt(prod?.qty) * parseFloat(prod?.price));
    }, 0);
    const shippingCost = parseFloat(input.shippingTotal);

    console.log("totla", subtotal, products);
    return {
        totalAmount: subtotal + shippingCost,
        summary: {
            title: 'Resumo',
            productLabel: 'Subtotal produtos',
            product: subtotal,
            shipping: shippingCost,
            // arrears: 18,
            // taxes: 20,
            // charge: 30,
            // discountLabel: 'discount label',
            // discount: 5,
        },
        backUrl: `/thank-you/?&order_id=${orderId}`,
    };
}

/**
 * Get meta data.
 *
 * @param input
 * @param {String} orderId Order Id.
 *
 * @returns {{lineItems: string, shipping: string, orderId, billing: string}}
 */
const getMetaData = (input, orderId) => {

    return {
        billing: JSON.stringify(input?.billing),
        shipping: JSON.stringify(input.billingDifferentThanShipping ? input?.billing?.email : input?.shipping?.email),
        orderId,
    };

    // @TODO
    // if ( customerId ) {
    //     metadata.customerId = customerId;
    // }

}

export const MercadoPagoCheckout = ({ products, orderId, input }) => {

    const mercadopago = useMercadopago.v2(process.env.NEXT_PUBLIC_MP_PUBLIC_TOKEN, {
        locale: 'pt-BR'
    });


    useEffect(() => {
        console.log("useEffect");
        if (mercadopago && orderId && !isEmpty(products)) {
            console.log("useEffect checkout", orderId, mercadopago);
            createCheckoutSessionAndRedirect(
                mercadopago,
                products,
                input,
                orderId
            );

        }
    }, [mercadopago, orderId])

    return (
        <>
            <div className='mp-container'></div>
        </>
    );
};

