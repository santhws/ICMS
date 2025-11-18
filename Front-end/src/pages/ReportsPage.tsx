// frontend/src/pages/ReportsPage.tsx

import React from "react";
import ImportSection from "../components/sections/ImportSection";
import ExportSection from "../components/sections/ExportSection";

const ReportsPage: React.FC = () => {
  return (
    <div className="reports-page">
      <h2>Gerenciamento de Relatórios e Dados</h2>
      <p>
        Utilize esta página para importar dados de estoque via arquivo Excel ou
        para gerar relatórios financeiros periódicos.
      </p>

      {/* Seção de Importação */}
      <div
        style={{
          margin: "30px 0",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <h3>📥 Importação de Estoque (Excel)</h3>
        <ImportSection />
      </div>

      {/* Seção de Exportação */}
      <div
        style={{
          margin: "30px 0",
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "5px",
        }}
      >
        <h3>📤 Exportação de Relatório Financeiro</h3>
        <ExportSection />
      </div>
    </div>
  );
};

export default ReportsPage;
