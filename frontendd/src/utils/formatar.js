const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const brl = (valor) => moeda.format(valor);

export const dataBR = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("pt-BR");
