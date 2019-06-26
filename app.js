const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const expressJwt = require('express-jwt')
const jwt = require('jsonwebtoken')

require('express-group-routes')
const app = express()

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'instaclone'
})

app.use(bodyParser.json())

app.group('/api/v1', (router) => {

  router.post('/login', (req, res) => {
    const email = req.body.email
    const password = req.body.password

    conn.query(`SELECT*FROM users WHERE email = '${email}' && password = '${password}'`, (err, rows, fields) => {
      
      if(rows.length == 1){

        const token = jwt.sign({email:email}, 'rahasia')
        res.send({rows,token})
      } else{

        res.send(rows)
      }
      


    })

  })
  
  router.get('/users' , (req, res) => {
    conn.query(`SELECT*FROM users`, (err, rows, fields) => {
      if(err) throw err
  
      res.send(rows)
  })
  })
  
  router.get('/user', (req, res) => {
    const email = req.body.email;
    conn.query(`SELECT*FROM users WHERE email='${email}'`, (err, rows, fields) => {
      if(err) throw err
      
      res.send(rows)
    })
  })
  
  router.get('/posts', expressJwt({secret: 'rahasia'}), (req, res) => {
    conn.query(`select * from v_posts`, (err, rows, fields) => {
      if(err) throw err
  
      res.send(rows)
  })
  })

  router.get('/posts/:userId', expressJwt({secret: 'rahasia'}), (req, res) => {
    const userId = req.params.userId
    conn.query(`select * from v_posts where user_id = ${userId}`, (err, rows, fields) => {
      if(err) throw err
  
      res.send(rows)
  })
  })

  router.post('/post', expressJwt({secret: 'rahasia'}),(req, res) => {
    const post = req.body.post
    const caption = req.body.caption
    const userId = req.body.userId

    conn.query(`INSERT INTO posts VALUES (null,'${post}','${caption}', ${userId}, 0)`, (err, rows, fields) => {
      if(err) throw err
  
      res.send(rows)
  })
  })

  router.patch('/post/:id', expressJwt({secret: 'rahasia'}),(req, res) => {
    const id = req.params.id
    const caption = req.body.caption

    conn.query(`UPDATE FROM posts SET caption = '${caption}' where id='${id}')`, (err, rows, fields) => {
      if(err) throw err
  
      res.send(rows)
  })
  })
  
  router.delete('/post/:id', expressJwt({secret: 'rahasia'}),(req, res) => {
    const id = req.params.id

    conn.query(`DELETE from posts where id='${id}'`, (err, rows, fields) => {
      if(err) throw err
  
      res.send(rows)
  })
  })

});

app.listen('3000', () => console.log("App Start..."));