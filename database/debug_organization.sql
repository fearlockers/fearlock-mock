-- Debug Organization and Project Data
-- Run this in Supabase SQL Editor to check the current state

-- 1. Check current user's profile
SELECT 
  'Current User Profile' as info,
  id,
  email,
  first_name,
  last_name,
  organization_id,
  role,
  created_at
FROM profiles 
WHERE id = auth.uid();

-- 2. Check if user has an organization
SELECT 
  'User Organization' as info,
  p.id as user_id,
  p.email,
  p.organization_id,
  o.id as org_id,
  o.name as org_name,
  o.description as org_description
FROM profiles p
LEFT JOIN organizations o ON p.organization_id = o.id
WHERE p.id = auth.uid();

-- 3. Check all organizations in the system
SELECT 
  'All Organizations' as info,
  id,
  name,
  description,
  created_at
FROM organizations
ORDER BY created_at DESC;

-- 4. Check all profiles and their organizations
SELECT 
  'All Profiles with Organizations' as info,
  p.id,
  p.email,
  p.first_name,
  p.last_name,
  p.organization_id,
  p.role,
  o.name as organization_name
FROM profiles p
LEFT JOIN organizations o ON p.organization_id = o.id
ORDER BY p.created_at DESC;

-- 5. Check projects for the user's organization
SELECT 
  'Projects for User Organization' as info,
  p.id as project_id,
  p.name as project_name,
  p.description as project_description,
  p.organization_id,
  o.name as organization_name,
  p.created_at
FROM projects p
JOIN organizations o ON p.organization_id = o.id
WHERE p.organization_id IN (
  SELECT organization_id FROM profiles WHERE id = auth.uid()
);

-- 6. Check all projects in the system
SELECT 
  'All Projects' as info,
  p.id,
  p.name,
  p.description,
  p.organization_id,
  o.name as organization_name,
  p.created_at
FROM projects p
LEFT JOIN organizations o ON p.organization_id = o.id
ORDER BY p.created_at DESC;

-- 7. Check RLS policies for projects table
SELECT 
  'RLS Policies for Projects' as info,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'projects';

-- 8. Test RLS policy directly
SELECT 
  'RLS Policy Test' as info,
  COUNT(*) as project_count,
  'Should show projects if RLS is working' as note
FROM projects
WHERE organization_id IN (
  SELECT organization_id FROM profiles WHERE id = auth.uid()
); 