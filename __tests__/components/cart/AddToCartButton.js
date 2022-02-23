import { render, screen, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { getGqlMocks } from '../../../__mocks__/cart';
import { product } from '../../../__mocks__/product';
import '../../../__mocks__/uuid';
import AddToCartButton from "../../../src/components/cart/AddToCartButton";
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

afterEach(cleanup);

describe('AddToCartButton', () => {

    const customRender = (loadCart) => {
        render(
            <MockedProvider mocks={getGqlMocks(loadCart)}>
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

    it('Add product to cart', async () => {

        customRender();

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

