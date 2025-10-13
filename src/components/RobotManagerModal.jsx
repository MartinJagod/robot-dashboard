import React, { useEffect, useState } from "react";
import { X, Plus, Save, Trash } from "lucide-react";
import { API_BASE } from "../utils/apiBase";
import { preloadRobots } from "../utils/robotsStore";   // 👈 importar
import "./RobotManagerModal.css";

/* ───────────────────────────────────────────── */
export default function RobotManagerModal({ open, onClose }) {
  const [robots, setRobots]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [dirty,   setDirty]   = useState(false);       // marca cambios

  /* lee robots al abrir */
  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/robots`);
        if (!res.ok) throw new Error();
        setRobots(await res.json());
      } catch {
        setError("Error al obtener los robots");
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  /* ===== helpers ===== */
  const handleField = (i,f,v)=>
    setRobots(r=>r.map((row,idx)=>(idx===i?{...row,[f]:v}:row)));

  const addRow = () => {
    setRobots(r => [...r,{id:null,user_id:1,name:"",status:1}]);
    setDirty(true);
  };

  const saveRow = async row => {
    try {
      const isNew  = row.id == null;
      const url    = isNew ? `${API_BASE}/robots`
                           : `${API_BASE}/robots/${row.id}`;
      const method = isNew ? "POST" : "PUT";
      const body   = JSON.stringify({
        user_id: row.user_id ?? 1,
        name:    row.name,
        status:  Number(row.status)
      });

      const res = await fetch(url,{method,headers:{"Content-Type":"application/json"},body});
      if (!res.ok) throw new Error();

      if (isNew) {
        const { id } = await res.json();
        setRobots(rs => rs.map(r => (r===row ? {...r,id} : r)));
      }
      setDirty(true);
    } catch { alert("Error al guardar"); }
  };

  const deleteRow = async row => {
    if (row.id == null) {
      setRobots(r=>r.filter(x=>x!==row));
      setDirty(true);
      return;
    }
    if (!window.confirm(`¿Eliminar “${row.name}”?`)) return;

    try {
      const res = await fetch(`${API_BASE}/robots/${row.id}`,{method:"DELETE"});
      if (!res.ok) throw new Error();
      setRobots(r=>r.filter(x=>x.id!==row.id));
      setDirty(true);
    } catch { alert("Error al borrar"); }
  };

  /* --- al cerrar: refresca ROBOTS si hubo cambios --- */
  const handleClose = async () => {
    if (dirty) await preloadRobots();   // 🔄 actualiza la lista global
    setDirty(false);
    onClose();                          // avisa al padre
  };

  if (!open) return null;               // modal oculto

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <header className="modal-header">
          <h2>Administrar Robots</h2>
          <button onClick={handleClose} className="icon-btn" aria-label="Cerrar">
            <X size={20}/>
          </button>
        </header>

        {error && <p className="error-msg">{error}</p>}
        {loading ? (
          <p>Cargando…</p>
        ) : (
          <table className="robots-table">
            <thead>
              <tr><th>Nombre</th><th>Status</th><th style={{textAlign:"center"}}>Acciones</th></tr>
            </thead>
            <tbody>
              {robots.map((r,idx)=>(
                <tr key={idx}>
                  <td><input value={r.name} onChange={e=>handleField(idx,"name",e.target.value)}/></td>
                  <td>
                    <select value={r.status} onChange={e=>handleField(idx,"status",e.target.value)}>
                      <option value={1}>Activo</option>
                      <option value={0}>Inactivo</option>
                      <option value={3}>Reparación</option>
                    </select>
                  </td>
                  <td className="actions">
                    <button onClick={()=>saveRow(r)}  className="icon-btn" title="Guardar"><Save size={18}/></button>
                    <button onClick={()=>deleteRow(r)} className="icon-btn" title="Borrar"><Trash size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button onClick={addRow} className="add-btn">
          <Plus size={18}/> Añadir robot
        </button>
      </div>
    </div>
  );
}
