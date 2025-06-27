import React, { useState } from 'react';
import HomePage from './HomePage';
import TestPage from './TestPage';

type AppView = 'home' | 'test';

const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');

  const handleRunTest = () => {
    setCurrentView('test');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen">
      {currentView === 'home' && (
        <HomePage onRunTest={handleRunTest} />
      )}
      {currentView === 'test' && (
        <TestPage onBack={handleBackToHome} />
      )}
    </div>
  );
};

export default AppLayout;