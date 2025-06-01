import { describe, it, expect, vi, Mock, beforeEach } from "vitest";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider, useSession } from "../../context/AuthContext";
import { getOrders } from "../../services/getOrders";
import { Orders } from "./Orders";
import { getSummaryOrders } from "../../utils/sumamry";

vi.mock("../../services/getOrders", () => ({
  getOrders: vi.fn(),
}));

const mockGetOrders = getOrders as Mock;

//Como se obtienen dos importaciones, SessionProvider y useSession, se debe mokear de forma parcial
vi.mock("../../context/AuthContext", async () => {
  const actual = await vi.importActual("../../context/AuthContext");
  return {
    ...actual,
    useSession: vi.fn(),
  };
});

const mockUseSession = useSession as Mock;

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

const mockUser = {
  id: "1",
  role: "superadmin",
};

describe("<Oders/>", () => {
  beforeEach(() => {
    mockGetOrders.mockClear();
    mockGetOrders.mockResolvedValue(mockOrders);
    mockUseSession.mockReturnValue({ user: mockUser });
    render(
      <SessionProvider>
        <MemoryRouter>
          <Orders />
        </MemoryRouter>
      </SessionProvider>
    );
  });

  it("Debería renderizar el loading", async () => {
    //Se verifica si loading se encuentra en el DOM,este atiende una condición
    const loading = screen.getByTestId("loading-id");
    expect(loading).toBeInTheDocument();

    await waitFor(() => {
        expect(loading).not.toBeInTheDocument();
    });
  });

  it("Debería mostrar sección para superadmin <OrderSummary/>", async() => {
    //Se verifica que la función getOrders haya sido llamada
    expect(mockGetOrders).toBeCalledTimes(1);

    const { totalOrders, totalValue, averageOrderValue, ordersByStatus } = getSummaryOrders(mockOrders);

    const [[statusValue, countValue]]  = Object.entries(ordersByStatus);

    await waitFor(() => {
      const totalrOrdersElement = screen.getByTestId("orders-total");
      const totalValueElement = screen.getByTestId("orders-value");
      const averageValueElement = screen.getByTestId("orders-average");
      const statusBadgeElement = screen.getAllByTestId("status-badge");
      const statusCountElement = screen.getByTestId("status-count");

      const total = totalrOrdersElement.textContent;
      const value = totalValueElement.textContent;
      const average = averageValueElement.textContent;
      const status = statusBadgeElement[1].textContent;
      const count = statusCountElement.textContent;

      expect(total).toBe(totalOrders.toString());
      expect(value).toBe(`$${totalValue.toString()}`);
      expect(average).toBe(`$${averageOrderValue.toString()}`);
      expect(status).toBe(statusValue.toUpperCase());
      expect(count).toBe(countValue.toString());
      
    });
  });

  it("Debería renderizar las ordenes", async () => {
    expect(mockGetOrders).toBeCalledTimes(1);

    await waitFor(() => {
      /* const orders = screen.getAllByRole("heading", { level: 3 }); */
      const orders = screen.getAllByTestId("order-items");
      expect(orders).toHaveLength(mockOrders.length);
    });
  });
});
