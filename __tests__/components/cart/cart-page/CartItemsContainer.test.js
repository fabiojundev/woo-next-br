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

    const customRender = (loadCart) => {
        return render(
            <AppProvider>
                <MockedProvider mocks={getGqlMocks(loadCart)} addTypename={false}>
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

});

