import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import { ListGroup } from "react-bootstrap";

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const notificationsRef = ref(db, `notifications`);

    // Listen for updates to the notifications
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const tempNotif = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));

      console.log(tempNotif);
      console.log(userId);

      // Filter notifications for the current user
      const userNotifications = tempNotif.filter(
        (notification) => notification.userid === userId
      );
      setNotifications(userNotifications);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [userId]);

  return (
    <ListGroup>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <ListGroup.Item key={notification.id} className="notification">
            {notification.message}
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item>No notifications</ListGroup.Item>
      )}
    </ListGroup>
  );
};

export default Notifications;
