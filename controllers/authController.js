import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../src/prisma/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};

        if(!email || !password) {
            return res.status(400).json({ error: "email and password are required" });
        }

        const existing = await db.orm.public.User.where({ email }).first();
        if (existing) {
            return res.status(409).json({ error: "email already registered" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await db.orm.public.User
            .select("id", "email")
            .create({ email, passwordHash });

        res.status(201).json(user);
    } catch(err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await db.orm.public.User.where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ error: "invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ token });
  } catch (err) {
    next(err);
  }
};