import { useRouter } from 'next/navigation'

export const PokemonCard = ({item}) => {
    const router = useRouter();

    const goToPokemonDetail = () => {
        router.push(`/pokemon/${item.id}`);
    };

    return (
        <div className=" border-2 border-green p-2 hover:cursor-pointer" onClick={goToPokemonDetail}>
            <div className=" flex flex-col items-center">
                <h3 className=" font-bold">{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</h3>
                <img src={item.sprite} alt="" />
            </div>
            <div className=" flex justify-between font-medium text-sm">
                <h4>{item.type1}</h4>
                <h4>{item.type2}</h4>
            </div>
        </div>
    )
}