import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import StockLog from "./components/StockLog";
import DataManagement from "./components/DataManagement";
import Expenses from "./components/Expenses"; // Import the new component

export type View = "dashboard" | "products" | "stock" | "data" | "expenses";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "stock":
        return <StockLog />;
      case "data":
        return <DataManagement />;
      case "expenses":
        return <Expenses />; // Add the new case
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
