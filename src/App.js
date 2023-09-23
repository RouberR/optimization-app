import React, { useState } from 'react';
import { Input, Button, Select } from 'antd';
import simplexOptimization from './simplexOptimization';

const { Option } = Select;

const App = () => {
  const [objectiveCoefficients, setObjectiveCoefficients] = useState([2, 3, 2]);
  const [constraints, setConstraints] = useState([{ coefficients: [1, 2, 44], rhs: 6, type: '≤' }]);
  const [initialSolution, setInitialSolution] = useState([2, 1, 1]);
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

    const objectiveFunctionCoefficients = objectiveCoefficients;
    const constraintsCoefficients = constraints.map((constraint) => constraint.coefficients);
    const constraintsRHS = constraints.map((constraint) => constraint.rhs);

    const optimizationResult = simplexOptimization(
      objectiveFunctionCoefficients,
      constraintsCoefficients,
      constraintsRHS,
      initialSolution,
      parseInt(maxIterations),
    );

    if (optimizationResult === null) {
      setError('Задача неограничена или достигнуто максимальное число итераций');
    } else {
      setResult(optimizationResult);
      setError(null);
    }
  };

  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  return (
    <div className="App">
      <h3>
        Решение многомерных оптимизационных задач симплексным методом с редукцией. Редукция
        относительно центра симплекса
      </h3>

      <h2>Целевая функция</h2>
      {objectiveCoefficients.map((coeff, idx) => (
        <div key={idx}>
          <label>{`Коэффициент ${String.fromCharCode(97 + idx)}:`}</label>
          <Input
            type="number"
            value={coeff}
            style={{ width: 100 }}
            onChange={(e) => handleObjectiveCoefficientChange(idx, e.target.value)}
          />
          <Button onClick={() => handleRemoveCoefficient(idx)}>Удалить</Button>
        </div>
      ))}
      <Button onClick={handleAddCoefficient}>Добавить коэффициент</Button>

      <h2>Ограничения</h2>
      {constraints.map((constraint, constraintIndex) => (
        <div key={constraintIndex}>
          {constraint.coefficients.map((coeff, coefficientIndex) => (
            <div key={coefficientIndex}>
              <label>{`Коэффициент ${String.fromCharCode(97 + coefficientIndex)}:`}</label>
              <Input
                type="number"
                value={coeff}
                style={{ width: 100 }}
                onChange={(e) =>
                  handleConstraintCoefficientChange(
                    constraintIndex,
                    coefficientIndex,
                    e.target.value,
                  )
                }
              />
            </div>
          ))}
          <div>
            <label>RHS (правая часть):</label>
            <Input
              type="number"
              value={constraint.rhs}
              style={{ width: 100 }}
              onChange={(e) => {
                const updatedConstraints = [...constraints];
                updatedConstraints[constraintIndex].rhs = parseFloat(e.target.value);
                setConstraints(updatedConstraints);
              }}
            />
          </div>
          <div>
            <label>Тип ограничения:</label>
            <Select
              value={constraint.type}
              onChange={(value) => {
                const updatedConstraints = [...constraints];
                updatedConstraints[constraintIndex].type = value;
                setConstraints(updatedConstraints);
              }}>
              <Option value="≤">≤</Option>
              <Option value="=">=</Option>
              <Option value="≥">≥</Option>
            </Select>
          </div>
          <Button onClick={() => handleRemoveConstraint(constraintIndex)}>
            Удалить ограничение
          </Button>
        </div>
      ))}
      <Button onClick={handleAddConstraint}>Добавить ограничение</Button>

      <h2>Начальное решение</h2>
      {initialSolution.map((solution, idx) => (
        <div key={idx}>
          <label>{`x${idx + 1}:`}</label>
          <Input
            type="number"
            value={solution}
            style={{ width: 100 }}
            onChange={(e) => {
              const updatedSolution = [...initialSolution];
              updatedSolution[idx] = parseFloat(e.target.value);
              setInitialSolution(updatedSolution);
            }}
          />
        </div>
      ))}

      <div>
        <label>Максимальное число итераций:</label>
        <Input
          type="number"
          value={maxIterations}
          style={{ width: 100 }}
          onChange={(e) => setMaxIterations(parseInt(e.target.value))}
        />
      </div>

      <Button type="primary" onClick={handleSolve}>
        Решить
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div>
          <h2>Результат оптимизации</h2>
          <p>Оптимальное значение: {result.optimalValue}</p>
          <p>Оптимальное решение: {result.optimalSolution.join(', ')}</p>
        </div>
      )}
    </div>
  );
};

export default App;
