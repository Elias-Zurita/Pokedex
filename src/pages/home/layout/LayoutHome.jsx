import React, { useEffect, useState } from 'react'
import css from './layout.module.scss'
import Header from '../header/Header'
import axios from 'axios'
import * as FaIcons from "react-icons/fa"
import { URL_POKEMON } from '../../../api/apiRest'
import Card from '../card/Card'

export default function LayoutHome() {

  const [arrayPokemon, setArrayPokemon] = useState([])
  const [globalPokemon, setGlobalPokemon] = useState([]) // Obtiene todos los pokemons disponibles de la API
  const [xpage, setXpage] = useState(1) // Paginado
  const [search, setSearch] = useState('') // Busqueda

    useEffect(() => {

        const api = async () => {

            const limit = 40 // cantidad de pokemons por pagina
            const xp = (xpage - 1) * limit
            const apiPoke = await axios.get(`${URL_POKEMON}/?offset=${xp}&limit=${limit}`) // el ?offset limita la cantidad de pokemons que se van a ver (xp con cual arranca, limit hasta cual muestra.)

            setArrayPokemon(apiPoke.data.results)
        }
        api()
        getGlobalPokemons()
    }, [xpage])

    const getGlobalPokemons = async () => {
        const res =  await axios.get(`${URL_POKEMON}?offset=0&limit=1000`)
        
        const promises = res.data.results.map(pokemon => {
            return pokemon
        })

        const results = await Promise.all(promises)
        setGlobalPokemon(results)
    }
    
    const filterPokemons = search?.length > 0 ? globalPokemon?.filter(pokemon => pokemon?.name?.includes(search)) : arrayPokemon 
    
    const obtenerSearch = (e) => {
        const texto = e.toLowerCase() // paso todas las busquedas a minuscula
        setSearch(texto)
        setXpage(1)
    }

    return (
        <div className= {css.layout}>
            <Header obtenerSearch = {obtenerSearch} />

            <section className={css.section_pagination}>
                <div className={css.div_pagination}>
                    <span className={css.item_izquierdo}
                    onClick = {() => {
                        if (xpage == 1 ){
                            return console.log("no puedo retroceder")
                        }
                        setXpage(xpage - 1)
                    }}
                    >
                        {" "}
                        <FaIcons.FaAngleLeft />
                        {" "}
                    </span>
                    <span className={css.item}> {xpage} </span> {/* Determina la pagina en la que estoy */}
                    <span className={css.item}> DE </span>
                    <span className={css.item}> 
                        {" "}
                        {Math.round(globalPokemon?.length / 40)} {/* globalPokemon es la cantidad total de pokemons, a ese numero lo divido por la cantidad que setee por pagina (40 en este caso) y da la cantidad total de paginas (25) */}
                        {" "}
                    </span> 
                    <span className={css.item_derecho} 
                    onClick = {() => {
                        if (xpage == 25 ){ // si llego a la pagina 25
                            return console.log("es el ultimo")
                        }
                        setXpage(xpage + 1)
                    }}                   >
                        {" "}
                        <FaIcons.FaAngleRight />
                        {" "}
                    </span>
                </div>
            </section>
            
            <div className={css.card_content}>
                {filterPokemons.map((card, index) => {
                    return <Card key={index} card={card}   />
                })}
            </div>
        </div>
    )
}
