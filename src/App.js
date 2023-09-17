import React, { useState } from 'react';
import { solveWithSimplexMethod } from './utils/solveWithSimplexMethod';
import { Container, Typography, Button } from '@mui/material';
import {
  InitialSolutionComponent,
  MaximumNumberIterations,
  ObjectiveComponent,
  RestrictionsComponent,
  Result,
} from './components';

function App() {
  const [objectiveCoefficients, setObjectiveCoefficients] = useState([2, 3]);
  const [constraints, setConstraints] = useState([{ coefficients: [1, 2], rhs: 6, type: '≤' }]);
  const [initialSolution, setInitialSolution] = useState([0, 0]);
  const [maxIterations, setMaxIterations] = useState(10);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleObjectiveCoefficientChange = (index, newValue) => {
    const updatedCoefficients = [...objectiveCoefficients];
    updatedCoefficients[index] = parseFloat(newValue);
    setObjectiveCoefficients(updatedCoefficients);
  };

  const handleConstraintCoefficientChange = (constraintIndex, coefficientIndex, newValue) => {
    const updatedConstraints = [...constraints];
    updatedConstraints[constraintIndex].coefficients[coefficientIndex] = parseFloat(newValue);
    setConstraints(updatedConstraints);
  };

  const handleAddCoefficient = () => {
    const newCoefficient = 0;
    setObjectiveCoefficients([...objectiveCoefficients, newCoefficient]);

    const updatedConstraints = constraints.map((constraint) => ({
      ...constraint,
      coefficients: [...constraint.coefficients, newCoefficient],
    }));
    setConstraints(updatedConstraints);

    setInitialSolution([...initialSolution, 0]);
  };

  const handleRemoveCoefficient = (index) => {
    const updatedCoefficients = [...objectiveCoefficients];
    updatedCoefficients.splice(index, 1);
    setObjectiveCoefficients(updatedCoefficients);

    const updatedConstraints = constraints.map((constraint) => {
      const copy = { ...constraint };
      copy.coefficients.splice(index, 1);
      return copy;
    });
    setConstraints(updatedConstraints);

    const updatedInitialSolution = [...initialSolution];
    updatedInitialSolution.splice(index, 1);
    setInitialSolution(updatedInitialSolution);
  };

  const handleAddConstraint = () => {
    const newConstraintCoefficients = new Array(objectiveCoefficients.length).fill(0);
    setConstraints([
      ...constraints,
      { coefficients: newConstraintCoefficients, rhs: 0, type: '≤' },
    ]);
  };

  const handleRemoveConstraint = (index) => {
    const updatedConstraints = [...constraints];
    updatedConstraints.splice(index, 1);
    setConstraints(updatedConstraints);
  };

  const handleSolve = () => {
    if (constraints.length === 0) {
      setError('Добавьте хотя бы одно ограничение перед решением.');
      return;
    }

    if (
      !objectiveCoefficients.every(isNumber) ||
      !constraints.every((constraint) => constraint.coefficients.every(isNumber)) ||
      !initialSolution.every(isNumber) ||
      !isNumber(maxIterations)
    ) {
      setError('Пожалуйста, убедитесь, что все поля содержат числовые значения.');
      return;
    }

    const data = {
      objectiveFunction: {
        coefficients: objectiveCoefficients,
        evaluate: (solution) => {
          return solution.reduce((acc, coeff, idx) => acc + coeff * objectiveCoefficients[idx], 0);
        },
      },
      constraints: constraints,
      initialSolution,
      maxIterations: parseInt(maxIterations),
    };

    const result = solveWithSimplexMethod(
      data.objectiveFunction,
      data.constraints,
      data.initialSolution,
      data.maxIterations,
    );

    if (result === null) {
      setError('Задача неограничена или достигнуто максимальное число итераций');
    } else {
      setResult(result);
      setError(null);
    }
  };

  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Оптимизация симплексным методом
      </Typography>
      <ObjectiveComponent
        handleObjectiveCoefficientChange={handleObjectiveCoefficientChange}
        handleRemoveCoefficient={handleRemoveCoefficient}
        objectiveCoefficients={objectiveCoefficients}
        handleAddCoefficient={handleAddCoefficient}
      />

      <RestrictionsComponent
        constraints={constraints}
        handleAddConstraint={handleAddConstraint}
        handleConstraintCoefficientChange={handleConstraintCoefficientChange}
        handleRemoveConstraint={handleRemoveConstraint}
        setConstraints={setConstraints}
      />

      <InitialSolutionComponent
        initialSolution={initialSolution}
        setInitialSolution={setInitialSolution}
      />

      <MaximumNumberIterations maxIterations={maxIterations} setMaxIterations={setMaxIterations} />

      <Button
        style={{ marginTop: 24 }}
        variant="contained"
        color="primary"
        onClick={handleSolve}
        fullWidth>
        Решить
      </Button>

      {error && (
        <Typography variant="body1" color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {result && <Result result={result} />}

      <Button
        variant="contained"
        color="secondary"
        onClick={() => window.location.reload()}
        fullWidth>
        Сбросить
      </Button>
    </Container>
  );
}

export default App;
