import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Contador } from './contador';

describe('<Counter/>', () => {
    it('It should render the counter with count 0', () => {
        render(<Contador/>);
        const counter = screen.getByText('Incremento: 0');
        expect(counter).toBeInTheDocument();
    });

    it('It should increment the counter when the button is clicked', async () => {
        render(<Contador/>);
        const button = screen.getByText('Incrementar');
        await act( () => {
            fireEvent.click(button);
        });
        const counter = screen.getByText('Incremento: 1');
        expect(counter).toBeInTheDocument();
    })

})



