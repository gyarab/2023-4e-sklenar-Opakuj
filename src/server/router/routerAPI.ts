import express from "express";
var routerAPI = express.Router();
import { ensureAuth } from "../scripts/ensureLogin";
import { ensureGuest } from "../scripts/ensureLogin";
import { checkJSON, savePrivate, savePublic } from "../scripts/exercises";
import ExercisePrivate from "../db/MongooseSchema/ExercisesPrivate";
import ExercisePublic from "../db/MongooseSchema/ExercisesPublic";
import UserStatistics from "../db/MongooseSchema/UserStatistics";

routerAPI.get("/user", function (req, res, next) {
  try {
    let session = req.params["session"];
    session = sessionStorage.getItem(session);
    res.send(session);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

routerAPI.get("/getExercisesPublic", async function (req, res, next) {
  await ExercisePublic.find({})
    .then((exercises) => {
      //console.log(exercises);
      res.send(exercises);
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error");
    });
});

routerAPI.get("/deleteExercisesPublic", async function (req, res, next) {});

routerAPI.get("/getExercisesPrivate", async function (req, res, next) {
  //console.log(req);
  const userID = req.user!["userID"];
  //console.log(userID);
  await ExercisePrivate.find({ userID: userID })
    .then((exercises) => {
      //console.log(exercises);
      res.send(exercises);
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error");
    });
});

routerAPI.post("/deleteExercisesPrivate", async function (req, res, next) {
  let id = req.body.exerciseID;
  console.log(id);
  await ExercisePrivate.findOneAndDelete({ exerciseID: id })
    .then(() => {
      res.send("OK");
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error");
    });
});

routerAPI.post("/exercisesUpload", async function (req, res, next) {
  //zkontrolovat
  let exercise = req.body;
  let visibility = exercise["visibility"];
  const userID = req.user!["userID"];
  exercise["userID"] = userID;
  if (await checkJSON(exercise)) {
    if (visibility == "Public") {
      //ulozit do public
      let newExercise = await savePublic(exercise);
      res.send({ msg: "OK", newExercise: newExercise });
    } else if (visibility == "Private") {
      //ulozit do private
      let newExercise = await savePrivate(exercise);
      res.send({ msg: "OK", newExercise: newExercise });
    } else {
      console.log("Visibility")
      res.status(500).send("Špatný soubor nebo formát souboru");
    }
  } else {
    console.log("JSON")
    res.status(500).send("Špatný soubor nebo formát souboru");
  }
});

routerAPI.post("/updateStats", async function (req, res, next) {
  let stats = req.body;
  const userID = req.user!["userID"];
  let statsFromDB = await UserStatistics.findOne({ userID: userID });
  if(statsFromDB == null){
    statsFromDB = new UserStatistics({
      userID: userID,
      totalExercisesPlayed: 0,
      totalAnswers: 0,
      totalCorrectAnswers: 0,
      totalIncorrectAnswers: 0,
      totalAcedExercises: 0,
      totalFailedExercises: 0,
      exactFailedExercises: [],
      exactAcedExercises: [],
    });
    await UserStatistics.create(statsFromDB);
  }
  statsFromDB.totalExercisesPlayed++;
  statsFromDB.totalAnswers += stats.totalAnswers;
  statsFromDB.totalCorrectAnswers += stats.totalCorrectAnswers;
  statsFromDB.totalIncorrectAnswers += stats.totalIncorrectAnswers;
  statsFromDB.totalAcedExercises += stats.totalAcedExercises;
  statsFromDB.totalFailedExercises += stats.totalFailedExercises;
  if (stats.exactFailedExercises != null || stats.exactFailedExercises != undefined) {
    statsFromDB.exactFailedExercises.push(stats.exactFailedExercises);
  }
  if (stats.exactAcedExercises != null || stats.exactAcedExercises != undefined) {
    statsFromDB.exactAcedExercises.push(stats.exactAcedExercises);
  }
  console.log(stats);
  await UserStatistics.findOneAndUpdate({ userID: userID }, statsFromDB, {
    new: true,
  })
    .then(() => {
      res.send("OK");
    })
    .catch((err) => {
      res.status(500).send("Chyba serveru");
    });
});

routerAPI.get("/getStats", async function (req, res, next) {
  const userID = req.user!["userID"];
  let stats = await UserStatistics.findOne({ userID: userID })
    .then((stats) => {
      res.send(stats);
    })
    .catch((err) => {
      res.status(500).send("Chyba serveru");
    });
});

export { routerAPI };
