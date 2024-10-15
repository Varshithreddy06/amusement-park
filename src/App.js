import React, { useState } from "react";

import Register from "./components/Register";
function App() {
  const [user, setUser] = useState({});

  return <Register user={user} setUser={setUser} />;
}

export default App;
