import { IScrapper } from "../Interfaces/Details/IScrapper";
import puppeteer from "puppeteer";

export class Scrapper implements IScrapper {
  public browser: any
  public page: any

  async start() {
    this.browser = await puppeteer.launch()
    this.page = await this.browser.newPage()
  }

  async finish() {
    await this.browser.close()
  }

  async openPage(link: string) {
    try {
      await this.page.goto(link)
    }
    catch (error) {
      console.log("It was not possible to visit this current page: ", link)
      await this.finish()
    }
  }
  
  async clickIt(elementSelector: any) {
    await this.page.locator(elementSelector).click()
  }

  async wait(ms: number)  {
    return await new Promise(function(resolve) {
      setTimeout(resolve, ms)
    })
  }

  private async evaluateElementWithProperty(elementNode: any, property: string): Promise<string | undefined> {
    switch(property) {
      case "innerText":
        return await elementNode.evaluate((e: any) => e.innerText)
      break
      case "href":
        return await elementNode.evaluate((e: any) => e.href)
      break
      case "src":
        return await elementNode.evaluate((e: any) => e.src)
      break
      default:
        console.log("This property was not assigned.")
    }
  }

  private async evaluateElementsWithProperty(elementsNode: any, property: string) {
    return await Promise.all(elementsNode.map(async (en: any) => this.evaluateElementWithProperty(en, property)))
  }

  async getElement(selector: string, property: string): Promise<string | undefined> {
    const elementNode = await this.page.$(selector)
    const element = await this.evaluateElementWithProperty(elementNode, property)
    return element
  }

  async getElements(selector: string, property: string): Promise<string[] | undefined> {
    const elementNode = await this.page.$$(selector)
    const element = await this.evaluateElementsWithProperty(elementNode, property)
    return element
  }

  async getAsyncElement(selector: string, property: string): Promise<string | undefined> {
    const elementNode = await this.page.waitForSelector(selector)
    const element = await this.evaluateElementWithProperty(elementNode, property)
    return element
  }

  async getAsyncElements(selector: string, property: string): Promise<string[] | undefined> {
    const elementNode = await this.page.waitForSelectorAll(selector)
    const element = await this.evaluateElementsWithProperty(elementNode, property)
    return element
  }
}