import logo from './assets/ythlogo108.png';
import './App.css';
import C from './Constants';
import Videos from './Videos';

import { useEffect, useState, useCallback } from 'react';

// import Player from 'griffith'
// import Videojs from 'video.js'
import ReactPlayer from 'react-player/lazy';
// import ReactHlsPlayer from 'react-hls-player';

// 缩略图w/h
const ThumbWHR = 16 / 9;
const footerHeight = 36;
const headerHeight = 48;

const getGallerySize = () => ({
  height: window.innerHeight - headerHeight - footerHeight,
  width: window.innerWidth
});

const getWindowType = (width, height) => {
  const whr = width / height;
  // console.log('window WHR', whr);
  if (whr < 1) return 'portrait';
  if (whr > 1 && whr < ThumbWHR * 1.25) return 'normal';
  if (whr >= ThumbWHR * 1.25) return 'wild';// 20:9以上就算wild了
  return 'normal';
}

function App() {

  const [gallerySize, setGallerySize] = useState(getGallerySize());

  const [showSelectMenu, setShowSelectMenu] = useState(false);

  // 可视范围最大显示行数2, 水平用平铺展开
  const thumbSizes = {
    'portrait': [gallerySize.width, Math.round(gallerySize.width / ThumbWHR)],
    'normal': [Math.round(gallerySize.height / 2 * ThumbWHR), Math.round(gallerySize.height / 2)],// 2行
    'wild': [Math.round(gallerySize.height / 2 * ThumbWHR), Math.round(gallerySize.height / 2)]
  }

  const handleResize = useCallback(() => {
    setGallerySize(getGallerySize())
  }, []);

  const [selectedIndex, setSelectedIndex] = useState(-1) // i -1代表鼠标离开

  const handleHover = i => {
    setSelectedIndex(i)
  }

  const handleSelectMenu = () => {
    // console.log('--->', showSelectMenu, selectedIndex)
    setShowSelectMenu(!showSelectMenu)
  }

  const [fullMode, setFullMode] = useState(false);

  const handleToggleFull = () => {
    if (selectedIndex < 0) return;
    setFullMode(!fullMode)
  }

  useEffect(() => {
    document.title = C.title;
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  // const widthToHeight = () => ({
  //   switch windowSize.width % windowSize.height
  //   case 2: return 1,
  // });

  const windowType = getWindowType(gallerySize.width, gallerySize.height);

  const thumbSize = thumbSizes[windowType]

  const playerStyles = {
    'portrait': { display: 'block', flexWrap: 'wrap' },
    'normal': { margin: 16, padding: 16, boxSizing: 'border-box', border: 'grey 1px solid' },
    'wild': { marginLeft: thumbSize[0] / 2, marginRight: thumbSize[0] / 2, padding: 16, boxSizing: 'border-box', border: 'grey 1px solid' }
  }

  const selectedVideo = Videos[selectedIndex];

  return (
    <div className="App">
      <div className="Header" style={{ height: headerHeight, fontSize: headerHeight * .5 }}>
        <img alt={C.title} src={logo} style={{ height: headerHeight - 8, marginRight: 8 }} /> {C.title}
      </div>
      {
        showSelectMenu &&
        <>
          <div className="overlay" onClick={handleSelectMenu} />
          <div className="modal" style={{ width: '60%' }}>
            <div className="Gallery">
              {
                Videos.map((v, i) =>
                  <div key={i}
                    onClick={handleSelectMenu}
                    // onClick={handleSelectMenu}
                    className={i === selectedIndex ? "Thumb ThumbSelected" : "Thumb"}
                    style={{ width: thumbSize[0] / 2, height: thumbSize[1] / 2 }}>
                    <ReactPlayer url={v.v_url}
                      playing
                      muted
                      light
                      width={'100%'}
                      height={'100%'}
                      config={{
                        file: {
                          forceHLS: true
                        }
                      }} />
                    <div className="banner">
                      <p onClick={handleSelectMenu}>{v.title}</p>
                    </div>
                  </div>)
              }
            </div>
          </div>
        </>
      }
      {
        fullMode ? // fullscreen
          <div className="Gallery" style={playerStyles[windowType]}>
            <div style={{ flex: 1 }}
              onDoubleClick={() => handleToggleFull(selectedIndex)}>
              <ReactPlayer url={selectedVideo.v_url}
                playing
                muted
                // light // thumb pic
                // controls
                config={{
                  file: {
                    forceHLS: true
                  }
                }} />
              {/* <Player sources={{
                hd: {
                  play_url: selectedVideo.v_url,
                },
              }}
                autoplay={true}
              // initialObjectFit={'scale-down'}
              /> */}
            </div>
          </div>
          : // gallery
          <div className="Gallery">
            {
              Videos.map((v, i) =>
                <div key={i}
                  onMouseEnter={() => handleHover(i)}
                  onMouseLeave={() => handleHover(-1)}
                  onDoubleClick={() => handleToggleFull(i)}
                  // onClick={handleSelectMenu}
                  className={i === selectedIndex ? "Thumb ThumbSelected" : "Thumb"}
                  style={{ width: thumbSize[0], height: thumbSize[1] }}>
                  <ReactPlayer url={v.v_url} playing
                    width={'100%'}
                    height={'100%'}
                    // controls
                    config={{
                      file: {
                        forceHLS: true
                      }
                    }} />
                  <div className="banner">
                    <p onClick={handleSelectMenu}>{v.title}</p>
                  </div>
                  {/* <ReactHlsPlayer
                    src={v.v_url}
                    hlsConfig={{
                      maxLoadingDelay: 4,
                      minAutoBitrate: 0,
                      lowLatencyMode: true,
                    }} */}

                  {/* <Player sources={{
                    hd: {
                      play_url: v.v_url,
                    },
                  }}
                    autoplay={true}
                    // hiddenPlayButton={true}
                    useMSE={true}
                  // initialObjectFit={'scale-down'}
                  /> */}
                </div>)
            }
          </div>
      }
      <div className="Footer" style={{ height: footerHeight, fontSize: footerHeight * .5 }}>
        {C.copyright}
        {/* {`size h:${gallerySize.height} w:${gallerySize.width}`}  */}
        {/* {selectedIndex}  {`( ${windowType} )`} */}
      </div>
    </div>

  );
}

export default App;
