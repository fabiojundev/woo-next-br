import { isArray, isEmpty, camelCase } from "lodash";

/**
 * Get line items for create order
 *
 * @param {array} products Products.
 *
 * @returns {*[]|*} Line items, Array of objects.
 */
export const getCreateOrderLineItems = (products) => {

    if (isEmpty(products) || !isArray(products)) {
        return []
    }

    console.log('products', products);

    return products?.map(
        ({ productId, qty: quantity, name, price }) => {
            return {
                quantity,
                product_id: productId,
                name,
                price
                // variation_id: '', // @TODO to be added.
            };
        },
    );
}

/**
 * Get Formatted create order data.
 *
 * @param order
 * @param products
 * @return {{shipping: {country: *, city: *, phone: *, address_1: (string|*), address_2: (string|*), postcode: (string|*), last_name: (string|*), company: *, state: *, first_name: (string|*), email: *}, payment_method_title: string, line_items: (*[]|*), payment_method: string, billing: {country: *, city: *, phone: *, address_1: (string|*), address_2: (string|*), postcode: (string|*), last_name: (string|*), company: *, state: *, first_name: (string|*), email: *}}}
 */
export const getCreateOrderData = (
    order,
    products
) => {
    // Set the billing Data to shipping, if applicable.
    const billingData = order.billingDifferentThanShipping ? order.billing : order.shipping;

    //console.log("getCreateOrderData", order);
    // Checkout data.
    return {
        shipping: {
            first_name: order?.shipping?.firstName,
            last_name: order?.shipping?.lastName,
            cpf: order?.shipping?.cpf,
            address_1: order?.shipping?.address1,
            number: order?.shipping?.number,
            address_2: order?.shipping?.address2,
            city: order?.shipping?.city,
            country: order?.shipping?.country,
            state: order?.shipping?.state,
            postcode: order?.shipping?.postcode,
            email: order?.shipping?.email,
            phone: order?.shipping?.phone,
            company: order?.shipping?.company,
        },
        billing: {
            first_name: billingData?.firstName,
            last_name: billingData?.lastName,
            cpf: billingData?.cpf,
            address_1: billingData?.address1,
            number: billingData?.number,
            address_2: billingData?.address2,
            city: billingData?.city,
            country: billingData?.country,
            state: billingData?.state,
            postcode: billingData?.postcode,
            email: billingData?.email,
            phone: billingData?.phone,
            company: billingData?.company,
            persontype: '1',
            // person_type: 1,
        },
        shipping_lines: order.shippingMethod
            ? [
                {
                    method_id: order.shippingMethod,
                    method_title: order.shippingLabel,
                    total: order.shippingTotal
                }
            ]
            : [],
        payment_method: order.paymentMethod,
        payment_method_title: camelCase(order.paymentMethod),
        line_items: getCreateOrderLineItems(products, order),
    };
}

/**
 * Create order in WooCommerce.
 *
 * @param {Object} orderData Order data.
 * @param {function} setOrderFailedError sets the react state to true if the order creation fails.
 * @param {string} previousRequestError Previous request error.
 *
 * @returns {Promise<{orderId: null, error: string}>}
 */
export const createTheOrder = async (
    orderData,
    setOrderFailedError,
    previousRequestError
) => {
    let response = {
        orderId: null,
        total: '',
        currency: '',
        error: '',
        preference: '',
    };

    // Don't proceed if previous request has error.
    if (previousRequestError) {
        response.error = previousRequestError;
        return response;
    }

    setOrderFailedError('');

    try {
        const request = await fetch('/api/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        const result = await request.json();
        console.log("order created: ", result);
        if (result.error) {
            response.error = result.error
            setOrderFailedError('Something went wrong. Order creation failed. Please try again');
        }
        response.orderId = result?.orderId ?? '';
        response.total = result.total ?? '';
        response.currency = result.currency ?? '';
        response.preference = result.preference ?? '';

    } catch (error) {
        // @TODO to be handled later.
        console.warn('Handle create order error', error?.message);
    }
    //console.log("create order response: ", response);
    return response;
}

export const getWCStatusDesc = (status) => {
    switch (status) {
        case 'approved':
            return 'Aprovado';
        case 'pending':
            return 'Aguardando pagamento';
        case 'processing':
            return 'Processando';
        case 'on-hold':
            return 'Em análise';
        case 'completed':
            return 'Completo';
        case 'cancelled':
            return 'Cancelado';
        case 'refunded':
            return 'Reembolsado';
        case 'failed':
            return 'Erro';
        default:
            return status;
    }
}