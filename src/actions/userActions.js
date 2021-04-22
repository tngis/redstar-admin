import { GET_ERRORS, SET_CURRENT_USER, CLEAR_ERRORS } from "../constants/userConstants";
import ServerSettings from '../utils/serverSettings';
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "../utils/setAuthToken";
import { message } from "antd";
// Login User
export const login = (userData, history) => (dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json",
    },
  };
  axios
    .post(ServerSettings.login.url, userData, config)
    .then((res) => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to localStorage
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
      history.push("/dashboard");
      message.success("Амжилттай нэвтэрлээ :)")
    })
    .catch((err) =>{
      message.error(err.response.data.error);
    });
};

// Create register
export const register = (data, history) => (dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json",
    },
  };
  axios
    .post("/api/auth/register", data, config)
    .then((res) => {
      message.success("Админ амжилттай нэмлээ");
      history.push("/userdetails");
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: { error: "Таны оруулсан и-майл хаяг бүртгэлтэй байна" },
      })
    );
};
export const clearError = () => (dispatch) => {
  return dispatch({
    type: CLEAR_ERRORS,
    payload: {},
  });
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  message.info("Системээс гарлаа!");
  // Set
  dispatch(setCurrentUser({}));
};
