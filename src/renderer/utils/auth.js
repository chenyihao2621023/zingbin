import Cookies from 'js-cookie'

const TokenKey = 'zatk'

export function getToken() {

  if(process.env.NODE_ENV_TARGET === 'electron') {

    return localStorage.getItem(TokenKey);
  }else {
    return Cookies.get(TokenKey)
  }

}

export function setToken(token) {

  if(process.env.NODE_ENV_TARGET === 'electron') {
    return localStorage.setItem(TokenKey, token);
  }else {
    return Cookies.set(TokenKey, token)
  }


}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
