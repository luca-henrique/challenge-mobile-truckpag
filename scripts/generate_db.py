import json
import os
import sqlite3
import time

def generate_database():
    start_time = time.time()
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, 'assets', 'words_dictionary.json')
    output_dir = os.path.join(base_dir, 'assets', 'database')
    os.makedirs(output_dir, exist_ok=True)
    db_path = os.path.join(output_dir, 'dictionary.db')

    if os.path.exists(db_path):
        os.remove(db_path)

    print(f"Lendo palavras de: {json_path}")
    with open(json_path, 'r', encoding='utf-8') as f:
        words_dict = json.load(f)
    
    words = list(words_dict.keys())
    print(f"Total de palavras carregadas: {len(words)}")

    print(f"Criando banco de dados em: {db_path}")
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("PRAGMA journal_mode = WAL;")
    cursor.execute("PRAGMA synchronous = NORMAL;")
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 1. Tabela words
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS words (
            word TEXT PRIMARY KEY COLLATE NOCASE
        );
    """)

    # 2. Tabela users (com salt e collation nocase)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT UNIQUE COLLATE NOCASE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
    """)

    # 3. Tabela favorites (com foreign key cascade e índice composto)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS favorites (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            word TEXT NOT NULL,
            created_at TEXT NOT NULL,
            UNIQUE(user_id, word),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)

    # 4. Tabela history (com foreign key cascade)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            word TEXT NOT NULL,
            viewed_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    """)

    # Inserção em lotes de 10.000 para velocidade máxima
    batch_size = 10000
    cursor.execute("BEGIN TRANSACTION;")
    for i in range(0, len(words), batch_size):
        chunk = [(w,) for w in words[i:i + batch_size]]
        cursor.executemany("INSERT OR IGNORE INTO words (word) VALUES (?)", chunk)
    conn.commit()

    # Criação de índices APÓS a carga em lote (conforme item 1 do checklist)
    print("Criando índices B-Tree otimizados...")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_words_word ON words(word COLLATE NOCASE);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_history_viewed_at ON history(viewed_at DESC);")
    conn.commit()

    # Executa otimização e fecha
    cursor.execute("PRAGMA optimize;")
    conn.close()

    elapsed = time.time() - start_time
    file_size_mb = os.path.getsize(db_path) / (1024 * 1024)
    print(f"Sucesso! Banco gerado em {elapsed:.2f}s. Tamanho final: {file_size_mb:.2f} MB")

if __name__ == '__main__':
    generate_database()
