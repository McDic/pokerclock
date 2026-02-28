import { Group, Panel, Separator, useDefaultLayout } from "react-resizable-panels";
import { TimerDisplay } from "./TimerDisplay";
import { BlindInfo } from "./BlindInfo";
import { TournamentInfo } from "./TournamentInfo";
import { TimerControls } from "./TimerControls";
import { PrizePanel } from "./PrizePanel";
import { useTimer } from "../../hooks/useTimer";
import { useWakeLock } from "../../hooks/useWakeLock";
import { useTournamentState } from "../../context/TournamentContext";
import styles from "./TimerView.module.css";

export function TimerView() {
  const { isRunning, structure } = useTournamentState();
  useTimer();
  useWakeLock(isRunning);

  const hasPrizes = structure.prizes.length > 0;

  const verticalLayout = useDefaultLayout({
    id: "timer-panels",
    storage: localStorage,
  });

  const horizontalLayout = useDefaultLayout({
    id: "timer-layout",
    storage: localStorage,
  });

  const verticalPanels = (
    <Group
      orientation="vertical"
      defaultLayout={verticalLayout.defaultLayout}
      onLayoutChanged={verticalLayout.onLayoutChanged}
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
  );

  return (
    <div className={styles.container}>
      {hasPrizes ? (
        <Group
          orientation="horizontal"
          defaultLayout={horizontalLayout.defaultLayout}
          onLayoutChanged={horizontalLayout.onLayoutChanged}
        >
          <Panel id="main" defaultSize={80} minSize={50}>
            {verticalPanels}
          </Panel>
          <Separator className={styles.resizeHandleVertical} />
          <Panel id="prizes" defaultSize={20} minSize={10}>
            <PrizePanel />
          </Panel>
        </Group>
      ) : (
        verticalPanels
      )}
      <TimerControls />
    </div>
  );
}
