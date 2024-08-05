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
  const [pricePerToken, setPricePerToken] = useState("");


  const temporaryPayTokenValueRef = useRef("");
  const temporaryPayTokenSymbolRef = useRef<TokenSymbol>("ETH");

  const updatePayTokenValue = useCallback(
    function updatePayTokenValue(tokenValue: string) {
      setPayTokenValue(tokenValue);
      if (tokenValue !== "" && pricePerToken !== ""){
        setReceiveTokenValue(
          (Number(tokenValue) / Number(pricePerToken)).toString(),
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
      if (tokenValue !== "" && pricePerToken !== "") {
        setPayTokenValue(((parseFloat(tokenValue)) * Number(pricePerToken)).toString());
      } else {
        setPayTokenValue(
          tokenValue !== "" ? (parseFloat(tokenValue) / ratio).toString() : "",
        );
      }
    },
    [ratio],
  );

  const updatePricePerToken = useCallback(
    function updatePricePerToken(pricePerTokenValue: string) {
      setPricePerToken(pricePerTokenValue);
      const tmp = pricePerTokenValue !== "" ? (parseFloat(pricePerTokenValue)).toString() : "";
      const res = Number(tmp) / Number(pricePerTokenValue);
      setReceiveTokenValue(res.toString());
    },
    [ratio],
  );

  useEffect(() => {
    if (payTokenValue !== "" && pricePerToken !== "") {
      setReceiveTokenValue(
        (Number(payTokenValue) / Number(pricePerToken)).toString()
      );
    } else {
      setReceiveTokenValue(
        payTokenValue !== "" ? (parseFloat(payTokenValue) * ratio).toString() : ""
      );
    }
  }, [payTokenValue, pricePerToken, ratio]);

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
    updatePricePerToken,
  };
}
