import { type TokenSymbol } from "@zohal/app/_helpers/tokens";
import { useCallback, useRef, useState, useEffect } from "react";

type Props = {
  /** Ratio applied to the prices when modified */
  ratio: number;
  leverage: number;
};

export function useTokenInputs(props: Props) {
  const { ratio, leverage } = props;

  const [tmpRatio, setTmpRatio] = useState(ratio);

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
      setReceiveTokenValue(
        tokenValue !== "" ? (parseFloat(tokenValue) * tmpRatio * leverage).toString() : "",
      );
    },
    [tmpRatio, leverage],
  );

  useEffect(() => {
    if (payTokenValue !== "") {
      setReceiveTokenValue(
        (parseFloat(payTokenValue) * ratio * leverage).toString()
      );
    }
  }, [payTokenValue, leverage, ratio]);

  const updateReceiveTokenValue = useCallback(
    function updateReceiveTokenValue(tokenValue: string) {
      setReceiveTokenValue(tokenValue);
      setPayTokenValue(
        tokenValue !== "" ? (parseFloat(tokenValue) / tmpRatio).toString() : "",
      );
    },
    [tmpRatio],
  );

  const updatePricePerToken = useCallback(
    function updatePricePerToken(pricePerToken: string) {
      setPricePerToken(pricePerToken);
      if (pricePerToken !== "") {
        setTmpRatio(payTokenSymbol === "USDC" ? 1 / Number(pricePerToken) : Number(pricePerToken))
      } else {
        setTmpRatio(ratio)
      }
    },
    [tmpRatio],
  );

  const updatePayTokenTradeValue = useCallback(
    function updatePayTokenValue(tokenValue: string) {
      setPayTokenValue(tokenValue);
      setReceiveTokenValue(
        tokenValue !== "" ? (parseFloat(tokenValue) * tmpRatio * leverage).toString() : "",
      );
    },
    [tmpRatio, leverage],
  );


  const updateReceiveTokenTradeValue = useCallback(
    function updateReceiveTokenValue(tokenValue: string) {
      setReceiveTokenValue(tokenValue);
      setPayTokenValue(
        tokenValue !== "" ? (parseFloat(tokenValue) / tmpRatio).toString() : "",
      );
    },
    [tmpRatio],
  );

  function switchTokens() {
    temporaryPayTokenValueRef.current = payTokenValue;
    setPayTokenValue(""+0);
    setReceiveTokenValue(temporaryPayTokenValueRef.current);
    temporaryPayTokenSymbolRef.current = payTokenSymbol;
    setReceiveTokenValue(""+0);
    setPayTokenSymbol(receiveTokenSymbol);
    setReceiveTokenSymbol(temporaryPayTokenSymbolRef.current);
  }

  return {
    payTokenSymbol,
    payTokenValue,
    receiveTokenSymbol,
    receiveTokenValue,
    pricePerToken,
    switchTokens,
    updatePayTokenValue,
    updateReceiveTokenValue,
    updatePricePerToken,
    updateReceiveTokenTradeValue,
    updatePayTokenTradeValue
  };
}