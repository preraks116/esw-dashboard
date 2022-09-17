import React, { useState, useEffect, startTransition } from "react";
import io from "socket.io-client";
import { logout } from "../firebase";
const TestingPage = () => {
    function onClickLogout()
    {
        logout();
        window.location.href = "/";
    }
    return (
        <div>
        <h1>Lmao</h1>
        <button onClick={onClickLogout}>logout</button>
        </div>
    );
    };

export default TestingPage;