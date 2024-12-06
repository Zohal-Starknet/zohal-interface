import { type TokenSymbol } from "@zohal/app/_helpers/tokens";
import { useCallback, useState, useEffect } from "react";

type Props = {
  /** Ratio applied to the prices when modified */
  ratio: number;
  leverage: number;
  tokenSymbol: string;
};

export function useTokenInputs({ ratio, leverage, tokenSymbol }: Props) {
  const [payTokenSymbol, setPayTokenSymbol] = useState<TokenSymbol>("USDC");
  const [payTokenValue, setPayTokenValue] = useState("");
  const [payTokenLimitValue, setPayTokenLimitValue] = useState("0");

  const [receiveTokenSymbol, setReceiveTokenSymbol] =
    useState<TokenSymbol>("ETH");
  const [receiveTokenValue, setReceiveTokenValue] = useState("");
  const [receiveTokenLimitValue, setReceiveTokenLimitValue] = useState("0");

  const [pricePerToken, setPricePerToken] = useState("");
  const [tokenRatio, setTokenRatio] = useState(ratio);

  useEffect(() => {
    if (payTokenValue !== "") {
      setReceiveTokenValue(
        (parseFloat(payTokenValue) * tokenRatio * leverage).toString(),
      );
    }
  }, [payTokenValue, leverage, tokenRatio]);

  const updatePayTokenValue = useCallback(
    (tokenValue: string) => {
      const formattedValue = tokenValue.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(formattedValue)) {
        setPayTokenValue(formattedValue);
        setReceiveTokenValue(
          formattedValue !== ""
            ? (parseFloat(formattedValue) * tokenRatio * leverage).toString()
            : "",
        );
      }
    },
    [tokenRatio, leverage],
  );

  const updateReceiveTokenValue = useCallback(
    (tokenValue: string) => {
      const formattedValue = tokenValue.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(formattedValue)) {
        setReceiveTokenValue(formattedValue);
        setPayTokenValue(
          formattedValue !== ""
            ? (parseFloat(formattedValue) / (tokenRatio * leverage)).toString()
            : "",
        );
      }
    },
    [tokenRatio, leverage],
  );

  const updatePayTokenLimitValue = useCallback(
    (tokenValue: string) => {
      const formattedValue = tokenValue.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(formattedValue)) {
        setPayTokenLimitValue(formattedValue);
        setReceiveTokenLimitValue(
          formattedValue !== ""
            ? (
                parseFloat(formattedValue) * parseFloat(pricePerToken)
              ).toString()
            : "",
        );
      }
    },
    [pricePerToken],
  );

  const updateReceiveTokenLimitValue = useCallback((tokenValue: string) => {
    const formattedValue = tokenValue.replace(",", ".");
    if (/^\d*([.]?\d*)$/.test(formattedValue)) {
      setReceiveTokenValue(formattedValue);
      setPayTokenLimitValue(
        formattedValue !== ""
          ? (parseFloat(formattedValue) / parseFloat(pricePerToken)).toString()
          : "",
      );
    }
  }, []);

  const updateLimitPrice = useCallback(
    (inputValue: string) => {
      if (inputValue !== "") {
        const formattedValue = inputValue.replace(",", ".");
        if (/^\d*([.]?\d*)$/.test(formattedValue)) {
          setPricePerToken(formattedValue);
          setReceiveTokenLimitValue(
            "" + parseFloat(payTokenLimitValue) * parseFloat(formattedValue),
          );
        }
      }
    },
    [payTokenLimitValue],
  );

  const updatePayTokenTradeValue = useCallback(
    function updatePayTokenValue(tokenValue: string) {
      const formattedValue = tokenValue.replace(",", ".");
      if (/^\d*([.]?\d*)$/.test(formattedValue)) {
        setPayTokenValue(formattedValue);
        setReceiveTokenValue(
          formattedValue !== ""
            ? (parseFloat(formattedValue) * tokenRatio * leverage).toString()
            : "",
        );
      }
    },
    [tokenRatio, leverage],
  );

  function switchTokens() {
    setReceiveTokenSymbol(tokenSymbol);
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
    updatePayTokenTradeValue,
  };
}
