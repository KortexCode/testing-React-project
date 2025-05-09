import {describe, it, expect, vi} from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {Button} from './Button';

describe('<Button/>', () => {
    it('it should be able to render a button', () => {
        render(<Button label="click"/>);
        const button = screen.getByText("click");
        expect(button).toBeInTheDocument();
    });

    it('it should do click event', async () => {
        const handleClick = vi.fn();
        render(<Button label="click" onClick={handleClick}/>);
        const button = screen.getByText('click');
        await act(() => {
            fireEvent.click(button);
        });
        expect(handleClick).toBeCalledTimes(1);
    });
});