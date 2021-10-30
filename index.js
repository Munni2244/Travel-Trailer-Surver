const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env. PORT || 5000 ;
require('dotenv').config();
const ObjectId= require('mongodb').ObjectId;

//  traveldb
//   VcHcJ4RBOnKk9sUc
app.use(cors());
app.use(express.json())

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crn6x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

///functionality
 async function run(){
     try{

        await client.connect();
        const database = client.db("travel-trailer");
        const allDatabaseCollection = database.collection("bookiing");
        const addCollection= client.db("travel-trailer").collection("addBooking");

      ///get all data
         app.get('/booking', async(req, res)=>{
         const cursor = await allDatabaseCollection.find({}).toArray();
        res.send(cursor)
         })

    ///get single data
        app.get('/booking/:id', async(req, res)=>{
            const id= req.params.id;
            const query= {_id: ObjectId(id)};
            const result = await allDatabaseCollection.findOne(query);
            res.send(result)
        })

        //get My data
        app.get('/addBooking/:email', async(req, res)=>{
          const result = await addCollection.find({email: req.params.email}).toArray();
          console.log("find my data");
          res.send(result);


        })

        //delete my data
        app.delete('/deleteBooking/:id', async(req, res)=>{
          const id= req.params.id;
          const query= {_id: ObjectId(id)};
          const result = await addCollection.deleteOne(query);
          console.log(result);
          res.send(result);

        })
        // post data
        app.post('/booking', async(req, res)=>{
            const docs= req.body;
            const result = await allDatabaseCollection.insertOne(docs);
            console.log(result);
            res.send(result)


     })

        //post booking data
        app.post('/addBooking', async(req, res)=>{
            const doc=req.body;
            const result = await addCollection.insertOne(doc);
            console.log(result);
            res.send(result);

        })

     }
     finally {
        // await client.close();
      }
 }

 run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })