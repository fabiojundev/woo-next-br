import { apiPut } from '../../src/utils/woocommerce-api';

const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
    // integrator_id: 'INTEGRATOR_ID',
});

const handler = async (req, res) => {

    try {
        const data = await mercadopago.ipn.manage(req);

        let newOrderData = {
            transaction_id: req.query.id
        };

        switch (data?.body?.status) {

            case 'approved':
                newOrderData.status = 'processing';
                break;

            case 'pending':
                newOrderData.status = 'pending';
                break;

            case 'in_process':
                newOrderData.status = 'on-hold';
                break;

            case 'rejected':
                newOrderData.status = 'failed';
                break;
        }

        const orderId = data?.body?.external_reference;
        if (newOrderData.status) {
            const updatedData = await apiPut(`orders/${orderId}`, newOrderData);
            // console.log('✅ Order updated data', orderId, updatedData, newOrderData);
            res.status(200).json({ success: true });
        }

        res.status(406).json({ status: 'status not found' });

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

export default handler;
