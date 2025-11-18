// frontend/src/components/charts/SalesChart.tsx

import React from "react";
import { Bar } from "react-chartjs-2";
// É preciso registrar os elementos do Chart.js que você usará
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registra os componentes necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Interface para os dados do gráfico (vindos do Backend)
interface ChartDataItem {
  dia: string; // Ex: '2025-11-01'
  vendas_dia: string; // Valor da venda naquele dia
}

interface SalesChartProps {
  data: ChartDataItem[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  // 1. Prepara os Dados no formato que o Chart.js entende
  const chartData = {
    labels: data.map((item) =>
      new Date(item.dia).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
    ),
    datasets: [
      {
        label: "Vendas Diárias (R$)",
        data: data.map((item) => parseFloat(item.vendas_dia)),
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Azul
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 2. Opções de Configuração Visual do Gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Volume de Vendas Diárias",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Valor (R$)",
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
