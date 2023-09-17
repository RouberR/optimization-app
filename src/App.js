import React, { useState } from 'react';
import { solveWithSimplexMethod } from './utils/solveWithSimplexMethod';
import {
  Container,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  List,
  ListItem,
  Box,
} from '@mui/material';

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

      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Целевая функция
      </Typography>
      {objectiveCoefficients.map((coeff, idx) => (
        <Box key={idx} sx={{ marginBottom: 2 }}>
          {/* Добавлен Box с вертикальным отступом */}
          <Grid container key={idx} spacing={2} className="mb-2">
            {/* Добавлен класс для отступа */}
            <Grid item xs={3}>
              <TextField
                type="number"
                label={`Коэффициент x${idx + 1}`}
                value={coeff}
                onChange={(e) => handleObjectiveCoefficientChange(idx, e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={2} sx={{ alignSelf: 'center' }}>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleRemoveCoefficient(idx)}>
                Удалить
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddCoefficient}>
        Добавить коэффициент
      </Button>

      <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 4 }}>
        Ограничения
      </Typography>
      {constraints.map((constraint, constraintIndex) => (
        <div key={constraintIndex}>
          {constraint.coefficients.map((coeff, coefficientIndex) => (
            <Box key={coefficientIndex} sx={{ marginBottom: 2 }}>
              <Grid container spacing={2} key={coefficientIndex}>
                <Grid item xs={3}>
                  <TextField
                    type="number"
                    label={`Коэффициент x${coefficientIndex + 1}`}
                    value={coeff}
                    onChange={(e) =>
                      handleConstraintCoefficientChange(
                        constraintIndex,
                        coefficientIndex,
                        e.target.value,
                      )
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                type="number"
                label="RHS (правая часть)"
                value={constraint.rhs}
                onChange={(e) => {
                  const updatedConstraints = [...constraints];
                  updatedConstraints[constraintIndex].rhs = parseFloat(e.target.value);
                  setConstraints(updatedConstraints);
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel>Тип ограничения</InputLabel>
                <Select
                  label="Тип ограничения"
                  value={constraint.type}
                  onChange={(e) => {
                    const updatedConstraints = [...constraints];
                    updatedConstraints[constraintIndex].type = e.target.value;
                    setConstraints(updatedConstraints);
                  }}>
                  <MenuItem value="≤">≤</MenuItem>
                  <MenuItem value="=">=</MenuItem>
                  <MenuItem value="≥">≥</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={5} sx={{ alignSelf: 'center', marginBottom: 4 }}>
              <Button
                variant="contained"
                fullWidth
                color="error"
                onClick={() => handleRemoveConstraint(constraintIndex)}>
                Удалить ограничение
              </Button>
            </Grid>
          </Grid>
        </div>
      ))}
      <Button variant="contained" color="primary" onClick={handleAddConstraint}>
        Добавить ограничение
      </Button>

      <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 4 }}>
        Начальное решение
      </Typography>
      {initialSolution.map((solution, idx) => (
        <Box key={idx} sx={{ marginBottom: 2 }}>
          <Grid container spacing={2} key={idx}>
            <Grid item xs={4}>
              <TextField
                type="number"
                label={`x${idx + 1}`}
                value={solution}
                onChange={(e) => {
                  const updatedInitialSolution = [...initialSolution];
                  updatedInitialSolution[idx] = parseFloat(e.target.value);
                  setInitialSolution(updatedInitialSolution);
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 4 }}>
        Максимальное число итераций
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Максимальное число итераций"
            value={maxIterations}
            onChange={(e) => setMaxIterations(e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>

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

      {result && (
        <div>
          <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 4 }}>
            Результат:
          </Typography>
          <Typography variant="body1">Оптимальное значение: {result.optimalValue}</Typography>
          <Typography variant="body1">Оптимальное решение:</Typography>
          <List>
            {result.optimalSolution.map((solution, idx) => (
              <ListItem key={idx}>{`x${idx + 1} = ${solution}`}</ListItem>
            ))}
          </List>
        </div>
      )}

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
