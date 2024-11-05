import React from "react";
import { ref, push, update } from "firebase/database";
import { db } from "../firebase/config";

const JoinQueueButton = ({ rideId, userId }) => {
  const handleJoinQueue = async () => {
    const queueRef = ref(db, `rides/${rideId}/queue`);
    const newQueueEntryRef = push(queueRef);

    await update(newQueueEntryRef, {
      userId,
      queuePosition: newQueueEntryRef.key,
      timestamp: Date.now(),
    });
  };

  return <button onClick={handleJoinQueue}>Join Queue</button>;
};

export default JoinQueueButton;
