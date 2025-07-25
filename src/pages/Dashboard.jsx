import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState({ cars: 0, users: 0, rentals: 0 });

  useEffect(() => {
    axios.get("/api/admin/stats").then((res) => setStats(res.data));
  }, []);

  return (
    <div>
      <h1>الإحصائيات</h1>
      
      <div className="row mt-4">
        <StatCard title="السيارات" value={stats.cars} icon="🚗" color="success" />
        <StatCard title="المستخدمين" value={stats.users} icon="👥" color="info" />
        <StatCard title="الحجوزات" value={stats.rentals} icon="📝" color="warning" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="col-md-4 mb-3">
      <div className={`card bg-${color} text-white`}>
        <div className="card-body d-flex justify-content-between">
          <div>
            <h5>{title}</h5>
            <h2 className="mb-0">{value}</h2>
          </div>
          <span className="display-4">{icon}</span>
        </div>
      </div>
    </div>
  );
}