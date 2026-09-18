import { db } from "../src/prisma/db.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, lat, lng } = req.body || {};

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const newTask = await db.orm.public.Task.create({ title, lat, lng });
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
};

export const getAllTasks = async (req, res, next) => {
  try {
    const tasks = await db.orm.public.Task.where({}).all();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const task = await db.orm.public.Task.where({ id }).first();

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { title, status, lat, lng } = req.body || {};

    const updated = await db.orm.public.Task.where({ id }).update({
      ...(title !== undefined && { title }),
      ...(status !== undefined && { status }),
      ...(lat !== undefined && { lat }),
      ...(lng !== undefined && { lng }),
    });

    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deleted = await db.orm.public.Task.where({ id }).delete();

    if (!deleted) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};