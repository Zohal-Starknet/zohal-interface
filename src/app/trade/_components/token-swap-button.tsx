import { SwapIcon } from "../../_ui/icons";

type TokenSwapButtonProps = {
  /** Handler called when clicking on the Swap button */
  onClick?: () => void;
};

/** TODO - Transform button into proper IconButton component */
export default function TokenSwapButton(props: TokenSwapButtonProps) {
  const { onClick } = props;

  return (
    <div className="relative flex items-center justify-center">
      <button
        className="border-border bg-background absolute mx-auto rounded-lg border p-2"
        onClick={onClick}
        type="button"
      >
        <SwapIcon className="text-foreground h-5 w-5" label="Swap" />
      </button>
    </div>
  );
}
