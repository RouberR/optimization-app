import { Grid, TextField, Typography } from '@mui/material';

export const MaximumNumberIterations = ({ setMaxIterations, maxIterations }) => {
  return (
    <>
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
    </>
  );
};
