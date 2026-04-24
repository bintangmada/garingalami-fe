import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './views/Home';
import BossRoom from './views/BossRoom';
import Toast from './components/Toast';

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Toast />
    </CartProvider>
  );
}

export default App;
