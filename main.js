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
        result = `Infelizmente, ${nome}, você não passou na Primeira Chamada. Sua classificação final é ${classificacaoFinal} no país ${paisEscolhido}, vá para aba da Segunda Chamada e verifique novamente!`;
      }
    } else {
      result = 'Número de inscrição não encontrado na lista de classificação final do país escolhido, Verifique se o número de inscrição está correto ou vá para aba da Segunda Chamada e verifique novamente!';
    }
  } else {
    result = 'Número de inscrição não encontrado na lista de classificação geral, Verifique se o número de inscrição está correto ouvá para aba da Segunda Chamada e verifique novamente!';
  }
  resultElem.innerText = result;
}

//construindo a função da segunda chamada
async function verificarSegundaChamada() {
  const inscricao = document.getElementById("inscricao").value;
  const dfSegundaChamada = await readExcelFile('Segunda_Chamada.xlsx');
  //substitui ai sla
  const resultElem = document.getElementById("result");
  let result = '';

  const inscricaoInt = parseInt(inscricao);
  const geralRow = dfSegundaChamada.find(row => row['INSCRIÇÃO'] == inscricaoInt);
  if (geralRow) {
      const nome = geralRow['NOME'];
      const paisEscolhido = geralRow['PAÍS'];
      const classificacaoFinal = geralRow['CLASSIFICAÇÃO'];
      let limite;

      if (paisEscolhido == 'INTERCÂMBIO INTERNACIONAL NOS ESTADOS UNIDOS DA AMÉRICA - INGLÊS') {
          limite = 4;
      } else if (paisEscolhido == 'INTERCÂMBIO INTERNACIONAL NO CANADÁ - INGLÊS') {
          limite = 11;
      } else if (paisEscolhido == 'INTERCÂMBIO INTERNACIONAL NO CHILE - ESPANHOL') {
          limite = 6;
      } else {
          result = 'País inválido.';
          resultElem.innerText = result;
          return;
      }

      if (classificacaoFinal < limite) {
          result = `Parabéns, ${nome}! Você passou para ${paisEscolhido}. Sua classificação final é ${classificacaoFinal}.`;
      } else {
          result = `Infelizmente, ${nome}, você não passou. Sua classificação final é ${classificacaoFinal} no país ${paisEscolhido}, aguarde o Remanejamento.`;
      }
  } else {
      result = 'Número de inscrição não encontrado na lista de Segunda Chamada. Verifique se o número de inscrição está correto ou vá para aba da Primeira Chamada.';
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

function ajustarOndas() {
  const larguraTela = window.innerWidth;
  let novaAltura;

  if (larguraTela < 768) {
      novaAltura = window.innerHeight * 0.25; // 25% da altura da tela
  } else {
      novaAltura = 100; // Altura fixa para desktop
  }

  document.getElementById("svgOndas").setAttribute('viewBox', `0 0 1440 ${novaAltura}`);

  // Ajuste das ondas de acordo com a nova altura do viewBox
  if (larguraTela < 768) {
      const alturaBase = novaAltura; // Base para as ondas

      // Ajustando as alturas das ondas
      document.getElementById("ondaVermelha").setAttribute("d", `M0,${alturaBase} C360,${alturaBase - 20} 1080,${alturaBase + 40} 1440,${alturaBase} L1440,${alturaBase} L0,${alturaBase} Z`);
      document.getElementById("ondaAmarela").setAttribute("d", `M0,${alturaBase} C360,${alturaBase - 10} 1080,${alturaBase + 20} 1440,${alturaBase} L1440,${alturaBase} L0,${alturaBase} Z`);
      document.getElementById("ondaVerde").setAttribute("d", `M0,${alturaBase + 10} C360,${alturaBase} 1080,${alturaBase + 60} 1440,${alturaBase + 10} L1440,${alturaBase} L0,${alturaBase} Z`);
  } else {
      // Manter ondas padrão para desktop
      document.getElementById("ondaVermelha").setAttribute("d", `M0,60 C360,10 1080,70 1440,60 L1440,100 L0,100 Z`);
      document.getElementById("ondaAmarela").setAttribute("d", `M0,90 C360,40 1080,80 1440,90 L1440,100 L0,100 Z`);
      document.getElementById("ondaVerde").setAttribute("d", `M0,110 C360,60 1080,90 1440,110 L1440,100 L0,100 Z`);
  }
}

window.onload = () => {
  ajustarOndas();
};
window.onresize = ajustarOndas;
