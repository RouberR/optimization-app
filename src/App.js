import React, { useState } from 'react';
import { solveWithSimplexMethod } from './utils/solveWithSimplexMethod';

function App() {
  const [objectiveCoefficients, setObjectiveCoefficients] = useState([2, 3, 2]);
  const [constraints, setConstraints] = useState([{ coefficients: [1, 2, 44], rhs: 6, type: '≤' }]);
  const [initialSolution, setInitialSolution] = useState([0, 0, 0]);
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

    // Обновляет начальное решение, добавляя нулевое значение для нового коэффициента
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

    // Обновляет начальное решение, удаляя значение, соответствующее удаленному коэффициенту
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
    // Проверка наличия хотя бы одного ограничения перед решением
    if (constraints.length === 0) {
      setError('Добавьте хотя бы одно ограничение перед решением.');
      return;
    }

    // Проверка, что все введенные значения числа
    if (
      !objectiveCoefficients.every(isNumber) ||
      !constraints.every((constraint) => constraint.coefficients.every(isNumber)) ||
      !initialSolution.every(isNumber) ||
      !isNumber(maxIterations)
    ) {
      setError('Пожалуйста, убедитесь, что все поля содержат числовые значения.');
      return;
    }

    // Формируем объект с данными для передачи в solveWithSimplexMethod
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

    // Вызываем функцию solveWithSimplexMethod с переданными данными
    const result = solveWithSimplexMethod(
      data.objectiveFunction,
      data.constraints,
      data.initialSolution,
      data.maxIterations,
    );

    // Обновляем состояние приложения с результатами решения
    if (result === null) {
      setError('Задача неограничена или достигнуто максимальное число итераций');
    } else {
      setResult(result);
      setError(null);
    }
  };

  // Проверка, что значение является числом
  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  return (
    <div className="App">
      <h1>Оптимизация симплексным методом</h1>

      <h2>Целевая функция</h2>
      {objectiveCoefficients.map((coeff, idx) => (
        <div key={idx}>
          <label>{`Коэффициент ${String.fromCharCode(97 + idx)}:`}</label>
          <input
            type="number"
            value={coeff}
            onChange={(e) => handleObjectiveCoefficientChange(idx, e.target.value)}
          />
          <button onClick={() => handleRemoveCoefficient(idx)}>Удалить</button>
        </div>
      ))}
      <button onClick={handleAddCoefficient}>Добавить коэффициент</button>

      <h2>Ограничения</h2>
      {constraints.map((constraint, constraintIndex) => (
        <div key={constraintIndex}>
          {constraint.coefficients.map((coeff, coefficientIndex) => (
            <div key={coefficientIndex}>
              <label>{`Коэффициент ${String.fromCharCode(97 + coefficientIndex)}:`}</label>
              <input
                type="number"
                value={coeff}
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
            <input
              type="number"
              value={constraint.rhs}
              onChange={(e) => {
                const updatedConstraints = [...constraints];
                updatedConstraints[constraintIndex].rhs = parseFloat(e.target.value);
                setConstraints(updatedConstraints);
              }}
            />
          </div>
          <div>
            <label>Тип ограничения:</label>
            <select
              value={constraint.type}
              onChange={(e) => {
                const updatedConstraints = [...constraints];
                updatedConstraints[constraintIndex].type = e.target.value;
                setConstraints(updatedConstraints);
              }}>
              <option value="≤">≤</option>
              <option value="=">=</option>
              <option value="≥">≥</option>
            </select>
          </div>
          <button onClick={() => handleRemoveConstraint(constraintIndex)}>
            Удалить ограничение
          </button>
        </div>
      ))}
      <button onClick={handleAddConstraint}>Добавить ограничение</button>

      <h2>Начальное решение</h2>
      {initialSolution.map((solution, idx) => (
        <div key={idx}>
          <label>{`x${idx + 1}:`}</label>
          <input
            type="number"
            value={solution}
            onChange={(e) => {
              const updatedInitialSolution = [...initialSolution];
              updatedInitialSolution[idx] = parseFloat(e.target.value);
              setInitialSolution(updatedInitialSolution);
            }}
          />
        </div>
      ))}

      <h2>Максимальное число итераций</h2>
      <div>
        <label>Максимальное число итераций:</label>
        <input
          type="number"
          value={maxIterations}
          onChange={(e) => setMaxIterations(e.target.value)}
        />
      </div>

      <button onClick={handleSolve}>Решить</button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div>
          <h2>Результат:</h2>
          <p>Оптимальное значение: {result.optimalValue}</p>
          <p>Оптимальное решение:</p>
          <ul>
            {result.optimalSolution.map((solution, idx) => (
              <li key={idx}>{`x${idx + 1} = ${solution}`}</li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={() => window.location.reload()}>Сбросить</button>
    </div>
  );
}

export default App;
