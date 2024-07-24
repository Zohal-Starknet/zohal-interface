import { type TokenSymbol } from "@zohal/app/_helpers/tokens";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  /** Ratio applied to the prices when modified */
  ratio: number;
};

export function useTokenInputs(props: Props) {
  const { ratio } = props;

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
        setPayTokenValue(((parseFloat(tokenValue)) * Number(x)).toString());
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
      const tmp = xValue !== "" ? (parseFloat(xValue)).toString() : "";
      const res = Number(tmp) / Number(xValue);
      setReceiveTokenValue(res.toString());
    },
    [ratio],
  );

  useEffect(() => {
    if (payTokenValue !== "" && x !== "") {
      setReceiveTokenValue(
        (Number(payTokenValue) / Number(x)).toString()
      );
    } else {
      setReceiveTokenValue(
        payTokenValue !== "" ? (parseFloat(payTokenValue) * ratio).toString() : ""
      );
    }
  }, [payTokenValue, x, ratio]);

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
    updateX,
  };
}
