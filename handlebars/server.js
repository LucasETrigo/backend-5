const express = require("express");
const app = express();

const { engine } = require("express-handlebars");

const engienFn = engine({
    extname: ".hbs",
    defaultLayout: `${__dirname}/views/index.hbs`,
    layoutsDir: `${__dirname}/views/layouts`,
    partialsDir: `${__dirname}/views/partials`,
});

app.engine("hbs", engienFn);
app.set("views", "./views");
app.set("view engine", "hbs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Contenedor = require(`./contenedor`);
let myContenedor = new Contenedor(`./productos.json`);

app.get("/", (req, res) => {
    const data = {
        title: "Desafio HandleBars Engine",
        content: "Utilizando HandleBars",
    };
    return res.render("layouts/main", data);
});

app.get(`/productos`, (req, res) => {
    let allProducts;

    (async () => {
        try {
            allProducts = await myContenedor.getAll();
        } catch (err) {
            return res.status(404).json({
                error: `Error ${err}`,
            });
        }
        data = {
            allProducts,
        };
        return res.render(`layouts/verProductos`, data);
    })();
});

app.get("/form", (req, res) => {
    return res.render("layouts/formProductos");
});

app.post(`/productos`, (req, res) => {
    (async () => {
        const name = req.body.title;
        const price = Number(req.body.price);
        const url = req.body.thumbnail;

        const newProducto = {
            title: `${name}`,
            price: price,
            thumbnail: `${url}`,
        };
        const id = await myContenedor.save(newProducto);
        return res.redirect(`/form`);
    })();
});
const PORT = 3333;

const server = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

server.on("error", (error) => console.log(`Error en servidor: ${error}`));
