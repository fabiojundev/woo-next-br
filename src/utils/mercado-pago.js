const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
    // integrator_id: 'INTEGRATOR_ID',
});


export const getMercadoPagoPreference = async (order) => {
    let preference;

    if (order?.line_items) {
        console.log("ORDER", order);
        const billing = order?.billing;
        const phone = billing?.phone?.replace(/\D/g, '');
        const items = order?.line_items.map(item => ({
            title: item.name,
            quantity: item.quantity,
            currency_id: 'BRL',
            unit_price: item.price

        }));

        const shipments = (order.shipping_lines && order.shipping_lines[0]?.total)
            ? {
                cost: parseFloat(order.shipping_lines[0]?.total),
                mode: 'not_specified',
            }
            : {};

        const preferences = {
            items: items,
            shipments,
            payer: {
                phone: {
                    area_code: phone.substring(0, 2),
                    number: parseInt(phone.substring(2)),
                },
                address: {
                    street_name: billing?.address_1,
                    street_number: billing?.number,
                    zip_code: billing?.postcode,
                },
                email: billing?.email,
                // identification: {
                //     type: billing.person_type == 1 ? 'CPF' : 'CNPJ',
                //     number: billing.person_type == 1 ? billing.cpf : billing.cnpj,
                // },
                name: billing.first_name,
                surname: billing.last_name,
                date_created: null,
                last_purchase: null
            },
            auto_return: 'all',
            back_urls: {
                success: process.env.NEXT_PUBLIC_MP_RETURN_URL,
                pending: process.env.NEXT_PUBLIC_MP_RETURN_URL,
                failure: process.env.NEXT_PUBLIC_MP_RETURN_URL,
            },
            redirect_urls: {
                success: process.env.NEXT_PUBLIC_MP_RETURN_URL,
                pending: process.env.NEXT_PUBLIC_MP_RETURN_URL,
                failure: process.env.NEXT_PUBLIC_MP_RETURN_URL,
            },
            notification_url: process.env.NEXT_PUBLIC_MP_IPN_URL,
            statement_descriptor: process.env.NEXT_PUBLIC_MP_STATEMENT_DESC,
            external_reference: order.id.toString(),
        };

        console.log("preferences", preferences);
        try {
            const mp = await mercadopago.preferences.create(preferences);
            preference = mp?.response;
        } catch (error) {
            console.log("error", error);
        }
    }

    return preference;
};
