import React, { useState, useEffect, useCallback } from "react";
import { LogEstoque } from "../types";
import { getLogsEstoque } from "../services/api";
import Card from "./ui/Card";

const StockLog: React.FC = () => {
  const [logs, setLogs] = useState<LogEstoque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLogsEstoque();
      setLogs(data);
      setError(null);
    } catch (err) {
      setError("Falha ao carregar o histórico de estoque.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getMovementTypeClass = (type: "ENTRADA" | "SAIDA") => {
    return type === "ENTRADA"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Histórico de Movimentação de Estoque
      </h1>

      <Card>
        {loading && <p>Carregando histórico...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Data
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Produto
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tipo Movimento
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantidade
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Motivo
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.log_id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">
                      {new Date(log.data_movimento).toLocaleString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {log.nome_produto}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getMovementTypeClass(
                          log.tipo_movimento
                        )}`}
                      >
                        {log.tipo_movimento}
                      </span>
                    </td>
                    <td className="px-6 py-4">{log.quantidade}</td>
                    <td className="px-6 py-4">{log.motivo}</td>
                    <td className="px-6 py-4">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(log.valor_operacao)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default StockLog;
