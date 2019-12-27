import React, { useMemo, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import Comment from 'COMPONENTS/comment/comment'
import './full-screen-player.less'
import api from 'API/index'

const FullScrrenPlayer: React.SFC = () => {
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  const isLogin = useSelector((state: RootState) => state.user.isLogin)
  const CommentComponent = useMemo(() => <Comment type="music" id={currentSong.id} />, [currentSong.id]);
  const [simiPlaylist, setSimiPlaylist] = useState([])
  const [simiSong, setSimiSong] = useState([])

  useEffect(() => {
    getSongSimi()
    if (!currentSong.lyric) {
      currentSong.getLyric()
    }
  }, [currentSong.id])

  function getSongSimi () {
    function getParams (type: string) {
      return {
        type,
        query: {
          id: currentSong.id
        }
      }
    }
    Promise.all([api.getSimi(getParams('song')), api.getSimi(getParams('playlist'))])
      .then(res => {
        setSimiSong(res[0].data.songs)
        setSimiPlaylist(res[1].data.playlists)
      })
  }
  return (
    <div className="player">
      <div className="player-wrap">
        <div className="player-cd-wrap">
          <div className="player-cd">
            <img src={currentSong.picUrl+'?param=200y200'} alt=""/>
          </div>
          <div className="player-action">
            <i className="iconfont iconxin"></i>
            <i className="iconfont icon-add"></i>
            <i className="iconfont iconxin"></i>
            <i className="iconfont icon-share"></i>
          </div>
        </div>
        <div className="player-info">
          <div className="player-info-name">{currentSong.name}</div>
          <div className="player-info-album">
            <div>专辑:<span>{currentSong.albumName}</span></div>
            <div>歌手:<span>{currentSong.artistName}</span></div>
            <div>来源:<span>这些生活必需品</span></div>
          </div>
          <div className="player-info-lyrics">
            {
              currentSong.lyric && currentSong.lyric.lines.map((item: any, index: any) => (
                <p key={index} className="player-info-lyrics-item">{item.txt}</p>
              ))
            }
          </div>
        </div>
      </div>
      <div className="player-other-info">
        <div className="player-other-comment">
          <div>听友评论<span>(已有0条评论)</span></div>
          {CommentComponent}
        </div>
        <div className="player-other-list">
          <div className="player-other-list-playlist">
            <div className="player-other-list-title">包含这首歌的歌单</div>
            {
              simiPlaylist.map(item => (
                <div key={item.id} className="player-other-list-item">
                  <img className="player-other-list-avatar" src={item.coverImgUrl+'?param=50y50'} alt=""/>
                  <div className="player-other-list-info">
                    <div className="player-other-list-info-name text-overflow">{item.name}</div>
                    <div className="player-other-list-info-text">{item.playCount}</div>
                  </div>
                </div>
              ))
            }
          </div>
          <div className="player-other-list-song">
            <div className="player-other-list-title">相似歌曲</div>
            {
              simiSong.map(item => (
                <div key={item.id} className="player-other-list-item">
                  <img className="player-other-list-avatar" src={item.album.picUrl+'?param=50y50'} alt=""/>
                  <div className="player-other-list-info">
                    <div className="player-other-list-info-name text-overflow">{item.name}</div>
                    <div className="player-other-list-info-text">{item.artists[0].name}</div>
                  </div>
                </div>
              ))
            }
          </div>
          {/* <div className="player-other-list-like">
            <div className="player-other-list-title">喜欢这首歌的人</div>
            <div className="player-other-list-item">
              <img className="player-other-list-avatar" src="https://p3.music.126.net/yeLMBHft3oDrpg8G_fjIRA==/109951163603810637.jpg?param=35y35" alt=""/>
              <div className="player-other-list-info">
                <div className="player-other-list-info-name text-overflow">日子有点苦的时候，听这些歌在点苦的时候，听这些歌 </div>
                <div className="player-other-list-info-text">2222万</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default FullScrrenPlayer