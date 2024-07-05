import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    const widgetOptions = {
      symbol: props.symbol || "ETH/USD",
      datafeed: datafeed,
      interval: props.interval || "1D",
      container: chartContainerRef.current,
      library_path: props.library_path || "/static/charting_library/",
      locale: props.locale || "en",
      disabled_features: ["use_localstorage_for_settings", "items_favoriting", "show_object_tree", "trading_account_manager"],
      enabled_features: [],
      charts_storage_url: props.charts_storage_url,
      charts_storage_api_version: props.charts_storage_api_version,
      client_id: props.client_id,
      user_id: props.user_id,
      fullscreen: props.fullscreen || false,
      autosize: props.autosize || true,
      theme: 'dark',
    };

    //@ts-ignore
    // const tvWidget = new window.TradingView.widget(widgetOptions);

    // tvWidget.onChartReady(() => {
    //   tvWidget.headerReady().then(() => {
    //     const button = tvWidget.createButton();
    //     button.setAttribute("title", "Click to show a notification popup");
    //     button.classList.add("apply-common-tooltip");
    //     button.addEventListener("click", () =>
    //       tvWidget.showNoticeDialog({
    //         title: "Notification",
    //         body: "TradingView Charting Library API works correctly",
    //         callback: () => {
    //           console.log("Noticed!");
    //         },
    //       })
    //     );
    //     button.innerHTML = "Check API";
    //   });
    // });

    return () => {
      // tvWidget.remove();
    };
  }, [props]);

  return <div ref={chartContainerRef} style={{ height: "100%", width: "100%" }} />;
};

export default TradingViewChart;