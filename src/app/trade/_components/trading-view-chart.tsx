import React, { useEffect, useRef } from "react";

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
    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.body.appendChild(script);
      });
    };

    const initializeChart = () => {
      if (chartContainerRef.current && window.TradingView && window.TradingView.widget && window.Datafeeds && window.Datafeeds.UDFCompatibleDatafeed) {
        const widgetOptions = {
          symbol: props.symbol || "AAPL",
          datafeed: new window.Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
          interval: props.interval || "1D",
          container: chartContainerRef.current,
          library_path: props.library_path || "/static/charting_library/",
          locale: props.locale || "en",
          disabled_features: ["use_localstorage_for_settings"],
          enabled_features: ["study_templates"],
          charts_storage_url: props.charts_storage_url,
          charts_storage_api_version: props.charts_storage_api_version,
          client_id: props.client_id,
          user_id: props.user_id,
          fullscreen: props.fullscreen || false,
          autosize: props.autosize || true,
        };

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
    };

    const loadScriptsAndInitializeChart = async () => {
      try {
        await loadScript("/static/charting_library/charting_library.standalone.js");
        await loadScript("/static/datafeeds/udf/dist/bundle.js");
        initializeChart();
      } catch (error) {
        console.error("Failed to load TradingView scripts", error);
      }
    };

    loadScriptsAndInitializeChart();

    return () => {
      document.querySelectorAll("script[src*='/static/charting_library']").forEach(script => {
        document.body.removeChild(script);
      });
    };
  }, [props]);

  return <div ref={chartContainerRef} style={{ height: "100%", width: "100%" }} />;
};

export default TradingViewChart;
