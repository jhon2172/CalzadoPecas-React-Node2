const mysql =require("mysql");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const app = express();



// ---- Direcciones ----

//const carpetaEspecifica = '../public'; // Cambia esto a la ruta que desees


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'uploads')));

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user:process.env.DB_USER || 'root',
    password:process.env.DB_PASSWORD || '',
    database:process.env.DB_NAME || 'registros'

});

// Configuración de Multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: path.join(__dirname,'uploads'),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha subido ninguna imagen.');
  }

  console.log('Imagen subida:', req.file);
  res.send('Imagen subida correctamente.');
});

// -------- * -------------------------------- * -----
/*const imagenesDir = path.join(carpetaEspecifica, 'Imagenes');
const exists = fs.existsSync(imagenesDir);
if (!exists) {
  fs.mkdirSync(imagenesDir, { recursive: true }); 
  console.log('La nueva carpeta ha sido creada.');
} else {
  console.log('La carpeta ya existe.');
}*/



app.post("/create",(req,res)=>{
    const empresa= req.body.empresa;
    const referencia= req.body.referencia;
    const color= req.body.color;
    const num34= req.body.num34;
    const num35= req.body.num35;
    const num36= req.body.num36;
    const num37= req.body.num37;
    const num38= req.body.num38;
    const num39= req.body.num39;
    const num40= req.body.num40;
    const image =req.body.image_url;
    const qr34 =req.body.qr34;
    const qr35 =req.body.qr35;
    const qr36 =req.body.qr36;
    const qr37 =req.body.qr37;
    const qr38 =req.body.qr38;
    const qr39 =req.body.qr39;
    const qr40 =req.body.qr40;

    

    db.query(
        'INSERT INTO empleados(empresa, referencia, color, num34, num35, num36, num37, num38, num39, num40, image_url,qr34,qr35,qr36,qr37,qr38,qr39,qr40) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [empresa, referencia, color, num34, num35, num36, num37, num38, num39, num40,image,qr34,qr35,qr36,qr37,qr38,qr39,qr40],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send('Error al guardar el empleado');
          } else {
            res.send('Empleado registrado con éxito');
            console.log("Registrado correctamente")
          }
        }
      );
    });

app.post("/createAdmin",(req,res)=>{
    const username= req.body.username;
    const password= req.body.password;
    
     db.query('INSERT INTO login2(username,password) VALUES(?,?)',
     [username,password],
     (err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send("Empleado registrado con exito");
        }
     	});
});

app.post("/deleteEmpleado", (req, res) => {
  const empleadoId = req.body.empleadoId; // Recibir el ID del empleado a eliminar desde el front-end

  db.query("DELETE FROM empleados WHERE id = ?", [empleadoId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al eliminar el empleado");
    } else {
      res.send("Empleado eliminado con éxito");
    }
  });
});
app.post("/updateEmpleado", (req, res) => {
  const {
    id, empresa, referencia, color, num34, num35, num36, num37, num38, num39, num40
  } = req.body;

  db.query(
    "UPDATE empleados SET empresa=?, referencia=?, color=?, num34=?, num35=?, num36=?, num37=?, num38=?, num39=?, num40=? WHERE id=?",
    [empresa,referencia,color,num34,num35,num36,num37,num38,num39,num40,id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el empleado");
      } else {
        res.send("Empleado actualizado con éxito");
      }
    }
  );
});

app.post("/updateEmpleado2", (req, res) => {
  const { variable1, variable2, variable3, variable4 } = req.body;

  const columnaNumero = `num${variable4}`;

  db.query(
    `UPDATE empleados SET ${columnaNumero} = ${columnaNumero} - 1 WHERE empresa=? AND referencia=? AND color=? AND ${columnaNumero} > 0`,
    [variable1, variable2, variable3],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error al actualizar el empleado");
      } else {
        res.send("Empleado actualizado con éxito");
      }
    }
  );
});


app.get("/empleados",(req,res)=>{
    db.query('SELECT * FROM empleados',(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
});

app.get("/log",(req,res)=>{
    db.query('SELECT * FROM login2',(err,result)=>{
        if(err){
            console.log(err);
        }else{
            res.send(result);
        }
    })
});



db.connect(function(error){
    if (error){throw error;
    }else{
        console.log('CONEXION EXITOSA');
    } 

});

app.post("/login2", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    db.query(
      "SELECT * FROM login2 WHERE username = ? AND password = ?",[username, password],
      (err, result) => {
       // console.log("User: ",username,"Password: ",password);
        if (err) {
          console.log(err);
          res.send("Error al verificar las credenciales");
        } else {
          if (result.length > 0) {
            res.send("Inicio de sesión exitoso");
         
          } else {
            res.send("Credenciales incorrectas");   
          }
        }
      }
    );
  });


app.listen(process.env.PORT || 3001,()=>{
    console.log('Server is running on port 3001');
})




