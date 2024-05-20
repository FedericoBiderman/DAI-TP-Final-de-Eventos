import axios from "axios";
const APIKEY = "ca6534a2";

const OMDBSearchByPage = async (searchText, page = 1) => {
    let returnObject = {
        respuesta: false,
        cantidadTotal: 0,
        datos: {}
    };
    const requestString = `http://www.omdbapi.com/?apikey=${APIKEY}&s=${searchText}&page=${page}`;
    try{
        const apiResponse = await axios.get(requestString);
        returnObject.datos          = apiResponse.data.Search;
        returnObject.cantidadTotal  = apiResponse.data.totalResults;
        returnObject.respuesta      = apiResponse.data.Response;
    } catch(error){
        console.log(error);
        returnObject.respuesta = false;
        returnObject.respuesta = false;
    }
    return returnObject;
    };


const OMDBSearchComplete = async (searchText) => {
    let returnObject = {
        respuesta: false,
        cantidadTotal: 0,
        datos: {}
    };
    const requestString = `http://www.omdbapi.com/?apikey=${APIKEY}&s=${searchText}`;
    try{
        const apiResponse = await axios.get(requestString);
        returnObject.datos = apiResponse.data.Search;
        returnObject.cantidadTotal = apiResponse.data.totalResults;
        returnObject.respuesta = apiResponse.data.response;
    } catch(error){
        console.log(error);
        returnObject.respuesta = false;
    }
    return returnObject;
}

const OMDBGetByImdbID = async (imdbID) => {
    let returnObject = {
        respuesta: false,
        cantidadTotal: 0,
        datos: {}
    };
    const requestString = `http://www.omdbapi.com/?apikey=${APIKEY}&page=${imdbID}`;
    try{
        const apiResponse = await axios.get(requestString);
        returnObject.datos = apiResponse.data.Search;
        returnObject.cantidadTotal = apiResponse.data.totalResults;
        returnObject.respuesta = apiResponse.data.response;
    } catch(error){
        console.log(error);
        returnObject.respuesta = false;
    }
    return returnObject;
    };

export { OMDBSearchByPage, OMDBSearchComplete, OMDBGetByImdbID };