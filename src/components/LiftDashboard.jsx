import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import LiftLine from "./LiftLine";
import "../css/LiftDashboard.css";

const LiftDashboard = () => {
  const [liftsData, setLiftsData] = useState([]); // Store full lift data, including id
  const [maxFloor, setMaxFloor] = useState(0);
  const socket = io("http://127.0.0.1:5000"); // Flask backend

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/intialize_data")
      .then((response) => {
        setMaxFloor(response.data.max_floor);
        const liftIds = response.data.lift_ids;
        const initialLiftsData = liftIds.map((liftId) => ({
          id: liftId,
          alarm: 0,
          current_floor: 0,
          door_open: 0,
        }));
        setLiftsData(initialLiftsData);

        // JOIN SOCKET ROOMS FOR EACH LIFT
        liftIds.forEach((liftId) => {
          socket.emit("join_lift", liftId);
          console.log(`Joined lift room: ${liftId}`);
        });
      })
      .catch((error) =>
        console.error("Error fetching initialization data:", error)
      );
  }, []);

  useEffect(() => {
    // Listen for updates from the backend when the lift data changes
    socket.on("lift_data_update", (data) => {
      setLiftsData((prevData) => {
        // Update the specific lift by its id
        const updatedData = prevData.map((lift) => {
          if (lift.id === data.id) {
            return { ...lift, ...data }; // Merge the incoming data with the existing data
          }
          return lift;
        });
        return updatedData;
      });
    });

    // Cleanup when the component unmounts
    return () => {
      // Clean up any socket connections or events when the component is unmounted
      socket.off("lift_data_update");
    };
  }, []); // Empty dependency array ensures this only runs once

  useEffect(() => {
    // Fetch all lift data once when the component mounts (no dependency)
    axios
      .get("http://127.0.0.1:5000/get_all_lifts")
      .then((response) => {
        const lifts = Object.values(response.data.data); // Convert the data to an array
        setLiftsData(lifts); // Set the initial lift data state
      })
      .catch((error) => console.error("Error fetching lifts data:", error));
  }, []); // This runs only once when the component mounts

  console.log(liftsData);

  return (
    <div className="dashboard">
      {liftsData.map((lift) => (
        <LiftLine
          key={lift.id}
          liftId={lift.id}
          liftData={lift}
          maxFloor={maxFloor}
        />
      ))}
    </div>
  );
};

export default LiftDashboard;
