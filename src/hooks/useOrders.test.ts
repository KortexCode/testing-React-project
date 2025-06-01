import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { useOrder } from "./useOrder";
import { getOrders } from "../services/getOrders";
import { useSession } from "../context/AuthContext";

//Indicamos que dentro del hook se limporta a useSession
vi.mock("../context/AuthContext", () => ({
  useSession: vi.fn()
}));
//Indicamos que useNavigate es importado y se usará en algún momento
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
vi.mock("../services/getOrders", () => ({
  getOrders: vi.fn(),
}));

const mockOrders = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    customer: {
      id: "60d07f61-99bf-4b90-955b-5d3a7c9bb3d4",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    products: [
      {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
        name: "Laptop",
        price: 999.99,
        quantity: 1,
      },
      {
        id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
        name: "Mouse",
        price: 29.99,
        quantity: 1,
      },
    ],
    total: 1029.98,
    status: "delivered",
    orderDate: "2023-10-01T10:00:00Z",
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    paymentMethod: "credit_card",
  },
];
const mockGetOrders = getOrders as Mock;
const mockUseSession = useSession as Mock;
const mockNavigate = vi.fn();

describe("useOrders", () => {

  // Limpiar los mocks antes de cada test para asegurar un estado limpio
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({ user: { id: 1 } });
    
  });

  it.skip("Loading should be false when orders are fetched", async () => {
    mockGetOrders.mockResolvedValue(mockOrders);

    const { result } = renderHook(() => useOrder());

    //Verificar el estado inicial
    expect(result.current.loading).toBe(true);
    expect(result.current.orders).toEqual([]); // Inicialmente vacío
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(mockGetOrders).toHaveBeenCalledTimes(1);  
    });
    expect(result.current.loading).toBe(false);
  });
});
