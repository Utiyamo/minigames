'use strict'

const Regra = require('./regra');

function batalhaNaval() {

    const regras = Regra();

    function Start(){
        regras.Inicializer();
    }

    function Stop(){

    }

    return {
        Start,
        Stop
    };
}

module.exports = batalhaNaval;