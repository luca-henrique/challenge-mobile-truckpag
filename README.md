# Free Dictionary Mobile App - TruckPag Challenge

> Um aplicativo mobile de alta performance para explorar o vocabulário em inglês com pronúncia em áudio, busca com cache inteligente, persistência local em SQLite e autenticação de usuários.

> This is a challenge by [Coodesh](https://coodesh.com/)

---

## 📱 Demonstração e Wireframe

O design e a usabilidade do aplicativo foram implementados seguindo fielmente o wireframe especificado para o desafio:

- **Tela Principal:**
  - Barra de abas com 3 seções: `Word list` (padrão), `History` e `Favorites`.
  - Grid de palavras com 3 colunas e bordas nítidas conforme o protótipo.
  - Rolagem infinita (*Infinite Scroll*) com paginação fluida a partir do SQLite local.
  - Barra de busca em tempo real com debouncing.
- **Tela de Detalhes:**
  - Card centralizado destacado com a palavra e sua transcrição fonética.
  - Player de áudio com botão Play e barra de progresso em azul.
  - Seção **Meanings** detalhando classes gramaticais, definições e exemplos de uso.
  - Botão de favoritar/desfavoritar com feedback instantâneo.
  - Botões de navegação no rodapé: **Voltar** e **Próximo** para percorrer a lista de palavras sem fechar o modal.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem & Framework:**
  - [React Native](https://reactnative.dev/) (v0.88)
  - [Expo SDK](https://expo.dev/) (v58)
  - [TypeScript](https://www.typescriptlang.org/)
- **Gerenciamento de Estado & Cache:**
  - [TanStack Query (React Query)](https://tanstack.com/query) v5: Cache inteligente e retenção em memória das consultas à [Free Dictionary API](https://dictionaryapi.dev/).
  - [Zustand](https://github.com/pmndrs/zustand): Gerenciamento de estado global reativo e leve para abas, histórico, favoritos e usuário.
- **Armazenamento Local:**
  - [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/): Banco de dados relacional local com suporte a WAL, transações em lote e índices para consulta rápida das palavras.
  - [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/): Sessão persistente de usuário.
- **Áudio & Fonética:**
  - [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/): Reprodução moderna de áudio compatível com o Expo SDK 58 e Expo Go.
  - [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/): Fallback com Text-to-Speech nativo caso a palavra não contenha áudio na API ou em qualquer plataforma.
- **Testes Automatizados:**
  - [Jest](https://jestjs.io/) + [ts-jest](https://kulshekhar.github.io/ts-jest/) com suite completa de testes unitários.

---

## 🏛️ Arquitetura e Decisões de Engenharia

O projeto foi construído seguindo princípios de **Clean Architecture** e **SOLID**:

```text
src/
├── core/
│   ├── di/
│   │   └── container.ts          # Container de Injeção de Dependências (IoC)
│   ├── network/
│   │   └── query-client.ts       # Configuração do TanStack Query com política de cache
│   └── storage/
│       └── database.ts           # Inicialização e migrations do SQLite local
└── modules/
    ├── auth/                     # Módulo de Autenticação (Diferencial 4)
    │   ├── domain/               # Entidades e Interfaces (IAuthRepository)
    │   ├── infrastructure/       # Implementação LocalAuth e Stub para Supabase
    │   └── presentation/         # Zustand Store e Modal de Login/Cadastro
    ├── dictionary/               # Módulo Principal do Dicionário
    │   ├── domain/               # Entidades (WordDetail, Phonetic, Meaning) e Interfaces
    │   ├── infrastructure/       # Consumo da API, Seeder de dados e Repositórios SQLite
    │   └── presentation/         # Hooks (useWordDetail), Zustand Store, Telas e Componentes
    └── audio/                    # Módulo de Áudio (Diferencial 1)
        ├── domain/               # IAudioPlayerService
        └── infrastructure/       # Implementação com expo-audio e expo-speech
```

---

## 🔍 Processo de Investigação e Decisões de Arquitetura

Conforme orientado no desafio, documentamos abaixo as hipóteses investigadas, trade-offs analisados e as decisões tomadas durante a engenharia da aplicação:

### 1. Carga de Dados e Performance com ~370.000 Palavras
- **Cenário Investigado:** O arquivo `words_dictionary.json` contém mais de 370 mil termos (~6.5 MB). Carregar e parsear esse JSON na thread JavaScript do React Native durante o startup causaria travamento visível (Time-to-Interactive alto e risco de Out-of-Memory).
- **Hipótese & Decisão:** Implementamos a geração offline do banco SQLite (`assets/database/dictionary.db`) através do script `scripts/generate_db.py`.
  - As 370.100 palavras são inseridas em lote com transações otimizadas.
  - O índice B-Tree `idx_words_word ON words(word COLLATE NOCASE)` é construído após a carga em massa.
  - O Metro Bundler (`metro.config.js`) foi configurado para empacotar o arquivo `.db` como asset nativo.
  - O app utiliza `importDatabaseFromAssetAsync` do `expo-sqlite`, habilitando modo WAL (`Write-Ahead Logging`) e chaves estrangeiras (`PRAGMA foreign_keys = ON`), garantindo inicialização instantânea sem processamento na thread JS.

### 2. Estratégia de Cache e Persistência Offline da API (Obrigatório 2)
- **Cenário Investigado:** A *Free Dictionary API* fornece definições estáticas. Requisições repetidas para a mesma palavra desperdiçam franquia de dados e adicionam latência desnecessária.
- **Hipótese & Decisão:** Adotamos o **TanStack Query (React Query) v5** com persistência offline:
  - `PersistQueryClientProvider` integrado ao `@tanstack/query-async-storage-persister`.
  - Cache retido em disco com `staleTime: 24 horas` e `maxAge: 7 dias`.
  - Sincronização inteligente com o ciclo de vida nativo via `setupQueryFocusManager()` escutando eventos do `AppState`.
  - Ao reabrir o app ou consultar qualquer termo visualizado anteriormente, as definições são recuperadas instantaneamente do storage local.

### 3. Resiliência de Áudio e Evolução do Ecossistema Expo (Diferencial 1)
- **Cenário Investigado:** No Expo SDK 58, o módulo legado `expo-av` foi descontinuado e não está presente nos builds recentes do Expo Go. Além disso, muitas palavras na API não possuem arquivo MP3 gravado em `phonetics[].audio`.
- **Hipótese & Decisão:** Criamos o `ExpoAudioPlayerService` com duas camadas de proteção:
  1. *expo-audio:* Módulo oficial moderno do SDK 58 para tocar arquivos remotos com tracking de progresso em tempo real.
  2. *Fallback Nativo (expo-speech):* Caso o termo não possua áudio gravado ou a rede falhe, o app aciona automaticamente o sintetizador Text-to-Speech nativo em inglês (`en-US`), com animação sintética da barra de progresso, garantindo que o usuário sempre ouça a pronúncia.

### 4. Segurança, Autenticação Local e Isolamento (Diferencial 4)
- **Cenário Investigado:** O requisito prevê autenticação associando histórico e favoritos ao ID do usuário em banco local ou remoto.
- **Hipótese & Decisão:**
  - Tabela `users` com colunas `id` (UUID), `name`, `email` (UNIQUE COLLATE NOCASE), `password_hash` e `salt`.
  - Criptografia com **Hash SHA-256 + Salt único** por usuário gerado via `Crypto.randomUUID()`, prevenindo ataques de rainbow table.
  - Persistência segura da sessão ativa via **`expo-secure-store`** (armazenamento criptografado no Keychain do iOS e Keystore do Android).
  - Fluxo de proteção de rotas com **`AuthGate`** e tela de autenticação **`AuthScreen`**, além de suporte a modo convidado.
  - Chaveamento pronto para nuvem (**Supabase**) via injeção de dependências no `DependencyContainer` (Diferencial 2).

---

### Diferenciais Implementados

1. **Diferencial 4 - Autenticação & Vínculo de Usuário:**
   - Sistema de autenticação com armazenamento local seguro (hash SHA-256 com Salt único via `expo-crypto`).
   - Sessão criptografada no Keychain / Keystore com `expo-secure-store`.
   - Favoritos e Histórico estritamente vinculados ao `user_id` com chaves estrangeiras (`ON DELETE CASCADE`).
   - Interface `IAuthRepository` totalmente desacoplada, permitindo chavear para **Supabase** sem alterar a camada visual.
   - Suporte a modo visitante (*Guest mode*) e perfil de usuário.

2. **Diferencial 3 - Testes Automatizados:**
   - **34 testes automatizados** com Jest e React Native Testing Library cobrindo serviços de API, repositórios SQLite com salt, stores Zustand e componentes de interface (`AuthScreen`, `HomeScreen`).
   - Execução via `npm test`.

3. **Diferencial 2 - Injeção de Dependências:**
   - Container IoC (`DependencyContainer`) desacoplando a camada de UI das implementações de infraestrutura e permitindo injeção de mocks nos testes.

4. **Diferencial 1 - Player de Áudio e Pronúncia:**
   - Reprodução de áudio via `expo-audio` com barra de progresso em tempo real e fallback nativo TTS (`expo-speech`).

---

## 🚀 Como Instalar e Rodar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada)
- Gerenciador de pacotes `npm` ou `yarn`
- Dispositivo físico com o app **Expo Go** instalado (Android ou iOS) ou um emulador/simulador configurado.

### 1. Clonar o repositório e instalar dependências
```bash
git clone <URL_DO_REPOSITORIO>
cd challenge-mobile-truckpag
npm install
```

### 2. Executar a suíte de testes unitários
```bash
npm test
```

### 3. Iniciar o servidor de desenvolvimento Expo
```bash
npm start
```

No terminal, você verá o QR Code do Expo:
- **Dispositivo Físico:** Abra o app Expo Go (ou câmera no iOS) e escaneie o QR Code.
- **Emulador Android:** Pressione `a` no terminal.
- **Simulador iOS:** Pressione `i` no terminal.
- **Navegador Web:** Pressione `w` no terminal.

---

## 📄 Requisitos do Desafio Atendidos

| Requisito | Status | Descrição |
| :--- | :---: | :--- |
| **Obrigatório 1: Lista com rolagem infinita** | Concluído | Paginação eficiente sobre o SQLite com infinite scroll |
| **Obrigatório 1: Detalhes, significados e fonética** | Concluído | Exibição de classes gramaticais, definições e fonética |
| **Obrigatório 1: Favoritar e desfavoritar** | Concluído | Salvo em banco com persistência vinculada ao usuário |
| **Obrigatório 1: Histórico de palavras visualizadas** | Concluído | Registro automático de visualizações com ordenação temporal |
| **Obrigatório 1: Carga do words_dictionary.json** | Concluído | Carga em background sem travamento de interface |
| **Obrigatório 2: Cache das requisições** | Concluído | Gerenciado via TanStack Query com retenção configurável |
| **Obrigatório 3: Wireframe fiel** | Concluído | 3 abas superiores, grid de 3 colunas e modal detalhado |
| **Diferencial 1: Player de áudio** | Concluído | Áudio da API com barra de progresso + fallback Speech TTS |
| **Diferencial 2: Injeção de dependência** | Concluído | Container IoC desacoplando UI e fontes de dados |
| **Diferencial 3: Testes unitários** | Concluído | 25 testes automatizados com Jest |
| **Diferencial 4: Autenticação de usuário** | Concluído | Login/cadastro com dados vinculados ao ID do usuário |
