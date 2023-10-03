const validarEntradaDeDados = (lancamento) => {
  const regex = /^\d+$/ // Expressão regular para verificar se o valor digitado contém apenas números 'inteiros' e positivos (CPF)
  const regexValor = /^-?\d*\.?\d+$/ // Expressão regular para verificar se o valor contém apenas números 'decimais' + ou - (REAIS)

     
  let cpfNumero = regex.test(lancamento.cpf) // 'test()' é usada para testar se uma string corresponde a um padrão especificado
  let cpfValido = isValidCPF(lancamento)
  let valorValido = regexValor.test(lancamento.valor)
  let valorMaximo = lancamento.valor <= 15000
  let valorMinimo = lancamento.valor >= -2000

  if(cpfNumero != true){
    return "CPF Não Pode Conter Letras"
  }else if(cpfValido != true){
    return "CPF Inválido - Digitos Verificadores Inválidos"
  }else if(valorValido != true){
    return "Valor Não Pode Conter Letras ou ser Igual a 0"
  }else if(valorMaximo != true){
    return "Valor Não Pode ser Superior a R$ 15.000,00"
  }else if(valorMinimo != true){
    return "Valor Não Pode ser Inferior a R$ -2.000,00"
  }else{
    return null
  }  
}

const recuperarSaldosPorConta = (lancamentos) => {
  if(lancamentos.length === 0){ // verifica se o array lancamentos está vazio
    return []
  }
    
  const saldosPorCPF = {} // Este objeto será usado para armazenar o saldo total para cada CPF único

  for(const lancamento of lancamentos){ // Itera por cada lancamento no array lancamentos usando um loop for...of
    const { cpf, valor } = lancamento // Para cada transação, ele extrai o cpf e o valor do lancamento.
    if(!saldosPorCPF[cpf]){ // Verifica se o cpf já é uma chave no objeto.
      saldosPorCPF[cpf] = 0 // Se não for, ele inicializa essa chave com um saldo de 0.
    }
    saldosPorCPF[cpf] += valor // adiciona o valor do lancamento ao saldo existente para o cpf correspondente.
  }
  const saldosOrdenados = Object.entries(saldosPorCPF).map(([cpf, valor]) => ({ cpf, valor })) // converte o objeto saldosPorCPF em um array de objetos usando
  return saldosOrdenados // contém os saldos totais para cada CPF único
}

const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => { // recebe dois parâmetros: cpf (o CPF para filtrar as transações) e lancamentos (um array de transações).
  const lancamentosCPF = lancamentos.filter(l => l.cpf === cpf) // Filtra o array lancamentos para criar um novo array chamado lancamentosCPF, contendo apenas as transações que correspondem ao cpf fornecido.
  if(lancamentos.length === 0){ // Verifica se o comprimento do array lancamentos é zero. Se for, ela retorna um array vazio []. Essa condição sugere que se não houver transações, a função retorna um array vazio.
    return []
  }else if(lancamentosCPF.length === 1){ // verifica se há apenas uma transação que corresponde ao cpf fornecido. Se houver apenas uma, ela retorna um array contendo essa única transação duas vezes.
    return [lancamentosCPF[0], lancamentosCPF[0]]
  }else{
    const ordenarLancamentosCPF = lancamentosCPF.sort((a, b) => a.valor - b.valor) // Se houver várias transações para o cpf fornecido, ela ordena o array lancamentosCPF em ordem crescente com base na propriedade valor de cada transação. 
    return [ordenarLancamentosCPF[0], ordenarLancamentosCPF[ordenarLancamentosCPF.length - 1]] // Em seguida, ela retorna um array contendo o primeiro elemento (a transação mais baixa) e o último elemento (a transação mais alta) do array lancamentosCPF ordenado.
  }
}

