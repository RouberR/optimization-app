import { Box, Button, Grid, TextField, Typography } from '@mui/material';

export const ObjectiveComponent = ({
  objectiveCoefficients,
  handleObjectiveCoefficientChange,
  handleRemoveCoefficient,
  handleAddCoefficient,
}) => {
  return (
    <>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Целевая функция
      </Typography>
      {objectiveCoefficients.map((coeff, idx) => (
        <Box key={idx} sx={{ marginBottom: 2 }}>
          <Grid container key={idx} spacing={2} className="mb-2">
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
    </>
  );
};
