import { createBrowserRouter, Navigate } from "react-router-dom";
import BassTuner from "./pages/BassTuner"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/bass"></Navigate>
    },
    {
        path: "/bass",
        element: <BassTuner></BassTuner>
    },
])

export default router