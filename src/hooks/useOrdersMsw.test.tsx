import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useOrder } from "./useOrder";
import { http, HttpResponse } from "msw";
import { server } from "../mocks/server";
import { SessionProvider, useSession } from "../context/AuthContext";

//Como se obtienen dos importaciones, SessionProvider y useSession, se debe mokear de forma parcial
vi.mock('../context/AuthContext', async() => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useSession: vi.fn()
    }
});

describe("MSW: userOrder", () => {

  const mockUser = { id: "1", name: "Wilmer Garzon" };

  beforeEach(() => {
      (useSession as Mock).mockReturnValue({ user: mockUser })
  })


  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SessionProvider>
      <MemoryRouter>{children}</MemoryRouter>
    </SessionProvider>
  );

  it("Debería devolver una orden si hay respuesta", async () => {
    const { result } = renderHook(() => useOrder(), { wrapper });
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      const orders = result.current.orders.length;
      expect(orders).toBe(1);
    });
    
  });

  it("Debería lanzar error si no hay respuesta", async () => {

    server.use(http.get('http://localhost:3001/orders', () => {
      return new HttpResponse(null, { status: 500, statusText: "Internal server error "})
    }));

    const { result } = renderHook(() => useOrder(), { wrapper });
    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.error).toBe("Failed to fetch orders. Please try again later.");
    });
    
  });
});
