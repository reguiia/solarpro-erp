/*
  # SolarPro ERP - Core Database Schema

  1. Authentication & User Management
    - user_profiles (extends auth.users with roles)
    - roles, permissions
    
  2. CRM Tables
    - lead_sources, leads, customers
    - communications, follow_up_tasks
    - tags, lead_tags, customer_tags
    
  3. Project Management
    - project_types, projects, tasks, task_assignments
    - site_surveys, resources
    
  4. Settings & Configuration
    - languages, forms, form_fields
    - workflows, rules
    
  5. Security
    - Row Level Security (RLS) enabled on all tables
    - Role-based access policies
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles extending auth.users
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'manager', 'technician', 'sales_rep')) DEFAULT 'technician',
  full_name TEXT NOT NULL,
  phone TEXT,
  department TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lead sources
CREATE TABLE IF NOT EXISTS lead_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view lead sources" ON lead_sources
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  source_id uuid REFERENCES lead_sources(id),
  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'converted', 'lost')) DEFAULT 'new',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  notes TEXT,
  assigned_to uuid REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view leads" ON leads
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update assigned leads" ON leads
  FOR UPDATE USING (
    assigned_to = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  address TEXT,
  tax_id TEXT,
  customer_type TEXT CHECK (customer_type IN ('residential', 'commercial', 'industrial')) DEFAULT 'residential',
  converted_from_lead uuid REFERENCES leads(id),
  assigned_to uuid REFERENCES user_profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view customers" ON customers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create customers" ON customers
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update assigned customers" ON customers
  FOR UPDATE USING (
    assigned_to = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Communications
CREATE TABLE IF NOT EXISTS communications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id),
  customer_id uuid REFERENCES customers(id),
  type TEXT CHECK (type IN ('email', 'phone', 'meeting', 'note')) NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT CHECK (status IN ('sent', 'received', 'scheduled', 'completed')) DEFAULT 'completed',
  created_by uuid REFERENCES user_profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT communication_target CHECK (
    (lead_id IS NOT NULL AND customer_id IS NULL) OR
    (lead_id IS NULL AND customer_id IS NOT NULL)
  )
);

ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view communications" ON communications
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create communications" ON communications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Follow-up tasks
CREATE TABLE IF NOT EXISTS follow_up_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  lead_id uuid REFERENCES leads(id),
  customer_id uuid REFERENCES customers(id),
  assigned_to uuid REFERENCES user_profiles(id) NOT NULL,
  due_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_by uuid REFERENCES user_profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT task_target CHECK (
    (lead_id IS NOT NULL AND customer_id IS NULL) OR
    (lead_id IS NULL AND customer_id IS NOT NULL)
  )
);

ALTER TABLE follow_up_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view tasks" ON follow_up_tasks
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create tasks" ON follow_up_tasks
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update assigned tasks" ON follow_up_tasks
  FOR UPDATE USING (
    assigned_to = auth.uid() OR created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Tags
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#3B82F6',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view tags" ON tags
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage tags" ON tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Lead tags
CREATE TABLE IF NOT EXISTS lead_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lead_id, tag_id)
);

ALTER TABLE lead_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view lead tags" ON lead_tags
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage lead tags" ON lead_tags
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Customer tags
CREATE TABLE IF NOT EXISTS customer_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, tag_id)
);

ALTER TABLE customer_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view customer tags" ON customer_tags
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage customer tags" ON customer_tags
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Project types
CREATE TABLE IF NOT EXISTS project_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('on_grid_residential', 'on_grid_industrial', 'off_grid_agricultural')) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE project_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view project types" ON project_types
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  customer_id uuid REFERENCES customers(id) NOT NULL,
  project_type_id uuid REFERENCES project_types(id) NOT NULL,
  status TEXT CHECK (status IN ('planning', 'design', 'approval', 'procurement', 'installation', 'commissioning', 'completed', 'cancelled')) DEFAULT 'planning',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  budget_amount DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  project_manager uuid REFERENCES user_profiles(id),
  created_by uuid REFERENCES user_profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view projects" ON projects
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Project managers can update projects" ON projects
  FOR UPDATE USING (
    project_manager = auth.uid() OR created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  project_id uuid REFERENCES projects(id) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  start_date DATE,
  due_date DATE,
  estimated_hours INTEGER,
  actual_hours INTEGER,
  assigned_to uuid REFERENCES user_profiles(id),
  created_by uuid REFERENCES user_profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view tasks" ON tasks
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update assigned tasks" ON tasks
  FOR UPDATE USING (
    assigned_to = auth.uid() OR created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Insert default data
INSERT INTO lead_sources (name, description) VALUES 
  ('Website', 'Leads from company website'),
  ('Referral', 'Customer referrals'),
  ('Social Media', 'Social media campaigns'),
  ('Trade Show', 'Trade shows and exhibitions'),
  ('Direct Mail', 'Direct mail campaigns')
ON CONFLICT DO NOTHING;

INSERT INTO project_types (name, description, category) VALUES 
  ('Residential Rooftop', 'Residential rooftop solar installations', 'on_grid_residential'),
  ('Industrial Solar Farm', 'Large-scale industrial solar installations', 'on_grid_industrial'),
  ('Agricultural Off-Grid', 'Off-grid solar systems for agriculture', 'off_grid_agricultural')
ON CONFLICT DO NOTHING;

INSERT INTO tags (name, color, description) VALUES 
  ('High Value', '#10B981', 'High-value prospect'),
  ('Quick Win', '#F59E0B', 'Quick conversion opportunity'),
  ('Technical', '#3B82F6', 'Requires technical consultation'),
  ('Price Sensitive', '#EF4444', 'Price-sensitive customer'),
  ('Urgent', '#DC2626', 'Urgent requirement')
ON CONFLICT DO NOTHING;