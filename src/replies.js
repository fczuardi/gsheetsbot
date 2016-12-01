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
    };

const token =
    { unauthorized: 'Você não está na lista de administradores.'
    };

const status =
    { pending: 'Sua inscrição ainda está sendo analizada, aguarde uns dias e verifique novamente usando o commando /status'
    , approved: 'Oi! Boas notícias! Você foi aprovado no Programa de Embaixadores! 😍 Digite /start para acessar o menu principal.'
    , unapproved: reason => (reason
        ? `Oi! Infelizmente sua inscrição ao programa Embaixadores não foi aceita neste momento :( Motivo: ${reason}`
        : 'Oi! Infelizmente sua inscrição ao programa Embaixadores não foi aceita neste momento :(')
    };

const signup =
    { formStart: 'Para continuar preciso saber algumas coisas sobre você…'
    , formFinished: 'Formulário preenchido, quer enviar já ou revisar alguma resposta?'
    , retryFormFinished: 'Deseja tentar novamente?'
    , submitButton: 'Enviar'
    , reviewButton: 'Revisar'
    , reviewQuestionsFooter: 'Quer editar alguma resposta?'
    , submissionError: 'Ocorreu um erro no envio.'
    , emptyAnswersError: 'Perdi suas respostas, vamos tentar de novo.'
    , submissionSent: [ 'Ótimo! Obrigado por responder a estas perguntas! :)'
        , 'Vamos avaliar a sua inscrição. Se tudo estiver OK você será avisado aqui!'
        , 'Enquanto isso, que tal visitar a página do YouTube da [Mind Lab](https://www.youtube.com/user/MindLabBrasil) e do [MISSU](https://www.youtube.com/channel/UCXzLrA6KPj_Q1FSLkBO3ghw) para saber mais sobre nossas soluções???'
        , 'Você pode digitar /status para consultar o status de sua inscrição a qualquer momento também.' ]
    };

const school =
    { submissionSent: [ 'Sua indicação foi enviada com sucesso.'
        , 'Utilize o botão "Escolas Indicadas" para acompanhar as suas indicações de escola dessa missão.' ]
    , statusLine: s => `*${s.name}*: ${s.status === undefined ? 'indicada' : s.status}${s.notes ? `, ${s.notes}` : ''}`
    };

const docs =
    { defaultDescription: 'Escolha uma opção:'
    };

const broadcast =
    { reviewMessage: 'Esta é a mensagem:'
    , confirm: 'Deseja enviar a mensagem abaixo a *TODOS* os embaixadores aprovados?'
    , submit: 'Sim. Enviar!'
    , cancel: 'Não. Cancelar'
    , success: 'Mensagem enviada com sucesso'
    , cancelled: 'Mensagem cancelada'
    , sessionError: 'Perdi sua mensagem. Envie o comando novamente por favor.'
    };

const replies =
    { tos
    , status
    , start
    , signup
    , school
    , token
    , docs
    , broadcast
    };

module.exports = replies;
