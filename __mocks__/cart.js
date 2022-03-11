import ADD_TO_CART from "../src/mutations/add-to-cart";
import UPDATE_CART from "../src/mutations/update-cart";
import GET_CART from "../src/queries/get-cart";
import { GET_CUSTOMER } from "../src/queries/get-customer";
import UPDATE_SHIPPING_ADDRESS from "../src/mutations/update-shipping-address";
import { UPDATE_SHIPPING_METHOD } from "../src/mutations/update-shipping-method";
import CLEAR_CART_MUTATION from "../src/mutations/clear-cart";
import { productNode } from "./product";

export const shipping = {
    address1: "Rua Conde de Sarzedas",
    address2: "Apt 1",
    number: "123",
    cpf: "12345678901",
    city: "Sao Paulo",
    state: "SP",
    country: "BRA",
    email: "email@email.com",
    company: "Cia",
    firstName: "Nome",
    lastName: "Sobrenome",
    phone: "11-98765-4321",
    postcode: "01512-000",
};

export const emptyShipping = {
    address1: "",
    address2: "",
    number: "",
    cpf: "",
    city: "",
    state: "",
    country: "",
    email: "",
    company: "",
    firstName: "",
    lastName: "",
    phone: "",
    postcode: "",
};

export const emptyCart = {
    contents: {
        "nodes": []
    },
    appliedCoupons: null,
    subtotal: "R$0,00",
    subtotalTax: "R$0,00",
    shippingTax: "R$0,00",
    shippingTotal: "R$000",
    total: "R$0,00",
    totalTax: "R$0,00",
    feeTax: "R$0, 00",
    feeTotal: "R$0,00",
    discountTax: "R$0,00",
    discountTotal: "R$0,00",
    availableShippingMethods: [],
    chosenShippingMethods: [],
    needsShippingAddress: false

};

export const shippingRates = [{
    packageDetails: "produto 1 + produto 2",
    rates: [
        {
            cost: "10.00",
            id: 'flat_rate',
            label: 'Frete',
            methodId: 'flat_rate',
        },
        {
            cost: "20.00",
            id: 'PAC',
            label: 'PAC',
            methodId: 'PAC',
        }
    ]
}];

export const loadedCart = {
    contents: {
        nodes: [
            {
                key: 'product-1',
                product: {
                    node: {
                        ...productNode.node,
                        productId: 472,
                    },
                },
                variation: null,
                quantity: 1,
                total: "R$34,90",
                subtotal: "R$34,90",
                subtotalTax: "R$0,00"
            },
            {
                key: 'product-2',
                product: productNode,
                variation: null,
                quantity: 2,
                total: "R$2,20",
                subtotal: "R$2,20",
                subtotalTax: "R$0,00"
            },
        ]
    },
    appliedCoupons: null,
    subtotal: "R$37,10",
    subtotalTax: "R$0,00",
    shippingTax: "R$0,00",
    shippingTotal: "R$0,00",
    total: "R$37,10",
    totalTax: "R$0,00",
    feeTax: "R$0,00",
    feeTotal: "R$0,00",
    discountTax: "R$0,00",
    discountTotal: "R$0,00",
    availableShippingMethods: [],
    chosenShippingMethods: ['flat_rate'],
    needsShippingAddress: true

};

export const loadedCartWithRates = {
    ...loadedCart,
    availableShippingMethods: shippingRates,
    shippingTotal: "R$10,00",
    total: "R$47,10",
};

const { contents, appliedCoupons, ...chooseShippingResult } = loadedCart;

let queryCalled = false;
export const getGqlMocks = (loadCart, withShipping) => ([
    {
        request: {
            query: GET_CART,
        },
        result: jest.fn(() => {
            let ret = {};
            if (queryCalled) {
                ret = {
                    data: {
                        cart: loadCart
                            ? loadedCartWithRates
                            : emptyCart,
                        customer: {
                            email: loadCart ? "email@email.com" : '',
                            shipping
                        }
                    }
                };
            }
            else {
                ret = {
                    data: {
                        cart: loadCart
                            ? withShipping ? loadedCartWithRates : loadedCart
                            : emptyCart,
                        customer: {
                            email: loadCart ? "email@email.com" : '',
                            shipping: withShipping ? shipping : emptyShipping,
                        }
                    }
                };
            }
            console.log("queryCalled", queryCalled, loadCart, withShipping, ret);
            queryCalled = true;
            return ret;
        }),
    },
    {
        request: {
            query: GET_CART,
            variables: {},
        },
        result: jest.fn(() => {
            return {
                data: {
                    cart: loadedCartWithRates,
                    customer: {
                        email: "email@email.com",
                        shipping
                    }
                }
            };
        }),
    },
    {
        request: {
            query: ADD_TO_CART,
            variables: {
                input: {
                    clientMutationId: '123',
                    productId: "1",
                    quantity: 1,
                },
            },
        },
        result: {
            data: {
                addToCart: {
                    cartItem: {
                        key: "26337353b7962f533d78c762373b3318",
                        product: productNode,
                        variation: null,
                        quantity: 1,
                        total: "R$34,90",
                        subtotal: "R$34,90",
                        subtotalTax: "R$0,00"
                    }
                },
            },
        },
    },
    {
        request: {
            query: UPDATE_CART,
            variables: {
                input: {
                    clientMutationId: '123',
                    productId: "1",
                    quantity: 1,
                },
                shippingMethod: {
                    clientMutationId: '123',
                    shippingMethods: ['flat_rate'],
                }
            },
        },
        result: {
            data: {
                addToCart: {
                    cartItem: {
                        key: "26337353b7962f533d78c762373b3318",
                        product: productNode,
                        variation: null,
                        quantity: 1,
                        total: "R$34,90",
                        subtotal: "R$34,90",
                        subtotalTax: "R$0,00"
                    }
                },
            },
        },
    },
    {
        request: {
            query: GET_CUSTOMER,
        },
        result: {
            data: {
                customer: {
                    email: loadCart ? "email@email.com" : '',
                    shipping: loadCart ? shipping : emptyShipping,
                }
            },
        },
    },
    {
        request: {
            query: UPDATE_SHIPPING_ADDRESS,
            variables: {
                input: {
                    clientMutationId: '123',
                    shipping: {
                        country: 'BR',
                        postcode: '01512000',
                    },
                },
            },
        },
        result: {
            data: {
                updateCustomer: {
                    customer: {
                        shipping
                    },
                },
            },
        },
    },
    {
        request: {
            query: UPDATE_SHIPPING_METHOD,
            variables: {
                shippingMethod: {
                    clientMutationId: '123',
                    shippingMethods: ['flat_rate'],
                }
            },
        },
        result: {
            data: {
                updateShippingMethod: {
                    cart: chooseShippingResult,
                },
            },
        },
    },
    {
        request: {
            query: UPDATE_SHIPPING_METHOD,
            variables: {
                shippingMethod: {
                    clientMutationId: '123',
                    shippingMethods: ['PAC'],
                }
            },
        },
        result: {
            data: {
                updateShippingMethod: {
                    cart: {
                        ...chooseShippingResult,
                        chosenShippingMethods: ['PAC']
                    },
                },
            },
        },
    },
]);