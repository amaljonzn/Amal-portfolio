import { useEffect, useRef } from 'react';
import { createDesk } from '../desk';

// Mounts the three.js desk. `active` drives the camera + lamp, `onPick` reports clicks on desk objects.
export default function DeskCanvas({ stageRef, active, onPick, onFail }) {
  const canvasRef = useRef(null);
  const deskRef = useRef(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    let desk;
    try {
      desk = createDesk({ canvas: canvasRef.current, stage: stageRef.current, onPick: (s) => pickRef.current(s) });
    } catch (e) {
      onFail();
      return undefined;
    }
    deskRef.current = desk;
    return () => { desk.dispose(); deskRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (deskRef.current) deskRef.current.setActive(active); }, [active]);

  return <canvas id="c" ref={canvasRef} aria-label="Interactive 3D desk. Click objects or use the menu." />;
}
