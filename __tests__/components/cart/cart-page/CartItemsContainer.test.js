import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppProvider } from "../../../../src/components/context/AppContext";
import CartItemsContainer from "../../../../src/components/cart/cart-page/CartItemsContainer";
import { MockedProvider } from '@apollo/client/testing';
import { getGqlMocks, loadedCart } from '../../../../__mocks__/cart';
import '../../../../__mocks__/uuid';
import { act } from 'react-dom/test-utils';
import { getFormattedCart } from '../../../../src/functions';

afterEach(cleanup);

describe('CartItemsContainer', () => {

    const customRender = (loadCart, withShipping) => {
        return render(
            <AppProvider>
                <MockedProvider mocks={getGqlMocks(loadCart, withShipping)} addTypename={false}>
                    <CartItemsContainer />
                </MockedProvider>
            </AppProvider>
        );
    };

    it('Render Empty CartItemsContainer', async () => {

        customRender();

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            screen.getByText(/Carrinho vazio/i);
            screen.getByText(/Adicionar Produtos/i);
        });
        // screen.debug();

    });

    it('Render CartItemsContainer with 2 products', async () => {

        customRender(true);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.queryByText(/Carrinho vazio/i)).not.toBeInTheDocument();
            expect(screen.queryAllByText(/Nome do Produto/i)).toHaveLength(2);
        });

    });

    it('Remove a item from the cart', async () => {

        customRender(true);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.queryByText(/Carrinho vazio/i)).not.toBeInTheDocument();
            expect(screen.queryAllByText(/Nome do Produto/i)).toHaveLength(2);
        });

        fireEvent.click(screen.getAllByTitle("Excluir")[0]);

        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            const prods = screen.queryAllByText(/Nome do Produto/i);
            expect(prods).toHaveLength(1);
        });
        // screen.debug();
    });

    it('Increase CartItem quantity in cart', async () => {

        customRender(true);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.queryByText(/Carrinho vazio/i)).not.toBeInTheDocument();
            expect(screen.queryAllByText(/Nome do Produto/i)).toHaveLength(2);
            expect(screen.getAllByText("R$34,90")).toHaveLength(2);
        });

        fireEvent.click(screen.getAllByText("+")[0]);
        screen.getByText("R$69,80");
        expect(screen.getAllByText("R$34,90")).toHaveLength(1);
    });

    it('Decrease CartItem quantity in cart', async () => {

        customRender(true);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.queryByText(/Carrinho vazio/i)).not.toBeInTheDocument();
            expect(screen.queryAllByText(/Nome do Produto/i)).toHaveLength(2);
            expect(screen.getAllByText("R$1,10")).toHaveLength(1);
        });

        fireEvent.click(screen.getAllByText("-")[1]);
        expect(screen.getAllByText("R$1,10")).toHaveLength(2);
    });

    it('Calculate shipping cost', async () => {

        customRender(true, true);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.queryByText(/Carrinho vazio/i)).not.toBeInTheDocument();
            expect(screen.queryAllByText(/Nome do Produto/i)).toHaveLength(2);
        });

        const postcodeInput = screen.getByTitle("CEP");

        //invalid zip code
        fireEvent.change(
            postcodeInput,
            { target: { value: "01512-aaa" } }
        );
        fireEvent.click(screen.getByRole("button", { name: /Atualizar/i }));
        expect(screen.queryAllByAltText("Carregando...")).toHaveLength(0);

        //valid zip code
        fireEvent.change(
            postcodeInput,
            { target: { value: "01512-000" } }
        );
        fireEvent.click(screen.getByRole("button", { name: /Atualizar/i }));
        screen.getAllByAltText("Carregando...");

        //update shipping address
        act(() => {
            new Promise(resolve => setTimeout(resolve, 2));
        });

        //refetch cart
        act(() => {
            new Promise(resolve => setTimeout(resolve, 10));
        });

        await waitFor(() => {
            expect(screen.queryByAltText("Carregando...")).not.toBeInTheDocument();
            expect(screen.queryByText(/Escolha o frete/i)).toBeInTheDocument();
            expect(screen.queryByText(/Rua Conde de Sarzedas/i)).toBeInTheDocument();
        });
    });

    it('Choose shipping method', async () => {

        customRender(true, true);

        //get cart items after render
        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.queryByText(/Carrinho vazio/i)).not.toBeInTheDocument();
            expect(screen.queryAllByText(/Nome do Produto/i)).toHaveLength(2);
            expect(screen.queryByText(/Escolha o frete/i)).toBeInTheDocument();
            expect(screen.queryByText(/Rua Conde de Sarzedas/i)).toBeInTheDocument();
        });

        fireEvent.click(screen.getByDisplayValue(/flat_rate/i));

        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.getByTitle(/Custo de Entrega/i)).toContainHTML("R$10,00");
        });

        fireEvent.click(screen.getByDisplayValue(/PAC/i));

        act(() => {
            new Promise(resolve => setTimeout(resolve, 1));
        });

        await waitFor(() => {
            expect(screen.getByTitle(/Custo de Entrega/i)).toContainHTML("R$20,00");
        });

    });

});

