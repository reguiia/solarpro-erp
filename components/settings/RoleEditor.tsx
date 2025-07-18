import { useEffect, useState } from 'react';

export default function RoleEditor() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [desc, setDesc] = useState('');

  useEffect(() => {
    fetch('/api/settings?type=role')
      .then(res => res.json())
      .then(data => setRoles(data.data || []));
  }, []);

  const addRole = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'role', name: newRole, description: desc })
    });
    if (res.ok) {
      const { data } = await res.json();
      setRoles([...roles, data]);
      setNewRole('');
      setDesc('');
    }
  };

  return (
    <div>
      <h2>Roles</h2>
      <ul>
        {roles.map(role => (
          <li key={role.id}>{role.name} - {role.description}</li>
        ))}
      </ul>
      <form onSubmit={addRole} className="mt-4">
        <input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Role name" required />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" />
        <button type="submit">Add Role</button>
      </form>
    </div>
  );
} 