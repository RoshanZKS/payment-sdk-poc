import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PaymentFormPage from './components/PaymentFormPage';
import DemoApp from './DemoApp';

// Check if we're in iframe mode or demo mode
const isIframeMode = window.location.hash.includes('payment');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {isIframeMode ? <PaymentFormPage /> : <DemoApp />}
  </React.StrictMode>
);
