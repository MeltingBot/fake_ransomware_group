import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck } from 'lucide-react';

const AntiBotLoading = ({ onLoadingComplete }) => {
  const [loadingStep, setLoadingStep] = useState(0);
  const steps = [
    "Initializing security protocols...",
    "Verifying browser fingerprint...",
    "Checking for automated requests...",
    "Analyzing network patterns...",
    "Confirming human interaction...",
    "Access granted. Loading data..."
  ];

  const updateStep = useCallback(() => {
    setLoadingStep((prevStep) => {
      if (prevStep < steps.length - 1) {
        return prevStep + 1;
      }
      return prevStep;
    });
  }, [steps.length]);

  useEffect(() => {
    let timer;
    if (loadingStep < steps.length - 1) {
      // Augmenter le délai entre chaque étape à 2 secondes
      timer = setTimeout(updateStep, 2000);
    } else if (loadingStep === steps.length - 1) {
      // Ajouter un délai supplémentaire à la fin avant de terminer le chargement
      timer = setTimeout(() => {
        onLoadingComplete();
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [loadingStep, steps.length, updateStep, onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-4">
          <ShieldCheck className="text-green-500 mr-2" size={32} />
          <h2 className="text-2xl font-bold text-green-500">Anti-Bot Verification</h2>
        </div>
        <div className="mb-4">
          <div className="h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(loadingStep + 1) / steps.length * 100}%` }}
            ></div>
          </div>
        </div>
        <p className="text-white text-center">{steps[loadingStep]}</p>
      </div>
    </div>
  );
};

export default AntiBotLoading;