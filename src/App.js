import React, { useState } from 'react';
import { solveWithSimplexMethod } from './utils/solveWithSimplexMethod';

function App() {
  const [objectiveCoefficients, setObjectiveCoefficients] = useState([2, 3]);
  const [constraints, setConstraints] = useState([]);
  const [rhsValues, setRhsValues] = useState([]);
  const [initialSolution, setInitialSolution] = useState([]);
  const [maxIterations, setMaxIterations] = useState(10);
  const [constraintTypes, setConstraintTypes] = useState([]); // Типы ограничений
  const [error, setError] = useState(null); // Сообщение об ошибке
  const [result, setResult] = useState(null);

  const handleAddConstraint = () => {
    const newConstraint = new Array(objectiveCoefficients.length).fill(0); // Создаем новое ограничение с нулевыми коэффициентами
    setConstraints([...constraints, newConstraint]);
    setRhsValues([...rhsValues, 0]);
    setConstraintTypes([...constraintTypes, '≤']); // По умолчанию выбираем "≤"
  };

  const handleRemoveConstraint = (index) => {
    const updatedConstraints = [...constraints];
    updatedConstraints.splice(index, 1);
    setConstraints(updatedConstraints);

    const updatedRhsValues = [...rhsValues];
    updatedRhsValues.splice(index, 1);
    setRhsValues(updatedRhsValues);

    const updatedConstraintTypes = [...constraintTypes];
    updatedConstraintTypes.splice(index, 1);
    setConstraintTypes(updatedConstraintTypes);
  };

  const handleAddCoefficient = () => {
    const newCoefficient = 0; // Используйте значение по умолчанию, например, 0.
    const updatedCoefficients = [...objectiveCoefficients, newCoefficient];
    setObjectiveCoefficients(updatedCoefficients);

    // Обновляем также коэффициенты в ограничениях
    const updatedConstraints = constraints.map((constraint) => {
      return [...constraint, newCoefficient];
    });
    setConstraints(updatedConstraints);
  };

  const handleRemoveCoefficient = (index) => {
    const updatedCoefficients = [...objectiveCoefficients];
    updatedCoefficients.splice(index, 1);
    setObjectiveCoefficients(updatedCoefficients);

    // Обновляем также коэффициенты в ограничениях
    const updatedConstraints = constraints.map((constraint) => {
      const copy = [...constraint];
      copy.splice(index, 1);
      return copy;
    });
    setConstraints(updatedConstraints);
  };

  const handleSolve = () => {
    // Проверка наличия хотя бы одного ограничения перед решением
    if (constraints.length === 0 || objectiveCoefficients.length === 0) {
      setError(
        'Добавьте хотя бы одно ограничение и хотя бы один коэффициент в целевую функцию перед решением.',
      );
      return;
    }

    // Формируем объект с данными для передачи в solveWithSimplexMethod
    const data = {
      objectiveFunction: {
        coefficients: objectiveCoefficients,
        evaluate: (solution) => {
          return objectiveCoefficients.reduce((acc, coeff, idx) => acc + coeff * solution[idx], 0);
        },
      },
      constraints: constraints.map((constraint, index) => ({
        coefficients: constraint,
        rhs: rhsValues[index],
        type: constraintTypes[index], // Тип ограничения
      })),
      initialSolution,
      maxIterations: parseInt(maxIterations), // Преобразуем в число
    };

    // Вызываем функцию solveWithSimplexMethod с переданными данными
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

  // Проверка, что значение является числом
  const isNumber = (value) => {
    return !isNaN(parseFloat(value)) && isFinite(value);
  };

  return (
    <div className="App">
      <h1>Оптимизация симплексным методом</h1>
      <h2>Целевая функция</h2>
      <div>
        {objectiveCoefficients.map((coeff, idx) => (
          <div key={idx}>
            <label>{`Коэффициент ${String.fromCharCode(97 + idx)}:`}</label>
            <input
              type="number"
              value={coeff}
              onChange={(e) => {
                const updatedCoefficients = [...objectiveCoefficients];
                updatedCoefficients[idx] = parseFloat(e.target.value);
                setObjectiveCoefficients(updatedCoefficients);

                // Обновляем также коэффициенты в ограничениях
                const updatedConstraints = constraints.map((constraint) => {
                  const copy = [...constraint];
                  copy[idx] = parseFloat(e.target.value);
                  return copy;
                });
                setConstraints(updatedConstraints);
              }}
            />
            <button onClick={() => handleRemoveCoefficient(idx)}>Удалить</button>
          </div>
        ))}
        <button onClick={handleAddCoefficient}>Добавить коэффициент</button>
      </div>

      <h2>Ограничения</h2>
      {constraints.map((coefficients, index) => (
        <div key={index}>
          {coefficients.map((coeff, idx) => (
            <div key={idx}>
              <label>{`Коэффициент ${String.fromCharCode(97 + idx)}:`}</label>
              <input
                type="number"
                value={coeff}
                onChange={(e) => {
                  const updatedConstraints = [...constraints];
                  updatedConstraints[index][idx] = parseFloat(e.target.value);
                  setConstraints(updatedConstraints);
                }}
              />
            </div>
          ))}
          <div>
            <label>RHS (правая часть):</label>
            <input
              type="number"
              value={rhsValues[index]}
              onChange={(e) => {
                const updatedRhsValues = [...rhsValues];
                updatedRhsValues[index] = parseFloat(e.target.value);
                setRhsValues(updatedRhsValues);
              }}
            />
          </div>
          <div>
            <label>Тип ограничения:</label>
            <select
              value={constraintTypes[index]}
              onChange={(e) => {
                const updatedConstraintTypes = [...constraintTypes];
                updatedConstraintTypes[index] = e.target.value;
                setConstraintTypes(updatedConstraintTypes);
              }}>
              <option value="≤">≤</option>
              <option value="=">=</option>
              <option value="≥">≥</option>
            </select>
          </div>
          <button onClick={() => handleRemoveConstraint(index)}>Удалить ограничение</button>
        </div>
      ))}
      <button onClick={handleAddConstraint}>Добавить ограничение</button>

      <h2>Начальное решение</h2>
      <div>
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
      </div>

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
