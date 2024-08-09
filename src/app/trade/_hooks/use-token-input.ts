import { type TokenSymbol } from "@zohal/app/_helpers/tokens";
import { useCallback, useEffect, useRef, useState } from "react";
import useEthPrice from "./use-market-data";

type Props = {
  /** Ratio applied to the prices when modified */
  ratio: number;
  leverage: number;
};

export function useTokenInputs(props: Props) {
  const { ratio, leverage } = props;

  const [payTokenSymbol, setPayTokenSymbol] = useState<TokenSymbol>("ETH");
  const [payTokenValue, setPayTokenValue] = useState("");

  const { ethData } = useEthPrice();
  const ethPrice = parseFloat((ethData.currentPrice.toPrecision(4)));

  const [receiveTokenSymbol, setReceiveTokenSymbol] =
    useState<TokenSymbol>("USDC");
  const [receiveTokenValue, setReceiveTokenValue] = useState("");
  const [pricePerToken, setPricePerToken] = useState("2500");

  const temporaryPayTokenValueRef = useRef("");
  const temporaryPayTokenSymbolRef = useRef<TokenSymbol>("ETH");


  const updatePayTokenValue = useCallback(
    function updatePayTokenValue(tokenValue: string) {
      setPayTokenValue(tokenValue);
      console.log("pricePerToken",pricePerToken)
      if (tokenValue !== "" && pricePerToken !== "") {
        setReceiveTokenValue(
          (Number(tokenValue) * Number(pricePerToken)).toString(),
        );
      } else {
        setReceiveTokenValue(
          tokenValue !== "" ? (parseFloat(tokenValue) * ratio * leverage).toString() : "",
        );
      }
    },
    [ratio, leverage, pricePerToken],
  );


  //watch that for leverage:
  //      setReceiveTokenValue(
  //  (parseFloat(payTokenValue) * ratio * leverage).toString()
  //);
  // useEffect(() => {
  //   if (payTokenValue !== "" && pricePerToken !== "") {
  //     setReceiveTokenValue(
  //       (Number(payTokenValue) / Number(pricePerToken)).toString()
  //     );
  //   } else {
  //     setReceiveTokenValue(
  //       payTokenValue !== "" ? (parseFloat(payTokenValue) * ratio).toString() : ""
  //     );
  //   }
  // }, [payTokenValue, pricePerToken, ratio]);

  useEffect(() => {
    if (payTokenValue !== "" && receiveTokenValue !== "") {
      setReceiveTokenValue(
        (Number(payTokenValue) / Number(pricePerToken)).toString()
      );
    } else {
      setReceiveTokenValue(
        payTokenValue !== "" ? (parseFloat(payTokenValue) * ratio).toString() : ""
      );
    }
  }, [payTokenValue, pricePerToken, ratio]);

  const updateReceiveTokenValue = useCallback(
    function updateReceiveTokenValue(tokenValue: string) {
      console.log("tokenValue",tokenValue)
      setReceiveTokenValue(tokenValue);
      if (tokenValue !== "" && pricePerToken !== "") {
        setPayTokenValue(
          ((parseFloat(tokenValue) / ratio) * Number(pricePerToken)).toString()
        );
      } else {
        setPayTokenValue(
          tokenValue !== "" ? (parseFloat(tokenValue) / ratio).toString() : "",
        );
      }
    },
    [ratio, pricePerToken],
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


  const updatePricePerToken = useCallback(
    function updatePricePerToken(pricePerTokenValue: string) {
      if (pricePerTokenValue !== ""){
        setPricePerToken(pricePerTokenValue);
      } else {
        setPricePerToken(temporaryPayTokenValueRef.current)
      }
    },
    [ratio],
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
    switchTokens,
    updatePayTokenValue,
    updateReceiveTokenValue,
    updatePricePerToken,
    updatePayTokenTradeValue
  };
}