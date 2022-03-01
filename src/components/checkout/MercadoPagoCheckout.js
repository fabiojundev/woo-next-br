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
* 4. On success set orderData state with MP preferences.
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
    // Show loading feedback.
    setIsMercadoPagoOrderProcessing(true);

    // Create Formatted Order data.
    const orderData = getCreateOrderData(
        input,
        products
    );
    // Call create order endpoint with order data - create WC Order.
    const wcOrder = await createTheOrder(
        orderData,
        setRequestError,
        ''
    );
    // Clear the cart session.
    const cartCleared = await clearTheCart(
        clearCartMutation,
        wcOrder?.error
    );
    // Hide loading feedback.
    setIsMercadoPagoOrderProcessing(false);

    //console.log("orderdata", orderData, wcOrder, input )

    // Verify for errors.
    if (!wcOrder?.orderId) {
        console.log('empty orderId ', wcOrder?.orderId, isEmpty(wcOrder?.orderId));
        setRequestError('Erro ao criar pedido. Tente novamente');
        return null;
    }
    if (cartCleared?.error) {
        console.log('error', cartCleared?.error);
        setRequestError('Erro ao limpar carrinho.');
        return null;
    }

    setCreatedOrderData(wcOrder);

    return wcOrder;
}

export const getMercadoPagoLineItems = (products, input) => {
    if (isEmpty(products) && !isArray(products)) {
        return [];
    }

    const subtotal = products.reduce((prev, prod) => {
        return (prev + parseInt(prod?.qty) * parseFloat(prod?.price));
    }, 0);
    const shippingCost = parseFloat(input.shippingTotal);

    // console.log("total", subtotal, products);
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

export const MercadoPagoCheckout = ({ products, orderId, input, preference }) => {


    const mercadopago = useMercadopago.v2(process.env.NEXT_PUBLIC_MP_PUBLIC_TOKEN, {
        locale: 'pt-BR'
    });

    const router = useRouter();

    useEffect(() => {
        if (mercadopago && orderId && !isEmpty(products) && preference?.id) {
            // console.log("useEffect checkout", orderId, mercadopago);
            try {

                const opt = {
                    preference: {
                        id: preference?.id,
                    },
                    tokenizer: getMercadoPagoLineItems(products, input),
                };

                const mpCheckout = async () => {
                    // console.log("checkout", preference, opt);
                    await mercadopago.checkout(opt);

                    if (preference?.init_point) {
                        const redir = 'true' == process.env.NEXT_PUBLIC_MP_SANDBOX
                            ? preference?.sandbox_init_point
                            : preference?.init_point;
                        // console.log("redir to: ", redir);
                        router.push(redir);
                    }
                }

                mpCheckout();
    
            } catch (error) {
                console.log(error);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mercadopago, orderId, products, input, preference?.id, router]);

    return (
        <>
            <div className='mp-container'></div>
        </>
    );
};

