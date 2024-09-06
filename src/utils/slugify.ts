export default function slugify(string: string): string {
  return string.replaceAll(" ", "_").toLowerCase()
}