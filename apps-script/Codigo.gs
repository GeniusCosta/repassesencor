/**
 * Repasses ENCOR — ponte entre o aplicativo e a Planilha Google.
 *
 * Instalação resumida (o passo a passo completo está no LEIA-ME.md):
 *   1. Crie uma Planilha Google no Drive e abra Extensões > Apps Script.
 *   2. Cole este arquivo, troque o CODIGO_DE_ACESSO abaixo.
 *   3. Implantar > Nova implantação > App da Web:
 *        Executar como: Eu
 *        Quem pode acessar: Qualquer pessoa
 *   4. Copie o endereço que termina em /exec e cole no aplicativo.
 */

// Troque por uma frase secreta sua. É o que impede estranhos de gravar na planilha.
var CODIGO_DE_ACESSO = "troque-esta-frase";

var ABA = "Lancamentos";
var CABECALHO = ["ID", "Data", "Favorecido", "Natureza", "Forma", "Valor", "Descricao", "Registrado em"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // evita que dois lançamentos simultâneos se sobreponham
    lock.waitLock(20000);
  } catch (err) {
    return responder({ ok: false, erro: "ocupado" });
  }

  try {
    var pedido = JSON.parse(e.postData.contents);

    if (String(pedido.token || "") !== CODIGO_DE_ACESSO) {
      return responder({ ok: false, erro: "token invalido" });
    }

    switch (pedido.acao) {
      case "listar":  return responder({ ok: true, lancamentos: listar() });
      case "incluir": return responder(incluir(pedido.dados));
      case "excluir": return responder(excluir(pedido.dados));
      default:        return responder({ ok: false, erro: "acao desconhecida" });
    }
  } catch (err) {
    return responder({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Permite abrir a URL no navegador só para conferir se a implantação está de pé. */
function doGet() {
  return responder({ ok: true, servico: "Repasses ENCOR", versao: 1 });
}

function responder(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function aba() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  var folha = planilha.getSheetByName(ABA);
  if (!folha) {
    folha = planilha.insertSheet(ABA);
    folha.appendRow(CABECALHO);
    folha.getRange(1, 1, 1, CABECALHO.length).setFontWeight("bold");
    folha.setFrozenRows(1);
  }
  return folha;
}

function listar() {
  var folha = aba();
  var ultima = folha.getLastRow();
  if (ultima < 2) return [];

  var linhas = folha.getRange(2, 1, ultima - 1, CABECALHO.length).getValues();
  var saida = [];

  for (var i = 0; i < linhas.length; i++) {
    var l = linhas[i];
    if (!l[0]) continue;
    saida.push({
      id: String(l[0]),
      data: comoData(l[1]),
      quem: String(l[2]),
      natureza: String(l[3] || "lucros"),
      forma: String(l[4] || "transferencia"),
      valor: Math.round(Number(l[5]) * 100),  // a planilha guarda em reais; o app usa centavos
      desc: String(l[6] || ""),
      criadoEm: l[7] ? new Date(l[7]).toISOString() : ""
    });
  }
  return saida;
}

function incluir(d) {
  if (!d || !d.id || !d.data || !d.quem) return { ok: false, erro: "dados incompletos" };

  var folha = aba();
  folha.appendRow([
    d.id,
    d.data,                        // texto no formato AAAA-MM-DD
    d.quem,
    d.natureza || "lucros",
    d.forma || "transferencia",
    Number(d.valor) / 100,         // grava em reais, para a planilha somar normalmente
    d.desc || "",
    d.criadoEm || new Date().toISOString()
  ]);
  return { ok: true };
}

function excluir(d) {
  if (!d || !d.id) return { ok: false, erro: "id ausente" };

  var folha = aba();
  var ultima = folha.getLastRow();
  if (ultima < 2) return { ok: true };

  var ids = folha.getRange(2, 1, ultima - 1, 1).getValues();
  for (var i = ids.length - 1; i >= 0; i--) {
    if (String(ids[i][0]) === String(d.id)) {
      folha.deleteRow(i + 2);
      return { ok: true };
    }
  }
  return { ok: true };  // já não existia
}

/** A planilha pode devolver a data como texto ou como Date; o app espera AAAA-MM-DD. */
function comoData(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(v).slice(0, 10);
}
