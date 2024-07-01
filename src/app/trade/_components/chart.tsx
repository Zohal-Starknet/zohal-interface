import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  PropsWithChildren,
} from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  IChartApi,
  ISeriesApi,
  SeriesType,
  CandlestickSeriesPartialOptions,
  SeriesOptionsMap,
  SeriesDataItemTypeMap
} from 'lightweight-charts';
import { robotoMono } from '@zohal/app/_helpers/fonts';

type ChartContextType = {
  api: IChartApi;
  isRemoved: boolean;
  free: (series: ISeriesApi<SeriesType>) => void;
};

const ChartContext = createContext<ChartContextType | null>(null);

interface ChartProps {
  layout?: CandlestickSeriesPartialOptions;
  children?: React.ReactNode;
  autoSize?: boolean;
  [key: string]: any;
}

export function Chart({ layout, children, autoSize, ...rest }: PropsWithChildren<ChartProps>) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const handleRef = useCallback((ref: HTMLDivElement) => setContainer(ref), []);

  useEffect(() => {
    if (container && autoSize) {
      container.style.height = '100%';
    }
  }, [container, autoSize]);

  return (
    <div ref={handleRef} style={{ height: '100%' }}>
      {container && <ChartContainer {...rest} container={container} layout={layout}>{children}</ChartContainer>}
    </div>
  );
}

interface ChartContainerProps extends PropsWithChildren<any> {
  container: HTMLDivElement;
  layout?: any;
}

const ChartContainer = forwardRef<IChartApi, ChartContainerProps>((props, ref) => {
  const { children, container, layout, ...rest } = props;

  const chartApiRef = useRef<{
    _api?: IChartApi;
    isRemoved: boolean;
    api: () => IChartApi;
    free: (series: ISeriesApi<SeriesType>) => void;
  }>({
    isRemoved: false,
    api() {
      if (!this._api) {
        this._api = createChart(container, {
          ...rest,
          layout,
          width: container.clientWidth,
          height: container.clientHeight, // Set height based on container
        });
        this._api.timeScale().fitContent();
      }
      return this._api;
    },
    free(series) {
      if (this._api && series) {
        this._api.removeSeries(series);
      }
    },
  });

  useLayoutEffect(() => {
    const currentRef = chartApiRef.current;
    const chart = currentRef.api();

    const handleResize = () => {
      chart.applyOptions({
        ...rest,
        width: container.clientWidth,
        height: container.clientHeight, // Adjust height on resize
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chartApiRef.current.isRemoved = true;
      chart.remove();
    };
  }, []);

  useLayoutEffect(() => {
    const currentRef = chartApiRef.current;
    currentRef.api();
  }, []);

  useLayoutEffect(() => {
    const currentRef = chartApiRef.current;
    currentRef.api().applyOptions(rest);
  }, []);

  useImperativeHandle(ref, () => chartApiRef.current.api(), []);

  useEffect(() => {
    const currentRef = chartApiRef.current;
    currentRef.api().applyOptions({ layout });
  }, [layout]);

  return (
    <ChartContext.Provider value={chartApiRef.current}>
      {props.children}
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'ChartContainer';

interface SeriesProps {
  type: keyof SeriesOptionsMap;
  data: SeriesDataItemTypeMap[keyof SeriesDataItemTypeMap][];
  color?: string;
  downColor?: string;
  wickUpColor?: string;
  wickDownColor?: string;
  [key: string]: any;
}

const Series = forwardRef<ISeriesApi<SeriesType>, PropsWithChildren<SeriesProps>>((props, ref) => {
  const parent = useContext(ChartContext);
  if (!parent) throw new Error("Series must be used within a Chart");
  
  const context = useRef<{
    _api?: ISeriesApi<SeriesType>;
    api: () => ISeriesApi<SeriesType>;
    free: () => void;
  }>({
    api() {
      if (!this._api) {
        const { data, type, ...rest } = props;
        this._api = parent.api().addCandlestickSeries(rest);
        this._api.setData(data);
      }
      return this._api;
    },
    free() {
      if (this._api && !parent.isRemoved) {
        parent.free(this._api);
      }
    },
  });

  useLayoutEffect(() => {
    const currentRef = context.current;
    currentRef.api();

    return () => currentRef.free();
  }, []);

  useLayoutEffect(() => {
    const currentRef = context.current;
    const { data, ...rest } = props;
    currentRef.api().applyOptions(rest);
    currentRef.api().setData(data); // Ensure data is set on update
  }, [props.data]); // Watch data changes

  useImperativeHandle(ref, () => context.current.api(), []);

  return (
    <ChartContext.Provider value={context.current}>
      {props.children}
    </ChartContext.Provider>
  );
});
Series.displayName = 'Series';

export { Series };
