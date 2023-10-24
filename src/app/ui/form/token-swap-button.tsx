import { SwapIcon } from "../icons";

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
        className="mx-auto absolute p-2 bg-[#4b4f5d] rounded-lg border border-[#363636]"
        onClick={onClick}
        type="button"
      >
        <SwapIcon className="h-5 w-5 text-white" label="Swap" />
      </button>
    </div>
  );
}
