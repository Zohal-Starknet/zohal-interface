import {
  getDashboardPath,
  getPortfolioPath,
  getRewardsPath,
  getTradePath,
} from "../_helpers/routes";
import NavigationItem from "./navigation-item";

export default function Navigation() {
  return (
    <nav className="hidden md:block">
      <ul className="flex gap-2">
        <NavigationItem label="Portfolio" pathname={getPortfolioPath()} />
        <NavigationItem label="Trade" pathname={getTradePath()} />
        <NavigationItem label="Dashboard" pathname={getDashboardPath()} />
        <NavigationItem label="Rewards" pathname={getRewardsPath()} />
        <NavigationItem
          isExternal
          label="Docs"
          pathname="https://book.satoru.run/"
        />
      </ul>
    </nav>
  );
}
