/**
 * Configuração da oferta: edite aqui preços, link de checkout e prazo.
 * Valores em reais (número). Ex.: 497 ou 297.9
 */
window.LP_CONFIG = {
  // Link do checkout desta página: OFERTA R$297, público geral (Protocolo Restart + 1 kit)
  checkoutUrl: "https://pay.meurestart.com/pay/blackfriday-protocolo-kit",

  // Outros links da Black (não usados nesta página, guardados para referência)
  // Upsell R$497, público geral, 1 clique (Protocolo + 2 kits): vai na página pós-compra
  upsellUrl: "https://pay.meurestart.com/pay/clube-restart-acelerador-2-kits-ritual-dia-noite/1click",
  // Oferta R$597, para alunas (Protocolo + 3 kits)
  alunasUrl: "https://pay.meurestart.com/pay/clube-restart-acelerador-3-kits-ritual-dia-noite",

  // Preços "de" (ancoragem)
  priceProtocol: 497,
  priceKit: 297,
  priceBonus: 197,

  // Preço final do combo à vista
  priceCash: 297,

  // Parcelamento exibido
  // CONFIRA no checkout: 24,75 = 297 / 12 sem juros
  installments: 12,
  installmentValue: 24.75,

  // Fim da oferta (horário de Brasília)
  deadline: "2026-11-30T23:59:59-03:00",

  // Dias de garantia
  guaranteeDays: 7,
};
