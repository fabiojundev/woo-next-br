import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddToCartButton from "../../../src/components/cart/AddToCartButton";
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { GET_CUSTOMER } from "../../../src/queries/get-customer";
import ADD_TO_CART from "../../../src/mutations/add-to-cart";
import GET_CART from "../../../src/queries/get-cart";
import { act } from 'react-dom/test-utils';
import { v4 as uuidv4 } from 'uuid';
import uuid from 'uuid';
// import { v4 } from 'uuid';
// import * as uuid from 'uuid';

// import * as uuid from 'uuid';
// // import { v4 as uuidv4 } from 'uuid';
// jest.mock('uuid', () => {
//     return {
//         uuidv4: jest.fn(() => '123')
//     };
// });
// const uuid = uuidv4();

jest.mock('uuid', () => {
    return {
      __esModule: true,
      v4: jest.fn().mockReturnValue('123'),
    };
  });
// jest.mock('uuid', () => ({ v4: () => '123' }));
// jest.mock('uuid', () => ({ v4: () => '123' }));
// jest.mock('uuid', () => () => '123');
// uuidv4 = jest.fn().mockReturnValue('123');
// uuidv4.mockImplementation(() => {
//     return '123';
// });

// const uuidMock = jest.fn().mockImplementation(() => {
//     return {
//         v4: jest.fn(() => '123'),
//     };
// });
// jest.mock('uuid', () => {
//     return uuidMock;
// });

// beforeEach(() => {
//     jest.mock('uuid', () => ({ v4: () => '123' }));
// });

describe('AddToCartButton', () => {

    const shipping = {
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
    const emptyShipping = {
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

    const emptyCart = {
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

    const loadedCart = {
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

    const product = {
        id: "1",
        productId: "1",
        name: "Product 1",
        description: "Product 1 description",
        type: "simple",
        onSale: false,
        slug: "product-1",
        averageRating: 5,
        reviewCount: 10,
        image: {
            id: "1",
            sourceUrl: "https://via.placeholder.com/150",
            altText: "Product 1"
        },
        galleryImages: {
            nodes: [
                {
                    id: "1",
                    sourceUrl: "https://via.placeholder.com/150",
                    altText: "Product 1"
                },
            ],
        },

    };

    const getMocks = (loadCart) => ([
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
                query: GET_CART,
            },
            result: {
                data: {
                    cart: loadCart ? loadedCart : emptyCart,
                    customer: {
                        email: loadCart ? "email@email.com" : '',
                        shipping: loadCart ? shipping : emptyShipping,
                    }
                }
            },
        },
        {
            request: {
                query: ADD_TO_CART,
                variables: {
                    input: {
                        clientMutationId: '123',
                        productId: 1,
                        quantity: 1,
                    },
                },
            },
            result: {
                data: {
                    addToCart: {
                        cartItem: {
                            key: "26337353b7962f533d78c762373b3318",
                            product: {
                                node: {
                                    id: "cHJvZHVjdDo0NzA=",
                                    productId: 470,
                                    name: "Nome do Produto",
                                    description: "Descrição",
                                    type: "SIMPLE",
                                    onSale: false,
                                    slug: "product-slug",
                                    averageRating: 0,
                                    reviewCount: 0,
                                    image: {
                                        id: "cG9zdDo0NjQ=",
                                        sourceUrl: "", altText: "Alt text"
                                    },
                                    galleryImages: {
                                        nodes: []
                                    }
                                }
                            },
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
    ]);

    const customRender = (loadCart) => {
        render(
            <MockedProvider mocks={getMocks(loadCart)}>
                <AddToCartButton
                    product={product}
                    showQuantity={true}
                />
            </MockedProvider>
        );
    };

    it('Render AddToCartButton', () => {

        customRender();
        screen.getByRole("button", { name: /Comprar/i });
        screen.getByDisplayValue("-");
        screen.getByDisplayValue("+");
    });

    it.skip('Add product to cart', async () => {

        customRender();

        // uuid.mockImplementation(() => '123');
        // jest.spyOn(uuid, 'v4').mockReturnValue('123');
        // const uuidSpy = jest.spyOn(uuid, 'v4');

        userEvent.click(screen.getByRole("button", { name: /Comprar/i }));

        expect(screen.queryByRole("button", { name: /Ver Carrinho/i })).not.toBeInTheDocument();

        screen.getByRole("button", { name: /Adicionando/i });

        act(() => {
            new Promise(resolve => setTimeout(resolve, 0));
        });

        await waitFor(() => {
            expect(screen.queryByRole("button", { name: /Ver Carrinho/i })).toBeInTheDocument();
        });
    });

});

