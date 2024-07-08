import { type TokenSymbol, Tokens } from "@zohal/app/_helpers/tokens";
import { Dialog, DialogContent, DialogHeader } from "@zohal/app/_ui/Modal";
import Divider from "@zohal/app/_ui/divider";
import Input from "@zohal/app/_ui/input";
import { useMemo, useState } from "react";

type ChooseTokenModalProps = {
  /** Function called when the modal is opened or closed */
  onOpenChange: (open: boolean) => void;
  /** Function called when a new token is selected */
  onTokenSymbolChange: (newTokenSymbol: TokenSymbol) => void;
  /** Is the modal open or not */
  open: boolean;
  /** Symbol of the token currently selected */
  tokenSymbol: TokenSymbol;
};
export default function ChooseTokenModal(props: ChooseTokenModalProps) {
  const { onOpenChange, onTokenSymbolChange, open, tokenSymbol } = props;
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = useMemo(() => {
    return Object.entries(Tokens).flatMap(([tokenSymbol, tokenInfo]) => {
      const lowerCaseQuery = searchQuery.toLowerCase();

      const shouldIncludeToken =
        tokenSymbol.toLowerCase().includes(lowerCaseQuery) ||
        tokenInfo.name.toLowerCase().includes(lowerCaseQuery) ||
        tokenInfo.address === lowerCaseQuery;

      if (shouldIncludeToken) {
        return {
          tokenSymbol,
          ...tokenInfo,
        };
      }

      return [];
    });
  }, [searchQuery]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="h-full max-h-[20rem] px-0 pb-0">
        <DialogHeader className="mx-6 text-left">Select a token</DialogHeader>

        <Input
          className="mx-6 rounded-md border border-border bg-secondary px-3 py-2 text-base"
          onChange={(newQuery) => setSearchQuery(newQuery)}
          placeholder="Search name or paste address"
          value={searchQuery}
        />

        <div className="flex flex-col">
          <Divider />

          <div className="flex flex-col gap-2">
            {filteredTokens.length ? (
              filteredTokens.map((filteredToken) => {
                return (
                  <button
                    className="flex items-center justify-between px-6 py-2 transition-colors hover:bg-card"
                    key={filteredToken.tokenSymbol}
                    onClick={() =>
                      onTokenSymbolChange(filteredToken.tokenSymbol)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <img
                        alt={`${filteredToken.name} icon`}
                        className="h-9 w-9"
                        src={filteredToken.icon}
                      />
                      <div className="flex flex-col text-left">
                        <h4>{filteredToken?.name}</h4>
                        <span className="text-xs text-muted-foreground">
                          {tokenSymbol}
                        </span>
                      </div>
                    </div>
                    <span>0</span>
                  </button>
                );
              })
            ) : (
              <span className="px-6 py-2">No results found.</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
