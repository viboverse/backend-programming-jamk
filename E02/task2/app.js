import express, { json } from "express";

const app = express();
const PORT = 3000;

const users = [
  { id: 1, name: "Leslie Parks", email: "leslie.parks@cityplanning.gov" },
  { id: 2, name: "Sherlock Holmes", email: "sherlock@221b.co.uk" },
  { id: 3, name: "Michael Scott", email: "worldsbestboss@dundermifflin.com" },
];

app.get("/", (req, res) => {
  res.send(`<div><h1>Welcome to Express Assignments! (LazyBee)</h1>
     <ul>
        <li><a href="/api/users">Users</a></li>
      </ul>
      </div>
    `);
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((user) => user.id === +id);
  if (!user) {
    return res.status(404).json({ error: "User Not Found!" });
  }
  res.json(user);
});

app.get("/api/echo/:message", (req, res) => {
  const { message } = req.params;
  res.json({ messge: message });
});

app.get("/contact", (req, res) => {
  res.send(`
    <h1>User Contacts</h1>
    ${users.map((user) => `<p>Email: ${user.email}</p>`).join("")}
  `);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
