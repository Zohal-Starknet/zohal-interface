import { type TokenSymbol } from "@zohal/app/_helpers/tokens";
import { useCallback, useRef, useState } from "react";

type Props = {
  /** Ratio applied to the prices when modified */
  ratio: number;
  leverage: number;
};

export function useTokenInputs(props: Props) {
  const { ratio, leverage } = props;

  const [payTokenSymbol, setPayTokenSymbol] = useState<TokenSymbol>("ETH");
  const [payTokenValue, setPayTokenValue] = useState("");

  const [receiveTokenSymbol, setReceiveTokenSymbol] =
    useState<TokenSymbol>("USDC");
  const [receiveTokenValue, setReceiveTokenValue] = useState("");
  const [x, setX] = useState("");


  const temporaryPayTokenValueRef = useRef("");
  const temporaryPayTokenSymbolRef = useRef<TokenSymbol>("ETH");

  const updatePayTokenValue = useCallback(
    function updatePayTokenValue(tokenValue: string) {
      setPayTokenValue(tokenValue);
      if (tokenValue !== "" && x !== ""){
        setReceiveTokenValue(
          (Number(tokenValue) / Number(x)).toString(),
        );
      } else {
      setReceiveTokenValue(
        tokenValue !== "" ? (parseFloat(tokenValue) * ratio).toString() : "",
      );
      }
    },
    [ratio],
  );

  const updateReceiveTokenValue = useCallback(
    function updateReceiveTokenValue(tokenValue: string) {
      setReceiveTokenValue(tokenValue);
      if (tokenValue !== "" && x !== "") {
        ((parseFloat(tokenValue) / ratio) * Number(x)).toString();
      } else {
        setPayTokenValue(
          tokenValue !== "" ? (parseFloat(tokenValue) / ratio).toString() : "",
        );
      }
    },
    [ratio],
  );

  const updateX = useCallback(
    function updateX(xValue: string) {
      setX(xValue);
      setPayTokenValue(
        xValue !== "" ? (parseFloat(xValue) / ratio).toString() : "",
      );
      const test = xValue !== "" ? (parseFloat(xValue) / ratio).toString() : "";
      const res = Number(test) / Number(xValue);
      setReceiveTokenValue(res.toString());

    },
    [ratio],
  );

  const updatePayTokenTradeValue = useCallback(
    function updatePayTokenValue(tokenValue: string) {
      setPayTokenValue(tokenValue);
      setReceiveTokenValue(
        tokenValue !== "" ? (parseFloat(tokenValue) * ratio * leverage).toString() : "",
      );
    },
    [ratio, leverage],
  );


  const updateReceiveTokenTradeValue = useCallback(
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
    setPayTokenValue(0);
    setReceiveTokenValue(temporaryPayTokenValueRef.current);

    temporaryPayTokenSymbolRef.current = payTokenSymbol;
    setReceiveTokenValue(0);
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
    updateX,
    updateReceiveTokenTradeValue,
    updatePayTokenTradeValue
  };
}
