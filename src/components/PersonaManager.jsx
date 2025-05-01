import React, { useState } from "react";

export default function PersonaManager({
  personas,
  onSave,
  activePersona,
  setActivePersona,
}) {
  const [current, setCurrent] = useState({
    name: "",
    description: "",
    scope: "",
    goals: "",
    tone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updated = [...personas, current];
    onSave(updated);
    setActivePersona(current);
    localStorage.setItem("ai_personas", JSON.stringify(updated));
    setCurrent({ name: "", description: "", scope: "", goals: "", tone: "" });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">
        🧠 Define Your AI Persona
      </h2>

      <input
        className="w-full border rounded p-2 text-sm"
        name="name"
        placeholder="Persona name (e.g. Marketing Strategist)"
        value={current.name}
        onChange={handleChange}
      />
      <input
        className="w-full border rounded p-2 text-sm"
        name="description"
        placeholder="Short description of the role"
        value={current.description}
        onChange={handleChange}
      />
      <textarea
        className="w-full border rounded p-2 text-sm"
        name="scope"
        placeholder="What does this role control or influence?"
        value={current.scope}
        onChange={handleChange}
      />
      <input
        className="w-full border rounded p-2 text-sm"
        name="goals"
        placeholder="Primary goals (comma-separated)"
        value={current.goals}
        onChange={handleChange}
      />
      <input
        className="w-full border rounded p-2 text-sm"
        name="tone"
        placeholder="Tone (e.g. practical, strategic)"
        value={current.tone}
        onChange={handleChange}
      />

      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        Save Persona
      </button>

      {personas.length > 0 && (
        <div className="pt-4 border-t space-y-2">
          <h3 className="text-sm font-semibold">Saved Personas</h3>
          <ul className="list-disc pl-4 text-sm text-gray-600">
            {personas.map((p, i) => (
              <li key={i}>
                <strong>{p.name}</strong>: {p.description}
              </li>
            ))}
          </ul>

          <div className="pt-4">
            <label className="text-sm font-medium mr-2">
              🎯 Active Persona:
            </label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={activePersona?.name || ""}
              onChange={(e) => {
                const selected = personas.find(
                  (p) => p.name === e.target.value
                );
                setActivePersona(selected || null);
              }}
            >
              <option value="">None</option>
              {personas.map((p, i) => (
                <option key={i} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
