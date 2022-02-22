import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuantityInput from '../../src/components/QuantityInput';

afterEach(cleanup);

describe('QuantityInput', () => {

    const customRender = () => {
        render(
                <QuantityInput
                    label="Quantidade"
                    value={2}
                    handleChange={()=>{}}
                />
        );
    };

    it('Render QuantityInput', () => {

        customRender();
        screen.getByText(/Quantidade/);
        screen.getByDisplayValue("2");
        screen.getByDisplayValue("-");
        screen.getByDisplayValue("+");
    });
});

