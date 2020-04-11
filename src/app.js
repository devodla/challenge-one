const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function logRequests(req, res, next) {
  const { method, url } = req;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

app.use(logRequests);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes:0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repositoriIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoriIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found.' });
  }

  const repositorie = {
    id,
    url,
    title,
    techs,
    likes: 0
  };

  repositories[repositoriIndex] = repositorie;

  return response.json(repositories[repositoriIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoriIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoriIndex < 0) {
    return res.status(400).json({ error: 'Repositorie not found.' });
  }

  repositories.splice(repositoriIndex, 1);

  return res.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoriIndex = repositories.findIndex(repositorie => repositorie.id === id);

  if (repositoriIndex < 0) {
    return response.status(400).json({ error: 'Repositorie not found.' });
  }

  repositories[repositoriIndex].likes++;

  return response.json(repositories[repositoriIndex]);
});

module.exports = app;
