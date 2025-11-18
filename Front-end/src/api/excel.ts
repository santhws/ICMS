// frontend/src/components/sections/ExportSection.tsx

import React, { useState } from "react";
import { exportarRelatorio } from "../../api/excel";

const ExportSection: React.FC = () => {
  // Definir o ano e mês atuais como valores padrão
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [ano, setAno] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: string } | null>(
    null
  );

  const handleExport = async () => {
    setLoading(true);
    setMessage(null);

    try {
      await exportarRelatorio(mes, ano);
      setMessage({
        text: `Relatório de ${mes}/${ano} gerado e download iniciado.`,
        type: "success",
      });
    } catch (error) {
      setMessage({
        text: "Falha ao exportar relatório. Verifique se há dados para o período.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Gera opções para os últimos 12 meses
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  // Gera opções de ano
  const anos = [new Date().getFullYear(), new Date().getFullYear() - 1];

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-end" }}>
      <div>
        <label>Mês:</label>
        <select
          value={mes}
          onChange={(e) => setMes(parseInt(e.target.value))}
          style={{ padding: "8px" }}
        >
          {meses.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Ano:</label>
        <select
          value={ano}
          onChange={(e) => setAno(parseInt(e.target.value))}
          style={{ padding: "8px" }}
        >
          {anos.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleExport}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#ccc" : "darkgreen",
          color: "white",
          padding: "10px 15px",
        }}
      >
        {loading ? "Gerando Arquivo..." : "Exportar Relatório"}
      </button>

      {message && (
        <p
          style={{
            color: message.type === "success" ? "green" : "red",
            marginTop: "10px",
          }}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default ExportSection;
