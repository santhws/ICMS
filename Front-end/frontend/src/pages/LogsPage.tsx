// frontend/src/pages/LogsPage.tsx

import React, { useEffect, useState } from "react";
import { LogEstoque, getLogsEstoque } from "../api/logs"; // Ajuste o caminho conforme sua estrutura
import "./LogsPage.css"; // Estilização opcional

const LogsPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efeito para carregar os logs quando o componente for montado
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const logsData = await getLogsEstoque();
        setLogs(logsData);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Erro ao carregar os dados de log.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // 💡 Renderização Condicional
  if (loading) return <p>Carregando histórico de movimentação...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;
  if (logs.length === 0)
    return <p>Nenhuma movimentação de estoque registrada.</p>;

  return (
    <div className="logs-page">
      <h2>Histórico de Logs de Estoque ({logs.length} Movimentos)</h2>
      <p>Detalhes de todas as entradas e saídas de produtos no sistema.</p>

      {/* Tabela de Logs */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4" }}>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              ID Log
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Data
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Produto
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "center",
                borderBottom: "2px solid #ddd",
              }}
            >
              Tipo
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "center",
                borderBottom: "2px solid #ddd",
              }}
            >
              Quantidade
            </th>
            <th
              style={{
                padding: "10px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
              }}
            >
              Motivo
            </th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.log_id}>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {log.log_id}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {new Date(log.data_movimento).toLocaleString()}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {log.nome_produto}
              </td>

              {/* Cor de destaque para o tipo de movimento */}
              <td
                style={{
                  padding: "10px",
                  textAlign: "center",
                  borderBottom: "1px solid #eee",
                  fontWeight: "bold",
                  color: log.tipo_movimento === "ENTRADA" ? "green" : "red",
                }}
              >
                {log.tipo_movimento}
              </td>

              <td
                style={{
                  padding: "10px",
                  textAlign: "center",
                  borderBottom: "1px solid #eee",
                }}
              >
                {log.quantidade}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {log.motivo}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogsPage;
