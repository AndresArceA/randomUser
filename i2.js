// codigo utilizando axios para leer una api
const express = require ("express");
const axios = require ("axios");
const app = express();
const { v4: uuidv4 } = require('uuid');

const moment = require('moment')

const PORT = 4000;
app.use(express.json());
//Genero la fecha de la cita para proximo lunes a una hora laboral , 3 dias mas 13 horas

const cita = moment().add(3,'days').add(13,'hours').format('MMMM Do YYYY h:mm:ss a');

// Genera un codigo UUID 
const uuid = uuidv4();

// Obtiene los primeros 6 caracteres del UUID, lo almaceno en la variable ID para agregarlo al arreglo
const ID = uuid.slice(0, 6);

// Ruta para obtener los datos de Random User API
app.get("/usuarios", async (req, res) => {
  try {
    const request =[];
    // realizo las consultas simultaneas (11)
    for (let i = 0; i < 11; i++) {
      requests.push(axios.get("https://randomuser.me/api/"));
    }
    //leyendo la api Randomuser
    const response = await axios.get("https://randomuser.me/api/");
  
    // accedo a la propiedad data del objeto response de la api
    const objectData = response.data;
    const userData = objectData.results;
   
    // Proceso los datos de cada usuario y los almaceno como un objeto

    const paciente = {"Genero:":userData[0].gender ,"Nombre:": userData[0].name.first ,"Apellido:": userData[0].name.last ,"ID:":ID ,"Timestamp:" :cita }
    console.log("Genero: ", userData[0].gender);
    console.log(paciente);
  
    res.json(userData);

  } catch (error) {
    console.error("Error fetching random user data:", error);
    res.status(500).json({ error: "Error fetching random user data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
