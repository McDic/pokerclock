import { Group, Panel, Separator, useDefaultLayout } from "react-resizable-panels";
import { TimerDisplay } from "./TimerDisplay";
import { BlindInfo } from "./BlindInfo";
import { TournamentInfo } from "./TournamentInfo";
import { TimerControls } from "./TimerControls";
import { useTimer } from "../../hooks/useTimer";
import { useWakeLock } from "../../hooks/useWakeLock";
import { useTournamentState } from "../../context/TournamentContext";
import styles from "./TimerView.module.css";

export function TimerView() {
  const { isRunning } = useTournamentState();
  useTimer();
  useWakeLock(isRunning);

  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: "timer-panels",
    storage: localStorage,
  });

  return (
    <div className={styles.container}>
      <Group
        orientation="vertical"
        defaultLayout={defaultLayout}
        onLayoutChanged={onLayoutChanged}
      >
        <Panel id="timer" defaultSize={60} minSize={30}>
          <TimerDisplay />
        </Panel>
        <Separator className={styles.resizeHandle} />
        <Panel id="blinds" defaultSize={25} minSize={15}>
          <BlindInfo />
        </Panel>
        <Separator className={styles.resizeHandle} />
        <Panel id="info" defaultSize={15} minSize={8}>
          <TournamentInfo />
        </Panel>
      </Group>
      <TimerControls />
    </div>
  );
}
