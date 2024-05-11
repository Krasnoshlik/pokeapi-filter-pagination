"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Pokemon({ searchParams }: any) {
  const { id } = searchParams;
  const [loading, setLoading] = useState(true);
  const [pokemonInfo, setPokemonInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch pokemon data
            const pokemonData = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${id}/`
            ).then((res) => res.json());

            // Fetch stat data
            const statData = await fetch(
                `https://pokeapi.co/api/v2/stat/${id}/`
            ).then((res) => res.json());

            const type1 = pokemonData.types[0]?.type.name;
            const type2 = pokemonData.types[1]?.type.name;
            const pokemon = {
                id: id,
                name: pokemonData.name,
                sprite: pokemonData.sprites.front_default,
                type1: type1,
                type2: type2,
                effect: pokemonData.effect_entries,
                pokType: statData.name,
                damageClass: statData.move_damage_class,
            };
            setPokemonInfo(pokemon);
            setLoading(false);
            console.log(statData);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };
    fetchData();
}, [id]);

  return (
    <div className="bg-white p-5 rounded-xl max-w-5xl w-full h-full mx-4 flex flex-col ">
      {loading ? (
        <div className=" self-center font-bold text-xl">Loading...</div>
      ) : pokemonInfo ? (
        <div>
          <div className=" flex justify-between items-center">
            <div>
              <h2 className=" font-bold text-4xl">
                {pokemonInfo.name.charAt(0).toUpperCase() +
                  pokemonInfo.name.slice(1)}
              </h2>
              <div className=" flex justify-between font-medium text-xl">
                <h4>{pokemonInfo.type1}</h4>
                <h4>{pokemonInfo.type2}</h4>
              </div>
            </div>
            <Image
              src={pokemonInfo.sprite}
              alt="Image"
              width={200}
              height={200}
            />
          </div>

          <div className=" flex gap-2">
            <h4 className=" font-medium">Аbility:</h4><p>{pokemonInfo.effect}</p>
          </div>
        </div>
      ) : (
        <div className="self-center font-bold text-xl">Pokemon not found</div>
      )}
    </div>
  );
}
