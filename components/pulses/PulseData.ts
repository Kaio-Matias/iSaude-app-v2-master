
export interface PulseData {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string; // URL do avatar
    isVerified?: boolean;
    specialty?: string;
    isFollowing: boolean; // Para o botão "Seguir"
  };
  video: {
    url: string;
    thumbnail: string;
    duration: number;
    resolution: {
      width: number;
      height: number;
    };
  };
  content: {
    title?: string;
    description: string; // Texto principal do pulse
  };
  audio?: {
    name: string; // Nome da música/áudio
    artist?: string; // Artista (opcional)
    url?: string; // URL do áudio (opcional)
  };
  taggedPeople: {
    count: number; // Quantas pessoas estão marcadas
    users: Array<{
      id: string;
      name: string;
      avatar?: string;
    }>; // Lista das pessoas marcadas (primeiras 3-5 para exibir)
  };
  interactions: {
    likes: {
      count: number;
      isLiked: boolean;
    };
    comments: {
      count: number;
    };
    shares: {
      count: number;
    };
    views?: {
      count: number;
    };
  };
  createdAt: string;
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  medicalCategory?: 'education' | 'procedure' | 'case_study' | 'tips' | 'awareness';
  visibility: 'public' | 'followers' | 'private';
}

export interface CreatePulseData {
  video: {
    uri: string;
    duration: number;
    thumbnail?: string;
  };
  title: string;
  description?: string;
  tags: string[];
  location?: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  medicalCategory?: 'education' | 'procedure' | 'case_study' | 'tips' | 'awareness';
  visibility: 'public' | 'followers' | 'private';
  audienceRestriction?: {
    minAge?: number;
    professionalsOnly?: boolean;
  };
}