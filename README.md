# Repasses ENCOR — controle de lançamentos

Aplicativo web para registrar os pagamentos feitos a **Dimona** e **Genius**, separando
dinheiro e transferência bancária, e acompanhando o limite de **R$ 50.000 por pessoa por mês**
em distribuição de lucros (Lei nº 15.270/2025).

Os dados ficam guardados em uma **Planilha Google** no Drive — nada é salvo no GitHub.

---

## Como funciona o "Drive como storage"

```
Navegador (GitHub Pages)  →  Apps Script (/exec)  →  Planilha Google no Drive
```

O aplicativo em si é só a tela. Quem guarda os lançamentos é a planilha.
O Apps Script é a portinha que liga um ao outro.

**Sobre cadastrar pelo e-mail:** o Google não permite que um site grave no Drive de alguém
apenas informando o e-mail — o dono precisa autorizar. Por isso o modelo aqui é:
a planilha fica em **um** Drive (o seu) e você **cadastra as pessoas compartilhando a planilha
com o e-mail delas**. Assim cada interessado enxerga os lançamentos no próprio Drive,
e quem opera o aplicativo grava através do script.

---

## Instalação (uma vez só, ~15 minutos)

### Parte 1 — Criar a planilha e o script

1. Acesse [drive.google.com](https://drive.google.com) → **Novo** → **Planilhas Google**.
2. Dê um nome à planilha, por exemplo `Repasses ENCOR`.
3. Na planilha, vá em **Extensões** → **Apps Script**.
4. Apague o conteúdo que aparecer e cole todo o conteúdo do arquivo
   `apps-script/Codigo.gs` deste projeto.
5. Na linha `var CODIGO_DE_ACESSO = "troque-esta-frase";`, troque por uma frase secreta sua
   (ex.: `encor-2026-repasses`). **Guarde essa frase** — ela será pedida no aplicativo.
6. Clique no disquete (Salvar).

### Parte 2 — Publicar o script

7. Clique em **Implantar** → **Nova implantação**.
8. Na engrenagem ao lado de "Selecione o tipo", escolha **App da Web**.
9. Preencha:
   - **Executar como:** Eu (seu e-mail)
   - **Quem pode acessar:** **Qualquer pessoa**
10. Clique em **Implantar**. O Google vai pedir autorização:
    **Revisar permissões** → escolha sua conta → em "O Google não verificou este app",
    clique em **Avançado** → **Acessar (nome do projeto)** → **Permitir**.
    (Esse aviso aparece porque o script é seu e não passou por revisão pública — é esperado.)
11. Copie o **URL do app da Web** — ele termina em `/exec`.

> **Importante:** sempre que você alterar o `Codigo.gs`, precisa fazer
> **Implantar → Gerenciar implantações → editar (lápis) → Versão: Nova versão → Implantar**,
> senão a alteração não entra no ar.

### Parte 3 — Publicar o aplicativo no GitHub

12. Em [github.com](https://github.com), clique em **+** → **New repository**.
    Dê um nome (ex.: `repasses-encor`) e crie.
13. Envie os arquivos: **Add file** → **Upload files** → arraste o `index.html`
    (e, se quiser, a pasta `apps-script` e este LEIA-ME) → **Commit changes**.
14. Vá em **Settings** → **Pages** → em "Branch" escolha **main** e **/ (root)** → **Save**.
15. Aguarde 1–2 minutos. O endereço do site aparece na mesma tela, no formato
    `https://SEU-USUARIO.github.io/repasses-encor/`.

> O repositório pode ser **público** sem problema: o `index.html` não contém nenhum dado
> financeiro nem a sua frase secreta. Os lançamentos estão só na planilha.

### Parte 4 — Conectar

16. Abra o endereço do GitHub Pages. Vai aparecer o painel **Conexão com a Planilha Google**.
17. Cole o **URL /exec** (passo 11) e a **frase secreta** (passo 5) → **Conectar**.
18. Faça um lançamento de teste e confira se ele aparece na planilha, na aba `Lancamentos`.

---

## Cadastrando as partes interessadas

Para que outra pessoa **veja os lançamentos no Drive dela**:

1. Abra a planilha → botão **Compartilhar** (canto superior direito).
2. Digite o **e-mail** da pessoa.
3. Escolha o papel:
   - **Leitor** — só consulta (indicado para o contador e para o sócio que apenas acompanha);
   - **Editor** — pode alterar a planilha diretamente.
4. Enviar.

Para que alguém **lance pelo aplicativo** (sua administradora, por exemplo), basta passar a ela
o **endereço do site** e a **frase secreta**. Ela preenche uma vez e o navegador dela lembra.

---

## Uso no dia a dia

| Ação | Como fazer |
|---|---|
| Registrar pagamento | Preencher o formulário → **Adicionar lançamento** |
| Ver outro mês | Setas **‹ ›** no topo |
| Ver o que outra pessoa lançou | Botão **Atualizar** |
| Enviar ao contador | **Baixar CSV do mês** (abre no Excel) |
| Trocar a conexão | Botão **⚙ Conexão** |

O aviso no canto superior direito mostra o estado: *Conectado*, *Salvando…*, *Salvo* ou um erro.
Se a gravação falhar, o lançamento **é desfeito na tela** — assim o que você vê é sempre
o que está de fato na planilha.

---

## Sobre a natureza dos lançamentos

Só a natureza **Distribuição de lucros** conta nos medidores de limite. Pró-labore, reembolso
de despesas e outros ficam registrados, mas fora do limite — **porque têm tratamento tributário
próprio**: pró-labore exige folha, INSS e IR na fonte; reembolso exige comprovante da despesa.

Dois pontos que a lei não perdoa:

- **Pagar em dinheiro não tira o valor do limite.** A retenção de 10% incide sobre o total de
  lucros distribuídos no mês, em qualquer forma de pagamento.
- **Classificar lucros como "pró-labore" ou "reembolso" sem que sejam** é sonegação fiscal
  (Lei 8.137/1990). Use cada natureza pelo que ela é de verdade e guarde a documentação.

Este aplicativo organiza o controle; ele não substitui a orientação do seu contador.

---

## Observações de segurança

- A frase secreta fica salva **no navegador** de quem usa o aplicativo. Quem tiver acesso
  àquele computador consegue vê-la — use o app em máquinas de confiança.
- Se a frase vazar, troque-a no `Codigo.gs`, reimplante (nova versão) e reconecte o aplicativo.
- Faça uma cópia da planilha de tempos em tempos: **Arquivo → Fazer uma cópia**.

---

## Estrutura do projeto

```
index.html              o aplicativo (tudo embutido: código, logo e marca d'água)
apps-script/Codigo.gs   o script que fica na Planilha Google
LEIA-ME.md              este arquivo
```
