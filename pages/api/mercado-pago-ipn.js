import { apiPut } from '../../src/utils/woocommerce-api';

const mercadopago = require('mercadopago');
mercadopago.configure({
    access_token: process.env.MP_ACCESS_TOKEN,
    // integrator_id: 'INTEGRATOR_ID',
});

const handler = async (req, res) => {

    try {
        const data = await mercadopago.ipn.manage(req);

        res.render('jsonOutput', {
            result: data,
        });

        let newOrderData = {
            transaction_id: req.query.id
        };

        switch(data?.status) {
            
            default:
            case 'approved':
            case 'pending':
                newOrderData.status = data.status;
               break;

            case 'in_process':
                newOrderData.status = 'processing';
                break;
            
            case 'rejected':
                newOrderData.status = 'failed';
                break;
        }
        
    
        const updatedData = await apiPut(`orders/${orderId}`, newOrderData);
        console.log('✅ Order updated data', updatedData, newOrderData);

        res.status(200).end();

    } catch (error) {
        console.log(error);
        res.status(500).end(error);
    }
};

export default handler;
