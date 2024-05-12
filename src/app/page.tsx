"use client"
// types images for filter start 
import fairyImg from './images/pokTypes/fairy.png';
import darkImg from './images/pokTypes/dark.png';
import electricImg from './images/pokTypes/electric.png';
import fightingImg from './images/pokTypes/fighting.png';
import groundImg from './images/pokTypes/ground.png';
import iceImg from './images/pokTypes/ice.png';
import normalImg from './images/pokTypes/fairy.png';
import poisonImg from './images/pokTypes/poison.png';
import psychicImg from './images/pokTypes/psychic.png';
import rockImg from './images/pokTypes/rock.png';
import steelImg from './images/pokTypes/steel.png';
import waterImg from './images/pokTypes/water.png';
import dragonImg from './images/pokTypes/dragon.svg';
import ghostImg from './images/pokTypes/ghost.svg';
import bugImg from './images/pokTypes/bug.svg';
import fireImg from './images/pokTypes/fire.svg';
import grassImg from './images/pokTypes/grass.svg';
// types images for filter end

// ui imports start
import { PokemonCard } from './components/ui/pokemonCard';
// ui imports end
import { useState, useEffect } from 'react';
import Image from 'next/image';
import ReactPaginate from 'react-paginate';
import Autosuggest from 'react-autosuggest';

const pokemonsTypes: PokemonType[] = [
  { type: 'fairy', img: fairyImg },
  { type: 'dark', img: darkImg },
  { type: 'electric', img: electricImg },
  { type: 'fighting', img: fightingImg },
  { type: 'ground', img: groundImg },
  { type: 'ice', img: iceImg },
  { type: 'normal', img: normalImg },
  { type: 'poison', img: poisonImg },
  { type: 'psychic', img: psychicImg },
  { type: 'rock', img: rockImg },
  { type: 'steel', img: steelImg },
  { type: 'water', img: waterImg },
  { type: 'dragon', img: dragonImg },
  { type: 'ghost', img: ghostImg },
  { type: 'bug', img: bugImg },
  { type: 'fire', img: fireImg },
  { type: 'grass', img: grassImg },
];

interface PokemonType {
  type: string;
  img: string;
}

interface PokemonInfo {
  id: number;
  name: string;
  sprite: string;
  type1: string;
  type2: string;
}

export default function Home() {
  const [allPokemons, setAllPokemons] = useState<PokemonInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pokemonsPerPage] = useState(21);
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set<string>());
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // data fetch start
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pokemonData = await Promise.all(
          Array.from({ length: 100 }, (_, i) =>
            fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}/`).then(res => res.json())
          )
        );
        const pokemons: PokemonInfo[] = pokemonData.map((res, i) => {
          const type1 = res.types[0]?.type.name;
          const type2 = res.types[1]?.type.name;
          return {
            id: i + 1,
            name: res.name,
            sprite: res.sprites.front_default,
            type1: type1 || '',
            type2: type2 || '',
          };
        });
        setAllPokemons(pokemons);
        setLoading(false);
        console.log(pokemons);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pagination logic start
  const handlePageClick = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  // Filtered pokemons based on selected types and search value
  const filteredPokemons = allPokemons.filter((pokemon) => {
    if (selectedTypes.size === 0 && !searchValue) {
      return true;
    }

    let typeMatch = false;
    if (selectedTypes.size === 0) {
      typeMatch = true;
    } else {
      for (const selectedType of selectedTypes) {
        if (pokemon.type1 === selectedType || pokemon.type2 === selectedType) {
          typeMatch = true;
          break;
        }
      }
    }

    const nameMatch = pokemon.name.toLowerCase().includes(searchValue.toLowerCase());

    return typeMatch && (searchValue ? nameMatch : true);
  });

  const indexOfLastPokemon = (currentPage + 1) * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);
  // Pagination logic end

  // Toggle type selection
  const toggleTypeSelection = (type: string) => {
    setSelectedTypes((prevSelectedTypes) => {
      const newSelectedTypes = new Set(prevSelectedTypes);
      if (newSelectedTypes.has(type)) {
        newSelectedTypes.delete(type);
      } else {
        newSelectedTypes.add(type);
      }
      return newSelectedTypes;
    });
  };

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : allPokemons.map(pokemon => pokemon.name).filter(name =>
      name.toLowerCase().slice(0, inputLength) === inputValue
    );
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event: React.FormEvent, { suggestion }: { suggestion: string }) => {
    setSearchValue(suggestion);
  };

  const inputProps = {
    placeholder: 'Search Pokemon',
    value: searchValue,
    onChange: (_: React.FormEvent, { newValue }: { newValue: string }) => {
      setSearchValue(newValue);
    },
    onBlur: () => {
      setSuggestions([]);
    }
  };

  const resetSearch = () => {
    setSearchValue('');
    setSuggestions([]);
  };

  return (
    <div className="bg-white p-5 rounded-xl max-w-5xl w-full min-h-screen mx-4 flex flex-col ">
      {/* Filter start */}
      <div className=' flex flex-col gap-4'>
        {/* Types start */}
        <div className=' flex flex-wrap gap-2'>
          {pokemonsTypes.map((item, index) => (
            <div key={index} className='flex gap-2 items-center border border-green p-1 rounded-xl hover:cursor-pointer'
              onClick={() => toggleTypeSelection(item.type)}
            >
              <input type="checkbox" checked={selectedTypes.has(item.type)} />
              <h3 className='font-bold'>{item.type}</h3>
              <Image src={item.img} alt='Fairy' width={24} height={24} />
            </div>
          ))}
          <div className='flex gap-2 items-center border border-dark-green p-1 rounded-xl'>
            <p className=' hover:cursor-pointer text-red-600' onClick={() => setSelectedTypes(new Set())}>Reset</p>
          </div>
        </div>
        {/* Types end */}

        {/* Search start */}
        <div className=' flex flex-col gap-2'>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            onSuggestionSelected={onSuggestionSelected}
            getSuggestionValue={(suggestion) => suggestion}
            renderSuggestion={(suggestion) => <div className='suggestion-item hover:cursor-pointer '>{suggestion}</div>}
            inputProps={inputProps}
          />
          <button className=' self-start text-red-500' onClick={resetSearch}>Reset search</button>
          {/* Suggestions list */}
        </div>
        {/* Search end */}
      </div>
      {/* Filter end */}
      <span className="border border-green w-full block my-5"></span>
      {/* Items list start  */}
      <div className=' flex flex-wrap gap-3 justify-center max-w-4xl self-center'>
        {!loading ? (
          currentPokemons.map((item) => {
            return (
              <PokemonCard item={item} key={item.id} />
            );
          })
        ) : (
          <div className=' mt-20 font-bold text-2xl -mb-10 w-72 h-24 bg-white z-10 text-center'>is Loading</div>
        )}
      </div>
      {/* Items list end  */}
      {/* Pagination */}
      {filteredPokemons.length === 0 ? <div className=' font-bold text-xl self-center'>Pokemons not found</div> :
        <div className="flex justify-center mt-4">
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={Math.ceil(filteredPokemons.length / pokemonsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName=' flex gap-4 mt-5'
            pageClassName=' px-2'
            activeClassName=" rounded-xl bg-black text-white px-2"
          />
        </div>}
    </div>
  );
}