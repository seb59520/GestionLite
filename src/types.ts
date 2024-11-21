export interface DisplayStand {
  id: string;
  name: string;
  location: string;
  currentPoster: string;
  isReserved: boolean;
  reservedUntil?: Date;
  reservedBy?: string;
  lastUpdated: Date;
  posterRequests: PosterRequest[];
  publications: PublicationStock[];
}

export interface StandStats {
  total: number;
  reserved: number;
  available: number;
}

export interface ReservationFormData {
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface PosterRequest {
  id: string;
  standId: string;
  requestedBy: string;
  requestedPoster: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

export interface Poster {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
}

export interface Publication {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  minStock: number;
}

export interface PublicationStock {
  publicationId: string;
  quantity: number;
  lastUpdated: Date;
}