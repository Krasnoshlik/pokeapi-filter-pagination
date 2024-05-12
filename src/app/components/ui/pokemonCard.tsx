import Link from "next/link";

interface PokemonsInfo {
  id: number;
  name: string;
  sprite: string;
  type1: string;
  type2: string;
}

interface PokemonCardProps {
  item: PokemonsInfo;
}


export const PokemonCard = ({ item }: PokemonCardProps) => {
  return (
    <div className=" border-2 border-green p-2">
      <div className=" flex flex-col items-center">
        <h3 className=" font-bold">
          {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        </h3>
        <img src={item.sprite} alt="" />
        <Link
          href={{
            pathname: "/pokemon",
            query: { id: item.id.toString() },
          }}
          className=" text-sm underline text-blue-500"
        >
          More info
        </Link>
      </div>
      <div className=" flex justify-between font-medium text-sm">
        <h4>{item.type1}</h4>
        <h4>{item.type2}</h4>
      </div>
    </div>
  );
};
