import React from 'react';
import { CartProvider } from './context/CartContext';
import Home from './views/Home';
import Toast from './components/Toast';

function App() {
  return (
    <CartProvider>
      <Home />
      <Toast />
    </CartProvider>
  );
}

export default App;
