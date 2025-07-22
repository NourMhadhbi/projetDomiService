import Api from '../axios/Api';

const AVIS_API = '/avis';

// Récupérer  les statistiques (prestataire OU entreprise selon l'ID)
export const getStatistiques = async (id) => {
    const response = await Api.get(`${AVIS_API}/statistiques/${id}`);
    return response.data;
};

// Ajouter un avis pour un prestataire ou entreprise
export const ajoutAvis = async (avis) => {
    const response = await Api.post(`${AVIS_API}/Ajouteravis`, avis);
    return response.data;
};
// modifier un avis pour un prestataire ou entreprise
export const modifierAvis = async (avis) => {
    const response = await Api.put(`${AVIS_API}/Modifieravis/${avis.id}`, avis);
    return response.data;
};
// archiver un avis pour un prestataire ou entreprise
export const archiveAvis = async (avis) => {
    const response = await Api.put(`${AVIS_API}/archiveAvis/${avis.id}`, avis);
    return response.data;
};

// Lister tous les avis pour un prestataire ou entreprise
export const getAvisParPrestataire = async (id) => {
    const response = await Api.get(`${AVIS_API}/prestataire/${id}`);
    console.log(response.data)
    return response.data;
};

// export const getAvisParEntreprise = async (id) => {
//     const response = await Api.get(`${AVIS_API}/entreprise/${id}`);
//     return response.data;
// };
// Récupérer un avis par son ID
export const getAvisParId = async (id) => {
    const response = await Api.get(`/avis/${id}`);
    return response.data;
};
// Récupérer les avis d’un client (commentaire non nul, non archivé)
export const getAvisParClient = async (clientId) => {
    const response = await Api.get(`/avis/client/${clientId}`);
    return response.data;
};