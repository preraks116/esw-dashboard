
import React, { useState, useEffect, startTransition } from "react";
import {
    BrowserRouter as Router,
    Switch,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import io from "socket.io-client";
import DashBoard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";
import TestingPage from "./pages/testingpage";
import Login from "./pages/Login"; // Written by Mavani
import Register from "./pages/Register";
import Reset from "./pages/Reset";
import Specs from "./pages/Specs";
const Final = () => {


    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/reset" element={<Reset />} />
                <Route
                    exact path="/dashboard"
                    element={
                        <DashBoard />
                    }
                >
                </Route>
                <Route path="/specs" element={<Specs />}></Route>
                <Route path="/error" element={<ErrorPage />}>
                </Route>
            </Routes>
        </Router>
    )
}

export default Final;