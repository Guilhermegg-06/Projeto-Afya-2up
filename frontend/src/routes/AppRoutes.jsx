import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import StudentDashboard from "../pages/StudentDashboard";
import CoordinatorDashboard from "../pages/CoordenadorDashboard";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import MyRegistrations from "../pages/MyRegistrations";
import AttendanceValidation from "../pages/AttendanceValidation";
import MyCertificates from "../pages/MyCertificates";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/cadastro" element={<Register />} />
                <Route path="/aluno" element={<StudentDashboard />} />
                <Route path="/coordenador" element={<CoordinatorDashboard />} />
                <Route path="/eventos" element={<Events />} />
                <Route path="/eventos/:id" element={<EventDetails />} />
                <Route path="/minhas-inscricoes" element={<MyRegistrations />} />
                <Route path="/validar-presenca" element={<AttendanceValidation />} />
                <Route path="/meus-certificados" element={<MyCertificates />} />
            </Routes>
        </BrowserRouter>
    );
}
