import Api from '../axios/Api';

const StatistiqueAd_API = '/statistiquesAdmin';
//Répartition des utilisateurs
export const getRepartitionUtili = async () => {
    const response = await Api.get(`${StatistiqueAd_API}/getutilisateur`);

    return response.data;
};
//Répartition des rendez-vous
export const getRendezVousU = async () => {
    const response = await Api.get(`${StatistiqueAd_API}/getRendezVous`);

    return response.data;
};
//Clients Interactions
export const getClientInter = async () => {
    const response = await Api.get(`${StatistiqueAd_API}/client-interactions`);

    return response.data;
};
//nb d'inscription par moi
export const getInscriptionM = async () => {
    const response = await Api.get(`${StatistiqueAd_API}/inscriptions-par-mois`);

    return response.data;
};
//nb de consultation utilisateur 
export const getConsultationM = async () => {
    const response = await Api.get(`${StatistiqueAd_API}/consultations-mensuelles`);

    return response.data;
};