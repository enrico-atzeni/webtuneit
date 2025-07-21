import { createBrowserRouter, Navigate } from "react-router-dom";
import BassTuner from "./pages/BassTuner"
import ElectricGuitarTuner from "./pages/ElectricGuitarTuner";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/electric-guitar"></Navigate>
    },
    {
        path: "/bass",
        element: <BassTuner></BassTuner>
    },
    {
        path: "/electric-guitar",
        element: <ElectricGuitarTuner></ElectricGuitarTuner>
    },
])

export default router