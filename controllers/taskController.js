import { db } from "../src/prisma/db.js";

export const createTask = async (req, res) => {
  const { title, lat, lng } = req.body;

  if (!title) {
    return res.status(400).json({ error: "title is required" });
  }

  const newTask = await db.orm.public.Task.create({title, lat, lng});
  res.status(201).json(newTask);
};

export const getAllTasks = async (req, res) => {
 const tasks = await db.orm.public.Task.where({}).all();
 res.json(tasks); 
};

export const getTaskById = async (req, res) => {
  const id = Number(req.params.id);
  const task = db.orm.public.Task.where({id}).first();

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
};

export const updateTask = async (req, res) => {
  const id = Number(req.params.id);
  const { title, status, lat, lng } = req.body;
  const task = await db.orm.public.Task.where({id}).first();

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const updated = await db.orm.public.Task.where({ id }).update({
    ...(title !== undefined && {title}),
    ...(status !== undefined && {status}),
    ...(lat !== undefined && {lat}),
    ...(lng !== undefined && {lng}),
  });

  if (!updated) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(updated);
};

export const deleteTask = async (req, res) => {
  const id = Number(req.params.id);
  const deleted = db.orm.public.Task.where({id}).delete();

  if (!deleted) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(204).send();
};