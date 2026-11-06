# 📦 Módulos do Sistema (`src/modules/`)

Este diretório contém os módulos de domínio, infraestrutura e apresentação da aplicação, implementados seguindo os princípios de **Clean Architecture**, **SOLID** e **Inversão de Dependência (DIP)**.

---

### 📂 Módulos Disponíveis:

1. [**`audio/`**](./audio/):
   - Gerenciamento de reprodução de áudio da pronúncia em inglês.
   - Implementado via `expo-audio` com fallback resiliente para Text-to-Speech nativo (`expo-speech`).

2. [**`auth/`**](./auth/):
   - Gestão de autenticação, login, cadastro e visitantes (Guest mode).
   - Implementação local segura com SQLite + `expo-crypto` (SHA-256 + Salt único) e `expo-secure-store`.
   - Driver preparado para Supabase Authentication (`supabase-auth.repository.ts`).

3. [**`dictionary/`**](./dictionary/):
   - Consulta e paginação de palavras no banco local SQLite.
   - Histórico de visualizações e favoritos por usuário com persistência local.
   - Integração com a Free Dictionary API via TanStack Query com cache offline.

---

📖 Para uma explicação completa e aprofundada de cada arquivo, classe e função, consulte o documento principal:
👉 **[Documentação Completa de Módulos](../../docs/modulos.md)**

