import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '../../data/courses.json');

export async function readCourses() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

export async function writeCourses(courses) {
  await fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 2), 'utf-8');
}

export async function getCourseById(id) {
  const courses = await readCourses();
  return courses.find((course) => course.id === id) ?? null;
}

export async function addCourse(course) {
  const courses = await readCourses();
  courses.push(course);
  await writeCourses(courses);
  return course;
}

export async function updateCourse(id, updates) {
  const courses = await readCourses();
  const index = courses.findIndex((course) => course.id === id);
  if (index === -1) return null;

  const updated = { ...courses[index], ...updates, id };
  courses[index] = updated;
  await writeCourses(courses);
  return updated;
}

export async function deleteCourse(id) {
  const courses = await readCourses();
  const index = courses.findIndex((course) => course.id === id);
  if (index === -1) return false;

  courses.splice(index, 1);
  await writeCourses(courses);
  return true;
}
