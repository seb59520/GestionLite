import React, { createContext, useContext, useState, useEffect } from 'react';
import { DisplayStand, Poster, Publication } from '../types';
import { loadStands, saveStands } from '../utils/storage';

// Initial publications data
const initialPublications: Publication[] = [
  {
    id: '1',
    title: 'Guide Visiteur',
    description: 'Guide complet pour les visiteurs',
    imageUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14',
    category: 'Guides',
    isActive: true,
    minStock: 10
  },
  {
    id: '2',
    title: 'Programme Mensuel',
    description: 'Programme des activités du mois',
    imageUrl: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335',
    category: 'Programmes',
    isActive: true,
    minStock: 15
  },
  {
    id: '3',
    title: 'Brochure Événements',
    description: 'Présentation des événements à venir',
    imageUrl: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2',
    category: 'Événements',
    isActive: true,
    minStock: 20
  }
];

// Initial posters data
const initialPosters: Poster[] = [
  {
    id: '1',
    name: 'Promotion Printemps',
    description: 'Affiche promotionnelle pour la saison du printemps',
    imageUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946',
    category: 'Saisonnier',
    isActive: true,
  },
  {
    id: '2',
    name: 'Nouveautés',
    description: 'Présentation des nouveaux produits',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    category: 'Produits',
    isActive: true,
  },
  {
    id: '3',
    name: 'Événement Spécial',
    description: 'Annonce d\'événements spéciaux',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    category: 'Événements',
    isActive: true,
  },
];

// Initial stands data
const initialStands: DisplayStand[] = [
  {
    id: '1',
    name: 'Présentoir Entrée',
    location: 'Hall Principal',
    currentPoster: 'Promotion Printemps',
    isReserved: false,
    lastUpdated: new Date(),
    posterRequests: [],
    publications: [
      { publicationId: '1', quantity: 15, lastUpdated: new Date() },
      { publicationId: '2', quantity: 20, lastUpdated: new Date() }
    ]
  },
  {
    id: '2',
    name: 'Présentoir Cafétéria',
    location: 'Zone de Restauration',
    currentPoster: 'Nouveautés',
    isReserved: false,
    lastUpdated: new Date(),
    posterRequests: [],
    publications: [
      { publicationId: '2', quantity: 12, lastUpdated: new Date() },
      { publicationId: '3', quantity: 25, lastUpdated: new Date() }
    ]
  },
  {
    id: '3',
    name: 'Présentoir Accueil',
    location: 'Réception',
    currentPoster: 'Événement Spécial',
    isReserved: false,
    lastUpdated: new Date(),
    posterRequests: [],
    publications: [
      { publicationId: '1', quantity: 8, lastUpdated: new Date() },
      { publicationId: '3', quantity: 18, lastUpdated: new Date() }
    ]
  },
];

interface StandsContextType {
  stands: DisplayStand[];
  setStands: React.Dispatch<React.SetStateAction<DisplayStand[]>>;
  availablePosters: Poster[];
  setAvailablePosters: React.Dispatch<React.SetStateAction<Poster[]>>;
  publications: Publication[];
  setPublications: React.Dispatch<React.SetStateAction<Publication[]>>;
}

const StandsContext = createContext<StandsContextType | undefined>(undefined);

export const StandsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stands, setStands] = useState<DisplayStand[]>(() => {
    const savedStands = loadStands();
    return savedStands.length > 0 ? savedStands : initialStands;
  });
  
  const [availablePosters, setAvailablePosters] = useState<Poster[]>(initialPosters);
  const [publications, setPublications] = useState<Publication[]>(initialPublications);

  useEffect(() => {
    if (stands.length > 0) {
      saveStands(stands);
    }
  }, [stands]);

  return (
    <StandsContext.Provider value={{ 
      stands, 
      setStands, 
      availablePosters, 
      setAvailablePosters,
      publications,
      setPublications 
    }}>
      {children}
    </StandsContext.Provider>
  );
};

export const useStands = () => {
  const context = useContext(StandsContext);
  if (!context) {
    throw new Error('useStands must be used within a StandsProvider');
  }
  return context;
};

export default StandsProvider;