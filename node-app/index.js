const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req,res) => {
    res.send("Hello from Gauraang")
})


app.listen(PORT, ()=> { console.log(`Server started on PORT: ${PORT}`)})