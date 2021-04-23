const { REACT_APP_BACKEND_URL } = process.env;
const baseURL = ``;

const SERVER_SETTINGS = {
  baseURL,
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
