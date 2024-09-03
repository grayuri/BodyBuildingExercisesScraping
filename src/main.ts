import { Scrapper } from "./Architecture/Details/Scrapper"
import { Database } from "./Architecture/Details/Database"
import { ExerciseGetter } from "./Architecture/Adapters/ExerciseGetter"

async function init() {
  const scrapper = new Scrapper()
  const exercisesDb = new Database("exercises")
  const EG = new ExerciseGetter({ scrapper, db: exercisesDb })

  try {
    await EG.getAllExercises()
    console.log("Congratulations! All the data have been written in your database.")
  } 
  catch (error) {
    console.log("It was not possible to extract the datas.")
  }
}

init()