import React from 'react';
import { useParams } from 'react-router-dom';
import { useStands } from '../context/StandsContext';
import ReservationModal from './ReservationModal';
import PosterRequestModal from './PosterRequestModal';
import { MapPin, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PublicStandView = () => {
  const { id } = useParams();
  const { stands, availablePosters } = useStands();
  const [showReservationModal, setShowReservationModal] = React.useState(false);
  const [showPosterRequestModal, setShowPosterRequestModal] = React.useState(false);

  const stand = stands.find(s => s.id === id);

  if (!stand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Présentoir non trouvé
          </h2>
          <p className="mt-2 text-gray-600">
            Le présentoir que vous recherchez n'existe pas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="card p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {stand.name}
          </h1>

          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{stand.location}</span>
            </div>

            {stand.isReserved && (
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-2" />
                  <span>Réservé par: {stand.reservedBy}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    Jusqu'au: {format(new Date(stand.reservedUntil!), 'PPP', { locale: fr })}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-4">
              {!stand.isReserved ? (
                <button
                  onClick={() => setShowReservationModal(true)}
                  className="btn btn-primary w-full"
                >
                  Réserver ce présentoir
                </button>
              ) : (
                <button
                  onClick={() => setShowPosterRequestModal(true)}
                  className="btn btn-primary w-full"
                >
                  Demander un changement d'affiche
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReservationModal && (
        <ReservationModal
          stand={stand}
          isOpen={showReservationModal}
          onClose={() => setShowReservationModal(false)}
          onReserve={() => {}}
        />
      )}

      {showPosterRequestModal && (
        <PosterRequestModal
          stand={stand}
          isOpen={showPosterRequestModal}
          onClose={() => setShowPosterRequestModal(false)}
          onSubmit={() => {}}
          availablePosters={availablePosters}
        />
      )}
    </div>
  );
};

export default PublicStandView;