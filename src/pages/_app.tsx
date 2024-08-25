import "@/styles/globals.css";

import { ThemeProvider } from "next-themes";

import { useSocket } from "@/hooks/useSocket";

import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  useSocket();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      // storageKey="acme-theme"
    >
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
