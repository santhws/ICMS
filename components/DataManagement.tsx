import React, { useState, useRef } from "react";
import Card from "./ui/Card";
import Button from "./ui/Button";

const DataManagement: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  const handleImportClick = () => {
    // Here you would add logic to process the file
    if (!fileName) {
      alert("Por favor, selecione um arquivo para importar.");
      return;
    }
    alert(
      `Iniciando importação do arquivo: ${fileName}.\n(Funcionalidade de exemplo)`
    );
    // Reset file input
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleExportClick = () => {
    alert(
      "Iniciando a geração de relatórios para exportação.\n(Funcionalidade de exemplo)"
    );
    // Logic to generate and download a file would go here
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Importação e Exportação de Dados
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card title="Importar Planilha de Produtos">
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Selecione um arquivo Excel (.xlsx, .xls) ou CSV (.csv) para
              atualizar o estoque ou cadastrar novos produtos em massa.
            </p>
            <div>
              <label className="w-full flex items-center px-4 py-2 bg-white dark:bg-gray-700 text-blue-500 rounded-lg shadow-lg tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3V9h2v2z" />
                </svg>
                <span className="text-base leading-normal">
                  {fileName || "Selecionar um arquivo"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls, .csv"
                />
              </label>
            </div>
            <Button onClick={handleImportClick} disabled={!fileName}>
              Processar Importação
            </Button>
          </div>
        </Card>

        <Card title="Exportar Relatórios Periódicos">
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Gere e baixe relatórios de vendas, estoque ou despesas em formato
              CSV.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleExportClick}
                variant="success"
                className="w-full sm:w-auto"
              >
                Exportar Relatório Mensal
              </Button>
              <Button
                onClick={handleExportClick}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Exportar Relatório Semanal
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DataManagement;
