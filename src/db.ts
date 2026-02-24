import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { Assignment } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client
// Note: In a real production app with RLS, you might use the ANON key for client
// and SERVICE_ROLE key for admin actions. For this demo, we'll use one key.
const supabaseUrl = process.env.SUPABASE_URL || 'https://ljbgrimmovfbhfzhzoif.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  console.warn('WARNING: SUPABASE_KEY is not set. Database operations will fail.');
}

const supabase = createClient(supabaseUrl, supabaseKey || 'placeholder-key');

export async function initDb() {
  if (!supabaseKey) return;

  try {
    // Check if data exists
    const { count, error } = await supabase
      .from('assignments')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error checking database:', error.message);
      console.log('Make sure you have run the SQL schema in Supabase SQL Editor.');
      return;
    }

    if (count === 0) {
      console.log('Seeding database from CSV...');
      const csvPath = path.join(process.cwd(), 'assignments.csv');
      
      if (fs.existsSync(csvPath)) {
        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });

        // Map CSV records to match Supabase schema if necessary
        // CSV columns: baslik, arastirma_konusu, ...
        // DB columns: title, research_topic, ...
        const assignmentsToInsert = records.map((r: any) => ({
          title: r.baslik,
          research_topic: r.arastirma_konusu,
          application_steps: r.uygulama_adimi,
          image_url: r.gorsel_url,
          student_name: r.ogrenci_ad || null,
          student_surname: r.ogrenci_soyad || null,
          student_no: r.ogrenci_no || null,
          is_taken: 0
        }));

        const { error: insertError } = await supabase
          .from('assignments')
          .insert(assignmentsToInsert);

        if (insertError) {
          console.error('Error seeding data:', insertError.message);
        } else {
          console.log(`Seeded ${records.length} assignments.`);
        }
      } else {
        console.warn('assignments.csv not found, skipping seed.');
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export async function getAssignments(): Promise<Assignment[]> {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) throw new Error(error.message);
  return data as Assignment[];
}

export async function getAssignment(id: number): Promise<Assignment | undefined> {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return undefined;
  return data as Assignment;
}

export async function takeAssignment(id: number, studentName: string, studentSurname: string, studentNo: string): Promise<boolean> {
  // First check if it's already taken to avoid race conditions (simple check)
  const current = await getAssignment(id);
  if (!current || current.is_taken) return false;

  const { error } = await supabase
    .from('assignments')
    .update({
      student_name: studentName,
      student_surname: studentSurname,
      student_no: studentNo,
      is_taken: 1
    })
    .eq('id', id)
    .eq('is_taken', 0); // Optimistic locking

  return !error;
}

export async function addAssignment(title: string, researchTopic: string, applicationSteps: string, imageUrl: string): Promise<number | null> {
  const { data, error } = await supabase
    .from('assignments')
    .insert({
      title,
      research_topic: researchTopic,
      application_steps: applicationSteps,
      image_url: imageUrl,
      is_taken: 0
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return data ? data.id : null;
}

export async function deleteAssignment(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('assignments')
    .delete()
    .eq('id', id);
  
  return !error;
}

export async function resetAssignment(id: number): Promise<boolean> {
  const { error } = await supabase
    .from('assignments')
    .update({
      student_name: null,
      student_surname: null,
      student_no: null,
      is_taken: 0
    })
    .eq('id', id);
  
  return !error;
}
