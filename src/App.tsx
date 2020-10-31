import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.scss";

import { Select, Option } from "./select";

const gender = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
];

function App() {
  const [active, set] = useState("");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Select
        onChange={({ target }) => {
          set(target.value as string);
        }}
      >
        {gender.map((item) => (
          <Option value={item.value} isActive={item.value === active}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export default App;
