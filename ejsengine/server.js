// Importacion de Express y app
const express = require("express");
const app = express();

// Importacion de class contenedor
const Contenedor = require("./src/contenedor");
const contenedor = new Contenedor("productos.json");

// Process.env.PORT for heroku to work
const PORT = process.env.PORT || 1222;

// Express
app.use(express.json());
// For html code to work
app.use(express.urlencoded({ extended: true }));

// Views Engine
app.set("views", "./src/views");
app.set("view engine", "ejs");

// GET
app.get("/productos", async (req, res) => {
    const productos = await contenedor.getAll();
    res.render("pages/list", { productos });
});

app.get("/", (req, res) => {
    res.render("pages/form", {});
});

// POST
app.post("/productos", async (req, res) => {
    const { body } = req;
    await contenedor.save(body);
    res.redirect("/");
});

const server = app.listen(PORT, () => {
    console.log(`Server started at ${PORT}`);
});

server.on("error", (err) => console.log(err));
