// a library to wrap and simplify api calls
import apisauce from 'apisauce'

// our "constructor"
const create = (baseURL = 'http://api.eth4.fun:7001/') => {
// const create = (baseURL = 'http://192.168.51.137:7001') => {
  // ------
  // STEP 1
  // ------
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache'
    },
    // 10 second timeout...
    timeout: 10000
  })

  // ------
  // STEP 2
  // ------
  //
  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.
  //
  // I generally don't like wrapping the output at this level because
  // sometimes specific actions need to be take on `403` or `401`, etc.
  //
  // Since we can't hide from that, we embrace it by getting out of the
  // way at this level.
  //
  const getRoot = () => api.get('')
  const getConfig = () => api.get('api/v1/games/dev/configs')
  const getABI = () => api.get('api/v1/games/dev/abi')
  const getActivity = () => api.get('api/v1/games/dev/banners')
  const getRecord = ({game, address, page, size}) => api.get('api/v1/games/dev/bet/history', {gameId: game, addr: address, page, size})
  const getUser = (uid) => api.get('api/v1/games/dev/userinfo', {uid})
  const getPromotion = (uid) => api.get('api/v1/games/dev/shareinfo', {uid})
  const getRandom = ({address, network_id}) => api.put('api/v1/games/dev/random', {address, network_id})

  const register = ({inviter, nickname, address}) => api.put('api/v1/games/dev/register', {aff_code: inviter, nickname, eth_address: address})

  // ------
  // STEP 3
  // ------
  //
  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    getRoot,
    getConfig,
    getABI,
    getActivity,
    getRecord,
    getUser,
    getPromotion,
    getRandom,

    register,
  }
}

// let's return back our create method as the default.
export default {
  create
}
