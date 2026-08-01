import sqlite3
import os

db_path = 'sql_app.db'
if not os.path.exists(db_path):
    print('❌ DATABASE FILE MISSING!')
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [t[0] for t in cursor.fetchall()]

print("==================================================")
print("  DATABASE HEALTH & INTEGRITY DIAGNOSTIC REPORT   ")
print("==================================================")
print("Status:            CONNECTED & ONLINE")
print(f"Engine:            SQLite")
print(f"Database File:     {os.path.abspath(db_path)}")
print(f"File Size:         {round(os.path.getsize(db_path) / 1024, 2)} KB")
print(f"Total Schema Tables: {len(tables)}")
print("--------------------------------------------------")
print(f"{'TABLE NAME':<28} | {'ROW COUNT':<10}")
print("--------------------------------------------------")

for table in sorted(tables):
    if table == 'sqlite_sequence':
        continue
    try:
        cursor.execute(f"SELECT count(*) FROM {table}")
        c = cursor.fetchone()[0]
        print(f"{table:<28} | {c:<10}")
    except Exception as e:
        print(f"{table:<28} | ERROR: {e}")

print("--------------------------------------------------")
print("REGISTERED USERS:")
try:
    cursor.execute("SELECT id, email, role, created_at FROM users;")
    users = cursor.fetchall()
    for u in users:
        print(f"  • ID {u[0]}: {u[1]} ({u[2].upper()}) - Created: {u[3] or 'N/A'}")
except Exception as e:
    print(f"  Error fetching users: {e}")

print("==================================================")
conn.close()
