import { useEffect, useState } from 'react';

export default function PermissionEditor() {
  const [permissions, setPermissions] = useState([]);
  const [role, setRole] = useState('');
  const [module, setModule] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    fetch('/api/settings?type=permission')
      .then(res => res.json())
      .then(data => setPermissions(data.data || []));
  }, []);

  const addPermission = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'permission', role, module, action })
    });
    if (res.ok) {
      const { data } = await res.json();
      setPermissions([...permissions, data]);
      setRole('');
      setModule('');
      setAction('');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-2">Permissions</h2>
      <ul className="mb-4">
        {permissions.map((perm, idx) => (
          <li key={perm.id || idx} className="text-sm">{perm.role} - {perm.module} - {perm.action}</li>
        ))}
      </ul>
      <form onSubmit={addPermission} className="flex gap-2 items-end">
        <input value={role} onChange={e => setRole(e.target.value)} placeholder="Role" required className="border px-2 py-1 rounded" />
        <input value={module} onChange={e => setModule(e.target.value)} placeholder="Module" required className="border px-2 py-1 rounded" />
        <input value={action} onChange={e => setAction(e.target.value)} placeholder="Action" required className="border px-2 py-1 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
      </form>
    </div>
  );
} 