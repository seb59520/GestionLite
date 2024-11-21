import React from 'react';
import { LayoutDashboard, Users, Calendar, AlertCircle, BookOpen } from 'lucide-react';
import { useStands } from '../context/StandsContext';
import StandList from './StandList';
import StatCard from './StatCard';
import PosterRequestList from './PosterRequestList';
import { ReservationFormData } from '../types';
import { toast } from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const { stands, setStands, availablePosters, publications = [] } = useStands();

  const handleReserve = (standId: string, data: ReservationFormData) => {
    setStands(prevStands => 
      prevStands.map(stand => 
        stand.id === standId
          ? {
              ...stand,
              isReserved: true,
              reservedBy: data.name,
              reservedUntil: data.endDate,
              lastUpdated: new Date()
            }
          : stand
      )
    );
    toast.success('Réservation effectuée avec succès');
  };

  const handleCancelReservation = (standId: string) => {
    setStands(prevStands =>
      prevStands.map(stand =>
        stand.id === standId
          ? {
              ...stand,
              isReserved: false,
              reservedBy: undefined,
              reservedUntil: undefined,
              lastUpdated: new Date()
            }
          : stand
      )
    );
    toast.success('Réservation annulée');
  };

  const handlePosterRequest = (standId: string, requestedPoster: string, notes: string) => {
    setStands(prevStands =>
      prevStands.map(stand =>
        stand.id === standId
          ? {
              ...stand,
              posterRequests: [
                ...(stand.posterRequests || []),
                {
                  id: crypto.randomUUID(),
                  standId,
                  requestedBy: stand.reservedBy!,
                  requestedPoster,
                  requestDate: new Date(),
                  status: 'pending',
                  notes
                }
              ]
            }
          : stand
      )
    );
    toast.success('Demande de changement d\'affiche envoyée');
  };

  const handleUpdateStock = (standId: string, publicationId: string, quantity: number) => {
    setStands(prevStands =>
      prevStands.map(stand =>
        stand.id === standId
          ? {
              ...stand,
              publications: (stand.publications || []).map(pub =>
                pub.publicationId === publicationId
                  ? { ...pub, quantity, lastUpdated: new Date() }
                  : pub
              )
            }
          : stand
      )
    );
  };

  const handleApprovePosterRequest = (requestId: string) => {
    setStands(prevStands =>
      prevStands.map(stand => ({
        ...stand,
        posterRequests: (stand.posterRequests || []).map(request =>
          request.id === requestId
            ? { ...request, status: 'approved' }
            : request
        ),
        currentPoster: stand.posterRequests?.find(r => r.id === requestId)?.requestedPoster || stand.currentPoster
      }))
    );
    toast.success('Demande approuvée');
  };

  const handleRejectPosterRequest = (requestId: string) => {
    setStands(prevStands =>
      prevStands.map(stand => ({
        ...stand,
        posterRequests: (stand.posterRequests || []).map(request =>
          request.id === requestId
            ? { ...request, status: 'rejected' }
            : request
        )
      }))
    );
    toast.error('Demande rejetée');
  };

  const stats = {
    total: stands.length,
    reserved: stands.filter(stand => stand.isReserved).length,
    available: stands.filter(stand => !stand.isReserved).length,
    lowStock: stands.filter(stand => 
      (stand.publications || []).some(pub => {
        const publication = publications.find(p => p.id === pub.publicationId);
        return publication && pub.quantity < publication.minStock;
      })
    ).length
  };

  const allPosterRequests = stands.flatMap(stand => 
    (stand.posterRequests || []).map(request => ({
      ...request,
      standName: stand.name
    }))
  ).sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Tableau de Bord
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Gestion des présentoirs mobiles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            title="Total Présentoirs"
            value={stats.total}
            icon={<LayoutDashboard className="h-6 w-6" />}
            color="from-blue-500 to-blue-600"
          />
          <StatCard 
            title="Présentoirs Réservés"
            value={stats.reserved}
            icon={<Users className="h-6 w-6" />}
            color="from-green-500 to-green-600"
          />
          <StatCard 
            title="Présentoirs Disponibles"
            value={stats.available}
            icon={<Calendar className="h-6 w-6" />}
            color="from-purple-500 to-purple-600"
          />
          <StatCard 
            title="Stock Bas"
            value={stats.lowStock}
            icon={<BookOpen className="h-6 w-6" />}
            color="from-yellow-500 to-yellow-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StandList 
              stands={stands}
              onReserve={handleReserve}
              onCancelReservation={handleCancelReservation}
              onPosterRequest={handlePosterRequest}
              onUpdateStock={handleUpdateStock}
              availablePosters={availablePosters}
              publications={publications}
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900">
                  Demandes de Changement d'Affiche
                </h2>
              </div>
              <div className="p-6">
                <PosterRequestList
                  requests={allPosterRequests}
                  onApprove={handleApprovePosterRequest}
                  onReject={handleRejectPosterRequest}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;