const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Config = require('./config')

const app = express()
const server = require('http').createServer(app)


app.use(cors())

// app.use((req, res, next) => {
//     const token = req.get('Authorization')
  
//     if (token) {
//       req.token = token
//       next()
//     } else {
//       res.status(403).send({
//         error: 'Please provide an Authorization header to identify yourself (can be whatever you want)'
//       })
//     }
//   })
 
  var mySQL = require('mysql');


  
const executeStatement = (sql) => {

  var con = mySQL.createConnection({ //Create connection
    host : "localhost",
    database : "nutrient",
    user : "demoUser",
    password : "00573975t" 
  });

  return new Promise((resolve, reject) => {
            con.connect(function(err) {
              if (err) throw err;
              // console.log("Connected!");
              con.query(sql, function (err, result) {
                if (err) throw err;
                con.destroy()
                resolve(result)
              });
            });
          })
} 

    
app.get('/get_user', (req, res) => {

    executeStatement("SELECT * FROM tblUsers WHERE userName = '" + req.query.username + "' AND userPassword = '" + req.query.password + "';")
      .then(data => res.send(data))

})

app.get('/get_userIngredients', (req, res) => {

  executeStatement("SELECT ingredientId,userId,tblingredients.unitId,ingredientName,ingredientPortion,ingredientCalorie,ingredientProtein," +
                    "ingredientCarbonhydrate,ingredientSugar,ingredientFat,ingredientSodium,ingredientCalcium,ingredientCholesterol," +
                    "ingredientFibre,ingredientSaturateFat,ingredientTransFat,ingredientIron,ingredientZinc,ingredientMagnesium," +
                    "ingredientPotasium,ingredientRemark, tblingredients.updCount, unitName FROM `tblingredients` " + 
                    "LEFT OUTER JOIN `tblunits` ON `tblingredients`.`unitId` = `tblunits`.`unitId` WHERE userId = '" + 
                    req.query.userId + "' ORDER BY ingredientName;")
    .then(data => res.send(data))

})


app.get('/get_notselecteduserIngredients', (req, res) => {

  executeStatement("SELECT ingredientId,userId,tblingredients.unitId,ingredientName,ingredientPortion,ingredientCalorie," +
                    "ingredientProtein,ingredientCarbonhydrate,ingredientSugar,ingredientFat,ingredientSodium,ingredientCalcium," +
                    "ingredientCholesterol,ingredientFibre,ingredientSaturateFat,ingredientTransFat,ingredientIron," +
                    "ingredientZinc,ingredientMagnesium,ingredientPotasium,ingredientRemark, tblingredients.updCount, unitName " + 
                    "FROM `tblingredients` LEFT OUTER JOIN `tblunits` " + 
                    "ON `tblingredients`.`unitId` = `tblunits`.`unitId` " +
                    "WHERE userId = '" + req.query.userId + "' " +
                    "AND tblingredients.ingredientId " + 
                    "NOT IN " +
                    "(SELECT ingredientId FROM tblusermenuingredients " + 
                    "WHERE tblusermenuingredients.userId = tblingredients.userId " +
                    "AND tblusermenuingredients.menuId = '" + req.query.menuId + "') " +
                    "ORDER BY ingredientName;")
    .then(data => res.send(data))

})


