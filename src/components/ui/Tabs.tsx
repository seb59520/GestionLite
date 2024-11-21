import React from 'react';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  value: string;
  onChange: (value: string) => void;
}>({
  value: '',
  onChange: () => {},
});

export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className = '' }) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onChange: setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {children}
    </div>
  );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const { value: selectedValue, onChange } = React.useContext(TabsContext);
  const isSelected = value === selectedValue;

  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
        ${isSelected 
          ? 'bg-white text-blue-600 shadow-sm' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      onClick={() => onChange(value)}
    >
      {children}
    </button>
  );
};

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = '' }) => {
  const { value: selectedValue } = React.useContext(TabsContext);

  if (value !== selectedValue) return null;

  return <div className={className}>{children}</div>;
};