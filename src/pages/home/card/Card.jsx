import React, { useEffect, useState } from 'react'
import css from './card.module.scss'
import axios from 'axios'
import {URL_ESPECIES, URL_EVOLUCIONES, URL_POKEMON} from "../../../api/apiRest";

export default function Card({card}) {

  const [itemPokemon, setItemPokemon] = useState({})
  const [especiePokemon, setEspeciePokemon] = useState({})
  
  // Info del pokemon
  useEffect(() => {
    const dataPokemon = async () => { 
      const api = await axios.get(`${URL_POKEMON}/${card.name}`)
      
      setItemPokemon(api.data)
    }
    dataPokemon()
  }, [])

  // Especie de pokemon (entrega evolucion y color)
  useEffect(() => {
    const dataEspecie = async () => { 
      const URL = card.url.split("/") // el metodo split ("/") lo vuelve un array
      const api = await axios.get(`${URL_ESPECIES}/${URL[6]}`) // URL[6] es por que el "id" (es lo que quiero obtener) esta en la posicion 6 del array
      setEspeciePokemon(api.data)
    }
    dataEspecie();
  }, [])

  console.log(itemPokemon)

  let pokeId = itemPokemon?.id?.toString()
  
  if (pokeId?.length == 1){     // si tiene de largo el numero de id 1 solo numero le agrega dos ceros, si tiene 2 un cero y sino ninguno. 
    pokeId = "00" + pokeId;
  } else if (pokeId?.length == 2){
    pokeId = "0" + pokeId;
  }

  // en la etiqueta img los "?" son para que no arroje error si no existe alguno de los componentes del pokemon
  return (
    <div className={css.card}>
      <img  
        className={css.img_poke}  
        src={itemPokemon?.sprites?.other["official-artwork"]?.front_default} 
        alt="pokemon" 
      /> 
      <div className={`bg-${especiePokemon?.color?.name} ${css.sub_card} `} > 
        <strong className={css.id_card}>{pokeId}</strong>
        <strong className={css.name_card}>{itemPokemon.name}</strong>
        <h4 className={css.altura_poke}>
          Altura: {itemPokemon.height}0 cm
        </h4>
        <h4 className={css.peso_poke}>
          Peso: {itemPokemon.weight} Kg
        </h4>
        <h4 className={css.habitat_poke}>
          Habitat: {itemPokemon.especiePokemon?.habitat?.name}
        </h4>
        <div className={css.div_stats}>
          {itemPokemon?.stats?.map((sta, index) => {
            return <h6 key={index} className={css.item_stats}> 
              <span className={css.name}> {sta.stat.name} </span>
              <progress value={sta.base_stat} max={110}></progress>
              <span className={css.numero}> {sta.base_stat} </span>
            </h6>
          })}
        </div>
        <div className={css.div_type_color}>
          {itemPokemon?.types?.map ((ti, index) => {
            return (
              <h6 key={index} className={`color-${ti.type.name} ${css.color_type}`}> 
                {ti.type.name}{" "}
              </h6>
            )
          })}
        </div>
      </div>
    </div>
  )
}
