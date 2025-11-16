import api from './api';

export interface Post {
  id: string;
  user: string;
  avatar: any; // require local asset
  time: string;
  text: string;
  image?: any;
  images?: any[]; // Array para múltiplas imagens
  likes: number;
  likers?: any[]; // Avatares de quem curtiu (mock)
  comments: number;
  shares: number;
  location?: string;
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  text: string;
  user: string;
  avatar: any;
  timestamp: number;
}

// TODO: A API precisa ser ajustada para retornar os dados no formato esperado pelo App
// Exemplo: A API retorna 'texto' e o app espera 'text'.
// Temporariamente, faremos a conversão no lado do cliente.

const mapPostFromApi = (apiPost: any): Post => {
  return {
    id: apiPost.id_postagem,
    user: apiPost.usuario?.nome_usuario || 'Usuário Anônimo',
    avatar: { uri: apiPost.usuario?.foto_perfil || `https://api.dicebear.com/7.x/avataaars/png?seed=${apiPost.usuario?.nome_usuario || 'anon'}&backgroundColor=4576F2&size=100` },
    time: new Date(apiPost.data_criacao).toLocaleDateString(), // Formatar a data
    text: apiPost.texto,
    images: apiPost.imagens ? apiPost.imagens.map((img: any) => ({ uri: img.url })) : [],
    likes: apiPost.curtidas?.length || 0,
    comments: apiPost.comentarios?.length || 0,
    shares: 0, // A API não parece ter compartilhamentos
    isLiked: false, // A lógica de 'isLiked' será tratada no PostCard
    // Faltam dados como 'likers', 'location' que não vêm da API
  };
};

export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get('/api/postagens');
    if (response.data && Array.isArray(response.data.postagens)) {
      // Mapeia a resposta da API para o formato que o componente PostCard espera
      return response.data.postagens.map(mapPostFromApi);
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar postagens da API:", error);
    // Em caso de erro, pode-se retornar um array vazio ou lançar o erro
    // Para manter o app funcional, retornamos um array vazio.
    return [];
  }
};

export const likePost = async (postId: string): Promise<void> => {
  try {
    // O endpoint para curtir pode variar. Ex: /api/postagens/{postId}/like
    // Assumindo um POST para a rota de curtidas da postagem.
    await api.post(`/api/postagens/${postId}/like`);
  } catch (error) {
    console.error(`Erro ao curtir o post ${postId}:`, error);
    throw error; // Lança o erro para ser tratado no componente
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await api.delete(`/api/postagens/${postId}`);
  } catch (error) {
    console.error(`Erro ao deletar o post ${postId}:`, error);
    throw error; // Lança o erro para ser tratado no componente
  }
};

// Funções para Comentários
export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await api.get(`/api/postagens/${postId}/comments`);
    // TODO: Adicionar mapeamento da resposta da API para o formato de Comment, se necessário
    return response.data.comments || [];
  } catch (error) {
    console.error(`Erro ao buscar comentários para o post ${postId}:`, error);
    return [];
  }
};

export const addComment = async (postId: string, text: string): Promise<Comment> => {
  try {
    const response = await api.post(`/api/postagens/${postId}/comments`, { text });
    // TODO: Adicionar mapeamento da resposta da API para o formato de Comment, se necessário
    return response.data.comment;
  } catch (error) {
    console.error(`Erro ao adicionar comentário ao post ${postId}:`, error);
    throw error;
  }
};

export const deleteComment = async (postId: string, commentId: string): Promise<void> => {
  try {
    await api.delete(`/api/postagens/${postId}/comments/${commentId}`);
  } catch (error) {
    console.error(`Erro ao deletar o comentário ${commentId}:`, error);
    throw error;
  }
};
