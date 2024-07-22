import {
  getDashboardPath,
  getPoolsPath,
  getPortfolioPath,
  getRewardsPath,
  getTradePath,
} from "../_helpers/routes";
import NavigationItem from "./navigation-item";

export default function Navigation() {
  return (
    <nav className="hidden lg:block">
      <ul className="flex gap-2">
        <NavigationItem label="Trade" pathname={getTradePath()} />
        <NavigationItem label="Earn" pathname={getPoolsPath()} />
        <NavigationItem label="Portfolio" pathname={getPortfolioPath()} />
        <NavigationItem label="Dashboard" pathname={getDashboardPath()} />
        <NavigationItem label="Rewards" pathname={getRewardsPath()} />
      </ul>
    </nav>
  );
}
