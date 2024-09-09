import { useEffect, useRef, useState } from 'react'
import './App.css'


type Position = {
  top: number;
  left: number
}

type ReactionTimeEntry = {
  id: number;
  time: number;
}



function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [intervalTime, setIntervalTime] = useState<number>(1);
  const [pixelPosition, setPixelPosition] = useState<Position>({ top: 0, left: 0 })
  const [reactionTimes, setReactionTimes] = useState<ReactionTimeEntry[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [lastClickedTime, setLastClikedTime] = useState<number | null>(null);
  const [lastPixelMoveTime, setLastPixelMoveTime] = useState<number | null>(null)
  const playAreaRef = useRef<HTMLDivElement>(null)

  const minTime = 1;
  const maxTime = 10;

  useEffect(() => {
    if (isPlaying && !isPaused) {
      startMovingPixel();
    }

    return () => {
      if (timer) clearInterval(timer);
    }
  }, [isPlaying, isPaused, intervalTime])

  const startMovingPixel = () => {
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      movePixelRandomly();
    }, intervalTime * 1000);
    setTimer(newTimer)
  }

  //function calls
  const movePixelRandomly = () => {
    if (playAreaRef.current) {
      const playAreaWidth = playAreaRef.current.offsetWidth;
      const playAreaHeight = playAreaRef.current.offsetHeight;
      const randomTop = Math.random() * (playAreaHeight - 10);
      const randomLeft = Math.random() * (playAreaWidth - 10);

      setPixelPosition({ top: randomTop, left: randomLeft });
      setLastPixelMoveTime(Date.now())
    }
  }

  const handleStart = () => {
    setIsPlaying(true);
    setIsPaused(false);
    setLastClikedTime(null);
    movePixelRandomly();
  }

  const handlePause = () => {
    setIsPaused(!isPaused);
    if (timer) clearInterval(timer)
  }

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setReactionTimes([]);
    if (timer) clearInterval(timer)
  }

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInterval = Math.max(minTime, Math.min(maxTime, Number(e.target.value)));
    setIntervalTime(newInterval);
  }

  const handlePixelClick = () => {
    const currentTime = Date.now();
    if (lastPixelMoveTime) {
      const reactionTime = (currentTime - lastPixelMoveTime) / 1000;
      const newEntry: ReactionTimeEntry = {
        id: reactionTimes.length + 1,
        time: reactionTime
      };
      setReactionTimes([...reactionTimes, newEntry]);
    }
    setLastClikedTime(currentTime);
    movePixelRandomly();
  }

  return (
    <div className='app-cont'>
      <div className='btn-cont'>
        <button className="start" onClick={handleStart}>Start</button>
        <button className="pause" onClick={handlePause}>Pause</button>
        <button className="reset" onClick={handleReset}>Reset</button>
        <input
          className='input-sec'
          type='number'
          value={intervalTime}
          onChange={handleIntervalChange}
          min={minTime}
          max={maxTime}
        ></input><span className="seconds-lbl">seconds</span>
      </div>
      <div className="game-and-react-cont">
        <div className='game-cont' ref={playAreaRef}>
          {
            isPlaying && !isPaused && (
              <div
                className='pixel-object'
                onClick={handlePixelClick}
                style={{
                  top: `${pixelPosition.top}px`,
                  left: `${pixelPosition.left}`
                }}
              ></div>
            )
          }
        </div>
        {/* <div className='reaction-cont'></div> */}
        <table>
          <thead>
            <tr>
              <th>Mouse click</th>
              <th>Reaction time</th>
            </tr>
          </thead>
          <tbody>
            {
              reactionTimes.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.id}</td>
                  <td>{entry.id.toFixed(3)}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
