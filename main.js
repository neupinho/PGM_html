async function verificarClassificacao() {
  const inscricao = document.getElementById("inscricao").value;

  const dfGeral = await readExcelFile('per_geral_1.xlsx');
  const dfCanada = await readExcelFile('classificacao_final_Canadá.xlsx');
  const dfEUA = await readExcelFile('classificacao_final_EUA.xlsx');
  const dfChile = await readExcelFile('classificacao_final_Chile.xlsx');

  const resultElem = document.getElementById("result");
  let result = '';

  const inscricaoInt = parseInt(inscricao);
  const geralRow = dfGeral.find(row => row['INSCRIÇÃO'] == inscricaoInt);
  if (geralRow) {
    const nome = geralRow['NOME'];
    const paisEscolhido = geralRow['PAÍS'];
    let dfPais, limite;

    if (paisEscolhido == 'INTERCÂMBIO INTERNACIONAL NOS ESTADOS UNIDOS DA AMÉRICA - INGLÊS') {
      dfPais = dfEUA;
      limite = 301;
    } else if (paisEscolhido == 'INTERCÂMBIO INTERNACIONAL NO CANADÁ - INGLÊS') {
      dfPais = dfCanada;
      limite = 401;
    } else if (paisEscolhido == 'INTERCÂMBIO INTERNACIONAL NO CHILE - ESPANHOL') {
      dfPais = dfChile;
      limite = 201;
    } else {
      result = 'País inválido.';
      resultElem.innerText = result;
      return;
    }

    const paisRow = dfPais.find(row => row['INSCRIÇÃO'] == inscricaoInt);
    if (paisRow) {
      const classificacaoFinal = paisRow['CLASSIFICAÇÃO'];
      if (classificacaoFinal < limite) {
        result = `Parabéns, ${nome}! Você passou para ${paisEscolhido}. Sua classificação final é ${classificacaoFinal}.`;
      } else {
        result = `Infelizmente, ${nome}, você não passou. Sua classificação final é ${classificacaoFinal} no país ${paisEscolhido}, aguarde a Segunda Chamada com o Remanejamento.`;
      }
    } else {
      result = 'Número de inscrição não encontrado na lista de classificação final do país escolhido.';
    }
  } else {
    result = 'Número de inscrição não encontrado na lista de classificação geral.';
  }
  resultElem.innerText = result;
}

function readExcelFile(filename) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', filename, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      const data = new Uint8Array(xhr.response);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet);
      resolve(json);
    };
    xhr.onerror = function () {
      reject(new Error('Erro ao carregar o arquivo ' + filename));
    };
    xhr.send();
  });
}
