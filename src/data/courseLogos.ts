// Logo por curso (slug -> SVG en public/). Si el curso no tiene uno, usa la marca AJ.
const COURSE_LOGOS: Record<string, string> = {
  "diseno-de-sistemas-escalables": "/brand/cursos/diseno-de-sistemas.svg",
};

export function courseLogo(slug: string): string {
  return COURSE_LOGOS[slug] ?? "/brand/marca.svg";
}
