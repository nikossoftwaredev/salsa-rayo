export interface PackageCardData {
  title: string;
  price: string;
  numberOfLessons: number;
  isMostPopular: boolean;
}

export const PACKAGES: PackageCardData[] = [
  {
    title: "Rayo 8",
    price: "50",
    numberOfLessons: 2,
    isMostPopular: false,
  },
  {
    title: "Rayo 16",
    price: "75",
    numberOfLessons: 4,
    isMostPopular: true,
  },
  {
    title: "Rayo 24",
    price: "100",
    numberOfLessons: 6,
    isMostPopular: false,
  },
];
