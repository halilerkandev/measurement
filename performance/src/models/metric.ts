import mongoose from 'mongoose';

export interface IMetricDocument extends mongoose.Document {
  name: 'FCP' | 'TTFB' | 'DL' | 'WL' | 'NT';
  value: number;
  delta: number;
  metricId: string;
  isFinal: boolean;
  entry?: PerformanceEntry;
  createdAt?: Date;
}

export interface IMetricInput {
  name: IMetricDocument['name'];
  value: IMetricDocument['value'];
  delta: IMetricDocument['delta'];
  metricId: IMetricDocument['metricId'];
  isFinal: IMetricDocument['isFinal'];
  entry?: IMetricDocument['entry'];
  createdAt?: IMetricDocument['createdAt'];
}

interface IMetricModel extends mongoose.Model<IMetricDocument> {}

const metricSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ['FCP', 'TTFB', 'DL', 'WL', 'NT'],
    },
    value: {
      type: Number,
    },
    delta: {
      type: Number,
    },
    metricId: {
      type: String,
    },
    isFinal: {
      type: Boolean,
    },
    entry: {
      type: Object,
    },
    createdAt: {
      type: Date,
      default: () => Date.now(),
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Metric = mongoose.model<IMetricDocument, IMetricModel>(
  'Metric',
  metricSchema
);
