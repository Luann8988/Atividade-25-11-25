const inputPais = document.getElementById("inputPais");
const btnPesquisar = document.getElementById("btnPesquisar");
const resultado = document.getElementById("resultado");
const listaHistorico = document.getElementById("listaHistorico");
const btnLimpar = document.getElementById("btnLimpar");

let historico = JSON.parse(localStorage.getItem("historicoPaises")) || [];

async function buscarPais(nome) {
  try {
    const resposta = await fetch(`https://restcountries.com/v3.1/name/${nome}`);
    if (!resposta.ok) throw new Error("País não encontrado");
    const dados = await resposta.json();
    mostrarDados(dados[0]);
    salvarHistorico(dados[0].name.common);
  } catch (erro) {
    resultado.innerHTML = `<h2>Erro: ${erro.message}</h2>`;
  }
}

function mostrarDados(pais) {
  const bandeira = pais.flags.svg || pais.flags.png;
  const nomeComum = pais.name.common;
  const nomeOficial = pais.name.official;
  const capital = pais.capital ? pais.capital[0] : "—";
  const regiao = pais.region;
  const subRegiao = pais.subregion || "—";
  const populacao = pais.population.toLocaleString("pt-BR");
  const moedaObj = pais.currencies ? Object.values(pais.currencies)[0] : null;
  const moedaNome = moedaObj ? moedaObj.name : "—";
  const simbolo = moedaObj ? moedaObj.symbol : "—";
  const idiomas = pais.languages ? Object.values(pais.languages).join(", ") : "—";

  resultado.innerHTML = `
    <h2>${nomeComum}</h2>
    <img src="${bandeira}" alt="Bandeira de ${nomeComum}">
    <p><strong>Oficial:</strong> ${nomeOficial}</p>
    <p><strong>Capital:</strong> ${capital}</p>
    <p><strong>Região:</strong> ${regiao}</p>
    <p><strong>Sub-região:</strong> ${subRegiao}</p>
    <p><strong>População:</strong> ${populacao}</p>
    <p><strong>Moeda:</strong> ${moedaNome} (${simbolo})</p>
    <p><strong>Idiomas:</strong> ${idiomas}</p>
  `;
}

function salvarHistorico(nome) {
  if (!historico.includes(nome)) {
    historico.push(nome);
    localStorage.setItem("historicoPaises", JSON.stringify(historico));
    renderizarHistorico();
  }
}

function renderizarHistorico() {
  listaHistorico.innerHTML = "";
  historico.forEach(pais => {
    const li = document.createElement("li");
    li.textContent = pais;
    li.onclick = () => buscarPais(pais);
    listaHistorico.appendChild(li);
  });
}

btnLimpar.onclick = () => {
  historico = [];
  localStorage.removeItem("historicoPaises");
  renderizarHistorico();
  resultado.innerHTML = "";
};

btnPesquisar.onclick = () => {
  const nome = inputPais.value.trim();
  if (nome) buscarPais(nome);
};

inputPais.addEventListener("keypress", e => {
  if (e.key === "Enter") btnPesquisar.click();
});

renderizarHistorico();
