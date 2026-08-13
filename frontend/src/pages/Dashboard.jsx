import { useEffect,useMemo,useState } from "react";
import { Leaf,Plus,Sprout,Droplets,Search } from "lucide-react";
import PlantCard from "../components/PlantCard";
import PlantForm from "../components/PlantForm";
import { api } from "../services/api";

export default function Dashboard({onViewPlant}) {
  const [plants,setPlants]=useState([]);
  const [show,setShow]=useState(false);
  const [editing,setEditing]=useState(null);
  const [search,setSearch]=useState("");
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  async function load(){
    try{setLoading(true);setError("");setPlants(await api.getPlants())}
    catch(e){setError(e.message)}
    finally{setLoading(false)}
  }
  useEffect(()=>{load()},[]);

  async function save(data){
    try{
      editing ? await api.updatePlant(editing.id,data) : await api.createPlant(data);
      setShow(false);setEditing(null);await load();
    }catch(e){alert(e.message)}
  }

  async function remove(id){
    if(!confirm("Delete this plant?")) return;
    try{await api.deletePlant(id);await load()}catch(e){alert(e.message)}
  }

  async function water(id){
    try{await api.waterPlant(id);await load()}catch(e){alert(e.message)}
  }

  const filtered=useMemo(()=>{
    const q=search.toLowerCase().trim();
    return q ? plants.filter(p=>[p.name,p.species,p.location].join(" ").toLowerCase().includes(q)) : plants;
  },[plants,search]);

  return <>
    <section className="hero">
      <div>
        <span className="eyebrow"><Leaf size={15}/> Plant care dashboard</span>
        <h1>Grow better.<br/><span>Care smarter.</span></h1>
        <p>Keep every plant, watering record, and care instruction in one simple place.</p>
      </div>
      <button className="btn primary large" onClick={()=>{setEditing(null);setShow(true)}}><Plus size={19}/> Add Plant</button>
    </section>

    <section className="stats">
      <div className="stat-card"><div className="stat-icon"><Sprout/></div><div><small>Total Plants</small><strong>{plants.length}</strong></div></div>
      <div className="stat-card"><div className="stat-icon"><Droplets/></div><div><small>Watering Tracked</small><strong>{plants.filter(p=>p.lastWatered).length}</strong></div></div>
      <div className="stat-card"><div className="stat-icon"><Leaf/></div><div><small>Collection</small><strong>{plants.length?"Growing":"Empty"}</strong></div></div>
    </section>

    <div className="section-heading">
      <div><h2>Your Plants</h2><p>{plants.length} plant{plants.length!==1?"s":""} in your collection</p></div>
      <div className="search-box"><Search size={17}/><input placeholder="Search plants..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
    </div>

    {loading && <div className="empty-state">Loading your plants...</div>}
    {error && <div className="error-box">{error}</div>}
    {!loading&&!error&&!filtered.length && <div className="empty-state"><div className="empty-icon">🌱</div><h3>{search?"No plants found":"Start your collection"}</h3><p>{search?"Try another search term.":"Add your first plant to start tracking care."}</p>{!search&&<button className="btn primary" onClick={()=>setShow(true)}><Plus size={17}/> Add First Plant</button>}</div>}

    <div className="plant-grid">
      {filtered.map(p=><PlantCard key={p.id} plant={p} onView={onViewPlant} onEdit={p=>{setEditing(p);setShow(true)}} onDelete={remove} onWater={water}/>)}
    </div>

    {show&&<PlantForm plant={editing} onClose={()=>{setShow(false);setEditing(null)}} onSubmit={save}/>}
  </>;
}
