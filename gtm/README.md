# Personalização do checkout (Guru) via GTM

Arquivo: `checkout-guru.html`. É a tag inteira, pronta para colar no GTM.

## O que a tag faz

- **Botão "Comprar Agora" sempre ativo.** A Guru deixa o botão cinza e desabilitado até tudo estar preenchido. Com a tag, ele fica sempre na cor da marca e clicável:
  - **Formulário completo:** o clique segue normal para a Guru (a tag não interfere).
  - **Formulário incompleto:** a tag mostra "O campo é obrigatório" nos campos vazios, rola até o primeiro problema e põe o cursor nele. Se faltar só o aceite dos termos, destaca o checkbox. Se faltar só o cartão, rola até o cartão.
  - O aviso vermelho "*Existem campos inválidos ou não preenchidos" só aparece depois da primeira tentativa.
  - Cada clique bloqueado envia `checkout_comprar_bloqueado` ao dataLayer, com `motivo` e `campo`. Assim dá para ver no GA4 onde as pessoas travam.
- **Rodapé:** selos de confiança (compra segura, garantia, envio), WhatsApp/Instagram opcionais ao lado do e-mail, links (termos/privacidade), razão social/CNPJ e ©. O logo da Guru fica escondido; o selo PCI e o aviso do reCAPTCHA continuam.

Tudo é configurado no bloco `CONFIG`, no topo do script. Campo vazio (`""`) não aparece na página.

## Como instalar

1. Na Guru, confirme que o container GTM está ligado no checkout (Produto/Oferta → Pixels/Rastreamento → Google Tag Manager).
2. No GTM: **Tags → Nova → HTML personalizado**. Cole o conteúdo de `checkout-guru.html`.
3. **Acionador:** "Visualização de página – DOM pronto", com a condição **Page Hostname igual a `pay.meurestart.com`**. Para limitar a ofertas específicas, adicione também **Page Path contém `/pl/black-`**.
4. Teste no **Modo de visualização** do GTM. Depois, **Enviar → Publicar**.

## Observações

- Teste uma compra real (ou com cupom de 100%) depois de publicar.
- A tag depende de classes da página da Guru (`MuiButton-contained`, `footer`). Se a Guru mudar o layout, pode ser preciso ajustar os seletores. Nesse caso, o checkout continua funcionando normalmente, só sem a personalização.
