import { IExercise } from "../Interfaces/Entities/IExercise"
import deslugify from "../../utils/deslugify"
import slugify from "../../utils/slugify"

export class Exercise implements IExercise{
  public name: string
  public muscleTargeted: string
  public equipmentType: string
  public pictureUrl: string
  public slug: string
  public muscleTargetedSlug: string
  public equipmentTypeSlug: string

  constructor(data: IExercise) {
    this.name = data.name
    this.muscleTargeted = data.muscleTargeted.split(" ").join(" ")
    this.equipmentType = data.equipmentType
    this.pictureUrl = data.pictureUrl
    this.slug = slugify(data.name)
    this.muscleTargetedSlug = deslugify(data.muscleTargeted, "-")
    this.equipmentTypeSlug = slugify(data.equipmentType)
  }
}