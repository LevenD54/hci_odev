import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('assignments.db');

export interface Assignment {
  id: number;
  title: string;
  research_topic: string;
  application_steps: string;
  image_url: string;
  student_name: string | null;
  student_surname: string | null;
  student_no: string | null;
  is_taken: number; // 0 or 1
}

export function initDb() {
  // Create table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      research_topic TEXT,
      application_steps TEXT,
      image_url TEXT,
      student_name TEXT,
      student_surname TEXT,
      student_no TEXT,
      is_taken INTEGER DEFAULT 0
    )
  `);

  // Check if data exists
  const count = db.prepare('SELECT count(*) as count FROM assignments').get() as { count: number };
  
  if (count.count === 0) {
    console.log('Seeding database from CSV...');
    try {
      const csvPath = path.join(process.cwd(), 'assignments.csv');
      if (fs.existsSync(csvPath)) {
        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const records = parse(fileContent, {
          columns: true,
          skip_empty_lines: true
        });

        const insert = db.prepare(`
          INSERT INTO assignments (title, research_topic, application_steps, image_url, student_name, student_surname, student_no, is_taken)
          VALUES (@baslik, @arastirma_konusu, @uygulama_adimi, @gorsel_url, @ogrenci_ad, @ogrenci_soyad, @ogrenci_no, 0)
        `);

        const insertMany = db.transaction((assignments) => {
          for (const assignment of assignments) {
            insert.run(assignment);
          }
        });

        insertMany(records);
        console.log(`Seeded ${records.length} assignments.`);
      } else {
        console.warn('assignments.csv not found, skipping seed.');
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
}

export function getAssignments() {
  return db.prepare('SELECT * FROM assignments').all() as Assignment[];
}

export function getAssignment(id: number) {
  return db.prepare('SELECT * FROM assignments WHERE id = ?').get(id) as Assignment | undefined;
}

export function takeAssignment(id: number, studentName: string, studentSurname: string, studentNo: string) {
  const info = db.prepare(`
    UPDATE assignments 
    SET student_name = ?, student_surname = ?, student_no = ?, is_taken = 1 
    WHERE id = ? AND is_taken = 0
  `).run(studentName, studentSurname, studentNo, id);
  return info.changes > 0;
}

export function addAssignment(title: string, researchTopic: string, applicationSteps: string, imageUrl: string) {
  const info = db.prepare(`
    INSERT INTO assignments (title, research_topic, application_steps, image_url, is_taken)
    VALUES (?, ?, ?, ?, 0)
  `).run(title, researchTopic, applicationSteps, imageUrl);
  return info.lastInsertRowid;
}

export function deleteAssignment(id: number) {
  const info = db.prepare('DELETE FROM assignments WHERE id = ?').run(id);
  return info.changes > 0;
}

export function resetAssignment(id: number) {
  const info = db.prepare(`
    UPDATE assignments 
    SET student_name = NULL, student_surname = NULL, student_no = NULL, is_taken = 0 
    WHERE id = ?
  `).run(id);
  return info.changes > 0;
}
