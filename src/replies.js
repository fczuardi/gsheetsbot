const start =
    { welcome: username => `Olá ${username}`
    };
const token =
    { unauthorized: 'Você não está na lista de administradores.'
    };
const status =
    { signup: 'Gostaria de se inscrever no programa?'
    , approved: 'Parabéns sua inscrição foi aceita!'
    };
const replies =
    { status
    , start
    , token
    };

module.exports = replies;
