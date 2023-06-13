const express = require('express')
const path = require('path');
const { engine } = require('express-handlebars')
const axios = require('axios');
const app = express()
app.set('port', process.env.port || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}))
app.set('view engine', '.hbs')
app.use(express.urlencoded({ extended: false }))
app.get("/", async (req, res) => {
  try {
    const response = await axios.get('https://api.spaceflightnewsapi.net/v3/reports');
    const response_2 = await axios.get('https://api.spaceflightnewsapi.net/v3/articles');
    const reports = response.data;
    const articles = response_2.data;
    res.render('index', { reports, articles });
  } catch (error) {
    console.error('Error al obtener reports:', error);
    res.render('error'); // Renderizar una plantilla de error en caso de fallo
  }
})
app.get('/noticias', async (req, res) => {
  try {
    const response = await axios.get('https://api.spaceflightnewsapi.net/v3/articles');
    const articles = response.data;
    res.render('news', { articles });
  } catch (error) {
    console.error('Error al obtener noticias:', error);
    res.render('error'); // Renderizar una plantilla de error en caso de fallo
  }
});
app.get('/blogs', async (req, res) => {
  try { // Realizar una solicitud a la API de Spaceflight News para obtener blogs
    const response = await axios.get('https://api.spaceflightnewsapi.net/v3/blogs');
    const blogs = response.data;// Obtener los datos de los blogs de la respuesta
    res.render('blogs', { blogs });
  } catch (error) {
    console.error('Error al obtener blogs:', error);
    res.render('error'); // Renderizar una plantilla de error en caso de fallo
  }
});
app.use(express.static(path.join(__dirname, 'public')))//Archivos estaticos
module.exports = app