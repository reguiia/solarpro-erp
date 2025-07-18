import { useEffect, useState } from 'react';

export default function WorkflowEditor() {
  const [workflows, setWorkflows] = useState([]);
  const [name, setName] = useState('');
  const [config, setConfig] = useState('{}');

  useEffect(() => {
    fetch('/api/settings?type=workflow')
      .then(res => res.json())
      .then(data => setWorkflows(data.data || []));
  }, []);

  const addWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'workflow', name, config: JSON.parse(config) })
    });
    if (res.ok) {
      const { data } = await res.json();
      setWorkflows([...workflows, data]);
      setName('');
      setConfig('{}');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Workflows</h2>
      <ul className="mb-4">
        {workflows.map((wf, idx) => (
          <li key={wf.id || idx} className="text-sm">{wf.name}</li>
        ))}
      </ul>
      <form onSubmit={addWorkflow} className="flex flex-col gap-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Workflow name" required className="border px-2 py-1 rounded" />
        <textarea value={config} onChange={e => setConfig(e.target.value)} placeholder="Config (JSON)" className="border px-2 py-1 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded self-start">Add Workflow</button>
      </form>
    </div>
  );
} 