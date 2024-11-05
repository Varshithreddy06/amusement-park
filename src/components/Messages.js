import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { ref, onValue, set } from "firebase/database";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

function Messages({ user }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const chatsRef = ref(db, "messages");
    onValue(chatsRef, (snapshot) => {
      const chatList = [];
      snapshot.forEach((childSnapshot) => {
        const chat = childSnapshot.val();
        chatList.push({ id: childSnapshot.key, ...chat });
      });
      setChats(chatList);
    });
  }, []);

  useEffect(() => {
    if (selectedChat) {
      const messagesRef = ref(db, `messages/${selectedChat.id}/messages`);
      onValue(messagesRef, (snapshot) => {
        const messageList = [];
        snapshot.forEach((childSnapshot) => {
          messageList.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        setMessages(messageList);
      });
    }
  }, [selectedChat]);

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const handleInputChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;

    const messageData = {
      senderId: user.id,
      message: messageInput,
      timestamp: Date.now(),
    };

    const messagesRef = ref(
      db,
      `messages/${selectedChat.id}/messages/${Date.now()}`
    );
    await set(messagesRef, messageData);
    setMessageInput(""); // Clear the input field after sending
  };

  return (
    <Container fluid className="pt-5 messages">
      <Row>
        <Col md={4} className="border-end">
          <h3>Chats</h3>
          {chats.map((chat) => (
            <Card
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              style={{ cursor: "pointer", marginBottom: "10px" }}
            >
              <Card.Body>
                <Card.Title>{chat.name || chat.id}</Card.Title>
              </Card.Body>
            </Card>
          ))}
        </Col>

        <Col md={7} className="bg-white p-3">
          {selectedChat ? (
            <>
              <h3>Chat with {selectedChat.name || selectedChat.id}</h3>
              <div
                style={{
                  maxHeight: "500px",
                  border: "1px solid #ddd",
                  padding: "10px",
                }}
              >
                <>
                  <strong>You:</strong>
                  <p>{selectedChat.message}</p>
                </>
                {messages.map((msg) => (
                  <div key={msg.id} style={{ margin: "5px 0" }}>
                    <strong>
                      {msg.senderId === user.id ? "You" : selectedChat.name}:
                    </strong>
                    <p>{msg.message}</p>
                  </div>
                ))}
              </div>
              <Form onSubmit={handleSubmit} className="mt-3">
                <Form.Group controlId="messageInput">
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={messageInput}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button type="submit" className="mt-2">
                  Send
                </Button>
              </Form>
            </>
          ) : (
            <h3>Please select a chat</h3>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Messages;
