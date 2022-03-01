import { useState, useContext } from "react";
import { useQuery, useMutation } from '@apollo/client';
import Link from "next/link";
import { v4 } from 'uuid';
import cx from 'classnames';

import { AppContext } from "../context/AppContext";
import { getFormattedCart } from "../../functions";
import GET_CART from "../../queries/get-cart";
import ADD_TO_CART from "../../mutations/add-to-cart";
import QuantityInput from "../QuantityInput";

const AddToCart = (props) => {

    const { product, showQuantity } = props;

    const [quantity, setQuantity] = useState(1);

    const productQryInput = {
        clientMutationId: v4(), // Generate a unique id.
        productId: product.productId,
        quantity: quantity,
    };

    const [cart, setCart] = useContext(AppContext);
    const [showViewCart, setShowViewCart] = useState(false);
    const [requestError, setRequestError] = useState(null);

    // Get Cart Data.
    const { data, refetch } = useQuery(GET_CART, {
        notifyOnNetworkStatusChange: true,
        onCompleted: () => {

            // Update cart in the localStorage.
            const updatedCart = getFormattedCart(data);
            localStorage.setItem('woo-next-cart', JSON.stringify(updatedCart));

            // Update cart data in React Context.
            setCart(updatedCart);
        }
    });

    const onChange = (event) => {
        const qty = parseInt(event.target.value);
        productQryInput.quantity = qty;
        setQuantity(qty);
    };

    // Add to Cart Mutation.
    const [addToCart, {
        data: addToCartRes,
        loading: addToCartLoading,
        error: addToCartError
    }] = useMutation(ADD_TO_CART, {
        variables: {
            input: productQryInput,
        },
        onCompleted: () => {
            // On Success:
            // 1. Make the GET_CART query to update the cart with new values in React context.
            refetch();

            // 2. Show View Cart Button
            setShowViewCart(true)
        },
        onError: (error) => {
            if (error) {
                console.log("ERROR adding to cart", error);
                setRequestError(error?.graphQLErrors?.[0]?.message ?? '');
            }
        }
    });

    const handleAddToCartClick = async () => {
        setRequestError(null);
        await addToCart();
    };

    return (
        <div>
            {/*	Check if its an external product then put its external buy link */}
            {"ExternalProduct" === product.__typename ? (
                <a
                    href={product?.externalUrl ?? '/'}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-sm mr-3 text-sm border-solid border border-current inline-block">
                    Comprar
                </a>
            ) :
                <>
                    <div className="flex flex-wrap items-end">
                        {showQuantity && (
                            <QuantityInput
                                label="Quantidade"
                                value={quantity}
                                handleChange={onChange}
                            />
                        )}
                        <div className="py-4">
                            <button
                                disabled={addToCartLoading}
                                onClick={handleAddToCartClick}
                                className={cx(
                                    'bg-green-default',
                                    { 'opacity-100 cursor-pointer': !addToCartLoading },
                                    { 'opacity-50 cursor-not-allowed': addToCartLoading }
                                )}
                            >
                                {addToCartLoading ? 'Adicionando...' : 'Comprar'}
                            </button>
                            {showViewCart ? (
                                <Link href="/carrinho" passHref>
                                    <button className="view-cart">
                                        Ver Carrinho
                                    </button>
                                </Link>
                            ) : ''}
                        </div>
                    </div>
                </>

            }
            {requestError ? (
                <div className="my-2">
                    <span className="p-2 text-sm text-white bg-red-500">
                        Erro ao adicionar o produto. Tente novamente mais tarde.
                    </span>
                </div>
            ) : ''}
        </div>
    );
};

export default AddToCart;
