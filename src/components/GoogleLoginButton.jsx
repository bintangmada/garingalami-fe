import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const GoogleLoginButton = ({ onSuccess, onError }) => {
  const { loginWithGoogle, loading } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse);
      if (onSuccess) onSuccess();
    } catch (error) {
      if (onError) onError(error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center"
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.log('Login Failed');
            if (onError) onError();
          }}
          useOneTap
          theme="outline"
          size="large"
          text="continue_with"
          shape="pill"
          width="100%"
        />
      </motion.div>
      
      {loading && (
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2D5A27]/40 animate-pulse">
          Synchronizing with Google...
        </p>
      )}
    </div>
  );
};

export default GoogleLoginButton;
