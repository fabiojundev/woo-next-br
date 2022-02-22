import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import Price from "../../../src/components/single-product/price";

afterEach(cleanup);

describe('Price', () => {

    it('Empty Price', async () => {

        const { container } = render(<Price />);
        expect(container.childElementCount).toEqual(0);
    });

    it('Same Price', () => {

        render(
            <Price
                salesPrice="R$10,90"
                regularPrice="R$10,90"
            />
        );
        screen.getByText("R$10,90");
    });

    it('Different Price', () => {

        render(
            <Price
                salesPrice="R$9,90"
                regularPrice="R$10,90"
            />
        );
        screen.getByText("R$9,90");
        screen.getByText("R$10,90");
    });

    it('Only Sales Price', () => {

        render(
            <Price
                salesPrice="R$9,90"
            />
        );
        screen.getByText("0");
    });

    it('Only Regular Price', () => {

        const { container } = render(
            <Price
                regularPrice="R$9,90"
            />
        );
        expect(container.childElementCount).toEqual(0);
    });

    it('Show percent', () => {

        render(
            <Price
                salesPrice="R$9,90"
                regularPrice="R$10,90"
                showPercent={true}
            />
        );
        screen.getByText(/de desconto/);
    });

});

