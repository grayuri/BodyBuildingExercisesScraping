export default function deslugify(string: string, filter: string): string {
  return string.split(filter).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}