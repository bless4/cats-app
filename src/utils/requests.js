const axios = require("axios");
export const APIURL = "https://api.thecatapi.com";
export const getPhotos = (limit, page) => axios.get(`${APIURL}/v1/images?limit=${limit}&page=${page}&order=ASC`, {
  headers: {
    "Content-Type": "multipart/form-data",
    "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
  }
})
export const getVotes = () => axios.get(`${APIURL}/v1/votes`, {
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
  }
})

export const addPhoto = data =>
  axios({
    method: "post",
    url: `${APIURL}/v1/images/upload`,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
    }
  });
export const editPhoto = data =>
  axios({
    method: "put",
    url: `${APIURL}/photos/edit`,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
      "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
    }
  });

export const favourite = data =>
  axios({
    method: "post",
    url: `${APIURL}/v1/favourite`,
    data,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
    }
  });

export const unfavourite = data =>
  axios({
    method: "post",
    url: `${APIURL}/v1/unfavourite`,
    data,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
    }
  });
export const deletePhoto = id => axios.delete(`${APIURL}/photos/delete/${id}`);

export const getAllFavourites = data =>
  axios({
    method: "get",
    url: `${APIURL}/v1/favourites`,
    data,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": "98de9fca-14cc-430d-a65f-e4930c214699"
    }
  });