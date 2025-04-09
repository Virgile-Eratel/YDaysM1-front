import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './Home.tsx';
import Place from "./Place/Place.tsx";
import Layout from "./Layout.tsx";
import App from './App.tsx';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleProtectedRoute } from './RoleProtectedRoute';
import CreatePlaceForm from './Place/CreatePlaceForm.tsx';
import './index.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: (
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                ),
            },
            {
                path: "home",
                element: (
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                ),
            },
            {
                path: "place/:id",
                element: (
                    <ProtectedRoute>
                        <Place />
                    </ProtectedRoute>
                ),
            },
            {
                path: "create-place",
                element: (
                    <RoleProtectedRoute requiredRole="owner">
                        <CreatePlaceForm />
                    </RoleProtectedRoute>
                ),
            },
            {
                path: "login",
                element: <App />,
            },
        ],
    },
]);

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <div className='h-screen w-screen'>
            <RouterProvider router={router} />
        </div>
    </StrictMode>
);