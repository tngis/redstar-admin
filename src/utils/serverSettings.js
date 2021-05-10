const { REACT_APP_BACKEND_URL } = process.env;
const baseURL = 'http://103.50.205.101:8081/uploads';
const apiUrl = 'http://103.50.205.101:8081/uploads';
const SERVER_SETTINGS = {
  baseURL,
  apiUrl,
  auth: {
    url: "/auth",
  },
  login: {
    url: "/auth/login",
  },
  getUser: {
    url: "/auth/me",
  },
  getSectors: {
    url: "/sectors"
  },
  getCategories: {
    url: "/categories"
  },
  getSubCategories: {
    url: "/subcategories"
  },
  getProdcuts: {
    url: "/products"
  },
  getIntros: {
    url: "/intros"
  },
  getWorks: {
    url: "/works"
  },
};

export default SERVER_SETTINGS;
