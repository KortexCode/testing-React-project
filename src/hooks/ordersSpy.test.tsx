import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, Mock, MockInstance, vi } from "vitest";
import * as ReactRouter from "react-router-dom";
import * as AuthContext from "../context/AuthContext";
import * as GetOrders  from "../services/getOrders";
import { useOrder } from "./useOrder";

//Indicamos que useNavigate es importado y se usará en algún momento
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));
describe("useOrders", () => {
    
    let useSessionSpy: MockInstance;
    let getOrdersSpy: MockInstance;
    const mockNavigate = vi.fn();

  beforeEach(() => {
    useSessionSpy = vi.spyOn(AuthContext, "useSession");
    getOrdersSpy = vi.spyOn(GetOrders, "getOrders");
    (ReactRouter.useNavigate as Mock).mockReturnValue(mockNavigate);

    vi.clearAllMocks();  
  });

  afterEach(() => {
    vi.restoreAllMocks();
  })

  it("should be show error if orders", async () => {

    useSessionSpy.mockReturnValue({user: {id: 1}});
    getOrdersSpy.mockRejectedValue(new Error('Api error'));
    const { result } = renderHook(() => useOrder());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
        expect(result.current.loading).toBe(false);
    });
    expect(result.current.error).toBe("Failed to fetch orders. Please try again later.");
    expect(getOrdersSpy).toBeCalledTimes(1);
  });
});