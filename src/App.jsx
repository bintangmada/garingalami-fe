import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './views/Home';
import BossRoom from './views/BossRoom';
import Toast from './components/Toast';

// Placeholder Client ID - User needs to replace this later
const GOOGLE_CLIENT_ID = "257787800799-mif3vlingmg79nnmevn8nni79ue5qc2p.apps.googleusercontent.com";

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
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boss-room" element={<BossRoom />} />
          </Routes>
          <Toast />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
