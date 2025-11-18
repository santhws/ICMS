# Integrated Commercial Management System (ICMS)

### Principais Funções:

1. Dashboard Interativo

   > Exibição de gráficos dinâmicos com indicadores de desempenho: total de vendas no mês, total de despesas e saldo resultante.</br>
   
   > Utilização de cores sinalizadoras para facilitar a análise rápida (positivo, neutro e crítico).

2. Monitoramento de Atividades Operacionais

   > Registro detalhado de movimentações de estoque (entrada e saída), incluindo valor da operação, fornecedor, data e horário.</br>
   
   > Histórico completo para auditoria e rastreabilidade.

3. Importação Automatizada de Planilhas Excel

   > Leitura e processamento automático de arquivos-padrão do sistema.</br>
   
   > Atualização de dados e execução de ações específicas conforme as informações importadas.

4. Módulo de Cadastro de Produtos

   > Inserção de novos itens com campos estruturados: tipo, quantidade, unidade de medida, data e horário de registro

5. Funcionalidade de Exclusão de Produtos

   > Remoção segura de itens do catálogo, com validações e registro de log.

6. Exportação de Arquivos Periódicos
   > Geração automática de relatórios mensais ou semanais, com opções de download e envio externo.

### Resumo do Backend

| Funcionalidade                              | Rota                       | Método | Status |
| ------------------------------------------- | -------------------------- | ------ | ------ |
| Listar Produtos (Read)                      | `/api/produtos`            | GET    | Pronto |
| Cadastro de Produtos (Create)               | `/api/produtos`            | POST   | Pronto |
| Exclusão/Atualização (Update/Delete Lógico) | `/api/produtos/:id`        | PUT    | Pronto |
| Leitura de Excel Automática (Importação)    | `/api/importar-estoque`    | POST   | Pronto |
| Exportação de Arquivos Periódicos           | `/api/exportar/financeiro` | GET    | Pronto |

---

### Detalhes dos Arquivos (Front-end)

1. Arquivos de Roteamento (Raiz)

   > `App.tsx`: Define as rotas usando o React Router (ex: Rota /dashboard renderiza o componente DashboardPage).
   
   > `index.tsx`: Ponto de entrada do React: é onde você chama ReactDOM.render(...) (ou createRoot) para renderizar <App /> dentro do HTML. Também pode configurar providers de contexto, roteamento, etc.
   
   > `types.ts`: Arquivo para declarar tipos / interfaces compartilhadas no projeto (tipos para dados da API, tipagem de modelos, etc).

2. Módulo Dashboard

   > `/components/DashboardPage.tsx`: Contém a lógica de busca de dados do Dashboard.
   
   > `/components/DataManagement.tsx`: Parte da UI onde você gerencia dados.
   
   > `/components/Products.tsx`: Componente ligado à parte de produtos: exibição, listagem, cadastro ou edição de produtos.
   
   > `/components/Sidebar.tsx`: Barra lateral (menu) para navegação entre diferentes páginas / seções da aplicação.
   
   > `/components/StockLog.tsx`: Componente para exibir log de estoque (“entradas / saídas”), histórico de movimentações, auditoria de estoque.

3. Módulo Produtos e Logs

   > `components/ui/Button.tsx`: Componente de botão reutilizável, com tipagem em TypeScript (por ser .tsx).
   
   > `components/ui/Card.tsx`: Cartão (“card”) de UI, usado para exibir informações agrupadas.
   
   > `/components/ui/Input.tsx`: Input de formulário, para digitar texto, números, ou outros dados.
   
   > `/components/ui/Modal.tsx`: (janela pop-up), usada para exibir formulários, alertas, confirmações ou formulários de edição.
