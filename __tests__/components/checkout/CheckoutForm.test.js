
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider } from "../../../src/components/context/AppContext";
import CheckoutForm from "../../../src/components/checkout/CheckoutForm";
import { MockedProvider } from '@apollo/client/testing';
import { getGqlMocks, loadedCart } from '../../../__mocks__/cart';
import '../../../__mocks__/uuid';
import { act } from 'react-dom/test-utils';

afterEach(cleanup);

describe('CheckoutForm', () => {

    const customRender = (loadCart, withShipping) => {
        return render(
            <AppProvider>
                <MockedProvider mocks={getGqlMocks(loadCart, withShipping)} addTypename={false}>
                    <CheckoutForm />
                </MockedProvider>
            </AppProvider>
        );
    };

    it('Render empty CheckoutForm', async () => {

        customRender();
        // screen.debug(undefined, Infinity);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            screen.getByText(/Carrinho vazio/i);
            screen.getByText(/Adicionar Produtos/i);
        });
    });

    it('Render CheckoutForm with 2 products in the cart, 3 items', async () => {

        customRender(true, true);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.queryByText(/Carrinho vazio/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Adicionar Produtos/i)).not.toBeInTheDocument();
        });
        screen.getByText(/Endereço de Entrega/i);

        //Form input loaded from the cart
        expect(screen.getByLabelText(/Nome/)).toHaveValue('Nome');
        expect(screen.getByLabelText(/Sobrenome/)).toHaveValue('Sobrenome');
        expect(screen.getByLabelText(/Email/)).toHaveValue('email@email.com');
        expect(screen.getByLabelText(/Celular/)).toHaveValue('(11) 98765-4321');
        expect(screen.getByLabelText(/CEP/)).toHaveValue('01512-000');
        expect(screen.getByPlaceholderText(/Nome da rua/)).toHaveValue('Rua Conde de Sarzedas');
        // expect(screen.getByLabelText(/Número/)).toHaveValue('123');
        // expect(screen.getByLabelText(/CPF/)).toHaveValue('123.456.789-01');
        expect(screen.getByLabelText(/Complemento/)).toHaveValue('Apt 1');
        expect(screen.getByLabelText(/Cidade/)).toHaveValue('Sao Paulo');
        expect(screen.getByLabelText(/Estado/)).toHaveValue('SP');

        //Cart items
        screen.getByText(/Nome do Produto x 1/);
        screen.getByText("R$34,90");
        screen.getByText(/Nome do Produto x 2/);
        screen.getByText("R$2,20");

        screen.getByText(/Frete(.|\n)*-(.|\n)*R\$10,00/);
        screen.getByText(/PAC(.|\n)*-(.|\n)*R\$20,00/);

        screen.getByText(/Total/);
        screen.getByText("R$47,10");


    });

    it('Choose shipping method', async () => {

        customRender(true, true);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.queryByText(/Carrinho vazio/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Adicionar Produtos/i)).not.toBeInTheDocument();
        });

        expect(screen.getAllByRole('radio')).toHaveLength(2);
        screen.getByText("R$47,10");

        fireEvent.click(screen.getByLabelText(/PAC/));
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });
        screen.getByText("R$57,10");
        // screen.debug(undefined, Infinity);
    });

    it('Submit checkout form', async () => {

        customRender(true, true);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.queryByText(/Carrinho vazio/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/Adicionar Produtos/i)).not.toBeInTheDocument();
        });

        screen.debug(undefined, Infinity);
        expect(screen.getAllByRole('radio')).toHaveLength(2);
        screen.getByText("R$47,10");

        fireEvent.click(screen.getByRole("button",{ name: /Finalizar Compra/i }));
        waitFor(() => {
            screen.getByText("Processando Pedido...");
        });
        
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });
        
        waitFor(() => {
            expect(screen.queryByText("Processando Pedido...")).not.toBeInTheDocument();
        });
        // screen.debug(undefined, Infinity);
    });

});

