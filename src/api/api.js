
import users from "./users"
import orders from "./orders"
// export default axios.create({
//     baseURL: process.env.VUE_APP_BACKEND_URL,
//     headers: {
//       "Content-type": "application/json"
//     }
//   });
export default (axios) => ({
  user: users(axios),
  order: orders(axios),
});

