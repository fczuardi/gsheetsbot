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
    { pending: 'Sua inscrição ainda está sendo analizada, aguarde uns dias e verifique novamente usando o commando /status'
    , approved: 'Parabéns sua inscrição foi aceita! Digite /start para acessar o menu principal'
    , unapproved: reason => (reason
        ? `Sua inscrição não foi aceita, motivo: ${reason}`
        : 'Sua inscrição não foi aceita.')
    };
const signup =
    { formFinished: 'Formulário preenchido, quer enviar já ou revisar alguma resposta?'
    , retryFormFinished: 'Deseja tentar novamente?'
    , submitButton: 'Enviar'
    , reviewButton: 'Revisar'
    , reviewQuestionsFooter: 'Quer editar alguma resposta?'
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
