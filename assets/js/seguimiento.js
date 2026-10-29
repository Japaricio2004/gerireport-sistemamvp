const taskStorageKey = "gerireport_tasks";
const taskStatuses = ["pending", "active", "done"];
const taskStatusLabels = ["Pendiente", "En proceso", "Completado"];
const demoTasks = [
  { id: 1, title: "Control de presión", patient: "Jorge Gálvez", time: "16:00", priority: "Alta", status: "pending" },
  { id: 2, title: "Revisar hidratación", patient: "Elena Campos", time: "Durante el turno", priority: "Media", status: "pending" },
  { id: 3, title: "Registrar medicación", patient: "María López", time: "Dosis nocturna", priority: "Media", status: "active" },
  { id: 4, title: "Reporte de alimentación", patient: "María López", time: "Almuerzo registrado", priority: "Completada", status: "done" },
  { id: 5, title: "Observación de movilidad", patient: "Elena Campos", time: "Sin incidencias", priority: "Completada", status: "done" },
];

function getTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(taskStorageKey));
    if (Array.isArray(saved)) return saved;
  } catch {}
  localStorage.setItem(taskStorageKey, JSON.stringify(demoTasks));
  return demoTasks;
}

function renderTasks() {
  const tasks = getTasks();
  document.querySelectorAll(".kanban-col").forEach((column, index) => {
    const status = taskStatuses[index];
    const currentTasks = tasks.filter((task) => task.status === status);
    const count = column.querySelector(".count");
    if (count) count.textContent = currentTasks.length;
    column.querySelectorAll(".task-card").forEach((card) => card.remove());
    currentTasks.forEach((task) => {
      const card = document.createElement("article");
      card.className = `task-card${status === "done" ? " done" : ""}`;
      const previous = index > 0
        ? `<button class="task-control" onclick="moveTask(${task.id}, -1)">← ${taskStatusLabels[index - 1]}</button>`
        : "";
      const next = index < taskStatuses.length - 1
        ? `<button class="task-control" onclick="moveTask(${task.id}, 1)">Pasar a ${taskStatusLabels[index + 1]} →</button>`
        : "";
      card.innerHTML = `
        <strong>${task.title}</strong>
        <p>${task.patient} · ${task.time}</p>
        <span class="task-priority ${task.priority === "Alta" ? "priority-high" : ""}">${task.priority === "Alta" ? '<i class="fas fa-circle-exclamation"></i> ' : ""}${task.priority}</span>
        <div class="task-controls">${previous}${next}</div>
      `;
      column.append(card);
    });
  });
}

function moveTask(id, direction) {
  const tasks = getTasks();
  const task = tasks.find((item) => item.id === id);
  if (!task) return;
  const current = taskStatuses.indexOf(task.status);
  const next = Math.max(0, Math.min(taskStatuses.length - 1, current + direction));
  if (next === current) return;
  task.status = taskStatuses[next];
  localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
  renderTasks();
}

renderTasks();
