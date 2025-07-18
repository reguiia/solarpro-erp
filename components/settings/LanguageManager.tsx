import { useEffect, useState } from 'react';

export default function LanguageManager() {
  const [languages, setLanguages] = useState([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/settings?type=language')
      .then(res => res.json())
      .then(data => setLanguages(data.data || []));
  }, []);

  const addLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'language', code, name })
    });
    if (res.ok) {
      const { data } = await res.json();
      setLanguages([...languages, data]);
      setCode('');
      setName('');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Languages</h2>
      <ul className="mb-4">
        {languages.map((lang, idx) => (
          <li key={lang.id || idx} className="text-sm">{lang.code} - {lang.name}</li>
        ))}
      </ul>
      <form onSubmit={addLanguage} className="flex gap-2 items-end">
        <input value={code} onChange={e => setCode(e.target.value)} placeholder="Code (e.g. en)" required className="border px-2 py-1 rounded" />
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required className="border px-2 py-1 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
      </form>
    </div>
  );
} 