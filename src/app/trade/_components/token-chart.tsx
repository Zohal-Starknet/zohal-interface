"use client";

import React from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
import Script from "next/script";

const TradingViewChart = dynamic(() => import("./trading-view-chart"), { ssr: false });

export default function TokenChart() {
  return (
    <>
      <Head>
        <title>TradingView Chart Integration</title>
      </Head>
      <Script src="/static/charting_library/charting_library.standalone.js" strategy="lazyOnload" />
      <Script src="/static/datafeeds/udf/dist/bundle.js" strategy="lazyOnload" />
      <div className="relative flex h-100 w-full flex-col border-b border-[#2A2E37] lg:h-auto lg:flex-1">
        <TradingViewChart
          symbol="AAPL"
          interval="1D"
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
