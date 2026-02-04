// let userApi = "https://95ipr7p9sa.execute-api.ap-southeast-1.amazonaws.com/dev";
let userApi = "http://localhost:3008";
// console.log("User API URL:", import.meta.env.VITE_USER_API_URL);
if (import.meta.env.VITE_USER_API_URL) {
    userApi = import.meta.env.VITE_USER_API_URL;
}
export default (axios)=>({
    register(payload) {
        return axios.post(`/v1/auth/register`, payload);
    },
    verifyOtp(payload) {
        return axios.post(`/v1/auth/verify-otp`, payload);
    },
    login(payload) {
        return axios.post(`/v1/auth/login`, payload);
    },
    logout(payload) {
        return axios.post(`/v1/auth/logout`, payload);
    },
    listUsers() {
        return axios.get(`/v1/admin/users`);
    },
    createUser(payload) {
        return axios.post(`/v1/admin/users`, payload);
    },
    getUserById(userId) {
        return axios.get(`/v1/admin/users/${userId}`);
    },
    updateUserById(userId, payload) {
        return axios.put(`/v1/admin/users/${userId}`, payload);
    },
    setPwd(payload) {
        return axios.post(`/v1/users/set-password`, payload);
    },
})
