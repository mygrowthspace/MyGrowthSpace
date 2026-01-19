#!/usr/bin/env python3
"""
Deploy schema.sql to Supabase using direct SQL execution
"""
import requests
import sys
from pathlib import Path

SUPABASE_URL = "https://dtyzunvgbmnheqbubhef.supabase.co"
SERVICE_ROLE_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eXp1bnZnYm1uaGVxYnViaGVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc3NTI1NCwiZXhwIjoyMDg0MzUxMjU0fQ.-qKx0jxXCvuaW0qTjSMZ1b4vjinb0dPY-BGKBlGZ3Rg"

HEADERS = {
    "Authorization": f"Bearer {SERVICE_ROLE_JWT}",
    "Content-Type": "application/json",
    "apikey": SERVICE_ROLE_JWT,
}

def exec_sql(sql):
    """Execute SQL via Supabase SQL API"""
    payload = {"query": sql}
    try:
        resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/rpc/sql_exec",
            headers=HEADERS,
            json=payload,
            timeout=30
        )
        return resp.status_code, resp.text
    except Exception as e:
        return 500, str(e)

def split_sql(content):
    """Split SQL into statements"""
    stmts = []
    current = ""
    for line in content.split('\n'):
        s = line.strip()
        if s.startswith('--') or s == '':
            continue
        current += line + '\n'
        if s.endswith(';'):
            stmt = current.strip()
            if stmt and stmt != ';':
                stmts.append(stmt)
            current = ''
    return stmts

def main():
    print("🚀 My Growth Space - Supabase Schema Deployment")
    print(f"📍 Project: dtyzunvgbmnheqbubhef\n")
    
    schema_file = Path(__file__).parent.parent / "schema.sql"
    
    if not schema_file.exists():
        print(f"❌ Not found: {schema_file}")
        sys.exit(1)
    
    content = schema_file.read_text()
    stmts = split_sql(content)
    
    print(f"📝 {len(stmts)} SQL statements found\n")
    print("=" * 70)
    
    success = 0
    for i, stmt in enumerate(stmts, 1):
        preview = stmt.split('\n')[0][:60]
        print(f"[{i:2d}/{len(stmts)}] {preview:60s} ", end="", flush=True)
        
        code, resp = exec_sql(stmt)
        
        if 200 <= code < 300:
            print("✅")
            success += 1
        elif "already exists" in resp or "duplicate" in resp:
            print("⚠️  (exists)")
            success += 1
        else:
            print("❌")
            if code >= 500:
                print(f"       Server error: {code}")
            else:
                print(f"       Error: {resp[:50]}")
    
    print("=" * 70)
    print(f"\n✅ Success: {success}/{len(stmts)}")
    print("🎉 Schema deployment completed!\n")

if __name__ == "__main__":
    main()
