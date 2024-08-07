import React, { useEffect, useRef, useState } from "react";
import datafeed from '../../_helpers/datafeed';

interface TradingViewChartProps {
  symbol?: string;
  interval?: string;
  library_path?: string;
  locale?: string;
  charts_storage_url?: string;
  charts_storage_api_version?: string;
  client_id?: string;
  user_id?: string;
  fullscreen?: boolean;
  autosize?: boolean;
}

const TradingViewChart: React.FC<TradingViewChartProps> = (props) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const checkIfScriptsLoaded = () => {
      //@ts-ignore
      if (window.TradingView && window.TradingView.widget) {
        setIsScriptLoaded(true);
      } else {
        setTimeout(checkIfScriptsLoaded, 100);
      }
    };
    checkIfScriptsLoaded();
  }, []);

  useEffect(() => {
    if (isScriptLoaded) {
      const widgetOptions = {
        symbol: props.symbol || "ETH/USD",
        datafeed: datafeed,
        interval: props.interval || "15",
        container: chartContainerRef.current,
        library_path: props.library_path || "/static/charting_library/",
        locale: props.locale || "en",
        disabled_features: ["use_localstorage_for_settings", "items_favoriting", "show_object_tree", "trading_account_manager"],
        charts_storage_url: props.charts_storage_url,
        charts_storage_api_version: props.charts_storage_api_version,
        client_id: props.client_id,
        user_id: props.user_id,
        fullscreen: props.fullscreen || false,
        autosize: props.autosize || true,
        theme: 'dark'
      };

      //@ts-ignore
      const tvWidget = new window.TradingView.widget(widgetOptions);

      tvWidget.onChartReady(() => {
        tvWidget.headerReady().then(() => {
          const button = tvWidget.createButton();
          button.setAttribute("title", "Click to show a notification popup");
          button.classList.add("apply-common-tooltip");
          button.addEventListener("click", () =>
            tvWidget.showNoticeDialog({
              title: "Notification",
              body: "TradingView Charting Library API works correctly",
              callback: () => {
                console.log("Noticed!");
              },
            })
          );
          button.innerHTML = "Check API";
        });
      });

      return () => {
        tvWidget.remove();
      };
    }
  }, [isScriptLoaded, props]);

  return <div ref={chartContainerRef} style={{ height: "100%", width: "100%" }} />;
};

export default TradingViewChart;
