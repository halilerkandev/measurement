import { createContext, useReducer, useContext } from 'react';

const MetricsStateContext = createContext();
const MetricsDispatchContext = createContext();

export const metricsActionTypes = {
  SET_METRICS_FROM_PROPS: 'SET_METRICS_FROM_PROPS',
  SET_CURRENT_METRIC: 'SET_CURRENT_METRIC',
};

const metricsReducer = (state, action) => {
  switch (action.type) {
    case metricsActionTypes.SET_METRICS_FROM_PROPS:
      return { ...state, metrics: [...action.payload] };
    case metricsActionTypes.SET_CURRENT_METRIC:
      return {
        ...state,
        metrics: [action.payload, ...state.metrics],
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const MetricsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(metricsReducer, {
    metrics: [],
  });

  return (
    <MetricsStateContext.Provider value={state}>
      <MetricsDispatchContext.Provider value={dispatch}>
        {children}
      </MetricsDispatchContext.Provider>
    </MetricsStateContext.Provider>
  );
};

const useMetricsState = () => {
  const context = useContext(MetricsStateContext);
  if (context === undefined) {
    throw new Error('useMetricsState must be used within a MetricsProvider');
  }
  return context;
};

const useMetricsDispatch = () => {
  const context = useContext(MetricsDispatchContext);
  if (context === undefined) {
    throw new Error('useMetricsDispatch must be used within a MetricsProvider');
  }
  return context;
};

export const useMetrics = () => {
  return [useMetricsState(), useMetricsDispatch()];
};
