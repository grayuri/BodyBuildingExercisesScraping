import { IExercise } from "../Interfaces/Entities/IExercise";
import { IExerciseGetter } from "../Interfaces/Adapters/IExerciseGetter";
import { IScrapper } from "../Interfaces/Details/IScrapper";
import { IDatabase } from "../Interfaces/Details/IDatabase";
import { Exercise } from "../Entities/Exercise";

interface constructorProps {
  scrapper: IScrapper
  db: IDatabase
}

export class ExerciseGetter implements IExerciseGetter {
  private scrapper: IScrapper
  private db: IDatabase

  constructor({ scrapper, db }: constructorProps) {
    this.scrapper = scrapper
    this.db = db
  }

  private async loadMoreButtonExists(selector: string): Promise<boolean> {
    try {
      const loadMoreButton = await this.scrapper.getAsyncElement(selector, "innerText")
      if (loadMoreButton !== undefined || loadMoreButton !== "") return true
    } 
    catch (error) {
      console.log("The Load More Button doesn't exist anymore.")
    }
    return false
  }

  private async loadAllData() {
    let loadMoreButtonIsVisible = true
    let loadingIteration = 0

    while(loadMoreButtonIsVisible) {
      await this.scrapper.wait(3000)
      const loadMoreButtonExists = await this.loadMoreButtonExists(".ExLoadMore>button")

      if (loadMoreButtonExists) {
        await this.scrapper.clickIt(".ExLoadMore>button")
        loadingIteration++
        console.log(`${loadingIteration}o. Time clicking in Load More`)
      }
      else {
        console.log("All the data have been loaded. It's time to get all.")
        loadMoreButtonIsVisible = false
      }
    }
  }

  private async getExerciseRowData(name: string, muscleTargeted: string, index: number): Promise<IExercise> {
    let exercise: IExercise = {} as IExercise

    try {
      const pictureUrls = await this.scrapper.getElements(".ExResult-img", "src")
      const equipmentTypes = await this.scrapper.getElements(".ExResult-equipmentType>a", "innerText")
      
      if (
        pictureUrls !== undefined &&
        equipmentTypes !== undefined
      ) {
        exercise = new Exercise({
          name,
          muscleTargeted,
          pictureUrl: pictureUrls[(index * 2) + 1],
          equipmentType: equipmentTypes[index]
        })
      }
    } 
    catch (error) {
      console.log("It was not possible to get your exercise data.")
    }
    
    return exercise
  }

  public async getAllExercises() {
    try {
      const muscles = [
        "chest",
        "forearms",
        "lats",
        "middle-back",
        "lower-back",
        "neck",
        "quadriceps",
        "hamstrings",
        "calves",
        "triceps",
        "traps",
        "shoulders",
        "abdominals",
        "glutes",
        "biceps",
        "adductors",
        "abductors"
      ]

      for (const muscle of muscles) {
        await this.scrapper.start()
        await this.scrapper.openPage("https://www.bodybuilding.com/exercises/finder?muscle=" + muscle)
        
        console.log(`I will get the ${muscle.toUpperCase()} exercises`)
        await this.loadAllData()
  
        const allExercisesNames = await this.scrapper.getElements(".ExResult-resultsHeading", "innerText")
  
        if (allExercisesNames !== undefined) {
          for (const [index, name] of allExercisesNames.entries()) {
            const exercise = await this.getExerciseRowData(name, muscle, index)
            this.db.appendData(exercise)
          }
        }
        
        await this.scrapper.finish()
      }
    }
    catch(error) {
      console.log("It was not possible to get the exercises.")
    }
  }
}