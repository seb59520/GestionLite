import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, Settings as SettingsIcon } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: LayoutDashboard },
    { name: 'Statistiques', href: '/statistics', icon: BarChart2 },
    { name: 'Paramètres', href: '/settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  Gestion des Présentoirs
                </h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                        isActive
                          ? 'text-blue-600 border-b-2 border-blue-500'
                          : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;