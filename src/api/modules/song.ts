import axios from '../request'

export default {
  getLyric (id) {
    return axios.get('lyric', { params: { id } })
  },
  getSongUrl (params: any) {
    return axios.get('song/url', { params, withCredentials: true })
  }
}