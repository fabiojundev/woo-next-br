const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
import { isEmpty } from 'lodash'

const api = new WooCommerceRestApi({
    url: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    consumerKey: process.env.WC_CONSUMER_KEY,
    consumerSecret: process.env.WC_CONSUMER_SECRET,
    version: "wc/v3"
});

/**
 * Create order endpoint.
 *
 * @see http://woocommerce.github.io/woocommerce-rest-api-docs/?javascript#retrieve-an-order
 *
 * @param {Object} req Request.
 * @param {Object} res Response.
 *
 * @return {Promise<{orderId: string, success: boolean, error: string}>}
 */
export default async function handler(req, res) {

    console.log("handler",req, req.query);

    const { orderId } = req.query;

    const responseData = {
        success: false,
        order: false,
        error: ''
    }


    if (isEmpty(orderId)) {
        responseData.error = 'Missing required data.';
        return responseData
    }

    try {
        const { data } = await api.get(
            'orders/' + orderId,
        );

        console.log("resp data", data);
        responseData.order = data;
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