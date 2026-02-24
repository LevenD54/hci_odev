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
