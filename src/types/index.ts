export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  image?: string;
  specifications: {
    label: string;
    value: string;
  }[];
  materials: string[];
  keyFeatures: string[];
  idealFor: string[];
}

export interface ConsultationBooking {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  propertyType: 'Residential' | 'Commercial' | 'Industrial' | 'Warehouse';
  serviceId: string;
  consultationMode: 'on-site' | 'online';
  address: string;
  date: string;
  timeSlot: string;
  notes?: string;
  status: 'confirmed' | 'rescheduled' | 'cancelled';
  createdAt: string;
}

export interface QuoteSubmission {
  id?: string;
  customerName: string;
  phone: string;
  email: string;
  serviceId: string;
  propertyType: string;
  dimensions: {
    height?: string;
    width?: string;
    length?: string;
    unit: 'feet' | 'meters' | 'inches';
    quantity: number;
  };
  materialPreference: string;
  location: string;
  notes?: string;
  files: {
    name: string;
    size: string;
    type: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imageUrl?: string;
  leadSummary?: {
    service?: string;
    dimensions?: string;
    location?: string;
    requirements?: string;
  };
}
