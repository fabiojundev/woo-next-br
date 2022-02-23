import ADD_TO_CART from "../src/mutations/add-to-cart";
import UPDATE_CART from "../src/mutations/update-cart";
import GET_CART from "../src/queries/get-cart";
import { GET_CUSTOMER } from "../src/queries/get-customer";
import CLEAR_CART_MUTATION from "../src/mutations/clear-cart";
import { productNode } from "./product";

export const shipping = {
    address1: "Rua Conselheiro Furtado, 123",
    address2: "Apt 1",
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
    availableShippingMethods: [{
        packageDetails: "produto 1 + produto 2",
        rates: [
            {
                cost: "10.00",
                id: 'flat_rate',
                label: 'Frete',
                methodId: 'flat_rate',
            }
        ]
    }],
    chosenShippingMethods: ['flat_rate'],
    needsShippingAddress: false

};

export const getGqlMocks = (loadCart) => ([
    {
        request: {
            query: GET_CART,
        },
        newData: jest.fn(() => ({
            data: {
                cart: loadCart ? loadedCart : emptyCart,
                customer: {
                    email: loadCart ? "email@email.com" : '',
                    shipping: loadCart ? shipping : emptyShipping,
                }
            }
        })),
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
]);