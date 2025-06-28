import LaureatesPage from "./LaureatesPage/LaureatesPage";


interface ApiLaureate {
  id: string;
  firstname: string;
  surname?: string;
  motivation: string;
  share: string;
}

interface ApiPrize {
  year: string;
  category: string;
  laureates?: ApiLaureate[];
}

export default async function Page() {
  const result = await fetch("https://api.nobelprize.org/v1/prize.json");
  const data = await result.json();
  const prizes = data.prizes || [];

  const laureates = prizes.flatMap((prize: ApiPrize) =>
    prize.laureates?.map((laureate: ApiLaureate) => ({
      id: laureate.id,
      firstname: laureate.firstname,
      surname: laureate.surname,
      motivation: laureate.motivation,
      share: laureate.share,
      year: prize.year,
      category: prize.category,
    })) || []
  );

  return <LaureatesPage laureates={laureates} />;
}