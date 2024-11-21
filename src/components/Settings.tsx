import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useStands } from '../context/StandsContext';
import { Poster, Publication } from '../types';
import { toast } from 'react-hot-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import { Image, Plus, Trash2, BookOpen, Settings as SettingsIcon, HelpCircle } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings } = useSettings();
  const { availablePosters, setAvailablePosters, publications, setPublications } = useStands();
  const [newPoster, setNewPoster] = useState<Omit<Poster, 'id'>>({
    name: '',
    description: '',
    imageUrl: '',
    category: '',
    isActive: true,
  });
  const [newPublication, setNewPublication] = useState<Omit<Publication, 'id'>>({
    title: '',
    description: '',
    imageUrl: '',
    category: '',
    isActive: true,
    minStock: 10,
  });
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    toast.success('Paramètres mis à jour avec succès');
  };

  const handleAddPoster = (e: React.FormEvent) => {
    e.preventDefault();
    const poster: Poster = {
      ...newPoster,
      id: crypto.randomUUID(),
    };
    setAvailablePosters([...availablePosters, poster]);
    setNewPoster({
      name: '',
      description: '',
      imageUrl: '',
      category: '',
      isActive: true,
    });
    toast.success('Affiche ajoutée avec succès');
  };

  const handleDeletePoster = (id: string) => {
    setAvailablePosters(availablePosters.filter(poster => poster.id !== id));
    toast.success('Affiche supprimée');
  };

  const handleAddPublication = (e: React.FormEvent) => {
    e.preventDefault();
    const publication: Publication = {
      ...newPublication,
      id: crypto.randomUUID(),
    };
    setPublications([...publications, publication]);
    setNewPublication({
      title: '',
      description: '',
      imageUrl: '',
      category: '',
      isActive: true,
      minStock: 10,
    });
    toast.success('Publication ajoutée avec succès');
  };

  const handleDeletePublication = (id: string) => {
    setPublications(publications.filter(pub => pub.id !== id));
    toast.success('Publication supprimée');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="general">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Général
          </TabsTrigger>
          <TabsTrigger value="posters">
            <Image className="h-4 w-4 mr-2" />
            Gestion des Affiches
          </TabsTrigger>
          <TabsTrigger value="publications">
            <BookOpen className="h-4 w-4 mr-2" />
            Gestion des Publications
          </TabsTrigger>
          <TabsTrigger value="help">
            <HelpCircle className="h-4 w-4 mr-2" />
            Aide
          </TabsTrigger>
        </TabsList>

        {/* Onglet Général */}
        <TabsContent value="general" className="mt-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <SettingsIcon className="h-6 w-6" />
              Paramètres Généraux
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de base des présentoirs
                </label>
                <input
                  type="url"
                  className="input"
                  value={localSettings.baseUrl}
                  onChange={(e) => setLocalSettings({
                    ...localSettings,
                    baseUrl: e.target.value
                  })}
                  placeholder="https://example.com/stand/"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Cette URL sera utilisée pour générer les QR codes des présentoirs
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée maximale de réservation (jours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="90"
                    className="input"
                    value={localSettings.maxReservationDays}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      maxReservationDays: parseInt(e.target.value)
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Délai minimum avant réservation (heures)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="72"
                    className="input"
                    value={localSettings.minAdvanceHours}
                    onChange={(e) => setLocalSettings({
                      ...localSettings,
                      minAdvanceHours: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      checked={localSettings.emailNotifications.newReservation}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        emailNotifications: {
                          ...localSettings.emailNotifications,
                          newReservation: e.target.checked
                        }
                      })}
                    />
                    <span className="ml-2">Nouvelles réservations</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      checked={localSettings.emailNotifications.posterRequest}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        emailNotifications: {
                          ...localSettings.emailNotifications,
                          posterRequest: e.target.checked
                        }
                      })}
                    />
                    <span className="ml-2">Demandes de changement d'affiche</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  Enregistrer les paramètres
                </button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* Onglet Gestion des Affiches */}
        <TabsContent value="posters" className="mt-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Image className="h-6 w-6" />
              Gestion des Affiches
            </h2>

            <form onSubmit={handleAddPoster} className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'affiche
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newPoster.name}
                    onChange={(e) => setNewPoster({ ...newPoster, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newPoster.category}
                    onChange={(e) => setNewPoster({ ...newPoster, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="input"
                  value={newPoster.description}
                  onChange={(e) => setNewPoster({ ...newPoster, description: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de l'image
                </label>
                <input
                  type="url"
                  className="input"
                  value={newPoster.imageUrl}
                  onChange={(e) => setNewPoster({ ...newPoster, imageUrl: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter l'affiche
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Affiches disponibles</h3>
              <div className="grid grid-cols-1 gap-4">
                {availablePosters.map((poster) => (
                  <div key={poster.id} className="card p-4 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={poster.imageUrl}
                          alt={poster.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{poster.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">{poster.description}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {poster.category}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePoster(poster.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Gestion des Publications */}
        <TabsContent value="publications" className="mt-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Gestion des Publications
            </h2>

            <form onSubmit={handleAddPublication} className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titre de la publication
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newPublication.title}
                    onChange={(e) => setNewPublication({ ...newPublication, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={newPublication.category}
                    onChange={(e) => setNewPublication({ ...newPublication, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="input"
                  value={newPublication.description}
                  onChange={(e) => setNewPublication({ ...newPublication, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL de l'image
                  </label>
                  <input
                    type="url"
                    className="input"
                    value={newPublication.imageUrl}
                    onChange={(e) => setNewPublication({ ...newPublication, imageUrl: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock minimal
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input"
                    value={newPublication.minStock}
                    onChange={(e) => setNewPublication({
                      ...newPublication,
                      minStock: parseInt(e.target.value)
                    })}
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter la publication
                </button>
              </div>
            </form>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Publications disponibles</h3>
              <div className="grid grid-cols-1 gap-4">
                {publications.map((publication) => (
                  <div key={publication.id} className="card p-4 flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={publication.imageUrl}
                          alt={publication.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{publication.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{publication.description}</p>
                        <div className="mt-2 flex items-center gap-3">
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                            {publication.category}
                          </span>
                          <span className="text-sm text-gray-600">
                            Stock min: {publication.minStock}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePublication(publication.id)}
                      className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Aide */}
        <TabsContent value="help" className="mt-6">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="h-6 w-6" />
              Aide
            </h2>

            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Comment réserver un présentoir ?
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Chaque présentoir est équipé d'un QR code unique. En le scannant, vous accédez à une page de réservation comme celle-ci :
                  </p>
                  <div className="rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1554178286-db96c387ce84?w=800&q=80"
                      alt="Page de réservation"
                      className="w-full"
                    />
                    <div className="p-4 bg-gray-50">
                      <p className="text-sm text-gray-600">
                        Interface de réservation accessible via QR code
                      </p>
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Processus de réservation :</h4>
                    <ol className="list-decimal list-inside space-y-2 text-blue-800">
                      <li>Scannez le QR code du présentoir</li>
                      <li>Remplissez le formulaire avec votre nom</li>
                      <li>Sélectionnez les dates de début et de fin</li>
                      <li>Confirmez la réservation</li>
                    </ol>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Gestion des publications
                </h3>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Pour chaque publication, vous pouvez :
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Définir un seuil minimal de stock</li>
                    <li>Suivre le stock en temps réel</li>
                    <li>Recevoir des alertes quand le stock est bas</li>
                    <li>Gérer les demandes de réapprovisionnement</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;