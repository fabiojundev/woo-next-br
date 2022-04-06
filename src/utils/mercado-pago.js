const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
    integrator_id: 'dev_f62e2595b5c311eca8530242ac130004',
});


export const getMercadoPagoPreference = async (order, domain) => {
    let preference;

    if (order?.line_items) {
//        console.log("ORDER MP", order);
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
            metadata:{
                orderId: order.id,
            },
            payer: {
                phone: {
                    area_code: phone.substring(0, 2),
                    number: parseInt(phone.substring(2), 10),
                },
                address: {
                    street_name: billing?.address_1,
                    street_number: parseInt( billing?.number, 10 ),
                    zip_code: billing?.postcode,
                },
                email: billing?.email,
                identification: {
                    type: billing.persontype != '1' ? 'CNPJ' : 'CPF',
                    number: billing.persontype != '1' ? billing.cnpj : billing.cpf,
                },
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
            // notification_url: process.env.NEXT_PUBLIC_MP_IPN_URL,
            notification_url: `https://${domain}/api/mercado-pago-ipn/`,
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

export const getMercadoPagoStatusDesc = (status, status_detail) => {
    switch (status) {
        case 'approved':
            return 'Aprovado';
        case 'pending':
            return 'Aguardando pagamento';
        case 'in_process':
            return 'Em análise';
        case 'rejected':
            switch (status_detail) {
                case 'cc_rejected_bad_filled_card_number':
                    return 'Cartão de crédito inválido';

                case 'cc_rejected_bad_filled_date':
                    return 'Data de expiração inválida';

                case 'cc_rejected_bad_filled_other':
                    return 'Revise as informações do pagamento';

                case 'cc_rejected_bad_filled_security_code':
                    return 'Código de segurança inválido';

                case 'cc_rejected_blacklist':
                    return 'Cartão de crédito bloqueado';

                case 'cc_rejected_call_for_authorize':
                    return 'Autorização obrigatória na operadora do cartão';

                case 'cc_rejected_card_disabled':
                    return 'Cartão de crédito desabilitado';

                case 'cc_rejected_duplicated_payment':
                    return 'Pagamento duplicado';

                case 'cc_rejected_insufficient_amount':
                    return 'Saldo insuficiente';

                case 'cc_rejected_invalid_installments':
                    return 'Número de parcelas inválido';

                default:
                case 'cc_rejected_card_error':
                case 'cc_rejected_high_risk':
                case 'cc_rejected_max_attempts':
                case 'cc_rejected_other_reason':
                case 'cc_rejected_card_type_not_allowed':
                    return 'Cartão de crédito recusado';

            }


    }
};