app.get('/get_calculateduserIngredients', (req, res) => {

  executeStatement("SELECT tblUserMenuIngredients.menuId, tblUserMenuIngredients.ingredientId, tblUserMenuIngredients.userId, tblUserMenuIngredients.unitId," +
                  "ingredientName, tblMenus.menuName, tblUnits.unitName, tblUserMenuIngredients.menuPortion," + 
                  "truncate((tblingredients.ingredientCalorie * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Calorie'," +
                  "truncate((tblingredients.ingredientProtein * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Protein'," +
                  "truncate((tblingredients.ingredientCarbonhydrate * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Carbonhydrate'," +
                  "truncate((tblingredients.ingredientSugar * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion, 2) as 'Sugar'," +
                  "truncate((tblingredients.ingredientFat * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Fat'," +
                  "truncate((tblingredients.ingredientSodium * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Sodium'," +
                  "truncate((tblingredients.ingredientCalcium * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Calcium'," +
                  "truncate((tblingredients.ingredientCholesterol * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Cholesterol'," +
                  "truncate((tblingredients.ingredientFibre * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Fibre'," +
                  "truncate((tblingredients.ingredientSaturateFat * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'SaturateFat'," +
                  "truncate((tblingredients.ingredientTransFat * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'TransFat'," +
                  "truncate((tblingredients.ingredientIron * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Iron'," +
                  "truncate((tblingredients.ingredientZinc * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Zinc'," +
                  "truncate((tblingredients.ingredientMagnesium * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Magnesium'," +
                  "truncate((tblingredients.ingredientPotasium * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion,2) as 'Potasium' " +
                  "FROM tblUserMenuIngredients " +
                  "LEFT OUTER JOIN tblMenus ON tblUserMenuIngredients.menuId = tblMenus.menuId " +
                  "LEFT OUTER JOIN tblUnits ON tblUserMenuIngredients.unitId = tblUnits.unitId " +
                  "LEFT OUTER JOIN tblingredients ON tblUserMenuIngredients.userId = tblingredients.userId " +
                  "AND tblUserMenuIngredients.ingredientId = tblingredients.ingredientId " +
                  "WHERE tblUserMenuIngredients.userId = '" + req.query.userId + "' AND tblUserMenuIngredients.menuId = '" + req.query.menuId + "' ORDER BY tblingredients.ingredientName;")
    .then(data => res.send(data))

})


app.get('/get_summerizeduserIngredients', (req, res) => {

  executeStatement("SELECT tblUserMenuIngredients.menuId,tblUserMenuIngredients.userId,tblMenus.menuName," +
    "TRUNCATE(sum((tblingredients.ingredientCalorie * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Calorie'," +
    "TRUNCATE(sum((tblingredients.ingredientProtein * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Protein'," +
    "TRUNCATE(sum((tblingredients.ingredientCarbonhydrate * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Carbonhydrate'," +
    "TRUNCATE(sum((tblingredients.ingredientSugar * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Sugar'," +
    "TRUNCATE(sum((tblingredients.ingredientFat * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Fat'," +
    "TRUNCATE(sum((tblingredients.ingredientSodium * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Sodium'," +
    "TRUNCATE(sum((tblingredients.ingredientCalcium * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Calcium'," +
    "TRUNCATE(sum((tblingredients.ingredientCholesterol * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Cholesterol'," +
    "TRUNCATE(sum((tblingredients.ingredientFibre * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Fibre'," +
    "TRUNCATE(sum((tblingredients.ingredientSaturateFat * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'SaturateFat'," +
    "TRUNCATE(sum((tblingredients.ingredientTransFat * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'TransFat'," +
    "TRUNCATE(sum((tblingredients.ingredientIron * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Iron'," +
    "TRUNCATE(sum((tblingredients.ingredientZinc * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Zinc'," +
    "TRUNCATE(sum((tblingredients.ingredientMagnesium * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Magnesium'," +
    "TRUNCATE(sum((tblingredients.ingredientPotasium * tblUserMenuIngredients.menuPortion) / tblingredients.ingredientPortion),2) AS 'Potasium' " +
    "FROM tblUserMenuIngredients " +
    "LEFT OUTER JOIN tblMenus ON tblUserMenuIngredients.menuId = tblMenus.menuId " +
    "LEFT OUTER JOIN tblingredients ON tblUserMenuIngredients.userId = tblingredients.userId AND tblUserMenuIngredients.ingredientId = tblingredients.ingredientId " +
    "WHERE " +
    "tblUserMenuIngredients.userId = '" + req.query.userId + "' " +
    "GROUP BY tblUserMenuIngredients.menuId, tblUserMenuIngredients.userId ORDER BY tblingredients.ingredientName;")
    .then(data => res.send(data))

})



