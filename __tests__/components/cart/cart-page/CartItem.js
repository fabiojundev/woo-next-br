import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import CartItem from '../../../../src/components/cart/cart-page/CartItem';
import { AppContext } from "../../../../src/components/context/AppContext";
import { getProduct } from '../../../../__mocks__/product';

afterEach(cleanup);

describe('CartItem', () => {

    const customRender = () => {
        render(
            <AppContext.Provider
                value={[
                    {},
                    () => { },
                    () => { },
                    () => { },
                ]}
            >
                <table>
                    <tbody>
                        <CartItem
                            item={getProduct(1, 2)}
                            products={[
                                getProduct(1),
                                getProduct(2),
                                getProduct(3),
                            ]}
                            updateCartProcessing={false}
                            handleRemoveProductClick={() => { }}
                            setNeedCartUpdate={() => { }}
                        />
                    </tbody>
                </table>
            </AppContext.Provider>
        );
    };

    it('Render CartItem', () => {

        customRender();
        screen.getByText(/Product 1/);
        screen.getByText("R$10,00");
        screen.getByDisplayValue("-");
        screen.getByDisplayValue("+");
        screen.getByDisplayValue("2");
        screen.getByText("R$20,00");
        screen.getByTitle("Excluir");
    });

    it('Click CartItem Plus Quantity', async () => {

        customRender();
        const qty = screen.getByRole("textbox", { title: "Quantidade" });
        expect(qty).toHaveValue("2");

        userEvent.click(screen.getByDisplayValue("+"));

        expect(qty).toHaveValue("3");
    });

    it('Click CartItem Minus Quantity', async () => {

        customRender();
        const qty = screen.getByRole("textbox", { title: "Quantidade" });
        expect(qty).toHaveValue("2");

        userEvent.click(screen.getByDisplayValue("-"));

        expect(qty).toHaveValue("1");
    });

});

