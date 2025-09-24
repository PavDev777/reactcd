import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom/client";

function App(){
  const [msg, setMsg] = useState("загрузка...");
  useEffect(()=>{
    fetch("/api/hello")
      .then(r=>r.json())
      .then(j=>setMsg(j.message))
      .catch(()=>setMsg("error"));
  },[]);
  return (
    <div style={{textAlign:"center", marginTop:40}}>
      <h1>Frontend (React) 🚀</h1>
      <p>Backend ответ: {msg}</p>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
export default App;