import { useCallback, useRef, useState } from "react";

type Props = {
  /** Ratio applied to the prices when modified */
  ratio: number;
};

export function useTokenInputs(props: Props) {
  const { ratio } = props;

  // TODO: Type this state stronger than string
  const [payTokenSymbol, setPayTokenSymbol] = useState("ETH");
  const [payTokenValue, setPayTokenValue] = useState("");

  // TODO: Type this state stronger than string
  const [receiveTokenSymbol, setReceiveTokenSymbol] = useState("BTC");
  const [receiveTokenValue, setReceiveTokenValue] = useState("");

  const temporaryPayTokenValueRef = useRef("");
  const temporaryPayTokenSymbolRef = useRef("");

  const updatePayTokenValue = useCallback(
    function updatePayTokenValue(tokenValue: string) {
      setPayTokenValue(tokenValue);
      setReceiveTokenValue(
        tokenValue !== "" ? (parseFloat(tokenValue) * ratio).toString() : "",
      );
    },
    [ratio],
  );

  const updateReceiveTokenValue = useCallback(
    function updateReceiveTokenValue(tokenValue: string) {
      setReceiveTokenValue(tokenValue);
      setPayTokenValue(
        tokenValue !== "" ? (parseFloat(tokenValue) / ratio).toString() : "",
      );
    },
    [ratio],
  );

  function switchTokens() {
    temporaryPayTokenValueRef.current = payTokenValue;
    setPayTokenValue(receiveTokenValue);
    setReceiveTokenValue(temporaryPayTokenValueRef.current);

    temporaryPayTokenSymbolRef.current = payTokenSymbol;
    setPayTokenSymbol(receiveTokenSymbol);
    setReceiveTokenSymbol(temporaryPayTokenSymbolRef.current);
  }

  return {
    payTokenSymbol,
    payTokenValue,
    receiveTokenSymbol,
    receiveTokenValue,
    switchTokens,
    updatePayTokenValue,
    updateReceiveTokenValue,
  };
}