app.delete('/delete_userIngredient', (req, res) => {

  executeStatement("DELETE FROM tblingredients WHERE ingredientId = '" + req.query.ingredientId + "' AND userId = '" + req.query.userId + "';")
  .then(data => res.send(data))
})


app.delete('/delete_UserMenuIngredient', (req, res) => {

  executeStatement("DELETE FROM tblUserMenuIngredients WHERE menuId = '" + req.query.menuId + "' AND userId = '" + req.query.userId + "';")
  .then(data => res.send(data))

})

app.delete('/delete_MenuIngredient', (req, res) => {

  executeStatement("DELETE FROM tblUserMenuIngredients WHERE ingredientId = '" + req.query.ingredientId + "' AND menuId = '" + req.query.menuId + "' AND userId = '" + req.query.userId + "';")
  .then(data => res.send(data))
  
})


app.post('/create_user', bodyParser.json(), (req, res) => {

  executeStatement("INSERT INTO tblusers(userId, userName, userEmail, userPassword, userRemark) VALUES ('" + req.body.userId + "', '" + req.body.userName + "','" + req.body.userEmail + "','" + req.body.userPassword + "','" +  req.body.userRemark + "');")
  .then(status =>  {
                  if (status) {
                    res.status(201).send("1 record Inserted")
                  }
                  else {
                    res.sendStatus(404)
                  }
                })
})

app.post('/create_menu', bodyParser.json(), (req, res) => {

  executeStatement("INSERT INTO tblMenus(menuId, userId, menuName, menuRemark) VALUES ('" + req.body.menuId + "', '" + req.body.userId + "','" + req.body.menuName + "','" + req.body.menuRemark + "');")
  .then(status =>  {
                  if (status) {
                    res.status(201).send("1 record Inserted")
                  }
                  else {
                    res.sendStatus(404)
                  }
                })
})


app.post('/create_usermenuingredient', bodyParser.json(), (req, res) => {

  executeStatement("INSERT INTO tblUserMenuIngredients(menuId, ingredientId, userId, unitId, menuPortion, menuRemark)" +
                   "VALUES ('" + req.body.menuId + "','" + req.body.ingredientId + "','" + req.body.userId + 
                   "','" + req.body.unitId + "'," + req.body.menuPortion + ",'" + req.body.menuRemark + "');")
  .then(status =>  {
                  if (status) {
                    res.status(201).send("1 record Inserted")
                  }
                  else {
                    res.sendStatus(404)
                  }
                })
})

app.post('/create_userIngrdient', bodyParser.json(), (req, res) => {

  executeStatement("INSERT INTO tblingredients(ingredientId,userId,unitId,ingredientName,ingredientPortion,ingredientCalorie,ingredientProtein,ingredientCarbonhydrate," +
                        "ingredientSugar,ingredientFat,ingredientSodium,ingredientCalcium,ingredientCholesterol,ingredientFibre,ingredientSaturateFat," +
                        "ingredientTransFat,ingredientIron,ingredientZinc,ingredientMagnesium,ingredientPotasium,ingredientRemark)" +
                        " VALUES('" + req.body.ingredientId + "','" + req.body.userId + "','" + req.body.unitId + "','" + req.body.ingredientName + 
                        "'," + req.body.ingredientPortion  + "," + req.body.ingredientCalorie + "," + req.body.ingredientProtein + 
                        "," + req.body.ingredientCarbonhydrate + "," + req.body.ingredientSugar + "," + req.body.ingredientFat + 
                        "," + req.body.ingredientSodium + "," + req.body.ingredientCalcium + "," + req.body.ingredientCholesterol + 
                        "," + req.body.ingredientFibre + "," + req.body.ingredientSaturateFat + "," + req.body.ingredientTransFat + 
                        "," + req.body.ingredientIron + "," + req.body.ingredientZinc + "," + req.body.ingredientMagnesium + 
                        "," + req.body.ingredientPotasium + ",'" + req.body.ingredientRemark + "');")
  .then(status =>  {
                  if (status) {
                    res.status(201).send("1 record Inserted")
                  }
                  else {
                    res.sendStatus(404)
                  }
                })
})

