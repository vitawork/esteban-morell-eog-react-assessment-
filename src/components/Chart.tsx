import React from 'react';
import { useSelector } from 'react-redux';
import { IState } from '../store';

export default () => {
  const { multipleMeasurements } = useSelector((state: IState) => state.metrics);

  return multipleMeasurements.length === 0 ? null : <div />;
};
