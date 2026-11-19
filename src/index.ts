import express from "express";
import { db } from "./prisma/db.js";

const app = express();
app.use(express.json());

// --- USERS (Person) ---

// GET /users - Получить всех пользователей
app.get("/users", async (req, res) => {
  try {
    const users = await db.orm.public.Person.all();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// GET /users/:id - Получить пользователя по id
app.get("/users/:id", async (req, res) => {
  try {
    const users = await db.orm.public.Person.where({ id: req.params.id }).all();
    if (users.length === 0) return res.status(404).json({ error: "Пользователь не найден" });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// POST /users/:id - Создать пользователя (используем /users/:id как указано в задании)
app.post("/users/:id", async (req, res) => {
  try {
    const { email, username, name } = req.body;
    const user = await db.orm.public.Person.create({ 
      email, 
      username, 
      name 
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: "Ошибка при создании" });
  }
});

// PATCH /users/:id - Обновить пользователя
app.patch("/users/:id", async (req, res) => {
  try {
    const updated = await db.orm.public.Person
      .where({ id: req.params.id })
      .update(req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Ошибка при обновлении" });
  }
});

// DELETE /users/:id - Удалить пользователя
app.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await db.orm.public.Person
      .where({ id: req.params.id })
      .delete();
    res.json({ message: "Пользователь удален", deleted });
  } catch (error) {
    res.status(400).json({ error: "Ошибка при удалении" });
  }
});


// --- POSTS ---

// GET /posts - Получить все посты
app.get("/posts", async (req, res) => {
  try {
    const posts = await db.orm.public.Post.all();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// GET /posts/:id - Получить пост по id
app.get("/posts/:id", async (req, res) => {
  try {
    // Включаем вывод автора
    const posts = await db.orm.public.Post.where({ id: req.params.id }).include("author").all();
    if (posts.length === 0) return res.status(404).json({ error: "Пост не найден" });
    res.json(posts[0]);
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// POST /posts/:id - Создать пост
app.post("/posts/:id", async (req, res) => {
  try {
    const { title, content, authorID } = req.body;
    const post = await db.orm.public.Post.create({ 
      title, 
      content, 
      authorID 
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: "Ошибка при создании поста" });
  }
});

// PATCH /posts/:id - Обновить пост
app.patch("/posts/:id", async (req, res) => {
  try {
    const updated = await db.orm.public.Post
      .where({ id: req.params.id })
      .update(req.body);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Ошибка при обновлении" });
  }
});

// DELETE /posts/:id - Удалить пост
app.delete("/posts/:id", async (req, res) => {
  try {
    const deleted = await db.orm.public.Post
      .where({ id: req.params.id })
      .delete();
    res.json({ message: "Пост удален", deleted });
  } catch (error) {
    res.status(400).json({ error: "Ошибка при удалении" });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
