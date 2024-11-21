import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DisplayStand, ReservationFormData, Poster, Publication } from '../types';
import { Image, MapPin, Clock, User, FileText, AlertTriangle, BookOpen } from 'lucide-react';
import ReservationModal from './ReservationModal';
import PosterRequestModal from './PosterRequestModal';
import PublicationStockModal from './PublicationStockModal';
import { toast } from 'react-hot-toast';

interface StandListProps {
  stands: DisplayStand[];
  onReserve: (standId: string, data: ReservationFormData) => void;
  onCancelReservation: (standId: string) => void;
  onPosterRequest: (standId: string, requestedPoster: string, notes: string) => void;
  onUpdateStock: (standId: string, publicationId: string, quantity: number) => void;
  availablePosters: Poster[];
  publications: Publication[];
}

const StandList: React.FC<StandListProps> = ({
  stands,
  onReserve,
  onCancelReservation,
  onPosterRequest,
  onUpdateStock,
  availablePosters,
  publications = []
}) => {
  const [selectedStand, setSelectedStand] = useState<DisplayStand | null>(null);
  const [posterRequestStand, setPosterRequestStand] = useState<DisplayStand | null>(null);
  const [stockModalStand, setStockModalStand] = useState<DisplayStand | null>(null);

  const checkLowStock = (stand: DisplayStand) => {
    return (stand.publications || []).some(pub => {
      const publication = publications.find(p => p.id === pub.publicationId);
      return publication && pub.quantity < publication.minStock;
    });
  };

  return (
    <>
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Liste des Présentoirs</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {stands.map((stand) => {
            const hasLowStock = checkLowStock(stand);
            
            return (
              <div key={stand.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">{stand.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        stand.isReserved 
                          ? 'bg-red-100/80 text-red-700 ring-1 ring-red-600/10' 
                          : 'bg-green-100/80 text-green-700 ring-1 ring-green-600/10'
                      }`}>
                        {stand.isReserved ? 'Réservé' : 'Disponible'}
                      </span>
                      {hasLowStock && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100/80 text-yellow-700 ring-1 ring-yellow-600/10 flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4" />
                          Stock bas
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{stand.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <FileText className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Affiche actuelle: {stand.currentPoster}</span>
                      </div>
                      
                      {stand.isReserved && (
                        <>
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Réservé par: {stand.reservedBy}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Jusqu'au: {format(new Date(stand.reservedUntil!), 'PPP', { locale: fr })}</span>
                          </div>
                        </>
                      )}

                      <div className="mt-6 flex gap-3">
                        {stand.isReserved ? (
                          <>
                            <button
                              onClick={() => onCancelReservation(stand.id)}
                              className="btn btn-secondary"
                            >
                              Annuler la réservation
                            </button>
                            <button
                              onClick={() => setPosterRequestStand(stand)}
                              className="btn btn-primary"
                            >
                              Demander un changement d'affiche
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => setSelectedStand(stand)}
                            className="btn btn-primary"
                          >
                            Réserver
                          </button>
                        )}
                        <button
                          onClick={() => setStockModalStand(stand)}
                          className="btn btn-secondary inline-flex items-center"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          Gérer le stock
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                    <QRCodeSVG
                      value={`https://presentoirs.example.com/reserve/${stand.id}`}
                      size={96}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedStand && (
        <ReservationModal
          stand={selectedStand}
          isOpen={true}
          onClose={() => setSelectedStand(null)}
          onReserve={onReserve}
        />
      )}

      {posterRequestStand && (
        <PosterRequestModal
          stand={posterRequestStand}
          isOpen={true}
          onClose={() => setPosterRequestStand(null)}
          onSubmit={onPosterRequest}
          availablePosters={availablePosters}
        />
      )}

      {stockModalStand && (
        <PublicationStockModal
          stand={stockModalStand}
          isOpen={true}
          onClose={() => setStockModalStand(null)}
          onUpdateStock={onUpdateStock}
          publications={publications}
        />
      )}
    </>
  );
};

export default StandList;