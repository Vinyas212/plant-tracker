import { useEffect,useState } from "react";
import { ArrowLeft,CalendarDays,Droplets,Leaf,MapPin,Save,Sun } from "lucide-react";
import { api } from "../services/api";

const fmt=v=>v?new Date(v).toLocaleString():"Unknown";

export default function PlantDetails({plantId,onBack}) {
  const [plant,setPlant]=useState(null);
  const [history,setHistory]=useState([]);
  const [care,setCare]=useState("");
  const [loading,setLoading]=useState(true);

  async function load(){
    try{
      setLoading(true);
      const [p,h]=await Promise.all([api.getPlant(plantId),api.getHistory(plantId)]);
      setPlant(p);setHistory(h);setCare(p.careInstructions||"");
    }catch(e){alert(e.message);onBack()}finally{setLoading(false)}
  }
  useEffect(()=>{load()},[plantId]);

  if(loading)return <div className="empty-state">Loading plant details...</div>;
  if(!plant)return null;

  return <div>
    <button className="back-btn" onClick={onBack}><ArrowLeft size={17}/> Back to plants</button>

    <section className="details-header">
      <div className="details-plant-icon">🌿</div>
      <div className="details-title"><span className="eyebrow"><Leaf size={15}/> Plant profile</span><h1>{plant.name}</h1><p>{plant.species||"Species not specified"}</p></div>
      <button className="btn primary" onClick={async()=>{await api.waterPlant(plantId);load()}}><Droplets size={17}/> Record Watering</button>
    </section>

    <div className="details-grid">
      <section className="panel">
        <h2>Plant Information</h2>
        <div className="info-grid">
          <div><MapPin size={18}/><span><small>Location</small><strong>{plant.location||"Not specified"}</strong></span></div>
          <div><Sun size={18}/><span><small>Sunlight</small><strong>{plant.sunlight}</strong></span></div>
          <div><Droplets size={18}/><span><small>Watering</small><strong>Every {plant.wateringFrequency} days</strong></span></div>
          <div><CalendarDays size={18}/><span><small>Added</small><strong>{fmt(plant.createdAt)}</strong></span></div>
        </div>
        {plant.notes&&<div className="notes-box"><small>Notes</small><p>{plant.notes}</p></div>}
      </section>

      <section className="panel">
        <div className="panel-title"><div><h2>Care Instructions</h2><p>Keep important care information here.</p></div><button className="btn primary" onClick={async()=>{await api.saveCare(plantId,care);load()}}><Save size={16}/> Save</button></div>
        <textarea className="care-editor" rows="8" value={care} onChange={e=>setCare(e.target.value)} placeholder="Water when the top layer of soil is dry..."/>
      </section>

      <section className="panel history-panel">
        <div className="panel-title"><div><h2>Plant History</h2><p>Recent watering and care activity.</p></div><span className="history-count">{history.length} events</span></div>
        {!history.length?<div className="small-empty">No history yet. Record your first watering.</div>:
          <div className="timeline">{history.map(e=><div className="timeline-item" key={`${e.type}-${e.id}`}><div className="timeline-dot">{e.type==="watering"?<Droplets size={15}/>:<Leaf size={15}/>}</div><div><strong>{e.description}</strong><small>{fmt(e.date)}</small>{e.notes&&<p>{e.notes}</p>}</div></div>)}</div>}
      </section>
    </div>
  </div>;
}
