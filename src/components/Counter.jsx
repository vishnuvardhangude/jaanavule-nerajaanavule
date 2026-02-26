
import React, { useState } from 'react';
import { useLocalStorage } from '../utils/storage';

function Counter() {
  // State to hold the count
  const [count, setCount] = useLocalStorage("Counter", 0);

  // Handlers
  const increment = () => setCount(prev => prev + 1);
  const reset = () => setCount(0);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Count: {count}</h1>
      <button onClick={increment} style={{ marginRight: '.5rem' }}>
        Increment
      </button>
      <button onClick={reset}>
        Reset
      </button>
    </div>
  );
}

export default Counter;
