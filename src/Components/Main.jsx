import React from "react";
import Card from "./Card";
import Pokeinfo from "./Pokeinfo";
import axios from "axios";
import { useState, useEffect } from "react";

const Main = () => {
  const [pokeData, setPokeData] = useState([]);
  const [loading, setLoading] = useState(true);
  /*const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon/"); // To load 20 Pokemon*/
  const [url, setUrl] = useState("https://pokeapi.co/api/v2/pokemon?limit=150"); // Set the initial URL to load the first 150 Pokémon
  const [nextUrl, setNextUrl] = useState();
  const [prevUrl, setPrevUrl] = useState();
  const [pokeDex, setPokeDex] = useState();
  const [searchType, setSearchType] = useState(""); // State for search type

  const pokeFun = async () => {
    setLoading(true);
    const res = await axios.get(url);
    setNextUrl(res.data.next);
    setPrevUrl(res.data.previous);
    /*Solongo notition*/
    if (res.data.results) {
      getPokemon(res.data.results);
    } else if (res.data.pokemon) {
      const typeRes = res.data.pokemon.map((pokemon) => {
        return pokemon.pokemon;
      });
      getPokemon(typeRes);
    }
    setLoading(false);
  };

  const getPokemon = async (res) => {
    res.map(async (item) => {
      const result = await axios.get(item.url);
      setPokeData((state) => {
        state = [...state, result.data];
        state.sort((a, b) => (a.id > b.id ? 1 : -1));
        return state;
      });
    });
  };

  const searchByType = () => {
    // When the search button is clicked, update the URL to search by type
    if (searchType) {
      setUrl(`https://pokeapi.co/api/v2/type/${searchType.toLowerCase()}`);
      setPokeData([]); // Clear existing data
    }
  };

  useEffect(() => {
    pokeFun();
  }, [url]);

  return (
    <>
      <div className="h1">
        <h1> Pokémon Application </h1>
      </div>
      <div>
        <input
          className="search-iput"
          type="text"
          placeholder="Search for Pokémon type"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        />
      </div>
      <div>
        <button className="search-button" onClick={searchByType}>
          Search
        </button>
      </div>
      <div className="container">
        <div className="left-content">
          <Card
            pokemon={pokeData}
            loading={loading}
            infoPokemon={(poke) => setPokeDex(poke)}
          />

          <div className="btn-group">
            {prevUrl && (
              <button
                onClick={() => {
                  setPokeData([]);
                  setUrl(prevUrl);
                }}
              >
                Previous
              </button>
            )}

            {nextUrl && (
              <button
                onClick={() => {
                  setPokeData([]);
                  setUrl(nextUrl);
                }}
              >
                Next
              </button>
            )}
          </div>
        </div>
        <div className="right-content">
          <Pokeinfo data={pokeDex} />
        </div>
      </div>
    </>
  );
};

export default Main;
