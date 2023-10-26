import { act, renderHook } from "@testing-library/react";

import { useTokenInputs } from "./use-token-input";

describe("Token Input Hook", () => {
  it("should apply ratio on receive state when updating pay token value", () => {
    const { result } = renderHook(() => useTokenInputs({ ratio: 2 }));

    act(() => {
      result.current.updatePayTokenValue("2");
    });

    expect(result.current.payTokenValue).toEqual("2");
    expect(result.current.receiveTokenValue).toEqual("4");
  });

  it("should apply values and then erase it when user clean the pay token value", () => {
    const { result } = renderHook(() => useTokenInputs({ ratio: 2 }));

    act(() => {
      result.current.updatePayTokenValue("2");
    });

    expect(result.current.payTokenValue).toEqual("2");
    expect(result.current.receiveTokenValue).toEqual("4");

    act(() => {
      result.current.updatePayTokenValue("");
    });

    expect(result.current.payTokenValue).toEqual("");
    expect(result.current.receiveTokenValue).toEqual("");
  });

  it("should apply ratio on pay state when updating receive token value", () => {
    const { result } = renderHook(() => useTokenInputs({ ratio: 2 }));

    act(() => {
      result.current.updateReceiveTokenValue("2");
    });

    expect(result.current.payTokenValue).toEqual("1");
    expect(result.current.receiveTokenValue).toEqual("2");
  });

  it("should swap token values and symbols", () => {
    const { result } = renderHook(() => useTokenInputs({ ratio: 2 }));

    act(() => {
      result.current.updatePayTokenValue("2");
    });

    expect(result.current.payTokenValue).toEqual("2");
    expect(result.current.receiveTokenValue).toEqual("4");
    expect(result.current.payTokenSymbol).toEqual("ETH");
    expect(result.current.receiveTokenSymbol).toEqual("BTC");

    act(() => {
      result.current.switchTokens();
    });

    expect(result.current.payTokenValue).toEqual("4");
    expect(result.current.receiveTokenValue).toEqual("2");
    expect(result.current.payTokenSymbol).toEqual("BTC");
    expect(result.current.receiveTokenSymbol).toEqual("ETH");
  });
});
