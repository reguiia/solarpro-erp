import { useEffect, useState } from 'react';

export default function FormBuilder() {
  const [forms, setForms] = useState([]);
  const [name, setName] = useState('');
  const [config, setConfig] = useState('{}');

  useEffect(() => {
    fetch('/api/settings?type=form')
      .then(res => res.json())
      .then(data => setForms(data.data || []));
  }, []);

  const addForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'form', name, config: JSON.parse(config) })
    });
    if (res.ok) {
      const { data } = await res.json();
      setForms([...forms, data]);
      setName('');
      setConfig('{}');
    }
  };

  return (
    <div>
      <h2>Forms</h2>
      <ul>
        {forms.map(form => (
          <li key={form.id}>{form.name}</li>
        ))}
      </ul>
      <form onSubmit={addForm} className="mt-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Form name" required />
        <textarea value={config} onChange={e => setConfig(e.target.value)} placeholder="Config (JSON)" />
        <button type="submit">Add Form</button>
      </form>
    </div>
  );
} 