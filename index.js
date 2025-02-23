import express from "express";
import axios from "axios";
import path from "path";
import favicon from "serve-favicon";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;
let data = [];

app.use(favicon(path.join(__dirname, 'public/images/joke.svg')));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home.ejs", { data });
})

app.post("/submit", async (req, res) => {
  data = [];
  let { category, amount, contains } = req.body;
  if (!amount)
    amount = 1;
  if (!contains)
    contains = "";
  try {
    const response = await axios.get(`https://v2.jokeapi.dev/joke/${category}`, { params: { contains, amount, type: "single" } });
    const jokeApiData = response.data;
    if (amount == 1)
      data.push(jokeApiData.joke);
    else if (amount > 1) {
      for (let i of jokeApiData.jokes)
        data.push(i.joke);
    }
    res.redirect("/");
  }
  catch (error) {
    console.error(`unable to get data from jokes api due to : ${error}`);
  }
})

app.listen(port, () => {
  console.log(`server started listening on port ${port}`);
})