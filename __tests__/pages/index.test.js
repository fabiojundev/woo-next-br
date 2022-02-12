import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../pages/index';

describe('Home', () => {
    beforeEach(() => {
        render(<Home />)
    });

    it('Render WhatsApp links', () => {
        const whatsapp = screen.getAllByRole('link', {
            exact: false,
            name: "WhatsApp: (11) 94802-4005",
        });

        expect(whatsapp).toHaveLength(2);
    });

    it('Render products', () => {
        screen.getByTitle('Produtos');
    });

    it('Renders sidebar', () => {
        screen.getByTitle('Barra Lateral');
    });
});

