import axios from "axios";
// Axios is a data fetching library that is used to fetch the data from any API enpoint. eg : Our server
const serverFetch = axios.create({
  baseURL: process.env.REACT_APP_SERVER_ADDRESS + "/api/v1",
  headers: {
    Accept: "application/json", //incoming data will only be accpeted in JSON form
  },
  withCredentials: true, //for cookies via URL, if false then cookies won't be sent. Http cookies can't be accessed via javascript.
});

export default serverFetch;
