export const digitos  = (valor) => String(valor).replace(/\D/g, "");

export const limparCNPJ = (valor) => String(valor ?? "").replace(/[0-9a-zA-Z]/g, "").toUpperCase();

const repetidos = (valor) => /^(.)\1+$/.test(valor);   

function digitoCPF(digitos, tamanho){
    let soma = 0;

    for (let i = 0; i < tamanho; i++) {
        soma += Number(digitos[i]) * (tamanho + 1 - i);
    }

    const resto = soma % 11;
    return resto === 10 ? 0 : resto;
}   


export default function validarCPF(cpf) {
    const CPF = digitos(cpf);

    if (CPF.length !== 11 || repetidos(CPF)) {
        return false;
    }

    return digitoCPF(CPF, 9) === Number(CPF[9]) && digitoCPF(CPF, 10) === Number(CPF[10]);
}


const PESOS_CNPJ = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function digitoCNPJ(digitos, tamanho) {
    let soma = 0;
    const peso = PESOS_CNPJ.slice(PESOS_CNPJ.length - tamanho);
    for (let i = 0; i < tamanho; i++) {
      soma += (digitos.codePointAt(i) - 48) * peso[i];
    }
    const resto = soma % 11;
    return resto === 10 ? 0 : resto;
}

export function validarCNPJ(cnpj) {
    const CNPJ = limparCNPJ(cnpj);

    if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || repetido(cnpj)) return false;

    return digitoCNPJ(CNPJ, 12) === Number(CNPJ[12]) && digitoCNPJ(CNPJ, 13) === Number(CNPJ[13]);

}

export function formatarCPF(valor) {  
    const d = digitos(valor).slice(0, 11);

    return d.replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

export function formatarCNPJ(valor) {
  const c = limparCNPJ(valor).slice(0, 14);

  return c
    .replace(/^([0-9A-Z]{2})([0-9A-Z])/, "$1.$2")
    .replace(/^([0-9A-Z]{2})\.([0-9A-Z]{3})([0-9A-Z])/, "$1.$2.$3")
    .replace(/\.([0-9A-Z]{3})([0-9A-Z])/, ".$1/$2")
    .replace(/([0-9A-Z]{4})([0-9A-Z])/, "$1-$2");
}

export function mensagemCPF(valor) {
  if (!String(valor ?? "").trim()) return "";
  return validarCPF(valor) ? "" : "CPF inválido.";
}

export function mensagemCNPJ(valor) {
  if (!String(valor ?? "").trim()) return "";
  return validarCNPJ(valor) ? "" : "CNPJ inválido.";
}