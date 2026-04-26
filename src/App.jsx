import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './views/Home';
import BossRoom from './views/BossRoom';
import Toast from './components/Toast';
import axios from 'axios';

function App() {
  useEffect(() => {
    // Track visitor hit
    console.log("🚀 Attempting analytics hit...");
    fetch('http://localhost:8080/api/analytics/hit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: window.location.pathname })
    }).then(() => console.log("✅ Hit recorded"))
      .catch(err => console.error("❌ Hit failed", err));
  }, []);

  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/boss-room" element={<BossRoom />} />
      </Routes>
      <Toast />
    </CartProvider>
  );
}

export default App;
