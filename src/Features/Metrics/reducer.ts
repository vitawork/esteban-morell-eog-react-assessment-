import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Measurement = {
  metric: string;
  at: number;
  value: number;
  unit: string;
};

export type Measurements = {
  metric: string;
  measurements: Measurement[];
};

export type MultipleMeasurements = Measurements[];
export type MetricsNames = string[];
export type SelectedMetrics = string[];

export type MetricsState = {
  metricsNames: MetricsNames;
  selectedMetrics: SelectedMetrics;
  multipleMeasurements: MultipleMeasurements;
};

export type ApiErrorAction = {
  error: string;
};

const initialState: MetricsState = {
  metricsNames: [],
  selectedMetrics: [],
  multipleMeasurements: [],
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<MetricsState>) => ({ ...action.payload }),
    initializeMetrics: (state, action: PayloadAction<MetricsNames>) => ({
      ...state,
      metricsNames: action.payload,
    }),
    selectMetrics: (state, action: PayloadAction<SelectedMetrics>) => ({
      ...state,
      selectedMetrics: action.payload,
    }),
    setMultipleMeasurements: (state, action: PayloadAction<MultipleMeasurements>) => ({
      ...state,
      multipleMeasurements: action.payload,
    }),
    addAMeasurements: (state, action: PayloadAction<Measurements>) => {
      const newMultipleMeasurements = [...state.multipleMeasurements];
      newMultipleMeasurements.push(action.payload);
      return {
        ...state,
        multipleMeasurements: newMultipleMeasurements,
      };
    },
    updateMeasurements: (state, action: PayloadAction<Measurement>) => {
      const metricIndex = state.multipleMeasurements.findIndex(
        measurements => measurements.metric === action.payload.metric,
      );
      if (metricIndex === -1) return state;

      const newMultipleMeasurements = [...state.multipleMeasurements];
      newMultipleMeasurements[metricIndex] = {
        ...newMultipleMeasurements[metricIndex],
        measurements: [...newMultipleMeasurements[metricIndex].measurements, action.payload],
      };

      return {
        ...state,
        multipleMeasurements: newMultipleMeasurements,
      };
    },
    deleteMeasurements: (state, action: PayloadAction<string>) => {
      const newMultipleMeasurements = state.multipleMeasurements.filter(
        measurements => measurements.metric !== action.payload,
      );
      return {
        ...state,
        multipleMeasurements: newMultipleMeasurements,
      };
    },
    apiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
