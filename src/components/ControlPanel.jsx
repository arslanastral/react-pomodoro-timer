import React from "react";
import styled from "styled-components";
import Start from "./buttons/Start";
import Reset from "./buttons/Reset";
// import Settings from "./buttons/Settings";
import { Howl } from "howler";
import { useSelector, useDispatch } from "react-redux";
import {
  setClockRuning,
  setClockStopped,
  setCurrentTime,
  setBreakStarted,
  setBreakFinished,
} from "../reducers/clockSlice";

const ControlPanelWrapper = styled.div`
  /* background: black; */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20%;
`;

const ControlPanelContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: clamp(2rem, 35vw + 1rem, 140px);
  height: 46px;
  background: #ffffff;
  border-radius: 47px;
`;

const ControlPanel = () => {
  const isRunning = useSelector((state) => state.clock.isRunning);
  const focusMinutes = useSelector((state) => state.focusTimer.value);
  const breakMinutes = useSelector((state) => state.breakTimer.value);

  const dispatch = useDispatch();

  const startTimerSound = new Howl({
    src: [
      "https://arslanastral.github.io/react-pomodoro-timer/src/sounds/play.mp3",
    ],
    volume: 0.5,
  });

  const stopTimerSound = new Howl({
    src: [
      "https://arslanastral.github.io/react-pomodoro-timer/src/sounds/stop.mp3",
    ],
    volume: 0.5,
  });

  const resetTimerSound = new Howl({
    src: [
      "https://arslanastral.github.io/react-pomodoro-timer/src/sounds/reset.mp3",
    ],
    volume: 0.5,
  });

  const breakStartedSound = new Howl({
    src: [
      "https://arslanastral.github.io/react-pomodoro-timer/src/sounds/breakstarted.mp3",
    ],
    volume: 0.5,
  });

  const breakFinishedSound = new Howl({
    src: [
      "https://arslanastral.github.io/react-pomodoro-timer/src/sounds/breakfinished.mp3",
    ],
    volume: 0.5,
  });

  let timer = 60 * focusMinutes;
  let breakTime = 60 * breakMinutes;
  let countDownInterval = React.useRef(null);

  const startTimer = () => {
    dispatch(setClockRuning());
    let breakStarted = false;
    let start = Date.now(),
      diff,
      minutes,
      seconds;

    const countdown = () => {
      diff = timer - (((Date.now() - start) / 1000) | 0);
      minutes = (diff / 60) | 0;
      seconds = diff % 60 | 0;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      if (breakStarted) {
        document.title = `Break Time! 👉 ${minutes}:${seconds}`;
      } else {
        document.title = `Focus! 💪 ${minutes}:${seconds}`;
      }

      dispatch(setCurrentTime(`${minutes}:${seconds}`));

      if (breakStarted && diff <= 0) {
        breakFinishedSound.play();
        dispatch(setBreakFinished());
        dispatch(setClockStopped());
        clearInterval(countDownInterval.current);
        document.title = "Session Finished! 🎉";
      } else if (!breakStarted && diff <= 0) {
        breakStartedSound.play();
        breakStarted = true;
        dispatch(setBreakStarted());
        start = Date.now();
        timer = breakTime;
      }
    };

    countdown();
    countDownInterval.current = setInterval(countdown, 100);
  };

  const stopTimer = () => {
    dispatch(setClockStopped());
    dispatch(setBreakFinished());
    document.title = "Stopped!";
    clearInterval(countDownInterval.current);
  };

  const handleTimerStart = () => {
    if (!isRunning) {
      startTimerSound.play();
      startTimer();
    } else if (isRunning) {
      stopTimerSound.play();
      stopTimer();
    }
  };

  const handleReset = () => {
    if (isRunning) {
      resetTimerSound.play();
      stopTimer();
      startTimer();
    }
  };

  return (
    <ControlPanelWrapper>
      <ControlPanelContainer>
        <Start onClick={handleTimerStart} isClockRunning={isRunning} />
        <Reset onClick={handleReset} />
        {/* <Settings /> */}
      </ControlPanelContainer>
    </ControlPanelWrapper>
  );
};

export default ControlPanel;
