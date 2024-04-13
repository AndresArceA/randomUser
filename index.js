// codigo utilizando axios para leer una api
const express = require("express");
const axios = require("axios");
const app = express();
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const lo = require("lodash");
const chalk = require("chalk");

//configuro el puerto del servidor
const PORT = 4000;

app.use(express.json());

//Genero la fecha de la cita para proximo lunes a una hora laboral , 3 dias mas 13 horas

const diaAtencion = moment().add(3, "days").add(13, "hours"); //.format('MMMM Do YYYY h:mm:ss a'); -- formato en esta linea me arroja una advertencia de incompatibildad
let cita = moment(diaAtencion);
//defino variable para la diferencia de tiempo entre consultas
const TPC = 15;

// Genera un codigo UUID
// let uuid = uuidv4(); -- no ocupé la variable porque me repetia el id en cada usuario

// Obtiene los primeros 6 caracteres del UUID, lo almaceno en la variable ID para agregarlo al arreglo
// let ID = uuid.slice(0, 6);

// Ruta para obtener los datos de Random User API
app.get("/usuarios", async (req, res) => {
  try {
    //Consulto la api Randomuser
    const response = await axios.get("https://randomuser.me/api/?results=11");

    // accedo a la propiedad data del objeto response de la api
    const objectData = response.data;
    const userData = objectData.results;

    // Proceso los datos de cada usuario y los almaceno como un objeto --
    //comentè la linea porque solamente me funciono para una consulta,
    // tuve que hacer una funcion de mapeo para recorrer todos los objetos
    // recibidos de la api

    // const pacientes = {"Genero:":userData[0].gender ,"Nombre:": userData[0].name.first ,"Apellido:": userData[0].name.last ,"ID:":ID ,"Timestamp:" :cita }
    // console.log("Genero: ", userData[0].gender);
    // console.log(paciente);

    const pacientes = userData.map((user) => ({
      Genero: user.gender,
      Nombre: user.name.first,
      Apellido: user.name.last,
      ID: uuidv4().slice(0, 6),
      Timestamp: cita.add(TPC, "minutes").format("MMMM Do YYYY, h:mm:ss a"), //formateo la fecha acà para poder operar con ella, sino me arroja error-- agrego una diferencia de 15 min entre consulta
    }));

    // console.log("estos son los ", pacientes);

    // res.json(pacientes);

    //aplico lodash con filter para separar por genero
    const pacientesMasculinos = lo.filter(pacientes, { Genero: "male" });
    const pacientesFemeninos = lo.filter(pacientes, { Genero: "female" });

    // res.json({ pacientesFemeninos, pacientesMasculinos });

    //aplico chalk a la respuesta por consola

    console.log(chalk.blue.bgWhite.underline("Pacientes Femeninos:"));
    pacientesFemeninos.forEach((paciente, index) => {
      const idLista = index + 1; // para agregar numero de fila del listado
      console.log(
        chalk.blue.bgWhite(
          `${idLista}. Nombre: ${paciente.Nombre} - Apellido: ${paciente.Apellido} - ID: ${paciente.ID} - Timestamp: ${paciente.Timestamp}`
        )
      );
    });

    console.log(chalk.blue.bgWhite.underline("Pacientes masculinos:"));
    pacientesMasculinos.forEach((paciente, index) => {
      const idLista2 = index + 1;
      console.log(
        chalk.blue.bgWhiteBright(
          `${idLista2}. Nombre: ${paciente.Nombre} - Apellido: ${paciente.Apellido} - ID: ${paciente.ID} - Timestamp: ${paciente.Timestamp}`
        )
      );
    });

    // Creo pagina web para mostrar los listados de usuaros al cliente
    const paginaHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listado de Pacientes</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .pacientes { margin-bottom: 20px; }
          h2 { margin-bottom: 10px; }
          ul { list-style-type: none; padding: 1; }
          li { margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="pacientes">
          <h1>Clinica DENDE - Listado de Pacientes</h1>
          <hr>
          <h2>Pacientes Femeninos</h2>
          <ul><h3>
            ${pacientesFemeninos
              .map(
                (paciente, index) =>
                  `<li>${index + 1}. Nombre: ${paciente.Nombre} - Apellido: ${
                    paciente.Apellido
                  } - ID: ${paciente.ID} - Timestamp: ${
                    paciente.Timestamp
                  }</li>`
              )
              .join("")}</h3>

          </ul>
        </div>
        <div class="pacientes">
          <h2>Pacientes Masculinos</h2>
          <ul><h3>
            ${pacientesMasculinos
              .map(
                (paciente, index) =>
                  `<li>${index + 1}. Nombre: ${paciente.Nombre} - Apellido: ${
                    paciente.Apellido
                  } - ID: ${paciente.ID} - Timestamp: ${
                    paciente.Timestamp
                  }</li>`
              )
              .join("")}</h3>

          </ul>
        </div>
      </body>
      </html>
    `;

    // Envío la pagina html para la lectura del cliente
    res.send(paginaHTML);
  } catch (error) {
    console.error("Error fetching random user data:", error);
    res.status(500).json({ error: "Error fetching random user data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
