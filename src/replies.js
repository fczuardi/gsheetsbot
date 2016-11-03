const start =
    { welcome: username => `Olá ${username}`
    , signup: 'Gostaria de se inscrever no programa?'
    };
const token =
    { unauthorized: 'Você não está na lista de administradores.'
    };
const replies =
    { start
    , token
    };

module.exports = replies;
