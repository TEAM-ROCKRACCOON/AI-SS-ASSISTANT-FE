// src/test/utils.tsx
import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function withClient() {
    const qc = new QueryClient();
    const wrapper = ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    );
    return { qc, wrapper };
}
