import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShippingCosts from "../../../src/components/single-product/ShippingCosts";
import { MockedProvider } from '@apollo/client/testing';
import userEvent from '@testing-library/user-event';
import { GET_CUSTOMER } from "../../../src/queries/get-customer";
import GET_SHIPPING_COSTS from "../../../src/queries/get-shipping-costs";
import UPDATE_SHIPPING_ADDRESS from "../../../src/mutations/update-shipping-address";
import { act } from 'react-dom/test-utils';

afterEach(cleanup);

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

    const getMocks = (loadCustomer) => ([
        {
            request: {
                query: GET_CUSTOMER,
            },
            result: {
                data: {
                    customer: {
                        email: loadCustomer ? "email@email.com" : '',
                        shipping: loadCustomer ? shipping : emptyShipping,
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
                query: GET_SHIPPING_COSTS,
                variables: {
                    productId: 1,
                    zipcode: "01234-567",
                    quantity: 1,
                },
            },
            result: {
                data: {
                    shippingCosts: {
                        address: {
                            desc: "CEP não encontrado",
                            address1: "",
                            address2: "",
                            city: "",
                            state: "",
                            country: "",
                            postcode: "",
                        },
                        shippingCosts: [],
                    }
                },
            },
        },
        {
            request: {
                query: UPDATE_SHIPPING_ADDRESS,
                variables: {
                    input: {
                        shipping: {
                            address1: "Rua Conselheiro Furtado, 123",
                            address2: "Apt 1",
                            city: "São Paulo",
                            country: "BRA",
                            state: "SP",
                            postcode: "01512-000"
                        }
                    }
                },
            },
            result: {
                data: {
                    updateCustomer: {
                        customer: {
                            email: "",
                            shipping,
                        }    
                    },
                },
            },
        },
    ]);

    const customRender = (loadCustomer) => {
        render(
            <MockedProvider mocks={getMocks(loadCustomer)}>
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

    it('Auto Request ShippingCosts - customer info load', async () => {

        customRender(true);

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
    });


    it('Incomplete Request ShippingCosts', async () => {

        customRender();
        userEvent.type(screen.getByPlaceholderText("00000-000"), "01512-00");
        userEvent.click(screen.getByRole('button', { title: /Calcular Frete/ }));

        act(() => {
            new Promise(resolve => setTimeout(resolve, 0));
        });

        await waitFor(() => {
            const results = screen.queryAllByTitle(/Frete e prazo de entrega/);
            expect(results).toBeNull;
        });
    });


    it('Request ShippingCosts - typed postcode', async () => {

        customRender();
        const input = screen.getByPlaceholderText("00000-000");
        fireEvent.change(input, { target: { value: '01512-000' } });
        expect(input).toHaveValue("01512-000");
        userEvent.click(screen.getByRole('button', { title: /Calcular Frete/ }));

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
    });

    it('Request ShippingCosts - invalid postcode', async () => {

        customRender();
        const input = screen.getByPlaceholderText("00000-000");
        fireEvent.change(input, { target: { value: '01234-567' } });
        expect(input).toHaveValue("01234-567");
        userEvent.click(screen.getByRole('button', { title: /Calcular Frete/ }));

        act(() => {
            new Promise(resolve => setTimeout(resolve, 0));
        });

        await waitFor(() => {
            const results = screen.queryByText(/CEP não encontrado/);
            expect(results).toBeInTheDocument();
        });
    });

});

