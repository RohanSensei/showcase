import logo from './assets/ythlogo108.png';
import './App.css';
import C from './Constants';
import Videos from './Videos';

import { useEffect, useState, useCallback } from 'react';

import Player from 'griffith'

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

  const [playMode, setPlayMode] = useState(false);
  const handleClickPlay = () => {
    if (selectedIndex < 0) return;
    setPlayMode(true)
  }

  useEffect(() => {
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
        <img alt={C.title} src={logo} style={{ height: headerHeight - 8, marginRight: 8}}/> {C.title}
      </div>
      {
        playMode ?
          <div className="Gallery" style={ playerStyles[windowType] }>
            <div style={{ flex: 1 }}>
              <Player sources={{
                hd: {
                  play_url: selectedVideo.v_url,
                },
              }}
                autoplay={true}
              // initialObjectFit={'scale-down'}
              />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: 16 }}>
              <h1>{selectedVideo.title}</h1>
              <p style={{ flex: 1, textAlign: 'left' }}>{selectedVideo.note}</p>
              <div className="Button" onClick={() => setPlayMode(false)}>返回</div>
            </div>
          </div>
          :
          <div className="Gallery">
            {
              Videos.map((img, i) =>
                <div key={i}
                  onMouseEnter={() => handleHover(i)}
                  onMouseLeave={() => handleHover(-1)}
                  onClick={() => handleClickPlay(i)}
                  className={i === selectedIndex ? "Thumb ThumbSelected" : "Thumb"}
                  style={{ backgroundImage: `url(${img.p_url})`, width: thumbSize[0], height: thumbSize[1] }}>
                  {
                    i === selectedIndex &&
                    <div className="banner">
                      <p>{img.title}</p>
                    </div>
                  }
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
