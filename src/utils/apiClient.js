import axios from "axios";
import ServerSetting from "./serverSettings";

// eslint-disable-next-line import/no-anonymous-default-export
export default (baseURL = ServerSetting.baseURL) => {
  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const login = (resource, data) => {
    api.post(resource, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  };

  const getHeaders = (token) => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  const get = (resource, params, token) =>
    api.get(resource, params, {
      headers: getHeaders(token),
    });

  const getOne = (resource, params, token) =>
    api.get(`${resource}/${params.id}`, {}, { headers: getHeaders(token) });

  const post = (resource, params, token) => {
    let url = resource;
    if (!!params.id) {
      url = `${resource}/${params.id}`;
    }

    return api.post(url, params.data);
  };
  const patch = (resource, params, token) => {
    let url = resource;
    if (!!params.id) {
      url = `${resource}/${params.id}`;
    }

    return api.patch(url, params.data, {
      headers: getHeaders(token),
    });
  };

  const deleteOne = (resource, params, token) => {
    let url = resource;
    if (!!params.id) {
      url = `${resource}/${params.id}`;
    }
    return api.delete(url, {}, { headers: getHeaders(token) });
  };

  return { login, get, getOne, post, patch, deleteOne };
};
