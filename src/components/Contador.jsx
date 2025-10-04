import { useState } from "react";

const buttonStyle = {
  border: "1px solid white",
  borderRadius: "8px",
  padding: "0.6em 1.2em",
  fontSize: "1em",
  fontFamily: "inherit",
  backgroundColor: "#1a1a1a",
  cursor: "pointer",
  margin: "0.5em",
};

const Contador = () => {
  const [counter, setCounter] = useState(0);
  return (
    <div
      style={{ border: "2px dashed white", padding: "20px", marginTop: "20px" }}
    >
      <p>Esta es un lista de react</p>
      <button style={buttonStyle} onClick={() => setCounter(counter - 1)}>
        -
      </button>
      <p>Counter: {counter}</p>
      <button style={buttonStyle} onClick={() => setCounter(counter + 1)}>
        +
      </button>
    </div>
  );
};

export default Contador;
