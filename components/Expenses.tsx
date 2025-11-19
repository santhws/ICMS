import React, { useState, useEffect, useCallback } from "react";
import { Despesa, DespesaCreateData } from "../types";
import { getDespesas, cadastrarDespesa } from "../services/api";
import Card from "./ui/Card";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import Input from "./ui/Input";

const ExpenseForm: React.FC<{
  onSave: (data: DespesaCreateData) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({ motivo: "", valor: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.motivo.trim()) {
      newErrors.motivo = "O motivo é obrigatório.";
    }
    if (!formData.valor.trim()) {
      newErrors.valor = "O valor é obrigatório.";
    } else if (isNaN(Number(formData.valor)) || Number(formData.valor) <= 0) {
      newErrors.valor = "O valor deve ser um número positivo.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        motivo: formData.motivo.trim(),
        valor: parseFloat(formData.valor),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Motivo da Despesa"
        name="motivo"
        value={formData.motivo}
        onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
        error={errors.motivo}
      />
      <Input
        label="Valor (R$)"
        name="valor"
        type="number"
        step="0.01"
        value={formData.valor}
        onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
        error={errors.valor}
      />
      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Despesa</Button>
      </div>
    </form>
  );
};

const Expenses: React.FC = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDespesas = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDespesas();
      setDespesas(data);
    } catch (err) {
      setError("Falha ao carregar as despesas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDespesas();
  }, [fetchDespesas]);

  const handleSaveDespesa = async (data: DespesaCreateData) => {
    try {
      await cadastrarDespesa(data);
      setIsModalOpen(false);
      await fetchDespesas();
    } catch (err) {
      console.error("Failed to save expense", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gerenciamento de Despesas
        </h1>
        <Button onClick={() => setIsModalOpen(true)}>Adicionar Despesa</Button>
      </div>

      <Card>
        {loading && <p>Carregando despesas...</p>}
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
                    Motivo
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Valor
                  </th>
                </tr>
              </thead>
              <tbody>
                {despesas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-10 text-gray-500 dark:text-gray-400"
                    >
                      Nenhuma despesa registrada.
                    </td>
                  </tr>
                ) : (
                  despesas.map((despesa) => (
                    <tr
                      key={despesa.despesa_id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4">
                        {new Date(despesa.data).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {despesa.motivo}
                      </td>
                      <td className="px-6 py-4">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(despesa.valor)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Adicionar Nova Despesa"
      >
        <ExpenseForm
          onSave={handleSaveDespesa}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Expenses;
