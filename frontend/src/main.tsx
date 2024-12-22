import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import RouterComponent from './RouterComponent';
import './index.css'
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import App from './PaymentServer';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterComponent />
    </StrictMode>
);