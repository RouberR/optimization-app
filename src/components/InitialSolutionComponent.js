import { Box, Grid, TextField, Typography } from '@mui/material';

export const InitialSolutionComponent = ({ initialSolution, setInitialSolution }) => {
  return (
    <>
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
    </>
  );
};
