import React, { useState, useEffect, startTransition } from "react";
import io from "socket.io-client";
const ErrorPage = () => {
    return (
        <div>
        <h1>Website Currently in use, Please Try Again Later</h1>
        </div>
    );
    };

export default ErrorPage;