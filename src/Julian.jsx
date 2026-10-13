import { useEffect, useImperativeHandle, useRef } from "react";
import leftArm from "./assets/julian/left-arm.png";
import head from "./assets/julian/head.png";
import eyesOpen from "./assets/julian/eyes-open.png";
import eyesClosed from "./assets/julian/eyes-closed.png";
import torso from "./assets/julian/torso.png";
import hips from "./assets/julian/hips.png";
import rightUpperArm from "./assets/julian/right-upper-arm.png";
import rightForearm from "./assets/julian/right-forearm.png";
import leftThigh from "./assets/julian/left-thigh.png";
import leftShin from "./assets/julian/left-shin.png";
import leftFoot from "./assets/julian/left-foot.png";
import rightThigh from "./assets/julian/right-thigh.png";
import rightShin from "./assets/julian/right-shin.png";
import rightFoot from "./assets/julian/right-foot.png";

// Every sprite shares one canvas, so each layer fills the whole box and lines up on its own.
// Joints rotate around their pivot (as % of the box). `follow` is how strongly a joint swings
// against the body, and `lag` how far behind it trails (radians), so limbs dangle loosely.
const JOINTS = {
  body: { pivot: "30.6% 2.8%", follow: -1, lag: 0 }, // the raised fist he hangs from
  neck: { pivot: "44.4% 30.9%", follow: 0.35, lag: 0.5 },
  shoulder: { pivot: "62.3% 33.9%", follow: 0.6, lag: 0.4 },
  elbow: { pivot: "65.8% 50.5%", follow: 0.5, lag: 0.9 },
  leftHip: { pivot: "32.2% 55.4%", follow: 0.45, lag: 0.45 },
  leftKnee: { pivot: "43.6% 74%", follow: 0.4, lag: 0.9 },
  leftAnkle: { pivot: "34.5% 91.3%", follow: 0.5, lag: 1.3 },
  rightHip: { pivot: "58.6% 54.7%", follow: 0.4, lag: 0.55 },
  rightKnee: { pivot: "73.9% 67.9%", follow: 0.45, lag: 1 },
  rightAnkle: { pivot: "67.7% 85.1%", follow: 0.5, lag: 1.4 },
};

const SWAY_DEGREES = 7; // how far he swings while the ribbon is pinned
const SWING_PERIOD = 2.6; // seconds per full swing
const SETTLE_TIME = 1.4; // seconds for the swing to shrink to about a third
const BLINK_DELAY = 600; // ms after he stops before blinking
const BLINK_LENGTH = 160;
const GRIP_TIME = 0.35; // seconds for his fist to tighten on the ribbon once he appears

const Joint = ({ name, children }) => (
  <div
    className="julian-joint"
    data-joint={name}
    style={{ transformOrigin: JOINTS[name].pivot }}
  >
    {children}
  </div>
);

const Layer = ({ src, className }) => (
  <img
    className={className ? `julian-layer ${className}` : "julian-layer"}
    src={src}
    alt=""
  />
);

