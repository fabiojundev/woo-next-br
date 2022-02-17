import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShippingCosts from "../../../src/components/single-product/ShippingCosts";
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { GET_CUSTOMER } from "../../../src/queries/get-customer";
import GET_SHIPPING_COSTS from "../../../src/queries/get-shipping-costs";
import UPDATE_SHIPPING_ADDRESS from "../../../src/mutations/update-shipping-address";
import { act } from 'react-dom/test-utils';

describe('ShippingCosts', () => {

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

    const mocks = [
        {
            request: {
                query: GET_CUSTOMER,
            },
            result: {
                data: {
                    customer: {
                        email: "email@email.com",
                        shipping
                    }
                },
            },
        },
        {
            request: {
                query: GET_SHIPPING_COSTS,
                variables: {
                    productId: 1,
                    zipcode: "01512-000",
                    quantity: 1,
                },
            },
            result: {
                data: {
                    shippingCosts: {
                        address: {
                            desc: "Rua Conselheiro Furtado - São Paulo / SP",
                            address1: "Rua Conselheiro Furtado, 123",
                            address2: "Apt 1",
                            city: "São Paulo",
                            state: "SP",
                            country: "BRA",
                            postcode: "01512-000",
                        },
                        shippingCosts: [
                            {
                                name: "PAC",
                                cost: "R$10,50",
                                forecast: "3 dias"
                            },
                            {
                                name: "SEDEX",
                                cost: "R$15,00",
                                forecast: "1 dia"
                            },
                        ],
                    }
                },
            },
        },
        {
            request: {
                query: UPDATE_SHIPPING_ADDRESS,
                variables: {
                    input: {
                        shipping
                    },
                },
            },
            result: {
                data: {
                    customer: {
                        email: "",
                        shipping,
                    }
                },
            },
        },
    ];
    const customRender = () => {
        render(
            <MockedProvider mocks={mocks}>
                <ShippingCosts
                    productId={1}
                    quantity={1}
                />
            </MockedProvider>
        );
    };

    it('Render ShippingCosts', () => {

        customRender();
        screen.getByText(/Calcular frete/);
        screen.getByTitle("Digite o CEP");
    });

    it('Request ShippingCosts', async () => {

        customRender();
        screen.debug();
        userEvent.type(screen.getByPlaceholderText("00000-000"), "01512-000");
        userEvent.click(screen.getByRole('button', {title: /Calcular Frete/}));

        act(() => {
            new Promise(resolve => setTimeout(resolve, 0));
        });

        await waitFor(() => {
            const results = screen.queryAllByTitle(/Frete e prazo de entrega/);
            expect(results).toHaveLength(2);
            screen.getByText(/Rua Conselheiro Furtado - São Paulo \/ SP/);
            screen.getByText(/PAC/);
            screen.getByText(/SEDEX/);
        });

        screen.debug();
    });
});

