import Library from "../models/library.js";

export async function addGame(req, res){
    try{
        const { id } = req.body;

        const userId = req.user.userId;

        if(!id){
            return res.status(400).json({
                message: "O ID do jogo é obrigatório.",
            });
        }

        const gameId = Number(id);

        let library = await Library.findOne({ userId });
        

        if(!library){
            library = await Library.create({
                userId,
                games: [
                    {
                        gameId,
                        status: "want_to_play",
                    },
                ],
            });

            return res.status(201).json(library);

        }

        const alreadyExists = library.games.some(
            (game) => game.gameId === gameId,
        )
        
        if (alreadyExists) {
            return res.status(409).json({
                message: "Esse jogo já está na sua biblioteca",
            });
        }

        library.games.push({
            gameId,
            status: "want_to_play",
        });

        await library.save();

        return res.status(201).json(library);
    }catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao adicionar jogo à biblioteca",
        });
    }
};

export async function getGame(req, res) {
    
    try{
        const userId = req.user.userId;

        const library = await Library.findOne({ userId });

        if(!library){
            return res.status(404).json({
                message: "Biblioteca não encontrada",
            });
        }

        return res.status(200).json(library);
    }catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Erro ao buscar biblioteca",
        });
    }

}

export async function updateGame(req, res) {
    try{
        const { gameId } = req.params;
        const { status } = req.body;
        
        const userId = req.user.userId;

        const validStatuses = [
            "want_to_play",
            "playing",
            "completed",
            "abandoned",
        ];

        if(!validStatuses.includes(status)){
            return res.status(400).json({
                message: "Status inválido",
            });
        }

        const library = await Library.findOne({ userId });

        if(!library){
            return res.status(404).json({
                message: "Biblioteca não encontrada",
            });
        }

        const game = library.games.find(
            (game) => game.gameId === Number(gameId),
        );

        if(!game){
            return res.status(404).json({
                message: "Jogo não encontrado na biblioteca",
            });
        }

        game.status = status;

        await library.save();

        return res.status(200).json({
            message: "Atualizado com sucesso",
            game,
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro ao atualizar",
        });
    }
};

export async function deleteGame(req, res){
    try{
        const { gameId } = req.params;
        const userId = req.user.userId;

        const library = await Library.findOne({ userId });

        if(!library){
            return res.status(400).json({
                message: "Biblioteca não encontrada",
            });
        }

        const gameIndex = library.games.findIndex(
            (game) => game.gameId === Number(gameId),
        );

        if(gameIndex === -1){
            return res.status(404).json({
                message: "Jogo não encontrado na biblioteca",
            });
        }

        library.games.splice(gameIndex, 1);

        await library.save();

        return res.status(200).json({
            message: "Jogo removido da biblioteca",
            library,
        });

    }catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Erro ao atualizar",
        });
    }
};
