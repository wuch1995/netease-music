import React from 'react'
import './music-list.less'
import Song from 'UTIL/song'
import { padZero } from 'UTIL/util'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import { usePlayerController } from 'UTIL/player-controller'
import { genArtists } from 'VIEWS/template/template'
import { useFavorite } from 'UTIL/favorite'
import { MenuType } from 'UTIL/menu'
import { ContextMenuWrap, ConnectedMenu } from 'COMPONENTS/context-menu/context-menu'
import Icon from 'COMPONENTS/icon/icon'

const MENU_NAME = 'music-list-contextmenu'
const Menu = ConnectedMenu(MENU_NAME)

interface MusicListProps {
  list: Song[]
  getMenu: (song: Song) => MenuType[]
  start: (song: Song) => void
  deleteMyFavorite?: (song: Song) => void
}

const MusicList: React.SFC<MusicListProps> = ({ list = [], getMenu, start, deleteMyFavorite }) => {
  const { goAlbumDetail, goArtistDetail, goMVDetail } = usePageForword()
  const { currentSong } = usePlayerController()
  const { isFavorite, favorite } = useFavorite()

  function muisclistFavorite (song: Song) {
    if (deleteMyFavorite) {
      deleteMyFavorite(song)
    } else {
      favorite(song.id)
    }
  }

  return (
    <>
      <ul>
        <li styleName="music-list-item-wrap">
          <div styleName="music-list-item">
            <div></div>
            <div>音乐标题</div>
            <div>歌手</div>
            <div>专辑</div>
            <div>时长</div>
          </div>
        </li>
        {
          list.map((item: Song, index) => (
            <li styleName="music-list-item-wrap" key={item.id}>
              <ContextMenuWrap id={MENU_NAME} menu={getMenu(item)}>
                <div onDoubleClick={() => start(item)} styleName="music-list-item">
                  <div styleName="music-list-item-action">
                    <span>{ currentSong.song.id === item.id ? <Icon name="icon-sound" className="icon-color-main"></Icon> : padZero(index + 1)}</span>
                    <Icon 
                      onClick={() => { muisclistFavorite(item) }} 
                      name={`${isFavorite(item.id) ? 'icon-heart-full' : 'iconxin'}`}
                      className={`icon-color-${isFavorite(item.id) ? 'main' : '9'} hover`}
                    >
                    </Icon>
                  </div>
                  <div>
                    <div className="text-overflow" styleName={classnames({ 'music-list-item-playing': item.id === currentSong.song.id })} title={item.name}>
                      {item.name}<span className="music-list-item-alia">{item.alia_string}</span>
                    </div>
                    { item.isHighQuality && <span styleName="music-list-item-highquality">SQ</span> }
                    { !!item.mv && <Icon className="icon-color-main hover" style={{marginLeft: '2px'}} onClick={() => { goMVDetail(item.mv) }} name="icon-mv"></Icon> }
                  </div>
                  <div>
                    <div className="text-overflow" title={item.artistName}>
                      { genArtists(item.artists, goArtistDetail, 'commen-link-666666') }
                    </div>
                  </div>
                  <div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        goAlbumDetail(item.album.id)
                      }}
                      styleName="music-list-item-link"
                      className="text-overflow"
                      title={item.album.name}
                    >
                      {item.album.name}
                    </div>
                  </div>
                  <div>
                  <div styleName="muisc-list-item-duration" className="text-overflow ">{item.duration_string}</div>
                  </div>
                </div>
              </ContextMenuWrap>
            </li>
          ))
        }
      </ul>
      <Menu></Menu>
    </>
  )
}

export default MusicList