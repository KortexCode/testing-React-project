import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import {TodoList} from "./todoList";

describe('<TodoList />', () => {
  it('should display input to enter Todo activity ', () => {
    render(<TodoList />);
    //Encontrar un elemento por su placeholder
    const input = screen.getByPlaceholderText('Enter Todo Activity');
    expect(input).toBeInTheDocument();
  });

  it('should display button to add Todo', () => {
    render(<TodoList />);
    const button = screen.getByText('Add Todo');
    expect(button).toBeInTheDocument();

  });

  it('should display ul empty at the begin', () => {
    render(<TodoList />);
    //Encontrar un elemento por su role, el role se define en el html como <ul role="list"></ul>
    const ul = screen.getByRole('list');
    //El elemento ul debe estar vacío.
    expect(ul).toBeEmptyDOMElement();
  });

  it('should add todo to the list', async () => {
    render(<TodoList />);
    const input = screen.getByPlaceholderText('Enter Todo Activity');
    //Simular el evento de cambios en el input cuando se ingresa el texto 'Learn Vitest'
    fireEvent.change(input, { target: { value: 'Learn Vitest' } });

    const button = screen.getByText('Add Todo');
    await act(async () => {
      fireEvent.click(button);
    });
    const ul = screen.getByRole('list');
    expect(ul).not.toBeEmptyDOMElement();
    expect(ul).toContainHTML('<li>Learn Vitest</li>');
    expect(screen.getByText('Learn Vitest')).toBeInTheDocument();
  });
});