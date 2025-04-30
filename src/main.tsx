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
import UserReservations from './Reservation/UserReservations.tsx';
import ReservationSuccess from './Reservation/ReservationSuccess.tsx';
import ReservationError from './Reservation/ReservationError.tsx';
import OwnerReservations from './Owner/OwnerReservations.tsx';
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
            {
                path: "reservations",
                element: (
                    <ProtectedRoute>
                        <UserReservations />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reservation-success/:id",
                element: (
                    <ProtectedRoute>
                        <ReservationSuccess />
                    </ProtectedRoute>
                ),
            },
            {
                path: "reservation-error/:id",
                element: (
                    <ProtectedRoute>
                        <ReservationError />
                    </ProtectedRoute>
                ),
            },
            {
                path: "owner/reservations",
                element: (
                    <RoleProtectedRoute requiredRole="owner">
                        <OwnerReservations />
                    </RoleProtectedRoute>
                ),
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