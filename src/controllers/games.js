

const API_KEY = "ff8d791912fc4da7945ec7396c0403fe";

const URL = `https://rawg.io/api/games?key=${API_KEY}`



export const findGames = async(res) => {
    try{   
        const response = await fetch(URL);
        const data = await response.json();
        res.json(data)
        }  
    catch(error){
        console.log(error)
        res.status(500).json({message:"Erro ao buscar jogos!"})
    } 
    }

export const findGameById = async(res, req) => {
    try{
        const { id } = req.params; 
        const response = await fetch(URL);
        const data = await response.json();
        res.json(data)
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Erro ao buscar jogo"})
    }
}




