"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface PokemonInfo {
  id: number;
  name: string;
  sprite: string;
  exp: number;
  height: number;
  weight: number;
  type1: string;
  type2: string;
}

interface Move {
  move: {
    name: string;
  };
}

interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export default function Pokemon({ searchParams }: { searchParams: { id: number } }) {
  const { id } = searchParams;
  const [loading, setLoading] = useState(true);
  const [pokemonInfo, setPokemonInfo] = useState<PokemonInfo | null>(null);
  const [pokMoves, setPokMoves] = useState<Move[] | null>(null);
  const [pokStats, setPokStats] = useState<Stat[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(res => res.json());

        const type1 = pokemonData.types[0]?.type.name;
        const type2 = pokemonData.types[1]?.type.name;
        const pokemon: PokemonInfo = {
          id: id,
          name: pokemonData.name,
          sprite: pokemonData.sprites.front_default,
          exp: pokemonData.base_experience,
          type1 : type1,
          type2 : type2,
          height: pokemonData.height,
          weight: pokemonData.weight,
        };
        setPokemonInfo(pokemon);
        setLoading(false);
        setPokMoves(pokemonData.moves);
        setPokStats(pokemonData.stats);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="bg-white p-5 rounded-xl max-w-5xl w-full h-screen mx-4 flex flex-col ">
      {loading ? (
        <div className=" self-center font-bold text-xl">Loading...</div>
      ) : pokemonInfo ? (
        <div>
          <div className=" flex justify-between items-center">
            <div>
              <h2 className=" font-bold text-4xl">
                {pokemonInfo.name.charAt(0).toUpperCase() + pokemonInfo.name.slice(1)}
              </h2>
              <div className=" flex justify-between font-medium text-xl">
                <h4>{pokemonInfo.type1}</h4>
                <h4>{pokemonInfo.type2}</h4>
              </div>
            </div>
            <Image src={pokemonInfo.sprite} alt="Image" width={200} height={200} />
          </div>

          <div className=" flex flex-col gap-5">
            <div className=" flex gap-2 flex-col">
              <h1 className=" text-xl font-bold">Pokemon characteristic:</h1>

              <div className=" flex gap-3">
                <h4 className=" font-medium">Base xp:</h4>
                <p>{pokemonInfo.exp}</p>
              </div>

              <div className=" flex gap-3">
                <h4 className=" font-medium">Height:</h4>
                <p>{pokemonInfo.height}</p>
              </div>

              <div className=" flex gap-3">
                <h4 className=" font-medium">Weight:</h4>
                <p>{pokemonInfo.weight}</p>
              </div>
            </div>

            <div className=" max-h-52">
              <h2 className=" font-bold">Pokemon stats:</h2>
              <div className=" flex flex-col gap-2">
                {pokStats &&
                  pokStats.map((item, index) => (
                    <div key={index} className=" flex gap-2">
                      <p className=" font-medium">{item.stat.name}:</p>
                      <p>{item.base_stat}</p>
                    </div>
                  ))}
              </div>
            </div>

            <div className=" max-h-52">
              <h2 className=" font-bold">Pokemon moves:</h2>
              <div className=" flex flex-wrap gap-2">
                {pokMoves &&
                  pokMoves.slice(0, 30).map((item, index) => (
                    <div key={index}>
                      <p>{item.move.name}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="self-center font-bold text-xl">Pokemon not found</div>
      )}
    </div>
  );
}
