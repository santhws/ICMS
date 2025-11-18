// frontend/src/components/layout/Sidebar.tsx

import React from "react";
import { Link } from "react-router-dom"; // Usar Link para navegar

const Sidebar: React.FC = () => {
  return (
    <aside
      style={{
        width: "250px",
        backgroundColor: "#333",
        color: "white",
        padding: "20px",
      }}
    >
      <h3>ICMS</h3>
      <hr style={{ borderColor: "#666" }} />
      <nav>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li>
            <Link to="/dashboard" style={{ color: "white" }}>
              🏠 Dashboard
            </Link>
          </li>
          <li>
            <Link to="/produtos" style={{ color: "white" }}>
              📦 Produtos & Estoque
            </Link>
          </li>
          <li>
            <Link to="/logs" style={{ color: "white" }}>
              ⏳ Logs de Atividade
            </Link>
          </li>
          <li>
            <Link to="/relatorios" style={{ color: "white" }}>
              📊 Relatórios (Excel)
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
