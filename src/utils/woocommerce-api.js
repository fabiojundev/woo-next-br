import axios from 'axios';
import OAuth  from 'oauth-1.0a'
import CryptoJS from 'crypto-js'
import {sanitize} from './miscellaneous';

const oauth = OAuth({
    consumer: {
        key: process.env.WC_CONSUMER_KEY,
        secret: process.env.WC_CONSUMER_SECRET
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
        return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(base_string, key));
    }
});

const getParams = (url, method, data) => {
    const requestData = {
        url,
        method
    };

    return { 
        params: oauth.authorize(requestData) 
    };
}

export const getFullUrl = (path) => {

    path = sanitize(path);
    let url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/${path}`;

    // url += `?consumer_key=${process.env.WC_CONSUMER_KEY}`;
    // url += `&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;

    return url;
};

export const apiGet = async (path) => {
    const url = getFullUrl(path);

    const res = await axios.get(
        url, 
        getParams(url, 'GET')
    );
    return res.data;
};

export const apiPost = async (path, data) => {
    const url = getFullUrl(path);

    const res = await axios.post(
        url, 
        data,
        getParams(url, 'POST')
    );

    return res.data;
};

export const apiPut = async (path, data) => {
    const url = getFullUrl(path);

    const res = await axios.put(
        url, 
        data,
        getParams(url, 'PUT')
    );

    return res.data;
};

