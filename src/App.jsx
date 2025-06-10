import React, { useEffect } from "react";
import { Router } from "./router";
import { Layout } from "./components";
import { LoadingPage } from "./pages";
import { BrowserRouter } from "react-router-dom";
import { useWebAppStore } from "./store";

export default function App() {
  const { loading, error, init } = useWebAppStore();

  useEffect(() => {
    init();
  }, [init]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <p>Ошибка: {error}</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Layout className="flex flex-col items-center justify-start p-4">
        <Router />
      </Layout>
    </BrowserRouter>
  );
}
