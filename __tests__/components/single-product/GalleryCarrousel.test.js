import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import GalleryCarousel from "../../../src/components/single-product/gallery-carousel";
import userEvent from '@testing-library/user-event';

afterEach(cleanup);

describe('GalleryCarousel', () => {
    beforeEach(() => {
        render(
            <GalleryCarousel
                gallery={[
                    {
                        mediaItemUrl: "https://cms.camadecultivo.com.br/wp-content/uploads/sites/73/2021/07/9.jpg",
                        title: "title text 1",
                    },
                    {
                        mediaItemUrl: "https://cms.camadecultivo.com.br/wp-content/uploads/sites/73/2021/07/10.jpg",
                        altText: "alt text 2",
                        title: "title text 2",
                    },
                    {
                        mediaItemUrl: "https://cms.camadecultivo.com.br/wp-content/uploads/sites/73/2021/07/8.jpg",
                        altText: "alt text 3",
                        title: "title text 3",
                    },
                ]}
            />)
    });
    it('Render Gallery', async () => {

        const images = screen.getAllByTitle(/Imagem do Produto/);
        expect(images).toHaveLength(3);

        screen.getByTitle("Anterior");
        screen.getByTitle("Próximo");
    });

    it('Click Gallery Next Image', async () => {

        const images = screen.getAllByTitle(/Imagem do Produto/);
        expect(images).toHaveLength(3);

        screen.getByTitle("Próximo");

        expect(images[0]).not.toHaveClass('hidden');
        expect(images[1]).toHaveClass('hidden');
        expect(images[2]).toHaveClass('hidden');

        await userEvent.click(screen.getByTitle("Próximo"));

        expect(images[0]).toHaveClass('hidden');
        expect(images[1]).not.toHaveClass('hidden');
        expect(images[2]).toHaveClass('hidden');

        await userEvent.click(screen.getByTitle("Próximo"));

        expect(images[0]).toHaveClass('hidden');
        expect(images[1]).toHaveClass('hidden');
        expect(images[2]).not.toHaveClass('hidden');

        await userEvent.click(screen.getByTitle("Próximo"));

        expect(images[0]).not.toHaveClass('hidden');
        expect(images[1]).toHaveClass('hidden');
        expect(images[2]).toHaveClass('hidden');
    });

    it('Click Gallery Previous Image', async () => {

        const images = screen.getAllByTitle(/Imagem do Produto/);
        expect(images).toHaveLength(3);

        screen.getByTitle("Anterior");

        expect(images[0]).not.toHaveClass('hidden');
        expect(images[1]).toHaveClass('hidden');
        expect(images[2]).toHaveClass('hidden');

        await userEvent.click(screen.getByTitle("Anterior"));

        expect(images[0]).toHaveClass('hidden');
        expect(images[1]).toHaveClass('hidden');
        expect(images[2]).not.toHaveClass('hidden');

        await userEvent.click(screen.getByTitle("Anterior"));

        expect(images[0]).toHaveClass('hidden');
        expect(images[1]).not.toHaveClass('hidden');
        expect(images[2]).toHaveClass('hidden');

        await userEvent.click(screen.getByTitle("Anterior"));

        expect(images[0]).not.toHaveClass('hidden');
        expect(images[1]).toHaveClass('hidden');
        expect(images[2]).toHaveClass('hidden');
    });
});

