import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Components/login/Login";
import Layanan from "./Components/admin/Layanan";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/services" element={<Layanan />} />
             </Routes>
        </BrowserRouter>
    );
}

export default App;