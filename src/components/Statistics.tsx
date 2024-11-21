import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useStands } from '../context/StandsContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';

const Statistics = () => {
  const { stands } = useStands();

  // Calculer les statistiques mensuelles
  const currentMonth = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const monthlyData = daysInMonth.map(date => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const reservedStands = stands.filter(stand => 
      stand.isReserved && 
      new Date(stand.reservedUntil!) >= date
    ).length;

    return {
      date: format(date, 'd MMM', { locale: fr }),
      reservations: reservedStands
    };
  });

  // Calculer les statistiques par catégorie
  const categoryStats = stands.reduce((acc, stand) => {
    const poster = stand.currentPoster;
    acc[poster] = (acc[poster] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryStats).map(([category, count]) => ({
    category,
    count
  }));

  return (
    <div className="space-y-8">
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Réservations du Mois
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reservations" fill="#3b82f6" name="Réservations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Distribution des Affiches
        </h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8b5cf6" name="Nombre de présentoirs" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Statistics;