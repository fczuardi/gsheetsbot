/* eslint max-len: "off" */
const tos =
    { text: url => `Mas antes de seguirmos em frente eu preciso que você leia e aceite os [termos de uso](${url}) do programa.`
    , accept: 'Eu li e aceito os termos'
    , deny: 'Eu não aceito os termos'
    , deniedReply: 'Tudo bem, caso mude de idéia e queira aceitar os termos basta clicar no botão'
    , accepted: 'Ótimo! Então podemos seguir em frente! :)'
    };
const start =
    { welcome: username =>
        [ `Olá ${username}! Seja bem-vinda ao *eduEmbaixadores*, programa de Embaixadores Mind Lab!`
        , 'Convidamos pessoas como você, apaixonadas por transformar a educação para ajudar a difundir nossas soluções inovadoras!'
        , 'Participando das Missões de Embaixadores, você divulgará as propostas da Mind Lab e oferecerá oportunidades especiais para escolas, ajudará a transformar a educação no Brasil e ainda poderá ser premiado por isso!'
        ]
    , 
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
