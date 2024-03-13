const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const { MongoClient } = require("mongodb");

const mongoURI =
  "mongodb+srv://daniel111hart:daniel111hart@cluster0.sxxiscv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(mongoURI);

app.post("/api/save-data", async (req, res) => {
  await client.connect();
  const database = client.db("data");
  if (!database.collection("nodes")) {
    database.createCollection("nodes");
  }

  const collection = database.collection("nodes");
  collection.deleteMany({});
  collection.insertMany(req.body);
  const data = req.body;
  res.json(data);
});

app.get("/", async (req, res) => {
  try {
    res.send("server is running");
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
