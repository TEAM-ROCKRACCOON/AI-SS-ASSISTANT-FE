import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { worker } from "./mocks/browser";

async function bootstrap() {
    const useMock = String(import.meta.env.VITE_USE_MOCK) === "true";

    if (useMock) {
        const { startMock } = await import("./mocks/startMock");
        await startMock();
    }

    let container = document.getElementById("root");
    if (!container) {
        container = document.createElement("div");
        container.id = "root";
        document.body.appendChild(container);
    }

    const root = createRoot(container);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                staleTime: 30_000,
                refetchOnWindowFocus: false,
            },
        },
    });

    const { default: App } = await import("./App");
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

bootstrap().catch((e) => {
    console.error("bootstrap failed:", e);
});
