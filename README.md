# Site da Zunkuft Digital Intelligence

Site estático (HTML, CSS e JS puros). Não precisa de build.

## Páginas
- `index.html`: página principal. A manchete repete o anúncio do Instagram e a aplicação de 8 perguntas abre por cima da página.
- `pacotes.html`: pacotes com preço fechado (trilha Pronta, até R$ 3 mil).

## Antes de publicar
Edite só `assets/config.js`:
- `whatsapp`: número comercial (DDI + DDD + número, só dígitos).
- `instagram`: link do perfil.
- `calHighTicket` e `calExpressa`: links do Cal.com ou Calendly (45 min e 20 min).
- `webhook`: URL que recebe os leads (Make, Zapier, Kommo ou Google Apps Script).
- `closer`: nome de quem faz as calls.
- `vagasFundadores`: vagas restantes do Programa Clientes Fundadores.
- `pagamentos`: links de pagamento dos pacotes.

Os preços dos pacotes (`pacotes.html`) são exemplos. Troque pelos valores reais.

## Como a aplicação direciona o lead
| Resposta | Trilha | O que aparece no fim |
|---|---|---|
| "Só estou pesquisando" | Pesquisa | Link para as demos no Instagram |
| Até R$ 3 mil | Pronta | Link para os pacotes |
| R$ 3 a 10 mil | Expressa | Agenda de 20 min |
| R$ 10 mil ou mais | High ticket | Agenda de 45 min |

Depois da 1ª pergunta (nome e WhatsApp), o site já envia um lead `parcial` para o webhook. Assim, quem abandona no meio ainda pode ser chamado. No fim, envia o lead `completa` com a trilha.

Os parâmetros `utm_*` do link do anúncio são guardados e enviados junto, para saber qual criativo trouxe cada lead.

## Publicar no GitHub Pages
1. Crie um repositório e envie esta pasta.
2. Em Settings → Pages, escolha a branch `main` e a pasta raiz.
