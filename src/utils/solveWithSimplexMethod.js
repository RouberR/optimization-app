export function solveWithSimplexMethod(
  objectiveFunction,
  constraints,
  initialSolution,
  maxIterations,
) {
  const numVariables = initialSolution.length;
  const numConstraints = constraints.length;
  let solution = initialSolution.slice();
  let iteration = 0;

  const findMinValueVertex = (solution) => {
    let minValue = Infinity;
    let minIndex = -1;

    for (let i = 0; i < numConstraints; i++) {
      const value = objectiveFunction.evaluate(solution);
      if (value < minValue) {
        minValue = value;
        minIndex = i;
      }
    }

    return minIndex;
  };

  while (iteration < maxIterations) {
    console.log(`Iteration ${iteration + 1}`);

    // Шаг 1: Редукция относительно вершины с наименьшим значением
    const vertexToReduce = findMinValueVertex(solution);
    if (vertexToReduce === -1) {
      console.log('Optimal solution found.');
      return {
        optimalValue: objectiveFunction.evaluate(solution),
        optimalSolution: solution,
      };
    }

    // Обновляем решение на основе коэффициентов редукции
    const reducedCoefficients = constraints[vertexToReduce];
    console.log('Reduced Coefficients:', reducedCoefficients);

    const pivotElement = reducedCoefficients.reduce(
      (min, current, index) => {
        if (current < 0 && -solution[index] / current < min.ratio) {
          return { ratio: -solution[index] / current, index };
        }
        return min;
      },
      { ratio: Infinity, index: -1 },
    );

    console.log('Pivot Element:', pivotElement);

    if (pivotElement.index === -1) {
      console.log('Unbounded problem.');
      return null; // Задача неограничена
    }

    const enteringVariable = pivotElement.index;
    console.log('Entering Variable:', enteringVariable);

    for (let i = 0; i < numVariables; i++) {
      solution[i] +=
        reducedCoefficients[i] *
        (solution[enteringVariable] / reducedCoefficients[enteringVariable]);
    }

    // Шаг 2: Вычисление коэффициентов целевой функции
    const c = objectiveFunction.coefficients.map((coeff, idx) => {
      let sum = 0;
      for (let i = 0; i < numConstraints; i++) {
        sum += constraints[i][idx] * solution[i];
      }
      return sum - coeff;
    });

    console.log('Updated Solution:', solution);
    console.log('Updated Coefficients c:', c);

    // Шаг 3: Проверка на оптимальность
    let isOptimal = true;
    for (let i = 0; i < numVariables; i++) {
      if (c[i] < 0) {
        isOptimal = false;
        break;
      }
    }

    if (isOptimal) {
      console.log('Optimal solution found.');
      return {
        optimalValue: objectiveFunction.evaluate(solution),
        optimalSolution: solution,
      };
    }

    // Шаг 4: Выбор выходящей переменной
    let minRatio = Infinity;
    let exitingVariable = -1;
    for (let i = 0; i < numConstraints; i++) {
      if (constraints[i][enteringVariable] > 0) {
        const ratio = constraints[i][numVariables] / constraints[i][enteringVariable];
        if (ratio < minRatio) {
          minRatio = ratio;
          exitingVariable = i;
        }
      }
    }

    console.log('Exiting Variable:', exitingVariable);
    console.log('Min Ratio:', minRatio);

    if (exitingVariable === -1) {
      console.log('Unbounded problem.');
      return null; // Нет опорного столбца, задача неограничена
    }

    // Шаг 5: Обновление решения и базиса
    const pivotElement2 = constraints[exitingVariable][enteringVariable];
    console.log('Pivot Element 2:', pivotElement2);

    for (let i = 0; i < numConstraints; i++) {
      for (let j = 0; j < numVariables; j++) {
        if (i !== exitingVariable) {
          solution[j] -= (constraints[i][j] / pivotElement2) * constraints[i][enteringVariable];
        }
      }
    }

    solution[exitingVariable] = 0;
    solution[enteringVariable] = minRatio;

    console.log('Updated Solution:', solution);

    iteration++;
  }

  console.log('Max iterations reached.');
  // Достигнуто максимальное число итераций
  return null;
}
