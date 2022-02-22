import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductsLayout from "../../../src/components/products/ProductsLayout";

afterEach(cleanup);

describe('ProductsLayout', () => {

    jest.mock("../../../src/components/InstagramEmbed", () => {
        return {
            __esModule: true,
            default: () => {
                return <div>Instagram</div>;
            },
        };
    });

    const product = (id) => {
        return {
            id: id,
            slug: `produto ${id} slug`,
            name: `Produto ${id} name`,
            price: "R$9,99",
            regularPrice: "R$10,00",
            image: {
                sourceUrl: 'https://via.placeholder.com/308x308',
                altText: 'alt text produto',
            },
        };
    };

    const category = (id) => {
        return {
            id: 1000 + parseInt(id),
            slug: `categoria ${id} slug`,
        }
    };
    const products = [product(1), product(2), product(3)];
    const categories = [category(1), category(2), category(3)];

    it('Render ProductsLayout', () => {

        render(
            <ProductsLayout
                data={{}}
                products={products}
                productsPageCount={1}
                productCategories={categories}
                categoryName={''}
                path={'produtos'}
            />
        );
        screen.getByText("Categorias");
        expect(screen
            .getAllByTitle("Categoria de Produto"))
            .toHaveLength(3);

        expect(screen.getAllByRole("link", {
            name: /WhatsApp/i,
        })).toHaveLength(2);

        screen.getByTitle("Produtos");

        expect(screen
            .getAllByTitle("Produto"))
            .toHaveLength(3);

        screen.getByTitle("Paginação");
    });
});

