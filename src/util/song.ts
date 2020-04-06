import { timeFormat } from 'UTIL/util'
import api from 'API/index'
import Lyric from './lyric-parser'
import { ArtistBaseClass, createBaseArtistList } from 'UTIL/artist'
import { AlbumBaseClass, createBaseAlbum } from 'UTIL/album'

let favoriteIds: number[] = JSON.parse(localStorage.getItem('favoriteIds') || '[]')

export function setFavoriteIds (ids: number[]) {
  localStorage.setItem('favoriteIds', JSON.stringify(ids))
  favoriteIds = ids
}

export function updateFavoriteIds (id) {}

export default class Song {
  name: string
  id: number
  artists: ArtistBaseClass[]
  mv: number
  album: AlbumBaseClass
  duration: number
  lyric: any
  liked: boolean
  origin: any

  constructor ({ id, name, al = {}, ar = [], mv, dt, liked = false }: any) {
    this.id = id
    this.name = name
    this.artists = createBaseArtistList(ar)
    this.mv = mv
    this.album = createBaseAlbum(al)
    this.duration = dt
    this.lyric = null
    this.liked = favoriteIds.indexOf(id) > -1
    this.origin = { id, name, al, ar, mv, dt, liked }
  }

  get duration_string (): string {
    if (!this.duration) return ''
    return timeFormat(this.duration / 1000)
  }

  get artistName (): string {
    if (!this.artists.length) return ''
    return this.artists.reduce((name, item) => {
      return name + '/' + item.name
    }, '').substring(1)
  }

  async getLyric (cb?: any) {
    try {
      let res = await api.getLyric(this.id)
      const lyric = new Lyric(res.data.lrc.lyric)
      this.lyric = lyric
      cb && cb(lyric)
    } catch (e) {}
  }
}

export function createSongList (data: any): Song[] {
  return data.map((item: any) => {
    return new Song({
      id: item.id,
      ar: item.artists || item.ar,
      al: item.album || item.al,
      dt: item.duration || item.dt,
      name: item.name,
      mv: item.mv || item.mvid
    })
  })
}

export function createSong (data: any): Song {
  return new Song({
    id: data.id,
    ar: data.artists || data.ar,
    al: data.album || data.al,
    dt: data.duration || data.dt,
    name: data.name,
    mv: data.mv || data.mvid
  })
}