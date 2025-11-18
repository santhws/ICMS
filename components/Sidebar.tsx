import React, { useState } from "react";
import { View } from "../App";

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

interface NavItemProps {
  view: View;
  label: string;
  // FIX: Changed JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'".
  icon: React.ReactNode;
  currentView: View;
  onClick: (view: View) => void;
  isCollapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  view,
  label,
  icon,
  currentView,
  onClick,
  isCollapsed,
}) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick(view);
      }}
      className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
        currentView === view
          ? "bg-blue-600 text-white"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
      <span
        className={`ml-3 transition-opacity duration-200 ${
          isCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        {label}
      </span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700 h-16">
        <h1
          className={`text-2xl font-bold text-gray-800 dark:text-white transition-opacity duration-200 ${
            isCollapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          ICMS
        </h1>
      </div>
      <nav className="p-4">
        <ul>
          <NavItem
            view="dashboard"
            label="Dashboard"
            icon={<DashboardIcon />}
            currentView={currentView}
            onClick={setCurrentView}
            isCollapsed={isCollapsed}
          />
          <NavItem
            view="products"
            label="Produtos"
            icon={<ProductsIcon />}
            currentView={currentView}
            onClick={setCurrentView}
            isCollapsed={isCollapsed}
          />
          <NavItem
            view="stock"
            label="Estoque"
            icon={<StockIcon />}
            currentView={currentView}
            onClick={setCurrentView}
            isCollapsed={isCollapsed}
          />
          <NavItem
            view="data"
            label="Import/Export"
            icon={<DataIcon />}
            currentView={currentView}
            onClick={setCurrentView}
            isCollapsed={isCollapsed}
          />
        </ul>
      </nav>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-16 bg-blue-600 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </button>
    </aside>
  );
};

// --- SVG Icons ---
const DashboardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);
const ProductsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);
const StockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 7v10m16-10v10M4 7h16M4 17h16M10 7v10m4-10v10"
    />
  </svg>
);
const DataIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);
const ChevronLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);
const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

export default Sidebar;
