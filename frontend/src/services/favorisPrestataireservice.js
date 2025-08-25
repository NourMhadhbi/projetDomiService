import Api from '../axios/Api';

const FAVORIS_API = '/favorisPres';

export const favorisService = {
  // Ajouter un prestataire comme favori
  ajouterFavori: async (prestataireId, clientId) => {
    try {
      const response = await Api.post(`${FAVORIS_API}/ajouter/${prestataireId}`, { clientId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Marquer un prestataire comme non favori
  marquerNonFavori: async (prestataireId, clientId) => {
    try {
      const response = await Api.post(`${FAVORIS_API}/marquer-non-favori/${prestataireId}`, { clientId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Supprimer un favori/non-favori
  supprimerFavori: async (prestataireId, clientId) => {
    try {
      const response = await Api.delete(`${FAVORIS_API}/supprimer/${prestataireId}`, {
        data: { clientId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer la liste des favoris
  getFavoris: async (clientId) => {
    try {
      const response = await Api.get(`${FAVORIS_API}/favoris/${clientId}`);
      console.log("API favoris response:", response.data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Récupérer la liste des non-favoris
  getNonFavoris: async (clientId) => {
    try {
      const response = await Api.get(`${FAVORIS_API}/non-favoris/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Vérifier le statut d'un prestataire
  getStatutPrestataire: async (prestataireId, clientId) => {
    try {
      // On récupère les favoris et non-favoris et on vérifie si le prestataire est présent
      const [favoris, nonFavoris] = await Promise.all([
        favorisService.getFavoris(clientId),
        favorisService.getNonFavoris(clientId)
      ]);

      const estFavori = favoris.some(fav => fav.prestataireId === prestataireId);
      const estNonFavori = nonFavoris.some(nonFav => nonFav.prestataireId === prestataireId);

      if (estFavori) return 'FAVORI';
      if (estNonFavori) return 'NON_FAVORI';
      return 'AUCUN';
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};