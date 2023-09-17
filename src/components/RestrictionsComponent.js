import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

export const RestrictionsComponent = ({
  constraints,
  handleConstraintCoefficientChange,
  setConstraints,
  handleRemoveConstraint,
  handleAddConstraint,
}) => {
  return (
    <>
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
    </>
  );
};
