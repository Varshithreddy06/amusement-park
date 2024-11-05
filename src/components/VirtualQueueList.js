import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";

const VirtualQueueList = ({ rideId }) => {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const queueRef = ref(db, `rides/${rideId}/queue`);
    onValue(queueRef, (snapshot) => {
      const queueData = snapshot.val() || [];
      setQueue(
        Object.values(queueData).sort(
          (a, b) => a.queuePosition - b.queuePosition
        )
      );
    });
  }, [rideId]);

  return (
    <div>
      <h6>Queue for this Ride</h6>
      <ul>
        {queue.map((entry, index) => (
          <li key={entry.userId}>
            {`User Name: ${entry.userName} - Position: ${index + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VirtualQueueList;
