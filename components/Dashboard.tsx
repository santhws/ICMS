import React, { useEffect, useState } from "react";
import Card from "./ui/Card";
import { getKpiData } from "../services/api";
import { KpiData } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const KpiCard: React.FC<{
  title: string;
  value: number;
  colorClass: string;
}> = ({ title, value, colorClass }) => {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
  return (
    <Card className={`flex flex-col justify-between ${colorClass} text-white`}>
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      <p className="text-3xl font-bold mt-2">{formattedValue}</p>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getKpiData();
        setKpiData(data);
        setError(null);
      } catch (err) {
        setError("Falha ao carregar os dados do dashboard.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Carregando...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  const getSaldoColor = (saldo: number) => {
    if (saldo > 0) return "bg-green-500";
    if (saldo < 0) return "bg-red-500";
    return "bg-gray-500";
  };

  const chartData = [
    {
      name: "Mês Atual",
      Vendas: kpiData?.totalVendas || 0,
      Despesas: kpiData?.totalDespesas || 0,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData && (
          <>
            <KpiCard
              title="Total de Vendas (mês)"
              value={kpiData.totalVendas}
              colorClass="bg-blue-500"
            />
            <KpiCard
              title="Total de Despesas (mês)"
              value={kpiData.totalDespesas}
              colorClass="bg-yellow-500"
            />
            <KpiCard
              title="Saldo Resultante"
              value={kpiData.saldo}
              colorClass={getSaldoColor(kpiData.saldo)}
            />
          </>
        )}
      </div>

      <Card title="Resumo Financeiro Mensal">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(128, 128, 128, 0.3)"
              />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value)
                }
              />
              <Legend />
              <Bar dataKey="Vendas" fill="#3b82f6" />
              <Bar dataKey="Despesas" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
