import axios from 'axios';

export const getFullUrl = (path) => {
    let url = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/${path}`;
    url += `?consumer_key=${process.env.WC_CONSUMER_KEY}`;
    url += `&consumer_secret=${process.env.WC_CONSUMER_SECRET}`;
    
    return url;
};

export const apiGet = async (path) => {
    const res = await axios.get(getFullUrl(path));
    return res.data;
};

export const apiPost = async (path, data) => {
    const res = await axios.post(getFullUrl(path), data);
    return res.data;
};