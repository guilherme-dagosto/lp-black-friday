# LP Black Friday: Protocolo Restart + Kit do Ritual Dia & Noite

Landing page estática (HTML + CSS + JS puro, sem build) para a venda do combo **Protocolo Restart + Kit do Ritual Dia & Noite** na Black Friday.

## Estrutura

```
index.html            # página
assets/css/style.css  # estilos
assets/js/config.js   # preços, checkout, prazo da oferta e garantia
assets/js/main.js     # aplica a config, cronômetro e CTA fixo no mobile
assets/img/           # imagens (combo.png, og-image.jpg)
```

## Como editar

1. **Oferta**: ajuste `assets/js/config.js` (link do checkout, preços, parcelamento, data final e dias de garantia). O percentual de desconto do selo é calculado automaticamente.
2. **Imagem do combo**: salve o mockup em `assets/img/combo.png`. Sem ele, a página mostra um placeholder.
3. **Textos marcados com `[colchetes]`**: bônus, depoimentos, FAQ (prazo de entrega e tempo de acesso) e rodapé.

## Rodar localmente

```bash
python3 -m http.server 8000
```

Depois, abra http://localhost:8000.

## Publicação

Por ser estática, pode ser publicada direto na Vercel, na Netlify, no GitHub Pages ou em qualquer hospedagem.
