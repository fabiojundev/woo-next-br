import { useState, useEffect, useContext } from "react";
import Router from "next/router";
import Link from 'next/link';
import axios from "axios";
import Layout from "../src/components/Layout";
import { AppContext } from "../src/components/context/AppContext";
import Loading from "../src/components/icons/Loading";
import ShoppingCart from "../src/components/icons/ShoppingCart";
import { formatCurrency } from "../src/functions";
import { getWCStatusDesc } from "../src/utils/order";


const isBrowser = 'undefined' !== typeof window;

const PedidoRecebidoContent = () => {
    const [cart, setCart, saveCartLocal, deleteCartLocal] = useContext(AppContext);
    const [isFetchingOrder, setFetchingOrder] = useState(false);
    const [orderData, setOrderData] = useState({});
    const orderId = isBrowser ? Router.query.external_reference : null;


    useEffect(() => {
        // console.log("Router", Router.query, orderId);
        setFetchingOrder(true);
        if (isBrowser) {
            deleteCartLocal();
            setCart(null);

            if (orderId) {
                console.log("get axios", `/api/get-order/?orderId=${orderId}`);
                axios.get(`/api/get-order/?orderId=${orderId}`)
                    .then((response) => {
                        console.log("response", response, response?.data?.order);
                        setOrderData(response?.data?.order ?? {});
                        setFetchingOrder(false);
                    })
                    .catch((error) => {
                        console.log(error);
                        setFetchingOrder(false);
                    });
            }
        }

    }, [orderId, setCart, deleteCartLocal]);

    return (
        <div className="h-almost-screen">
            <div className="w-600px mt-10 m-auto">
                {isFetchingOrder ? <Loading /> : (
                    <>
                        <h2 className="mb-6 text-xl">
                            <ShoppingCart className="inline-block mr-1" />
                            <span>Obrigado! Recebemos o seu pedido.</span>
                        </h2>
                        <table className="table-auto w-full text-left whitespace-no-wrap mb-8">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 text-gray-900 bg-gray-100 rounded-tl rounded-bl">
                                        Pedido
                                    </th>
                                    <th className="px-4 py-3 text-gray-900 text-sm bg-gray-100">
                                        #{orderData?.id}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-4 py-3">
                                        Status
                                    </td>
                                    <td className="px-4 py-3">
                                        {getWCStatusDesc(orderData?.status)}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">
                                        Produtos
                                    </td>
                                    <td className="px-4 py-3">
                                        {
                                            orderData?.line_items?.map(prod => (
                                                `${prod.name} x ${prod.quantity}: ${formatCurrency(prod.subtotal)}`
                                            ))
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">
                                        Entrega
                                    </td>
                                    <td className="px-4 py-3">
                                        {
                                            [
                                                orderData.shipping?.address_1,
                                                orderData.shipping?.address_2,
                                                orderData.shipping?.city,
                                                orderData.shipping?.state,
                                                orderData.shipping?.postcode,
                                                formatCurrency(orderData?.shipping_total),
                                            ].filter(n => n).join(' - ')
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3">
                                        Total
                                    </td>
                                    <td className="px-4 py-3">
                                        {formatCurrency(orderData?.total)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <Link href="/" passHref>
                            <button className="px-5 py-3 rounded-sm w-auto">
                                Comprar mais
                            </button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

const PedidoRecebido = () => {
    return (
        <Layout>
            <PedidoRecebidoContent />
        </Layout>
    )
}

export default PedidoRecebido;
