# SolarPro ERP - Solar Installation Management System

A comprehensive ERP system tailored for solar installation companies in Tunisia, built with Next.js, Tailwind CSS, and Supabase.

## Features

### Core Modules
- **CRM**: Lead management, customer tracking, communications
- **Project Management**: Project lifecycle, task management, team assignments
- **Design & Simulation**: Solar system sizing and ROI calculations
- **Regulatory Compliance**: Tunisian regulation compliance tracking
- **Procurement & Inventory**: Supplier management, purchase orders, stock control
- **Finance**: Quotes, invoices, payments, subsidy management
- **Reporting & Analytics**: Real-time dashboards and KPI tracking
- **Settings & Parametrage**: System configuration, user management

### Technical Features
- **Authentication**: Supabase Auth with role-based access control
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Real-time**: Live updates using Supabase realtime subscriptions
- **Internationalization**: Support for Arabic, French, and English
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API**: RESTful API with Next.js App Router

## Tech Stack

- **Frontend**: Next.js 13+ (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Database**: PostgreSQL with Row Level Security
- **Authentication**: Supabase Auth
- **Deployment**: Vercel + Supabase

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd solarpro-erp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/` in order
   - Enable Row Level Security on all tables

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Database Setup

### Supabase Configuration

1. Create a new Supabase project
2. Go to the SQL Editor
3. Run the migration file: `supabase/migrations/01_create_core_tables.sql`
4. Verify that all tables are created with RLS enabled

### Demo Data

The migration includes sample data for:
- Lead sources (Website, Referral, Social Media, etc.)
- Project types (Residential, Industrial, Agricultural)
- Tags for lead categorization

## Authentication & Authorization

### Roles
- **Admin**: Full system access, user management, settings
- **Manager**: Project oversight, reporting, team management
- **Sales Rep**: CRM access, lead management, customer relations
- **Technician**: Project execution, technical tasks, field work

### Row Level Security (RLS)
All tables implement RLS policies to ensure data security:
- Users can only access data they're authorized to see
- Role-based permissions control data access
- All API endpoints validate user permissions

## API Documentation

### Authentication
- `POST /api/auth` - User authentication and registration

### CRM
- `GET /api/leads` - Fetch leads with filters
- `POST /api/leads` - Create new lead
- `POST /api/leads/convert` - Convert lead to customer

### Projects
- `GET /api/projects` - Fetch projects with filters
- `POST /api/projects` - Create new project

## Development Guidelines

### File Organization
- Components are organized by feature in `/components`
- API routes follow RESTful conventions in `/app/api`
- Database types are defined in `/lib/supabase.ts`
- Authentication helpers in `/lib/auth.ts`

### Code Standards
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

### Database Best Practices
- Use UUIDs for primary keys
- Always enable RLS on new tables
- Include created_at and updated_at timestamps
- Use foreign key constraints for data integrity

## Deployment

### Vercel Deployment
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Supabase Configuration
1. Configure your Supabase project
2. Set up authentication providers if needed
3. Configure RLS policies for production
4. Set up backups and monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.