import { defineQuery } from "next-sanity";
import { imageFields, pageHeroFields, seoFields } from "./fragments";

/**
 * A posting is publicly "open" when its status is Open and its deadline (if
 * any) hasn't passed. `$today` is an ISO date (YYYY-MM-DD) supplied by the
 * caller — see `todayIso()` in `lib/career-utils.ts`.
 */
const openJobFilter = /* groq */ `
  _type == "jobPosting"
  && status == "Open"
  && defined(slug.current)
  && (!defined(deadline) || deadline >= $today)
`;

const departmentFields = /* groq */ `{
  _id,
  title,
  "slug": slug.current,
  description,
  icon,
}`;

const jobCardFieldList = /* groq */ `
  _id,
  "slug": slug.current,
  title,
  employmentType,
  salary,
  location,
  "featured": coalesce(featured, false),
  status,
  deadline,
  postedAt,
  "summary": role->summary,
  "noIndex": coalesce(seo.noIndex, false),
  "role": role->{ title, "slug": slug.current },
  "department": department->{ title, "slug": slug.current, icon },
  "branch": branch->{ name, "slug": slug.current, city },
`;

export const careerPageQuery = defineQuery(`
  *[_type == "careersPage"][0]{
    hero${pageHeroFields},
    image${imageFields},
    whyWorkHere{ eyebrow, heading, description, cards[]{ icon, title, description } },
    lifeAtAdakings{
      eyebrow,
      heading,
      description,
      gallery[]${imageFields},
      quote{ text, name, role },
    },
    hiringProcess{ eyebrow, heading, steps[]{ icon, title, description } },
    benefits{ eyebrow, heading, description, items[]{ icon, title, description } },
    faq{ eyebrow, heading, items[]{ question, answer } },
    talentPool{ heading, description, cta },
    homeCta{ eyebrow, heading, description, cta },
    seo${seoFields},
  }
`);

export const featuredJobsQuery = defineQuery(`
  *[${openJobFilter} && featured == true] | order(postedAt desc) { ${jobCardFieldList} }
`);

export const allOpenJobsQuery = defineQuery(`
  *[${openJobFilter}] | order(coalesce(featured, false) desc, postedAt desc) { ${jobCardFieldList} }
`);

/** Matches any status, so closed/filled postings still resolve (with applications disabled). */
export const jobBySlugQuery = defineQuery(`
  *[_type == "jobPosting" && slug.current == $slug][0]{
    ${jobCardFieldList}
    description,
    responsibilities,
    requirements,
    benefits,
    seo${seoFields},
  }
`);

export const departmentsQuery = defineQuery(`
  *[_type == "department" && defined(slug.current)] | order(title asc) ${departmentFields}
`);
