// import logo from './logo.svg';
import './App.css';

import { useEffect, useState, useCallback } from 'react';

import Player from 'griffith'

const TITLE = "云天化视频平台"

// datas
const Thumbs = [
  { title: '111', p_url: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.W9Vmgn4nqhN2X-KhIUtniQHaEK?w=305&h=180&c=7&r=0&o=5&dpr=2&pid=1.7', v_url: 'http://10.1.2.27/WebReport/video/10.mp4' },
  { title: '222', p_url: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.G57BoVevShzkLhBF5ONxOgHaLD?w=197&h=295&c=7&r=0&o=5&dpr=2&pid=1.7', v_url: 'http://10.1.2.27/WebReport/video/Sunset-Lapse.mp4' },
  { title: '333', p_url: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.dHe5E7QPKyni0ETe-DOwrgHaLF?w=197&h=295&c=7&r=0&o=5&dpr=2&pid=1.7', v_url: 'http://10.1.2.27/WebReport/video/02.mp4' },
  { title: '444', p_url: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.EpX8wvAau9cwZU-AYHQR4AAAAA?w=197&h=292&c=7&r=0&o=5&dpr=2&pid=1.7' },
  { title: '555', p_url: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.udtFihsO6W7eMMBvhjLpFwHaLO?w=197&h=298&c=7&r=0&o=5&dpr=2&pid=1.7' },
  { title: '666', p_url: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.X4A4aDs8erMOcSKA_Ff9lAHaLH?w=197&h=296&c=7&r=0&o=5&dpr=2&pid=1.7' },
]

// 缩略图w/h
const ThumbWHR = 16 / 9;
const footerHeight = 48;
const headerHeight = 48;

const getGallerySize = () => ({
  height: window.innerHeight - headerHeight - footerHeight,
  width: window.innerWidth
});

const getWindowType = (width, height) => {
  const whr = width / height;
  // console.log('window WHR', whr);
  if (whr < 1) return 'portrait';
  if (whr > 1 && whr < ThumbWHR * 2) return 'normal';
  if (whr >= ThumbWHR * 2) return 'wild';
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

  return (
    <div className="App">
      {
        playMode ?
          <div style={{ width: 400, height: 300 }}>
            <p>{Thumbs[selectedIndex].title}</p>
            <p onClick={() => setPlayMode(false)}>close</p>
            <Player sources={{
              hd: {
                play_url: Thumbs[selectedIndex].v_url,
              },
            }}
              autoplay={true}
            // initialObjectFit={'scale-down'}
            />
          </div>
          :
          <>
            <div style={{ height: headerHeight }}>
              {TITLE}
            </div>
            <div className="Gallery">
              {
                Thumbs.map((img, i) =>
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
            <div style={{ height: footerHeight }}>
              <p>
                {selectedIndex} {`size h:${gallerySize.height} w:${gallerySize.width}`} {`window WHR: ${windowType}`}
              </p>
            </div>
          </>
      }
    </div>

  );
}

export default App;
