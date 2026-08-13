import { useState } from "react";
import { Leaf,Sprout } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import PlantDetails from "./pages/PlantDetails";

export default function App(){
  const [selected,setSelected]=useState(null);
  return <div className="app-shell">
    <header className="navbar">
      <div className="brand" onClick={()=>setSelected(null)}>
        <div className="brand-mark"><Leaf size={20}/></div>
        <div><strong>Plant Tracker</strong><span>Simple plant care</span></div>
      </div>
      <div className="nav-status"><span className="online-dot"/> Your garden is growing</div>
    </header>
    <main className="container">
      {selected?<PlantDetails plantId={selected} onBack={()=>setSelected(null)}/>:<Dashboard onViewPlant={setSelected}/>}
    </main>
    <footer className="footer"><Sprout size={16}/> Plant Tracker · Built for better plant care</footer>
  </div>;
}
