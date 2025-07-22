import Api from '../axios/Api';
const AVIS_API = '/rendezVous';
//Ajouter rendezVous
export const ajoutRendezvous = async (rendezVous) => {
    const response = await Api.post(`${AVIS_API}/ajoutRendezvous`, rendezVous);
    return response.data;
}
//Modifier rendezVous
export const modifierRendezVous = async (rendezVous) => {
    const response = await Api.put(`${AVIS_API}/modifierRendezVous/${rendezVous.id}`, rendezVous);
    return response.data;
}
//supprimer rendezVous
export const supprimerRendezVous = async (rendezVous) => {
    const response = await Api.delete(`${AVIS_API}/supprimerRendezVous/${rendezVous.id}`, rendezVous);
    return response.data;

}
//confirmer rendezVous
export const confirmerRendezVous = async (rendezVous) => {
    const response = await Api.put(`${AVIS_API}/confirmerRDV/${rendezVous.id}`, rendezVous);
    return response.data;
}
//Annuler rendezVous
export const annulerRendezVous = async (rendezVous) => {
    const response = await Api.put(`${AVIS_API}/annulerRDV/${rendezVous.id}`, rendezVous);
    return response.data;
}
//  TERMINE rendez Vous 
export const terminerRendezVous = async (rendezVous) => {
    const response = await Api.put(`${AVIS_API}/terminerRDV/${rendezVous.id}`, rendezVous);
    return response.data;
}
//envoyer notification avant jour et le jour j de rendez vous 
//get RendezVous by client 
export const fetchRendezVousByClient = async (id) => {
    const response = await Api.get(`${AVIS_API}/rendezVousByClient/${id}`);
    return response.data;
}
// GET rendez-vous d’un presetatire
// export const fetchRendezVousByPrestataire = async (id) => {
//     return await Api.get(`${AVIS_API}/rendezVousByprestataire/${id}`);
// }
// // GET rendez-vous d’un entreprise
// export const fetchRendezVousByEntreprise = async (id) => {

//     return await Api.get(`${AVIS_API}/rendezVousByentreprise/${id}`);
// }
export const fetchRendezVousByIntervenant = async (id) => {
    const response = await Api.get(`${AVIS_API}/rendezVousByintervenant/${id}`);
    return response.data;
}
// Afficher un rendez-vous avec détails
export const fetchRendezVousById = async (id) => {
    const response = await Api.get(`${AVIS_API}/${id}`);
    return response.data;

};