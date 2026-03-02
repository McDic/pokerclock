import { useZoom, type PanelId } from "../../context/ZoomContext";
import styles from "./ZoomControls.module.css";

export function ZoomControls({ panel }: { panel: PanelId }) {
  const { zoomIn, zoomOut } = useZoom(panel);

  return (
    <div className={styles.controls}>
      <button className={styles.btn} onClick={zoomOut} title="Zoom out">
        −
      </button>
      <button className={styles.btn} onClick={zoomIn} title="Zoom in">
        +
      </button>
    </div>
  );
}
