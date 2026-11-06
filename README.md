# Free Dictionary Mobile App — Desafio TruckPag

> Aplicativo mobile desenvolvido para proporcionar uma experiência fluida, acessível e agradável ao explorar o vocabulário em inglês. Construído com **React Native**, **Expo SDK 58**, **TypeScript**, persistência local em **SQLite (WAL)**, cache offline inteligente via **TanStack Query**, autenticação segura de ponta a ponta e rotas protegidas pelo **React Navigation**.

> *This is a challenge by [Coodesh](https://coodesh.com/)*

---

## 📱 O que o app oferece e fidelidade ao Wireframe

O desenvolvimento foi guiado pela busca de um equilíbrio entre fidelidade visual ao protótipo e excelência em usabilidade (UX / Acessibilidade):

- **Tela Principal (Home):**
  - **Navegação por Abas:** Alternância instantânea entre `Word list` (palavras disponíveis), `History` (palavras recentemente visualizadas) e `Favorites` (termos salvos pelo usuário).
  - **Grade Visual em 3 Colunas:** Células com bordas bem delineadas, tipografia legível e feedback tátil ao toque conforme o wireframe oficial.
  - **Rolagem Infinita de Alta Performance:** Paginação sob demanda com consultas indexadas ao banco local, sem engasgos ou perda de frames.
  - **Busca em Tempo Real:** Barra de pesquisa humanizada com *debouncing* (300ms) e cancelamento de requisições anteriores (`useDebounce`), permitindo encontrar qualquer palavra instantaneamente.
- **Modal de Detalhes da Palavra:**
  - **Card Central:** Destaque para a palavra pesquisada e sua transcrição fonética precisa.
  - **Player de Áudio Dinâmico:** Botão de reprodução e barra de progresso em tempo real (azul/ciano), com fallback inteligente para síntese de voz (TTS) para termos sem gravação remota.
  - **Significados & Exemplos:** Seção *Meanings* detalhada por classe gramatical (substantivo, verbo, adjetivo) com exemplos práticos de aplicação no dia a dia.
  - **Favoritos com 1 Toque:** Adicione ou remova qualquer termo com resposta visual imediata no ícone de coração.
  - **Navegação Contínua no Rodapé:** Botões `Voltar` e `Próximo` para avançar ou retroceder pelas palavras da lista sem precisar fechar e reabrir o modal.

---

## 🛠️ Tecnologias e Decisões de Ferramental

Optamos por uma stack moderna, robusta e alinhada com as melhores práticas do ecossistema React Native:

- **Linguagem & Framework:**
  - [React Native](https://reactnative.dev/) 0.88 + [Expo SDK](https://expo.dev/) 58: Estabilidade e acesso nativo otimizado.
  - [TypeScript](https://www.typescriptlang.org/): Tipagem estrita de ponta a ponta para prevenir erros em tempo de compilação.
- **Roteamento & Navegação:**
  - [@react-navigation/native](https://reactnavigation.org/) & [@react-navigation/native-stack](https://reactnavigation.org/): Gerenciamento das rotas públicas (`AuthScreen`) e privadas protegidas (`HomeScreen`), com transições nativas e tela de carregamento reativa.
- **Gerenciamento de Estado & Cache Offline:**
  - [TanStack Query (React Query)](https://tanstack.com/query) v5: Cache inteligente em memória e em disco (`AsyncStorage`), evitando requisições repetidas à [Free Dictionary API](https://dictionaryapi.dev/).
  - [Zustand](https://github.com/pmndrs/zustand): Estado global reativo, leve e previsível para abas, histórico, favoritos e usuário logado.
- **Banco de Dados Local & Segurança:**
  - [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/): Banco relacional SQLite operando em modo WAL (`Write-Ahead Logging`), com índices B-Tree e integridade referencial (`PRAGMA foreign_keys = ON`).
  - [expo-secure-store](https://docs.expo.dev/versions/latest/sdk/securestore/): Armazenamento criptografado no Keychain do iOS e Keystore do Android para tokens de sessão.
  - [expo-crypto](https://docs.expo.dev/versions/latest/sdk/crypto/): Criptografia com Hash SHA-256 e Salt exclusivo por usuário contra ataques de dicionário e rainbow table.
- **Reprodução de Áudio & Acessibilidade:**
  - [expo-audio](https://docs.expo.dev/versions/latest/sdk/audio/): Reprodução estável de arquivos de áudio compatível com o Expo SDK 58.
  - [expo-speech](https://docs.expo.dev/versions/latest/sdk/speech/): Fallback nativo com Text-to-Speech (`en-US`) para garantir que o usuário sempre possa ouvir a pronúncia.
- **Qualidade & Testes:**
  - [Jest](https://jestjs.io/) + [React Native Testing Library](https://callstack.github.io/react-native-testing-library/): **39 testes automatizados** cobrindo 9 suítes completas de regras de negócio, repositórios, stores e componentes de interface.

---

## 🏛️ Padrões de Arquitetura e Engenharia de Código

O projeto adota uma fusão entre **Clean Architecture** (nas regras de negócio e fontes de dados) e **Feature-Sliced Design (FSD)** com **Atomic Design** (na interface visual):

```text
src/
├── core/                         # Infraestrutura e Inicialização Global
│   ├── di/
│   │   └── container.ts          # Container de Injeção de Dependências (IoC)
│   ├── network/
│   │   └── query-client.ts       # TanStack Query com persistência offline
│   ├── storage/
│   │   └── database.ts           # Inicialização relacional e seeds do SQLite local (WAL)
│   └── ui/
│       └── ErrorBoundary.tsx     # Captura amigável de falhas com interface de recuperação
├── navigation/                   # Rotas Públicas e Protegidas (React Navigation)
│   ├── app-navigator.tsx         # NavigationContainer temático
│   ├── root-navigator.tsx        # Controle de sessão (Pública: Auth / Privada: Home)
│   ├── loading-screen.tsx        # Tela de transição humanizada
│   └── types.ts                  # Definições tipadas de navegação
├── shared/                       # Primitivas Agnósticas do Design System
│   ├── theme/tokens.ts           # Design tokens semânticos (cores, espaçamentos, touch >= 44px)
│   ├── ui/                       # Átomos acessíveis: Button, Input, Typography, EmptyState
│   ├── lib/use-debounce.ts       # Debounce customizado com cancelamento por AbortController
│   └── api/http-client.ts        # Cliente HTTP centralizado e resiliente
├── entities/                     # Entidades de Domínio e Células Atômicas
│   ├── word/                     # Modelos de vocabulário e componente WordCell (grade 3 colunas)
│   └── user/                     # Modelos de usuário e sessão
├── features/                     # Casos de Uso Fatiados (todos com <= 120 linhas)
│   ├── auth/                     # Autenticação, validações e telas fatiadas
│   └── word-detail/              # Modal de detalhes em blocos atômicos (card, player, meanings)
├── widgets/                      # Blocos de Interface Autônomos
│   ├── header/                   # Topbar com identificação e perfil
│   ├── search-bar/               # Barra de pesquisa acessível
│   ├── tab-bar/                  # Abas Word list, History, Favorites
│   └── word-grid/                # Grid com paginação fluida
└── modules/                      # Regras de Negócio e Repositórios Desacoplados
    ├── auth/                     # LocalAuth (SQLite + Crypto) e Stub Supabase
    ├── dictionary/               # SQLiteWord, SQLiteFavorite, SQLiteHistory e DictionaryApi
    └── audio/                    # Player de áudio com fallback de voz nativo
```

> 💡 **Regra de Ouro do Projeto:** Cada componente, hook e serviço foi rigorosamente desenhado para não ultrapassar **120 linhas**, mantendo alta coesão, responsabilidade única e testabilidade descomplicada.

Documentações complementares detalhadas:
- **[Guia Completo de Módulos & Repositórios](docs/modulos.md)**
- **[Padrões de Arquitetura e Código (FSD & Atomic Design)](docs/padroes_e_arquitetura_react_native.md)**

---

## 🔍 Desafios Técnicos Enfrentados e Decisões de Engenharia

Durante o ciclo de desenvolvimento, investigamos cenários críticos de usabilidade e performance, tomando decisões fundamentadas:

### 1. Inicialização Instantânea vs. Volume de ~370.000 Palavras
- **O Desafio:** O dicionário completo (`words_dictionary.json`) contém mais de 370 mil palavras (~6.5 MB). Processar todo esse JSON na thread principal do JavaScript logo na inicialização travaria o app por vários segundos, gerando frustração ao usuário.
- **A Solução:** Adotamos uma estratégia de inicialização em duas etapas:
  1. *Boot Imediato:* O app inicializa em menos de 100ms criando a estrutura relacional no SQLite com índices e carregando imediatamente os termos essenciais para a grade inicial.
  2. *Ingestão em Segundo Plano:* O serviço `WordSeederService` indexa o restante do vocabulário em lotes assíncronos de 1.000 termos sem concorrer com as animações da interface (60 FPS garantidos).

### 2. Cache Inteligente e Resiliência Offline da API
- **O Desafio:** A *Free Dictionary API* fornece definições estáticas. Fazer requisições de rede repetidas para palavras já consultadas gera lentidão e consome os dados do usuário desnecessariamente.
- **A Solução:** Configuramos o **TanStack Query v5** com retenção em memória e persistência em disco via `AsyncStorage` (`staleTime: 24h` / `maxAge: 7 dias`). Uma vez consultada, a palavra fica imediatamente acessível mesmo se o dispositivo estiver em modo avião ou sem conexão.

### 3. Áudio Sempre Disponível (Player Nativo + Síntese de Voz)
- **O Desafio:** Muitas palavras cadastradas na API gratuita não possuem gravações de áudio anexadas ou retornam links de MP3 indisponíveis. Além disso, bibliotecas legadas como `expo-av` estão descontinuadas no SDK 58.
- **A Solução:** Desenvolvemos o `ExpoAudioPlayerService` com duas camadas:
  1. Reprodução primária via `expo-audio` com monitoramento em tempo real do progresso.
  2. Fallback automático para o sintetizador nativo `expo-speech` (`en-US`), com animação fluida da barra de áudio, assegurando que o usuário **sempre** consiga ouvir a pronúncia correta de qualquer palavra.

### 4. Segurança de Credenciais e Rotas Protegidas
- **O Desafio:** Associar histórico e favoritos a cada usuário de forma segura, sem expor senhas em texto puro no banco local.
- **A Solução:**
  - Armazenamento das senhas utilizando hash criptográfico **SHA-256 + Salt único** por usuário via `expo-crypto`.
  - Persistência das sessões ativas no cofre seguro do sistema operacional via `expo-secure-store` (Keychain no iOS / Keystore no Android).
  - Controle de rotas protegidas com o **React Navigation**, permitindo navegação como visitante (*Guest Mode*) ou acesso completo autenticado com migração transparente para o Supabase graças à Injeção de Dependências.

---

## 🌟 Diferenciais Implementados

1. **Diferencial 1: Player de Áudio com Fallback de Voz**
   - Reprodução com feedback visual em tempo real e sintetizador Text-to-Speech nativo.
2. **Diferencial 2: Injeção de Dependências (IoC Container)**
   - Desacoplamento total entre a UI e a infraestrutura, facilitando testes com mocks e alternância entre SQLite local e Supabase remoto.
3. **Diferencial 3: Suíte Abrangente de Testes Automatizados**
   - **39 testes automatizados** com Jest e React Native Testing Library, cobrindo rotas protegidas, autenticação com salt, repositórios SQLite, cache e componentes de tela.
4. **Diferencial 4: Autenticação com Dados Vinculados**
   - Login, cadastro e modo visitante. Favoritos e histórico são estritamente vinculados ao ID do usuário com integridade referencial (`ON DELETE CASCADE`).

---

## 👤 Contas de Teste Pré-configuradas

Para facilitar a avaliação sem necessidade de cadastro prévio, deixamos **dois usuários de demonstração** já registrados e populados com dados iniciais:

| Usuário | E-mail | Senha | Histórico e Favoritos Iniciais |
| :--- | :--- | :---: | :--- |
| **Admin TruckPag** | `admin@truckpag.com` | `123456` | Favoritos: *hello*, *peace*, *great* • Histórico: *hello*, *today* |
| **Lucas Developer** | `user@truckpag.com` | `123456` | Favoritos: *value*, *common* • Histórico: *watch*, *review* |

> 💬 *Dica:* Você também pode criar uma conta nova na aba **Cadastrar** ou navegar livremente como visitante clicando em **Continuar como Visitante**.

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos
- **Node.js** (versão LTS recomendada: 18 ou superior)
- Gerenciador de pacotes **npm** ou **yarn**
- Dispositivo físico com o aplicativo **Expo Go** (Android/iOS) ou um simulador/emulador local.

### 1. Clonar e Instalar
```bash
git clone https://github.com/luca-henrique/challenge-mobile-truckpag.git
cd challenge-mobile-truckpag
npm install
```

### 2. Rodar a Suíte de Testes
```bash
npm test
```
*Executa os 39 testes unitários e de integração com cobertura das regras de negócio e interface.*

### 3. Iniciar o Aplicativo com o Expo
```bash
npm start
```
Após o build inicial, use o terminal interativo:
- Pressione `a` para abrir no emulador **Android**.
- Pressione `i` para abrir no simulador **iOS**.
- Pressione `w` para testar no **Navegador Web**.
- Ou escaneie o **QR Code** no aplicativo **Expo Go** do seu celular.

---

## 📋 Resumo dos Requisitos Atendidos

| Requisito do Desafio | Status | Como foi atendido |
| :--- | :---: | :--- |
| **Obrigatório 1: Rolagem infinita das palavras** | ✅ Concluído | Paginação veloz no SQLite local com carregamento suave |
| **Obrigatório 1: Modal com detalhes, significados e fonética** | ✅ Concluído | Exibição de transcrição fonética, classes gramaticais e exemplos |
| **Obrigatório 1: Salvar e remover favoritos** | ✅ Concluído | Persistência relacional vinculada ao ID do usuário logado |
| **Obrigatório 1: Histórico de palavras visualizadas** | ✅ Concluído | Registro temporal de cada palavra acessada |
| **Obrigatório 1: Carga do vocabulário em background** | ✅ Concluído | Inicialização ágil com ingestão em segundo plano sem bloquear a UI |
| **Obrigatório 2: Cache inteligente das requisições** | ✅ Concluído | TanStack Query v5 persistido em disco para navegação offline |
| **Obrigatório 3: Wireframe fiel ao protótipo** | ✅ Concluído | Abas superiores, grade de 3 colunas e modal navegável com Voltar/Próximo |
| **Diferencial 1: Player de áudio com pronúncia** | ✅ Concluído | Reprodução com expo-audio e fallback automático de voz (TTS) |
| **Diferencial 2: Injeção de dependências** | ✅ Concluído | Container IoC desacoplando UI, repositórios e serviços |
| **Diferencial 3: Testes automatizados unitários/integração** | ✅ Concluído | 39 testes em 9 suítes com Jest e Testing Library |
| **Diferencial 4: Autenticação de usuários** | ✅ Concluído | Cadastro, login com SHA-256 + Salt, Keychain/Keystore e modo visitante |
