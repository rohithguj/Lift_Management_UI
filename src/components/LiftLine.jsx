import React, { useEffect, useState } from "react";
import "../css/LiftLine.css";

const LiftLine = ({ liftId, liftData, maxFloor }) => {
  const [status, setStatus] = useState("idle");
  const [currentFloor, setCurrentFloor] = useState(null);
  const [alarm, setAlarm] = useState(0);
  const [doorOpen, setDoorOpen] = useState(0);

  useEffect(() => {
    if (liftData) {
      setStatus(liftData.status || "idle");
      setCurrentFloor(liftData.current_floor || 0);
      setAlarm(liftData.alarm || 0);
      setDoorOpen(liftData.door_open || 0);
    }
  }, [liftData]);

  const isBlocked = liftId === "{}";

  // Line color logic
  let lineClass = "lift-line";
  if (isBlocked) {
    lineClass += " blocked-line";
  } else if (alarm === 1) {
    lineClass += " alarm-line";
  } else {
    lineClass += " normal-line";
  }

  return (
    <div className="lift-line-container">
      <div className="lift-id-label">Lift {liftId}</div>
      <div className={lineClass}>
        {[...Array(maxFloor)].map((_, index) => {
          const floorNumber = maxFloor - index;
          const isActive = floorNumber === currentFloor;

          return (
            <div key={floorNumber} className="floor-container">
              {isActive && (
                <div
                  className={`lift-hexagon ${doorOpen ? "door-open" : ""}`}
                />
              )}
              <div
                className="floor-dot"
                // style={{
                //     backgroundColor: isBlocked
                //         ? 'grey'
                //         : alarm === 1
                //         ? 'red'
                //         : 'black'
                // }}
              >
                <div  className="floor-dot-text">{floorNumber}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiftLine;
