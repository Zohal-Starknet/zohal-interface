import { TWITTER_URL } from "@zohal/app/_helpers/socials";
import { TwitterIcon } from "@zohal/app/_ui/icons";
import FooterBlockNumber from "./footer-block-number";

//@ts-ignore
export default function Footer({ activePanel, setActivePanel }) {
  return (
    <footer className="flex h-16 flex-shrink-0 items-center justify-between border-t border-border px-4 lg:h-auto lg:flex-col lg:items-stretch lg:justify-center lg:p-2">
      {" "}
      <div className="hidden w-full items-center justify-between lg:flex">
        <FooterBlockNumber />
        <div className="ml-auto flex items-center gap-2">
          <a href={TWITTER_URL} rel="noopener noreferrer" target="_blank">
            <TwitterIcon label="twitter" />
          </a>
        </div>
      </div>
      <div className="flex h-16 w-full justify-around p-2 lg:hidden">
        <button
          onClick={() => setActivePanel("chart")}
          className={`px-4 py-2 ${
            activePanel === "chart" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          Chart
        </button>
        <button
          onClick={() => setActivePanel("position")}
          className={`px-4 py-2 ${
            activePanel === "position" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          Position
        </button>
        <button
          onClick={() => setActivePanel("trade")}
          className={`px-4 py-2 ${
            activePanel === "trade" ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          Trade
        </button>
      </div>
    </footer>
  );
}
