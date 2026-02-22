export default function CircleCard({ icon, label, onClick }) {
  return (
    <div className="circle-card" onClick={onClick}>
      <div className="circle-icon">{icon}</div>
      <div className="circle-label">{label}</div>
    </div>
  );
}
