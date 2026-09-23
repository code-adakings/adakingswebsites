export type Author = {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
};

export const authors: Record<string, Author> = {
  "ama-owusu": {
    id: "ama-owusu",
    name: "Ama Owusu",
    role: "Head of Brand, Adakings",
    bio: "Ama leads brand storytelling at Adakings, spotlighting the people and craft behind every meal.",
    avatar: "/journal/authors/ama-owusu.jpg",
  },
  "kwesi-boateng": {
    id: "kwesi-boateng",
    name: "Kwesi Boateng",
    role: "Franchise Development Lead",
    bio: "Kwesi works with new franchise partners across Ghana to bring Adakings to their communities.",
    avatar: "/journal/authors/kwesi-boateng.jpg",
  },
  "editorial-team": {
    id: "editorial-team",
    name: "Adakings Editorial",
    role: "Adakings Journal",
    bio: "News, culture, and stories from the Adakings kitchen and community.",
    avatar: "/journal/authors/editorial-team.jpg",
  },
};

export function getAuthor(id: string): Author {
  return authors[id] ?? authors["editorial-team"];
}
