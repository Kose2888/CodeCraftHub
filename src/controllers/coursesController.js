import { v4 as uuidv4 } from 'uuid';
import * as fileStore from '../utils/fileStore.js';
import { validateCourseInput, VALID_STATUSES } from '../utils/validation.js';

export async function getAllCourses(req, res) {
  try {
    const courses = await fileStore.readCourses();
    res.json(courses);
  } catch {
    res.status(500).json({ error: 'Failed to read courses' });
  }
}

export async function getCourseStats(req, res) {
  try {
    const courses = await fileStore.readCourses();
    const byStatus = Object.fromEntries(VALID_STATUSES.map((status) => [status, 0]));

    for (const course of courses) {
      if (byStatus[course.status] !== undefined) {
        byStatus[course.status]++;
      }
    }

    res.json({
      total: courses.length,
      byStatus,
    });
  } catch {
    res.status(500).json({ error: 'Failed to read course statistics' });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await fileStore.getCourseById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch {
    res.status(500).json({ error: 'Failed to read course' });
  }
}

export async function createCourse(req, res) {
  const validation = validateCourseInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors });
  }

  const now = new Date().toISOString();
  const course = {
    id: uuidv4(),
    name: req.body.name.trim(),
    description: req.body.description,
    targetCompletionDate: req.body.targetCompletionDate,
    status: req.body.status,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await fileStore.addCourse(course);
    res.status(201).json(course);
  } catch {
    res.status(500).json({ error: 'Failed to create course' });
  }
}

export async function updateCourse(req, res) {
  const validation = validateCourseInput(req.body);
  if (!validation.valid) {
    return res.status(400).json({ errors: validation.errors });
  }

  try {
    const existing = await fileStore.getCourseById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updated = {
      name: req.body.name.trim(),
      description: req.body.description,
      targetCompletionDate: req.body.targetCompletionDate,
      status: req.body.status,
      updatedAt: new Date().toISOString(),
    };

    const course = await fileStore.updateCourse(req.params.id, updated);
    res.json(course);
  } catch {
    res.status(500).json({ error: 'Failed to update course' });
  }
}

export async function deleteCourse(req, res) {
  try {
    const deleted = await fileStore.deleteCourse(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete course' });
  }
}
