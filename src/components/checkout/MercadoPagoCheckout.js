import { from } from '@apollo/client';
import { useEffect } from 'react';
import { useMercadopago } from 'react-sdk-mercadopago';
import { createTheOrder, getCreateOrderData } from '../../utils/order';
import { isEmpty, isArray } from 'lodash';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { clearTheCart } from '../../utils/cart';

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
    const cartCleared = await clearTheCart(
        clearCartMutation,
        createCustomerOrder?.error
    );
    setIsMercadoPagoOrderProcessing(false);

    //console.log("orderdata", orderData, createCustomerOrder, input )
    if (!createCustomerOrder?.orderId) {
        console.log('empty orderId ', createCustomerOrder?.orderId, isEmpty(createCustomerOrder?.orderId));
        setRequestError('Create order failed');
        return null;
    }
    if (cartCleared?.error) {
        console.log('error', cartCleared?.error);
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
    orderId,
    preference
) => {

    try {

        if (mercadopago) {

            const opt = {
                preference: {
                    id: preference?.id,
                },
                tokenizer: getMercadoPagoLineItems(products, input),
            };

            console.log(opt);
            const checkout = mercadopago.checkout(opt);
            console.log("checkout", checkout, checkout?.init_point);
        }
    } catch (error) {
        console.log(error);
    }
}

export const getMercadoPagoLineItems = (products, input) => {
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
            title: 'Resumo da sua Compra',
            productLabel: 'Subtotal produtos',
            charge: subtotal,
            shipping: shippingCost,
            // arrears: 18,
            // taxes: 20,
            // charge: 30,
            // discountLabel: 'discount label',
            // discount: 5,
        },
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

export const MercadoPagoCheckout = ({ products, orderId, input, preference }) => {

    const mercadopago = useMercadopago.v2(process.env.NEXT_PUBLIC_MP_PUBLIC_TOKEN, {
        locale: 'pt-BR'
    });

    const router = useRouter();

    useEffect(() => {
        if (mercadopago && orderId && !isEmpty(products)) {
            // console.log("useEffect checkout", orderId, mercadopago);
            createCheckoutSessionAndRedirect(
                mercadopago,
                products,
                input,
                orderId,
                preference
            );
            if (preference?.init_point) {
                const redir = process.env.MP_SANDBOX
                    ? preference?.sandbox_init_point
                    : preference?.init_point;
                console.log("redir to: ", redir);
                router.push(redir);
            }
        }
    }, [mercadopago, orderId, products, input, preference, router]);

    return (
        <>
            <div className='mp-container'></div>
        </>
    );
};

