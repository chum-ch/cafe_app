const additionalConfig = { showToast: true }
let userApi = "https://eaownyg1ak.execute-api.ap-southeast-1.amazonaws.com/dev";
// let userApi = "http://localhost:3008";
// console.log("User API URL:", import.meta.env.VITE_USER_API_URL);
if (import.meta.env.VITE_USER_API_URL) {
    userApi = import.meta.env.VITE_USER_API_URL;
}

export default (axios)=>({
    register(payload) {
        return axios.post(`${userApi}/v1/auth/register`, payload, additionalConfig);
    },
    verifyOtp(payload) {
        return axios.post(`${userApi}/v1/auth/verify-otp`, payload, additionalConfig);
    },
    login(payload) {
        return axios.post(`${userApi}/v1/auth/login`, payload, additionalConfig);
    },
    logout(payload) {
        return axios.post(`${userApi}/v1/auth/logout`, payload);
    },
    listUsers(tenantId) {
        return axios.get(`${userApi}/v1/${tenantId}/admin/users`, { showLoading: true});
    },
    createUser(payload, tenantId) {
        return axios.post(`${userApi}/v1/${tenantId}/admin/users`, payload, additionalConfig);
    },
    getUserById(userId, tenantId) {
        return axios.get(`${userApi}/v1/${tenantId}/admin/users/${userId}`);
    },
    updateUserById(payload, tenantId, userId) {
        return axios.put(`${userApi}/v1/${tenantId}/admin/users/${userId}`, payload, additionalConfig);
    },
    deleteUser(userId, tenantId) {
        return axios.delete(`${userApi}/v1/${tenantId}/admin/users/${userId}`, additionalConfig);
    },
    setPwd(payload) {
        return axios.post(`${userApi}/v1/users/set-password`, payload, additionalConfig);
    },
    sendEmail(payload) {
        return axios.post(`${userApi}/v1/users/send-email`, payload, additionalConfig);
    },
    checkUserLogin(payload) {
        return axios.post(`${userApi}/v1/check-user`, payload, additionalConfig);
    },
})
