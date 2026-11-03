# Tá tudo bem
Jogo educativo de corrida infinita sobre saúde mental (pesquisa escolar *Tá tudo bem*, Colégio Estadual Marechal Floriano Peixoto). Site estático: HTML + CSS + JavaScript (Canvas). Sem backend.

## Como rodar
Abra `index.html` no navegador (ou use um servidor local, ex.: `python -m http.server`).
Publicação: envie ao GitHub e faça upload da pasta no Neocities (ou use o deploy por GitHub Actions/Neocities CLI).

## Mecânica
Afirmação aparece → o jornal lança uma palavra → no momento em que ela chega ao personagem:
pulando = respondeu **FALSA**; no chão = respondeu **VERDADEIRA**. +10 acerto, −5 erro (mín. 0), 3 vidas.
Vitória: 10 acertos (`WIN_TARGET` em `js/game.js`). Recorde salvo em `localStorage`.

## Sprites a adicionar (PNG com transparência; tira horizontal, quadros lado a lado)
| Arquivo | Quadros |
|---|---|
| assets/sprites/player/idle.png, jump.png, fall.png, hurt.png, dead.png | 1 |
| assets/sprites/player/run.png | 4 (ajuste em `js/assets.js`) |
| assets/sprites/enemy/idle.png | 1 |
| assets/sprites/enemy/attack.png | 2 |
| assets/sprites/scenes/classroom.png | 1 (repetível na horizontal, proporção 2:1 recomendada) |
| assets/sprites/scenes/library.png | 1 (repetível na horizontal) |
| assets/sprites/effects/gameover.png | 1 (reservado; ainda não usado na tela) |

Enquanto faltarem arquivos, aparecem caixas tracejadas marcadas **PLACEHOLDER**. Nomes, quadros e FPS ficam em `ASSET_MANIFEST` (`js/assets.js`).

## Perguntas
Edite `js/questions.js`. Os registros atuais são **exemplos provisórios**; troque pelos definitivos com fonte confiável.
