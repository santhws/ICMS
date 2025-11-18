import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "", title }) => {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 ${className}`}
    >
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Card;
