// src/utils/robotsStore.js
import { API_BASE } from "./apiBase";

/* ────── Constante global ──────
   Se mantiene la MISMA referencia para que otros módulos
   puedan importar { ROBOTS } y ver los cambios en tiempo real. */
export let ROBOTS = [];

/* ────── Función de carga / refresco ────── */
export async function preloadRobots() {
  try {
    const res = await fetch(`${API_BASE}/robots`); // trae todos
    if (!res.ok) throw new Error("Bad response");

    const data = await res.json();

    const activeNames = [...new Set(
      data
        .filter(r => Number(r.status) === 1) // solo activos
        .map(r => r.name.trim())             // solo nombres
    )];

    /* Mutamos el array sin cambiar la referencia */
    ROBOTS.splice(0, ROBOTS.length, ...activeNames);
    return true;
  } catch (err) {
    console.error("⚠️ No se pudieron cargar los robots:", err);
    return false;
  }
}

/* ────── Carga inicial (una sola vez al iniciar la app) ────── */
preloadRobots();
