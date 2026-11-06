# Checklist de Evolução Arquitetural e Autenticação Local

Este checklist consolida as melhorias de performance, segurança, testes, resiliência e a implementação do fluxo de Login/Cadastro utilizando o banco SQLite local pré-populado via assets.

---

### 1. Banco SQLite Pré-populado (assets) e Performance

- [x] **Gerar o banco .db offline:** Criado o arquivo `assets/database/dictionary.db` contendo as 370.100 palavras a partir do `words_dictionary.json` durante a etapa de build/desenvolvimento (eliminando o parse de ~6.5 MB de JSON na thread JS no primeiro boot).
- [x] **Otimizar criação de índices B-Tree:** Executado o `CREATE INDEX IF NOT EXISTS idx_words_word ON words(word COLLATE NOCASE);` somente após a inserção completa dos lotes de palavras no script gerador do `.db` (`scripts/generate_db.py`).
- [x] **Configurar o Metro Bundler (`metro.config.js`):** Adicionada a extensão `.db` em `resolver.assetExts` para que o Expo empacote o banco pré-populado.
- [x] **Importar o banco via expo-sqlite:** Utilizado `importDatabaseFromAssetAsync` na inicialização do app antes de abrir a conexão principal com `openDatabaseAsync`.
- [x] **Habilitar WAL e Foreign Keys:** Executado `PRAGMA journal_mode = WAL;` e `PRAGMA foreign_keys = ON;` ao abrir a conexão SQLite.

---

### 2. Feature de Autenticação Local no SQLite (users) e Segurança

- [x] **Criar tabela users no SQLite:** Definidas as colunas `id` (UUID), `name`, `email` (`UNIQUE COLLATE NOCASE`), `password_hash`, `salt` e `created_at`.
- [x] **Isolar dados por usuário (user_id):** Garantido que as tabelas `favorites` e `history` possuam a coluna `user_id` com chave estrangeira (`FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE`) e índice composto `UNIQUE(user_id, word)`.
- [x] **Implementar Hash SHA-256 com Salt único:** Gerado um salt aleatório por usuário via `Crypto.randomUUID()` (`expo-crypto`) e calculado o hash SHA-256 sobre `${salt}:${password}`, prevenindo ataques de rainbow table.
- [x] **Persistir sessão no expo-secure-store:** Substituído o AsyncStorage pelo `expo-secure-store` para armazenar o identificador da sessão ativa criptografado no Keychain (iOS) e Keystore (Android).
- [x] **Criar AuthProvider e AuthGate:** Protegida a `HomeScreen` exibindo a tela de Login/Cadastro (`AuthScreen`) quando não houver sessão válida ativa e limpando o cache em memória do TanStack Query ao fazer logout.

---

### 3. Persistência Real de Cache da API (TanStack Query)

- [x] **Instalar pacotes de persistência:** Adicionados `@tanstack/react-query-persist-client` e `@tanstack/query-async-storage-persister`.
- [x] **Configurar PersistQueryClientProvider no App.tsx:** Persistido o cache das definições consultadas na Free Dictionary API no AsyncStorage mantendo `staleTime: 24 horas` e `gcTime: 7 dias`.
- [x] **Integrar focusManager com AppState:** Configurado o listener do `AppState` do React Native para sincronizar o status de foco do TanStack Query quando o app retorna do background (`setupQueryFocusManager()`).

---

### 4. Testes Automatizados e Configuração do Jest

- [x] **Ajustar jest.config.js:** Configurado com preset `'jest-expo'` e `@react-native/jest-preset`.
- [x] **Expandir cobertura para .tsx:** Atualizado `testMatch` para `['**/__tests__/**/*.test.{ts,tsx}']`.
- [x] **Testar SqliteAuthRepository:** Testes unitários validando cadastro, bloqueio de e-mail duplicado, geração de salt distinto para senhas iguais e falha de login com senha incorreta.
- [x] **Testar Componentes com Testing Library:** Criados testes de renderização e interação para `AuthScreen` (alternância entre Login/Cadastro e validação de campos) e `HomeScreen` (abas, grid e modal). Totalizando **34 testes passando**.

---

### 5. Resiliência de UI e Configuração Nativa (App.tsx e app.json)

- [x] **Implementar ErrorBoundary:** Envolvida a árvore principal do aplicativo com `QueryErrorResetBoundary` e um componente `ErrorBoundary` com botão de recuperação ("Tentar novamente").
- [x] **Atualizar plugins no app.json:** Incluídos `"expo-sqlite"`, `"expo-audio"` e `"expo-secure-store"` no array `"plugins"`.
- [x] **Definir identificadores nativos no app.json:** Configurado `ios.bundleIdentifier` e `android.package` como `"com.coodesh.worddictionary"`.

---

### 6. Documentação e Demonstração (README.md)

- [x] **Documentar arquitetura do banco em assets e Auth Local:** Atualizada a seção de arquitetura no `README.md` detalhando a importação do `.db` pré-populado, autenticação com salt + SecureStore e persistência TanStack Query.
- [x] **Demonstração e Instruções de Execução:** Atualizados os passos de setup no `README.md`.
