import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import { fireEvent, render, screen, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getAuth } from '../../services/getAuth';
import { SessionProvider } from "../../context/AuthContext";
import { Login } from "./Login";

//Intercepta el módulo de react-router-dom y sobreescribe el useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await import("react-router-dom"); // así obtienes el módulo real
  return {
    ...actual,
    useNavigate: () => mockNavigate, // sobrescribes solo useNavigate
  };
});
//Recordar que useNavigate es una función que devuelve un objeto con un método navigate el cual
//será reemplazado por la función mockNavigate
const mockNavigate = vi.fn();

vi.mock('../../services/getAuth', () => ({
  getAuth: vi.fn()
}));

const mockGetAuth = getAuth as Mock;


describe("<Login />", () => {
  beforeEach(() => {
    render(
      <SessionProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </SessionProvider>
    )});

  it("deberia mostrar un mensaje de error", async () => {
    mockGetAuth.mockRejectedValue(new Error("Invalid credentials"));
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const buttonLogin = screen.getByRole('button', { name: 'Login'});
    await act(() => {
        fireEvent.change(usernameInput, { target: { value: 'wrongUser' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongPassword'}});
        fireEvent.click(buttonLogin);
    })
    const errorMessage = screen.getByText("Invalid credentials");
    expect(errorMessage).toBeInTheDocument()
  });


  it("deberia redirigir a /orders", async () => {
    mockGetAuth.mockResolvedValue({ success: true });

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const buttonLogin = screen.getByRole("button", { name: "Login" });
    await act(() => {
      fireEvent.change(usernameInput, { target: { value: "validUser" } });
      fireEvent.change(passwordInput, { target: { value: "validPassword" } });
      fireEvent.click(buttonLogin);
    });
    await waitFor(() => {
        expect(mockGetAuth).toHaveBeenCalledWith('validUser', 'validPassword');
        expect(mockNavigate).toHaveBeenCalledWith('/orders');
    });
  });
});