app.patch('/update_userIngrdient', bodyParser.json(), (req, res) => {

  executeStatement("UPDATE tblingredients " +
                    "SET " +
                    "unitId = '"+ req.body.unitId + "'," +
                    "ingredientName = '"+ req.body.ingredientName + "'," +
                    "ingredientPortion = "+ req.body.ingredientPortion + "," +
                    "ingredientCalorie = "+ req.body.ingredientCalorie + "," +
                    "ingredientProtein = "+ req.body.ingredientProtein + "," +
                    "ingredientCarbonhydrate = "+ req.body.ingredientCarbonhydrate + "," +
                    "ingredientSugar = "+ req.body.ingredientSugar + "," +
                    "ingredientFat = "+ req.body.ingredientFat + "," +
                    "ingredientSodium = "+ req.body.ingredientSodium + "," +
                    "ingredientCalcium = "+ req.body.ingredientCalcium + "," +
                    "ingredientCholesterol = "+ req.body.ingredientCholesterol + "," +
                    "ingredientFibre = "+ req.body.ingredientFibre + "," +
                    "ingredientSaturateFat = "+ req.body.ingredientSaturateFat + "," +
                    "ingredientTransFat = "+ req.body.ingredientTransFat + "," +
                    "ingredientIron = "+ req.body.ingredientIron + "," +
                    "ingredientZinc = "+ req.body.ingredientZinc + "," +
                    "ingredientMagnesium = "+ req.body.ingredientMagnesium + "," +
                    "ingredientPotasium = "+ req.body.ingredientPotasium + "," +
                    "ingredientRemark = '"+ req.body.ingredientRemark + "'," +
                    "updCount = "+ req.body.updCount + "," +
                    "createAt = '"+ Date() + "' " +
                    "WHERE ingredientId = '" + req.body.ingredientId + "' AND userId = '" + req.body.userId + "';")
  .then(status =>  {
                  if (status) {
                    res.status(201).send("1 record Updated")
                  }
                  else {
                    res.sendStatus(404)
                  }
                })
})


app.patch('/update_menu', bodyParser.json(), (req, res) => {

  executeStatement("UPDATE tblmenus " +
                    "SET " +
                    "menuName = '" + req.body.menuName + "', " +
                    "menuRemark = '" + req.body.menuRemark + "' " +
                    "WHERE menuId = '" + req.body.menuId + "' AND userId = '" + req.body.userId + "';")
  .then(status =>  {
                  if (status) {
                    res.status(201).send("1 record Updated")
                  }
                  else {
                    res.sendStatus(404)
                  }
                })
})


app.get('/get_menu', (req, res) => {

  executeStatement("SELECT * FROM `tblmenus` WHERE userId = '" + req.query.userId + "' AND menuId = '" + req.query.menuId + "';")
    .then(data => res.send(data))

})


app.get('/get_ingredientunit', (req, res) => {

  executeStatement("SELECT * FROM tblunits ORDER BY unitName;")
    .then(data => res.send(data))

})

app.get('/get_IngredientUpdateCount', (req, res) => {

  executeStatement("SELECT updCount FROM tblingredients WHERE ingredientId = '" + req.query.ingredientId + "' AND userId = '" + req.query.userId + "';")
    .then(data => res.send(data))

})

app.get('/get_MenuUpdateCount', (req, res) => {

  executeStatement("SELECT updCount FROM tblMenus WHERE menuId = '" + req.query.menuId + "';")
    .then(data => res.send(data))

})


const port = Config.port;
server.listen(port, function() {
  console.log('server listening on port ' + port)
})
