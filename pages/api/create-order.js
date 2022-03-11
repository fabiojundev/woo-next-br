import { isEmpty } from 'lodash'
import { getMercadoPagoPreference } from '../../src/utils/mercado-pago';
import { apiPost } from '../../src/utils/woocommerce-api';

/**
 * Create order endpoint.
 *
 * @param {Object} req Request.
 * @param {Object} res Response.
 *
 * @return {Promise<{orderId: string, success: boolean, error: string}>}
 */
export default async function handler(req, res) {

    const responseData = {
        success: false,
        orderId: '',
        total: '',
        currency: '',
        error: ''
    }

    const reqData = req?.body;

    if (isEmpty(reqData)) {
        responseData.error = 'Missing required data.';
        return responseData
    }

    try {
        const data = await apiPost('orders', reqData);

        // console.log("resp data", data);
        // console.log('reqData',reqData);

        responseData.success = true;
        responseData.orderId = data.id;
        responseData.total = data.total;
        responseData.currency = data.currency;

        if(data.payment_method === 'woo-mercado-pago-basic') {
            //TODO remove
            data.billing = reqData.billing;
            data.shipping = reqData.shipping;
            const preferences = await getMercadoPagoPreference(
                data,
                req.headers.host
            );
            console.log("MP preference: ", preferences);

            responseData.preference = {
                id: preferences?.id,
                init_point: preferences?.init_point,
                sandbox_init_point: preferences?.sandbox_init_point,
            };
        }

        console.log("response data", responseData);
        res.json(responseData)

    } catch (error) {
        console.log("error", error);
        /**
         * Request usually fails if the data in req.body is not sent in the format required.
         *
         * @see Data shape expected: https://stackoverflow.com/questions/49349396/create-an-order-with-coupon-lines-in-woocomerce-rest-api
         */
        responseData.error = error.message;
        res.status(500).json(responseData);
    }
}
