"use client";

import React from "react";
import dynamic from "next/dynamic";
import Script from "next/script";

const TradingViewChart = dynamic(() => import("./trading-view-chart"), {
  ssr: false,
});

export default function TokenChart() {
  return (
    <>
      <Script
        src="/static/charting_library/charting_library.standalone.js"
        strategy="lazyOnload"
      />
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
      />
      <div className="h-100 border-border relative flex w-full flex-col border-b lg:h-auto lg:flex-1">
        <TradingViewChart
          symbol="ETH/USD"
          interval="60"
          library_path="/static/charting_library/"
          locale="en"
          charts_storage_url="https://saveload.tradingview.com"
          charts_storage_api_version="1.1"
          client_id="tradingview.com"
          user_id="public_user_id"
          fullscreen={false}
          autosize={true}
        />
      </div>
    </>
  );
}
