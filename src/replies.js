/* eslint max-len: "off" */
const tos =
    { text: 'Por favor leia os termos do programa, é preciso que você aceite-os antes de começar a interagir com este bot.'
    , accept: 'Eu li e aceito os termos'
    , deny: 'Eu não aceito os termos'
    , deniedReply: 'Tudo bem, caso mude de idéia e queira aceitar os termos basta clicar no botão'
    };
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
const docs =
    { defaultDescription: 'Escolha uma opção:'
    };
const replies =
    { tos
    , status
    , start
    , signup
    , token
    , docs
    };

module.exports = replies;
