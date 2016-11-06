/* eslint max-len: "off" */
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
const signup =
    { formFinished: 'Formulário preenchido, quer enviar já ou revisar alguma resposta?'
    , retryFormFinished: 'Deseja tentar novamente?'
    , submitButton: 'Enviar'
    , reviewButton: 'Revisar'
    , submissionError: 'Ocorreu um erro no envio.'
    , emptyAnswersError: 'Perdi suas respostas, vamos tentar de novo.'
    , submissionSent: 'Sua inscrição foi enviada! Entraremos em contato. Caso queira acompanhar o estado de sua aplicação, digite /status.'
    };
const replies =
    { status
    , start
    , signup
    , token
    };

module.exports = replies;
