'use client'

import { getCurrentUserProfile, isAdmin } from '@/lib/auth-client';
import RoleEditor from '@/components/settings/RoleEditor';
import FormBuilder from '@/components/settings/FormBuilder';
import LanguageSwitcher from '@/components/settings/LanguageSwitcher';
import PermissionEditor from '@/components/settings/PermissionEditor';
import WorkflowEditor from '@/components/settings/WorkflowEditor';
import LanguageManager from '@/components/settings/LanguageManager';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [forbidden, setForbidden] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCurrentUserProfile().then(profile => {
      if (!profile || !isAdmin(profile.role)) {
        setForbidden(true);
      } else {
        setUserProfile(profile);
      }
    }).catch(() => setError('Failed to load user profile.'));
  }, []);

  if (forbidden) {
    return <div className="text-center text-red-600 mt-10">Forbidden</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  if (!userProfile) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings & Parametrage</h1>
      <div className="mb-6"><LanguageSwitcher /></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded shadow p-6">
          <RoleEditor />
        </div>
        <div className="bg-white rounded shadow p-6">
          <PermissionEditor />
        </div>
        <div className="bg-white rounded shadow p-6 md:col-span-2">
          <FormBuilder />
        </div>
        <div className="bg-white rounded shadow p-6">
          <WorkflowEditor />
        </div>
        <div className="bg-white rounded shadow p-6">
          <LanguageManager />
        </div>
      </div>
    </div>
  );
}
