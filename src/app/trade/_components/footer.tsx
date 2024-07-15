import { TWITTER_URL } from "@zohal/app/_helpers/socials";
import { TwitterIcon } from "@zohal/app/_ui/icons";

import FooterBlockNumber from "./footer-block-number";

export default function Footer() {
  return (
    <footer className="border-border flex h-[3.25rem] flex-shrink-0 items-center justify-between border-t px-4">
      <FooterBlockNumber />
      <div className="ml-auto flex items-center gap-2">
        <a href={TWITTER_URL} rel="noopener noreferrer" target="_blank">
          <TwitterIcon label="twitter" />
        </a>
      </div>
    </footer>
  );
}
