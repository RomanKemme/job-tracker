import React, { useEffect, useState } from 'react';

function App() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [firma, setFirma] = useState("");
  const [stelle, setStelle] = useState("");
  const [status, setStatus] = useState("Beworben");
  const [notizen, setNotizen] = useState("");

  const loadJobs = () => {
    fetch("http://127.0.0.1:8000/jobs")
      .then(res => res.json())
      .then(data => setJobs(data));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const createJob = () => {
    fetch("http://127.0.0.1:8000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firma, stelle, status, notizen })
    }).then(() => loadJobs());
  };

  const deleteJob = (id: number) => {
    fetch(`http://127.0.0.1:8000/jobs/${id}`, {
      method: "DELETE"
    }).then(() => loadJobs());
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🗂️ Job Tracker</h1>

      <div style={{ marginBottom: "2rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input placeholder="Firma" value={firma} onChange={e => setFirma(e.target.value)} />
        <input placeholder="Stelle" value={stelle} onChange={e => setStelle(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option>Beworben</option>
          <option>Interview</option>
          <option>Angebot</option>
          <option>Abgelehnt</option>
          <option>Noch nicht beworben</option>
        </select>
        <input placeholder="Notizen" value={notizen} onChange={e => setNotizen(e.target.value)} />
        <button onClick={createJob}>➕ Hinzufügen</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Firma</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Stelle</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Status</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Notizen</th>
            <th style={{ padding: "0.5rem", textAlign: "left" }}>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job: any) => (
            <tr key={job.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "0.5rem" }}>{job.firma}</td>
              <td style={{ padding: "0.5rem" }}>{job.stelle}</td>
              <td style={{ padding: "0.5rem" }}>{job.status}</td>
              <td style={{ padding: "0.5rem" }}>{job.notizen}</td>
              <td style={{ padding: "0.5rem" }}>
                <button onClick={() => deleteJob(job.id)}>🗑️ Löschen</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;