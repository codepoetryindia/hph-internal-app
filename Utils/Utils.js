import {API_SERVICES_URL} from '../src/ApiService/ApiService';
import axios from 'axios';


export const PostMethod = async (url, data, token) => {
  ///////////// POST METHOD /////////////

  let PostUrl = API_SERVICES_URL + url;
  console.log('Api url', PostUrl, data);
  try {
    let response = await axios.post(PostUrl, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + token,
      },
    });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

///////////// PATCH METHOD /////////////

export const PatchMethod = async (url, data, token) => {
  let PostUrl = API_SERVICES_URL + url;
  console.log('Api url', PostUrl, data);
  try {
    let response = await axios.patch(PostUrl, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer' + token,
      },
    });
    console.log('Api resp', response);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};
///////////// PUT METHOD /////////////

export const PutMethod = async (url, data, token) => {
  let PostUrl = API_SERVICES_URL + url;
  console.log('Api url', PostUrl, data);
  try {
    let response = await axios.put(PostUrl, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',

        Authorization: 'Bearer' + token,
      },
    });
    console.log('Api resp', response);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

///////////// GET METHOD /////////////

export const GetRawurl = async (url, token) => {
  let PostUrl = API_SERVICES_URL + url;
  try {
    let response = await axios.get(PostUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + token,
      },
    });
    return response;
  } catch (error) {
    throw handleError(error);
  }
};

///////////// HANDLE ERROR /////////////

const handleError = error => {
  try {
    if (error.response) {
      if (error.response.status == '403' || error.response.status == '401') {
        throw new Error('Session expired please login again');
      }
      if (error.response && error.response.data.hasOwnProperty('message')) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Something went wrong Error' + error.response.status);
      }
    } else if (error.request) {
      throw new Error('Network Error');
    } else {
      throw new Error('Something went wrong please retry');
    }
  } catch (error) {
    throw new Error('Something went wrong please retry');
  }
  return;
};
