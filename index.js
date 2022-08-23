import express from "express"
//import path from "path"
import fetch from "node-fetch"
import mysql from "mysql"
let app = express()

function set_options(res, options) {
  res.header("Access-Control-Allow-Origin", '*')

  if(options && options.length)
    for (let option of options) {
      if (option.length == 2 && option[0] && option[1])
        res.header(option[0], option[1])
    }

  return res
}

app.get('/', function (req, res) {
  res = set_options(res)

  let endpoints = ["static_data", "api_data", "db_data"]
  let DOM_data = "<h1>You must choose an endpoint!</h1>"
  for (let endpoint of endpoints)
    DOM_data += '<a href="' + endpoint + '" target="_blank">/' + endpoint + "</a><br /><br />"
  res.end(DOM_data)
})

app.get('/static_data', function (req, res) {
  res = set_options(res)

  /*let options = {
      root: path.join(__dirname)
  }*/
  //res.sendFile("data.json", options)
  res.sendFile("/home/runner/APIExpressNode/data.json")
})

app.get('/api_data', function (req, res) {
  res = set_options(res)

  let header = {
    'Accept': 'application/json',
    'Authorization': 'Bearer GRFzIeeQkGJ7qVOgPN0E'
  }
  fetch("https://the-one-api.dev/v2/book", { headers: header })
  .then(function(result){
    return result.text()
  })
  .then(function(data){
    let api_data = {}
    for(let book of JSON.parse(data).docs){
      api_data[book.name] = book._id
    }
    res.end(JSON.stringify(api_data))
  })
})

app.get('/db_data', function (req, res) {
  res = set_options(res)

  let sql = "SELECT * from places;"

  let con = mysql.createConnection({
    host: "remotemysql.com",
    user: "uOdiYKGflG",
    password: "pSY1mvpuwS",
  database:"uOdiYKGflG"
  })

  con.connect(function(err) {
    if (err) throw err
    console.log("Connected!")
    con.query(sql, function (err, result) {
      if (err) throw err

      let db_data = '{"data" :['
      for(let entry of result)
        db_data += JSON.stringify(entry) + ((entry == result[result.length - 1]) ? "" : ",")
      db_data += "]}"

      res.end(db_data)
    })
  })
})
app.listen(8000)