// frontend/src/components/layout/Layout.tsx

import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar"; // Importa a Sidebar

const Layout: React.FC = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* A barra lateral será fixa */}
      <Sidebar />

      {/* O conteúdo da página (Outlet) é onde os componentes de rota serão renderizados */}
      <main style={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
