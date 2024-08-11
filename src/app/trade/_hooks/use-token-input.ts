import { type TokenSymbol } from "@zohal/app/_helpers/tokens";
import { useCallback, useState, useEffect } from "react";

type Props = {
  /** Ratio applied to the prices when modified */
  ratio: number;
  leverage: number;
};

export function useTokenInputs({ ratio, leverage }: Props) {
  const [payTokenSymbol, setPayTokenSymbol] = useState<TokenSymbol>("ETH");
  const [payTokenValue, setPayTokenValue] = useState("0");
  const [payTokenLimitValue, setPayTokenLimitValue] = useState("0");

  const [receiveTokenSymbol, setReceiveTokenSymbol] =
    useState<TokenSymbol>("USDC");
  const [receiveTokenValue, setReceiveTokenValue] = useState("0");
  const [receiveTokenLimitValue, setReceiveTokenLimitValue] = useState("0");

  const [pricePerToken, setPricePerToken] = useState("");
  const [tokenRatio, setTokenRatio] = useState(ratio);


  useEffect(() => {
    if (payTokenValue !== "") {
      setReceiveTokenValue(
        (parseFloat(payTokenValue) * tokenRatio * leverage).toString()
      );
    }
  }, [payTokenValue, leverage, tokenRatio]);


  const updatePayTokenValue = useCallback(
    (tokenValue: string) => {
      setPayTokenValue(tokenValue);
      setReceiveTokenValue(
        tokenValue !== ""
          ? (parseFloat(tokenValue) * tokenRatio * leverage).toString()
          : ""
      );
    },
    [tokenRatio, leverage]
  );


  const updateReceiveTokenValue = useCallback(
    (tokenValue: string) => {
      setReceiveTokenValue(tokenValue);
      setPayTokenValue(
        tokenValue !== ""
          ? (parseFloat(tokenValue) / (tokenRatio * leverage)).toString()
          : ""
      );
    },
    [tokenRatio, leverage]
  );

  const updatePayTokenLimitValue = useCallback(
    (tokenValue: string) => {
      setPayTokenLimitValue(tokenValue);
      setReceiveTokenLimitValue(tokenValue !== ""? (parseFloat(tokenValue) * parseFloat(pricePerToken) ).toString(): "");
    },
    [pricePerToken]
  );

  const updateReceiveTokenLimitValue = useCallback(
    (tokenValue: string) => {
      setReceiveTokenValue(tokenValue);
      setPayTokenLimitValue(tokenValue !== ""? (parseFloat(tokenValue) / parseFloat(pricePerToken) ).toString(): "");
    },
    []
  );

  const updateLimitPrice = useCallback(
    (inputValue: string) => {
      if (inputValue !== "") {
        setPricePerToken(inputValue);
        setReceiveTokenLimitValue(""+(parseFloat(payTokenLimitValue)* parseFloat(inputValue)));
      }
    },
    [payTokenLimitValue]
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

  function switchTokens() {
    const tempPayTokenSymbol = payTokenSymbol;
    const tempPayTokenValue = payTokenValue;
    
    setPayTokenSymbol(receiveTokenSymbol);
    setReceiveTokenSymbol(tempPayTokenSymbol);
    
    setPayTokenValue(receiveTokenValue);
    setReceiveTokenValue(tempPayTokenValue);
  }

  return {
    payTokenSymbol,
    payTokenValue,
    payTokenLimitValue,
    receiveTokenSymbol,
    receiveTokenValue,
    receiveTokenLimitValue,
    pricePerToken,
    tokenRatio,
    setTokenRatio,
    switchTokens,
    updatePayTokenValue,
    updatePayTokenLimitValue,
    updateReceiveTokenValue,
    updateReceiveTokenLimitValue,
    updateLimitPrice,
    updatePayTokenTradeValue
  };
}
