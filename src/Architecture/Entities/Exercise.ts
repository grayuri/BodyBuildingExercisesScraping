import { IExercise } from "../Interfaces/Entities/IExercise"

export class Exercise implements IExercise{
  public name: string
  public muscleTargeted: string
  public equipmentType: string
  public pictureUrl: string

  constructor(data: IExercise) {
    this.name = data.name
    this.muscleTargeted = data.muscleTargeted
    this.equipmentType = data.equipmentType
    this.pictureUrl = data.pictureUrl
  }
}