const recuperarMaioresSaldos = (lancamentos) => {
  if(lancamentos.length === 0){ // verifica se o array lancamentos está vazio. Se estiver  a função retorna um array vazio [].
    return []
  }

  const saldosPorCPF = {} // inicializa um objeto vazio chamado saldosPorCPF para armazenar os saldos de cada CPF
  lancamentos.forEach(l => { // iteração
    if(!saldosPorCPF[l.cpf]){ // se não tiver nenhum lançamento no cpf
      saldosPorCPF[l.cpf] = 0 // incializa com um saldo de 0
    }
    saldosPorCPF[l.cpf] += l.valor // depois adiciona os valores que forem lançados
  })

  const saldos = Object.entries(saldosPorCPF).sort((a, b) => b[1] - a[1]) // Este array contém subarrays com dois elementos: CPF e saldo. Ela ordena o array saldos em ordem decrescente com base nos saldos usando o método sort e uma função comparadora (a, b) => b[1] - a[1].
  const maioresSaldos = [] // Ela inicializa um array vazio chamado maioresSaldos para armazenar os 3 maiores saldos.
  let i = 0
  while(maioresSaldos.length < 3 && i < saldos.length){ // entra em um loop while que continua a ser executado enquanto maioresSaldos contém menos de 3 entradas e i é menor que o comprimento do array saldos.
    maioresSaldos.push({
      cpf: saldos[i][0], // Em cada iteração do loop, ela adiciona um objeto ao array maioresSaldos, contendo o CPF e o saldo do array saldos no índice i.
      valor: saldos[i][1]
    })
    i++ // incrementa a variável i para passar para a próxima entrada no array saldos ordenado.
  }
  return maioresSaldos // a função retorna o array maioresSaldos, que contém os 3 maiores saldos juntamente com seus respectivos CPFs
}

const recuperarMaioresMedias = (lancamentos) => {
  if(lancamentos.length === 0){ //  verifica se o array lancamentos está vazio. Se estiver, a função retorna uma matriz vazia []
    return []
  }

  const saldosPorCPF = {} // armazenar a soma acumulada dos valores
  const contadoresPorCPF = {} // contagem de entradas para cada "cpf"

  lancamentos.forEach(l => { // percorre cada entrada na matriz lancamentos usando um loop forEach.  
    if(!saldosPorCPF[l.cpf]){ // Ele verifica se saldosPorCPF e contadoresPorCPF já têm uma entrada para o "cpf" na entrada atual.
      saldosPorCPF[l.cpf] = 0 // Se não tiverem, ele os inicializa com um valor inicial de 0.
      contadoresPorCPF[l.cpf] = 0
    }
    saldosPorCPF[l.cpf] += l.valor // ele atualiza a entrada "cpf" correspondente em saldosPorCPF, adicionando o campo valor da entrada e incrementa a contagem em contadoresPorCPF para aquele "cpf".
    contadoresPorCPF[l.cpf]++
  })

  const medias = Object.entries(saldosPorCPF)
  .map(([cpf, saldo]) => ({ cpf, valor: saldo / contadoresPorCPF[cpf] })) // Esta matriz contém objetos com os campos "cpf" e "valor", onde "valor" representa o valor médio para cada "cpf".
  .sort((a, b) => b.valor - a.valor) // A matriz medias é então ordenada em ordem decrescente com base no campo "valor" usando o método sort.

  const maioresMedias = [] // o código constrói uma matriz chamada maioresMedias para armazenar as 3 entradas com os valores médios mais altos da matriz medias ordenada. Ele percorre a matriz ordenada e adiciona as primeiras 3 entradas a maioresMedias.
  let i = 0
  while(maioresMedias.length < 3 && i < medias.length){ // 
    maioresMedias.push(medias[i])
    i++
  }
  return maioresMedias
}

function isValidCPF(lancamento) {
  if(typeof lancamento.cpf !== 'string'){ // verifica se o cpf é do tipo string. Se não for, a função retorna false
    return false
  }
  cpf = lancamento.cpf.replace(/[^\d]+/g, '') // Remove os caracteres não numéricos da string
  if(cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)){ // Verifica se a string possui exatamente 11 dígitos, se não houver ou todos caracteres forem iguais irá retornar false
    return false
  }   
  cpf = lancamento.cpf.split('').map(el => +el) // Converte a string cpf em uma matriz de números convertidos em inteiros.
  const rest = (count) => (cpf.slice(0, count-12).reduce( (soma, el, index) => (soma + el * (count-index)), 0 )*10) % 11 % 10 // que calcula o dígito de verificação (o décimo e o décimo primeiro dígitos) do CPF
  return rest(10) === cpf[9] && rest(11) === cpf[10] // Verifica se os dígitos de verificação calculados correspondem aos décimo e décimo primeiro dígitos na matriz original cpf. Se corresponderem, o CPF é considerado válido e a função retorna true. Caso contrário, ela retorna false.
}