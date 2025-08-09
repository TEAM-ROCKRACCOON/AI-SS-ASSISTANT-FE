// src/index.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

async function bootstrap() {

    if (import.meta.env.DEV) {
        const { worker } = await import("./mocks/browser");
        await worker.start({ onUnhandledRequest: "bypass" });
    }


    // root 보장
    let container = document.getElementById("root");
    if (!container) {
        container = document.createElement("div");
        container.id = "root";
        document.body.appendChild(container);
    }

    const root = createRoot(container);
    const queryClient = new QueryClient();

    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "dummy";

    root.render(
        <React.StrictMode>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <QueryClientProvider client={queryClient}>
                    <App />
                </QueryClientProvider>
            </GoogleOAuthProvider>
        </React.StrictMode>
    );
}

bootstrap();
