import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../pages/index';

describe('Home', () => {
    it('renders a WhatsApp link', () => {
        render(<Home />)

        const whatsapp = screen.getAllByRole('link', {
            exact: false,
            name: "WhatsApp: (11) 94802-4005",
        });

        expect(whatsapp).toHaveLength(2);
    });    
});

