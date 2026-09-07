// Configuration du routeur (react-router 7).
// Chaque page routée est enveloppée par un RouteRenderer (ErrorBoundary par route).
import { createBrowserRouter } from 'react-router'
import { App } from '@app/app'
import { RouteRenderer } from './route-renderer'
import { HomePage } from '@features/home'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: (
                    <RouteRenderer routeKey="home">
                        <HomePage />
                    </RouteRenderer>
                ),
            },
        ],
    },
])
