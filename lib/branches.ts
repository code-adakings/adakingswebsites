export type Branch = {
  id: string;
  name: string;
  area: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
};

export const branches: Branch[] = [
  {
    id: "east-legon",
    name: "Adakings East Legon",
    area: "East Legon",
    city: "Accra",
    address: "East Legon Main Road, Accra",
    hours: "9:00am – 10:00pm daily",
    phone: "+233 000 000 001",
  },
  {
    id: "osu",
    name: "Adakings Osu",
    area: "Osu",
    city: "Accra",
    address: "Oxford Street, Osu, Accra",
    hours: "9:00am – 11:00pm daily",
    phone: "+233 000 000 002",
  },
  {
    id: "kumasi",
    name: "Adakings Kumasi",
    area: "Adum",
    city: "Kumasi",
    address: "Adum Central, Kumasi",
    hours: "9:00am – 10:00pm daily",
    phone: "+233 000 000 003",
  },
  {
    id: "takoradi",
    name: "Adakings Takoradi",
    area: "Market Circle",
    city: "Takoradi",
    address: "Market Circle, Takoradi",
    hours: "9:00am – 9:00pm daily",
    phone: "+233 000 000 004",
  },
];
