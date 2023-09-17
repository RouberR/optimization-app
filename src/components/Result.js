import { List, ListItem, Typography } from '@mui/material';

export const Result = ({ result }) => {
  return (
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
  );
};
