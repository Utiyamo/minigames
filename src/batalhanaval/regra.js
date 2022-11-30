'use strict'

const { getEventListeners } = require("prompt");

function batalhaNavalRegra() {
    let _tabuleiro = [];
    let _tabuleiroInimigo = [];
    
    function Inicializer(type){
        for(let i = 0; i < 10; i++){
            _tabuleiro.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            _tabuleiroInimigo.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        }

        switch(type){
            //Automatico
            case 0:
                _tabuleiro = inputTabuleiroAutomatic(_tabuleiro);
                _tabuleiroInimigo = inputTabuleiroAutomatic(_tabuleiroInimigo);
                break;
        }

        console.log('Seu Tabuleiro:');
        printTabuleiro(_tabuleiro);
    }

    function printTabuleiro(tabuleiro){
        console.log('TABULEIRO ');
        console.log('X | A | B | C | D | E | F | G | H | I | J |');
        let indexRow = 1;
        for(let row of tabuleiro){
            let line;
            if(indexRow < 10)
                line = `${indexRow} |`;
            else
                line = `${indexRow}|`;
            
            for(let column of row){
                line += ` ${column} |`;
            }
            console.log(line);
            indexRow++;
        }
    }

    function inputTabuleiroAutomatic(tab){
        let tabuleiro = tab;
        let finish = false;
        let boat = 1;
        let timesBoat = 0;
        while(!finish){
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);

            let space = tabuleiro[y][x];

            let validated;
            if(space === 0){
                switch(boat){
                    case 1:
                        validated = distributeShips(tabuleiro, x, y, 1);
                        if(validated.success){
                            tabuleiro = validated.tabuleiro;
                            if(timesBoat < 3)
                                timesBoat++;
                            else{
                                timesBoat = 0;
                                boat++;
                            }
                        }
                        break;

                    case 2:
                        validated = distributeShips(tabuleiro, x, y, 2);
                        if(validated.success){
                            tabuleiro = validated.tabuleiro;
                            if(timesBoat < 3)
                                timesBoat++;
                            else{
                                timesBoat = 0;
                                boat++;
                            }
                        }
                        break;

                    case 3:
                        validated = distributeShips(tabuleiro, x, y, 3);
                        if(validated.success){
                            tabuleiro = validated.tabuleiro;
                            if(timesBoat < 2)
                                timesBoat++;
                            else {
                                timesBoat = 0;
                                boat++;
                            }
                        }
                        break;

                    case 4:
                        validated = distributeShips(tabuleiro, x, y, 4);
                        if(validated.success){
                            tabuleiro = validated.tabuleiro;
                            if(timesBoat < 2)
                                timesBoat++;
                            else{
                                timesBoat = 0;
                                boat++;
                            }
                        }
                        break;

                    case 5:
                        validated = distributeShips(tabuleiro, x, y, 5);
                        if(validated.success){
                            tabuleiro = validated.tabuleiro;
                            finish = true;
                        }
                        break;
                    }
            }
        }

        return tabuleiro;
    }

    function distributeShips(tab, x, y, boatSize){
        let tabuleiro = tab;
        const space = tabuleiro[y][x];
        if(space === 0){
            if(boatSize === 1){
                tabuleiro[y][x] = boat;
                return {
                    boatSize: boatSize,
                    success: true,
                    tabuleiro: tabuleiro
                };
            }
            else{
                const vhs = verifyHasSpace(boatSize, x, y);
                if(vhs.length === 0){
                    const direction = Math.floor(Math.random() * 4);
                    tabuleiro = inputBoat(tabuleiro, boat, x, y, direction);
                    return {
                        boatSize: boatSize,
                        success: true,
                        tabuleiro: tabuleiro
                    }
                }
                else{
                    const outUp = vhs.find(x => x === "OUT UP");
                    const outLeft = vhs.find(x => x === "OUT LEFT");
                    const outDown = vhs.find(x => x === "OUT DOWN");
                    const outRight = vhs.find(x => x === "OUT RIGHT");

                    if(outUp === undefined)
                        inputBoat(boat, x, y, 0);
                    else if(outRight === undefined)
                        inputBoat(boat, x, y, 1);
                    else if(outDown === undefined)
                        inputBoat(boat, x, y, 2);
                    else if(outLeft === undefined)
                        inputBoat(boat, x, y, 3);
                    else 
                        return {
                            boatSize: boatSize,
                            success: false,
                            error: "Sem espaco",
                            tabuleiro: null
                        }
                }
            }
        }
        return {
            boatSize: boatSize,
            success: false,
            error: "Sem espaco",
            tabuleiro: null
        }
    }

    function inputBoat(tab, boatSize, x, y, direction){
        let tabuleiro = tab;
        for(let i = 0; i < boatSize; i++){
            switch(direction){
                //UP
                case 0:
                    tabuleiro[y+i][x] = boatSize;
                    break;
                
                //RIGHT
                case 1:
                    tabuleiro[y][x+i] = boatSize;
                    break;

                //DOWN
                case 2: 
                    tabuleiro[y+i][x] = boatSize;
                    break;
                
                //LEFT
                case 3:
                    tabuleiro[y][x-i] = boatSize;
                    break;
            }
        }

        return tabuleiro;
    }

    function verifyHasSpace(tab, boatSize, x, y){
        let tabuleiro = tab;
        let msgRetorno = [];
        for(let i = 1; i < boatSize; i++){
            //Verifica se esta dentro as dimencoes
            if((x - boatSize < 0 && x + boatSize > 9) && (y - boatSize < 0 && x + boatSize > 9))
                msgRetorno.push("OUT ALL");
            else{
                //Verifica se possivel para cima
                if((tabuleiro[y-i][x] !== 0) && !msgRetorno.find("OUT UP"))
                    msgRetorno.push("OUT UP");
                
                //Verifica se possivel esquerda
                else if((tabuleiro[y][x-i] !== 0) && !msgRetorno.find("OUT LEFT"))
                    msgRetorno.push("OUT LEFT");

                //Verifica se possivel baixo
                else if((tabuleiro[y+i][x] !== 0) && !msgRetorno.find("OUT DOWN"))
                    msgRetorno.push("OUT DOWN");

                else if((tabuleiro[y][x+i] !== 0) && !msgRetorno.find("OUT RIGHT"))
                    msgRetorno.push("OUT RIGHT");
            }
        }

        return msgRetorno;
    }

    return {
        Inicializer
    }
}

module.exports = batalhaNavalRegra;