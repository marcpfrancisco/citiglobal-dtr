export function isNotEmptyString<Subject>(
  subject: Subject | unknown
): subject is string {
  return typeof subject === 'string' && subject !== '';
}
