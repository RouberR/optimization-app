// Компонент для ввода целевой функции
import React, { useState } from 'react';

export const ObjectiveFunctionInput = ({ onObjectiveFunctionChange }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = () => {
    onObjectiveFunctionChange(inputValue);
  };

  return (
    <div>
      <label>Целевая функция:</label>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      <button onClick={handleInputSubmit}>Применить</button>
    </div>
  );
};
