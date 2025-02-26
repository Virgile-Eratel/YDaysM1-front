import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import App from './App.tsx';
import Home from './Home.tsx';
import './index.css';

const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div className='min-h-screen min-w-screen'>
        <RouterProvider router={router} />
        </div>
    </StrictMode>
)
