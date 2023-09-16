import React from 'react';

export const  OptimizationResult = ({ result }) => {
  return (
    <div>
      <h2>Результат оптимизации</h2>
      <p>Оптимальное значение: {result.optimalValue}</p>
      <p>Оптимальное решение: {result.optimalSolution}</p>
    </div>
  );
}

