import Api from '../axios/Api';
const USER_API = "/utilisateur"
export const signup = async (user) => {
    return await Api.post(USER_API + "/register", user);
    2
}
export const signin = async (user) => {
    return await Api.post(USER_API + "/login", user);
}
export const forgot = async (identifier) => {
    return await Api.post(USER_API + "/forgot-password", { identifier });
}
export const resetPass = async (identifier, code, newPassword) => {
    return await Api.post(USER_API + "/reset-password", { identifier, code, newPassword });
};

// export const getUserFromToken = async (token) => {
//     const response = await Api.get(`${USER_API}/profil`, {
//         headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
// };
const AuthService = {
    forgot,
    resetPass,
};
export default AuthService;