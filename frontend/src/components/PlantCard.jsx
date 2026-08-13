import { Droplets, Edit3, History, MapPin, Sun, Trash2 } from "lucide-react";

const date = value => value ? new Date(value).toLocaleDateString() : "Never";

export default function PlantCard({ plant, onView, onEdit, onDelete, onWater }) {
  return (
    <article className="plant-card">
      <div className="plant-icon">🌿</div>
      <div className="plant-card-content">
        <div className="card-title-row">
          <div>
            <h3>{plant.name}</h3>
            <p>{plant.species || "Species not specified"}</p>
          </div>
          <span className="status-badge">{plant.lastWatered ? "Healthy" : "New"}</span>
        </div>
        <div className="plant-meta">
          <span><MapPin size={15}/> {plant.location || "No location"}</span>
          <span><Sun size={15}/> {plant.sunlight}</span>
        </div>
        <div className="watering-row">
          <div><small>Last watered</small><strong>{date(plant.lastWatered)}</strong></div>
          <div><small>Frequency</small><strong>Every {plant.wateringFrequency} days</strong></div>
        </div>
        <div className="card-actions">
          <button className="btn primary" onClick={() => onWater(plant.id)}><Droplets size={16}/> Water</button>
          <button className="btn secondary" onClick={() => onView(plant.id)}><History size={16}/> History</button>
          <button className="icon-btn" onClick={() => onEdit(plant)}><Edit3 size={17}/></button>
          <button className="icon-btn danger" onClick={() => onDelete(plant.id)}><Trash2 size={17}/></button>
        </div>
      </div>
    </article>
  );
}
