
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
import Specs from "./pages/Specs";
const Final = () => {


    return (
        <Router>
            <Routes>
                <Route
                    path="/"
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