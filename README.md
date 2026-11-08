# Site da Zunkuft Digital Intelligence

Site estático (HTML, CSS e JS puros). Não precisa de build.
No ar em: https://galdinoheitor15-star.github.io/zunkuft-site/

## Páginas
- `index.html`: página principal. Os botões "Pedir orçamento" abrem as 8 perguntas por cima da página.
- `pacotes.html`: pacotes com preço fechado (até R$ 3 mil).

## Como o lead chega ao WhatsApp
1. O visitante responde 8 perguntas: nome e WhatsApp, cargo, empresa e setor, tamanho da equipe, do que precisa, o que mais toma tempo, quando quer começar e investimento.
2. No fim, o site abre o WhatsApp da Zunkuft com o resumo das respostas já escrito. Ele só toca em enviar.
3. O agente de IA (`Documents\zunkuft-agente`) lê o resumo, não repete perguntas, tira dúvidas e leva ao pedido de orçamento.

A mensagem sempre contém a palavra "Zunkuft", que é o que faz o agente responder a conversa.

## Configuração
Edite só `assets/config.js`:
- `whatsapp`: número que recebe os leads (DDI + DDD + número, só dígitos).
- `instagram`: link do perfil.
- `webhook`: opcional. URL que recebe uma cópia dos leads em JSON (Make, Zapier, Google Apps Script).
- `vagasFundadores`: vagas restantes do Programa Clientes Fundadores.
- `pagamentos`: links de pagamento dos pacotes. Vazio = o botão abre o WhatsApp com o nome do pacote.

Os preços dos pacotes (`pacotes.html`) são exemplos. Troque pelos valores reais.

Os parâmetros `utm_*` do link do anúncio são guardados e enviados ao webhook, para saber qual criativo trouxe cada lead.

## Publicar
O GitHub Pages publica a branch `main` sozinho. Depois de mudar algo, faça commit e push; o site atualiza em 1 ou 2 minutos.
