import { useEffect, useState } from "react";
import { X } from "lucide-react";

const blank = {name:"",species:"",location:"",sunlight:"Indirect",wateringFrequency:7,notes:""};

export default function PlantForm({ plant, onClose, onSubmit }) {
  const [form,setForm] = useState(blank);

  useEffect(() => {
    setForm(plant ? {
      name:plant.name||"", species:plant.species||"", location:plant.location||"",
      sunlight:plant.sunlight||"Indirect", wateringFrequency:plant.wateringFrequency||7,
      notes:plant.notes||""
    } : blank);
  },[plant]);

  const set=(key,value)=>setForm(f=>({...f,[key]:value}));

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={e=>e.stopPropagation()}>
        <div className="modal-header">
          <div><h2>{plant ? "Edit Plant" : "Add New Plant"}</h2><p>Keep your plant information organized.</p></div>
          <button className="icon-btn" onClick={onClose}><X size={19}/></button>
        </div>
        <form onSubmit={e=>{e.preventDefault();onSubmit(form)}}>
          <div className="form-grid">
            <label>Plant Name *
              <input required value={form.name} onChange={e=>set("name",e.target.value)} placeholder="e.g. Monstera"/>
            </label>
            <label>Species
              <input value={form.species} onChange={e=>set("species",e.target.value)} placeholder="e.g. Monstera deliciosa"/>
            </label>
            <label>Location
              <input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="e.g. Living room"/>
            </label>
            <label>Sunlight
              <select value={form.sunlight} onChange={e=>set("sunlight",e.target.value)}>
                <option>Indirect</option><option>Low</option><option>Bright</option><option>Direct</option>
              </select>
            </label>
            <label>Water every (days)
              <input type="number" min="1" value={form.wateringFrequency} onChange={e=>set("wateringFrequency",e.target.value)}/>
            </label>
            <label className="full">Notes
              <textarea rows="4" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Add useful information..."/>
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onClose}>Cancel</button>
            <button className="btn primary">{plant ? "Save Changes" : "Add Plant"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
