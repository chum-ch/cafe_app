const additionalConfig = { showToast: true }
// let userApi = "https://eaownyg1ak.execute-api.ap-southeast-1.amazonaws.com/dev";
let userApi = "http://localhost:3008";
// console.log("User API URL:", import.meta.env.VITE_USER_API_URL);
if (import.meta.env.VITE_USER_API_URL) {
    userApi = import.meta.env.VITE_USER_API_URL;
}

export default (axios)=>({
    listOrders(tenantId, userId) {
        return axios.get(`${userApi}/v1/${tenantId}/users/${userId}/orders`, { showToast: false, showLoading: false });
    },
    updateOrderStatus(payload, tenantId, userId, orderId) {
        return axios.patch(`${userApi}/v1/${tenantId}/users/${userId}/orders/${orderId}`, payload, { showToast: false });
    },
    createOrder(payload, tenantId, userId) {
        return axios.post(`${userApi}/v1/${tenantId}/users/${userId}/orders`, payload, { showToast: true });
    },
})
