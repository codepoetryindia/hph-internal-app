import {API_SERVICES_URL} from '../src/ApiService/ApiService';
import axios from 'axios';
import CryptoJS from 'react-native-crypto-js';
import moment from 'moment';

const InEncrypted = false;
const Algorithm = 'aes-256-cbc';
const KEY = '595959b6ab46d379b89d794c87b74a51';
const IV = '0aaff094b6dc2974';

export const dateToTimestamp = (dateInput) => {
  return moment(dateInput).unix();
  // return new Date(dateInput).getTime();
}

export const Decrypt = plainText => {
  let rawData = CryptoJS.enc.Base64.parse(plainText);
  let decrypted = CryptoJS.AES.decrypt(
    {ciphertext: rawData},
    CryptoJS.enc.Latin1.parse(KEY),
    {
      iv: CryptoJS.enc.Latin1.parse(IV),
    },
  );

  console.log(decrypted.toString(CryptoJS.enc.Utf8));
  return decrypted.toString(CryptoJS.enc.Utf8);
};

export const Encrypt = plainText => {
  let parsedkey = CryptoJS.enc.Latin1.parse(KEY);
  let iv = CryptoJS.enc.Latin1.parse(IV);
  let encrypted = CryptoJS.AES.encrypt(plainText, parsedkey, {
    iv: iv,
  }).toString();
  return encrypted;
};

///////////// POST METHOD /////////////

export const PostMethod = async (url, data, token) => {
  let PostUrl = API_SERVICES_URL + url;
  let HashedData;
  if (InEncrypted) {
    HashedData = {data: Encrypt(JSON.stringify(data))};
  } else {
    HashedData = data;
  }
  try {
    let response = await axios.post(PostUrl, JSON.stringify(HashedData), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + token,
      },
    });
    if (InEncrypted) {
      if (response.data) {
        console.log('response data', response.data);
        let newData = response.data;
        return {
          ...newData,
          data: JSON.parse(Decrypt(response.data.data)),
        };
      }
    } else {
      return response.data;
    }
  } catch (error) {
    console.log(error);
    throw handleError(error);
  }
};

///////////// PATCH METHOD /////////////

export const PatchMethod = async (url, data, token) => {
  let PostUrl = API_SERVICES_URL + url;
  if (InEncrypted) {
    HashedData = {data: Encrypt(JSON.stringify(data))};
  } else {
    HashedData = data;
  }
  try {
    let response = await axios.patch(PostUrl, JSON.stringify(HashedData), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + token,
      },
    });
    if (InEncrypted) {
      if (response.data) {
        let newData = response.data;
        return {
          ...newData,
          data: JSON.parse(Decrypt(response.data.data)),
        };
      }
    } else {
      return response.data;
    }
  } catch (error) {
    throw handleError(error);
  }
};

///////////// PUT METHOD /////////////

export const PutMethod = async (url, data, token) => {
  let PostUrl = API_SERVICES_URL + url;
  if (InEncrypted) {
    HashedData = {data: Encrypt(JSON.stringify(data))};
  } else {
    HashedData = data;
  }
  try {
    let response = await axios.put(PostUrl, JSON.stringify(HashedData), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer' + token,
      },
    });

    if (InEncrypted) {
      if (response.data) {
        let newData = response.data;
        return {
          ...newData,
          data: JSON.parse(Decrypt(response.data.data)),
        };
      }
    } else {
      return response.data;
    }
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

    if (InEncrypted) {
      if (response && response.data) {
        let newData = response;
        return {
          ...newData,
          data: {
            ...newData.data,
            data: JSON.parse(Decrypt(response.data.data)),
          },
        };
      }
    } else {
      return response;
    }
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