// Julian hangs from the outer edge of the ribbon by one hand. He sways while the ribbon is pinned, and once it
// starts scrolling away the swing slowly dies out, he blinks, and he hangs still.
// Figure.jsx drives him through `ref.update(progress)` on every scroll frame, and squeezes the
// ribbon to match through `onPose(bodyAngle, gripStrength)`.
const Julian = ({ ref, showAt, onPose }) => {
  const rootRef = useRef(null);
  const onPoseRef = useRef(onPose);
  useEffect(() => {
    onPoseRef.current = onPose;
  });
  const state = useRef({
    shown: false,
    settling: false,
    settled: false,
    settleStart: 0,
    shownAt: 0,
    frame: 0,
    blink: 0,
  });

  useEffect(() => {
    const root = rootRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const current = state.current;
    const omega = (2 * Math.PI) / SWING_PERIOD;
    const jointNodes = Object.fromEntries(
      [...root.querySelectorAll("[data-joint]")].map((node) => [
        node.dataset.joint,
        node,
      ]),
    );

    const pose = (degrees, time) => {
      for (const [name, { follow, lag }] of Object.entries(JOINTS)) {
        const angle = -follow * degrees * Math.sin(omega * time - lag);
        jointNodes[name].style.transform = `rotate(${angle.toFixed(2)}deg)`;
      }
      const tighten = reduceMotion.matches
        ? 1
        : Math.min((performance.now() / 1000 - current.shownAt) / GRIP_TIME, 1);
      onPoseRef.current?.(
        degrees * Math.sin(omega * time),
        tighten * tighten * (3 - 2 * tighten),
      );
    };

    const blink = () => {
      root.classList.add("is-blinking");
      current.blink = setTimeout(
        () => root.classList.remove("is-blinking"),
        BLINK_LENGTH,
      );
    };

    const tick = (now) => {
      const time = now / 1000;
      let amplitude = reduceMotion.matches ? 0 : SWAY_DEGREES;
      if (current.settling) {
        amplitude *= Math.exp(-(time - current.settleStart) / SETTLE_TIME);
      }
      if (current.settling && amplitude < 0.05) {
        // The swing has died out: rest exactly in the drawn pose, then blink once
        pose(0, 0);
        current.frame = 0;
        current.settled = true;
        current.blink = setTimeout(
          blink,
          reduceMotion.matches ? 0 : BLINK_DELAY,
        );
        return;
      }
      pose(amplitude, time);
      current.frame = requestAnimationFrame(tick);
    };

    // Only animates while he's on screen and still moving
    current.sync = () => {
      if (current.shown && !current.settled && !current.frame) {
        current.frame = requestAnimationFrame(tick);
      } else if (!current.shown && current.frame) {
        cancelAnimationFrame(current.frame);
        current.frame = 0;
      }
    };

    return () => {
      cancelAnimationFrame(current.frame);
      clearTimeout(current.blink);
      current.frame = 0;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    update(progress) {
      const current = state.current;
      const root = rootRef.current;
      if (progress >= showAt && !current.shown) {
        current.shownAt = performance.now() / 1000;
      }
      current.shown = progress >= showAt;
      root.classList.toggle("is-shown", current.shown);

      if (progress >= 1 && !current.settling) {
        // The ribbon is done growing and starts scrolling up: let the swing die out
        current.settling = true;
        current.settleStart = performance.now() / 1000;
      } else if (!current.shown && current.settling) {
        // Out of sight again: reset so the whole thing replays on the way back down
        current.settling = false;
        current.settled = false;
        clearTimeout(current.blink);
        root.classList.remove("is-blinking");
      }
      current.sync();
    },
  }));

  return (
    <div className="julian" ref={rootRef} aria-hidden="true">
      <Joint name="body">
        <Joint name="shoulder">
          <Joint name="elbow">
            <Layer src={rightForearm} />
          </Joint>
          <Layer src={rightUpperArm} />
        </Joint>
        <Joint name="rightHip">
          <Joint name="rightKnee">
            <Joint name="rightAnkle">
              <Layer src={rightFoot} />
            </Joint>
            <Layer src={rightShin} />
          </Joint>
          <Layer src={rightThigh} />
        </Joint>
        <Joint name="leftHip">
          <Joint name="leftKnee">
            <Joint name="leftAnkle">
              <Layer src={leftFoot} />
            </Joint>
            <Layer src={leftShin} />
          </Joint>
          <Layer src={leftThigh} />
        </Joint>
        <Layer src={hips} />
        <Layer src={torso} />
        <Joint name="neck">
          <Layer src={head} />
          <Layer src={eyesOpen} className="julian-eyes-open" />
          <Layer src={eyesClosed} className="julian-eyes-closed" />
        </Joint>
        <Layer src={leftArm} />
      </Joint>
    </div>
  );
};

export default Julian;
