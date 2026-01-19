#!/usr/bin/env python3
"""Deploy schema to Supabase using the Supabase REST API"""

import requests
import json
import sys
from pathlib import Path

SUPABASE_URL = "https://dtyzunvgbmnheqbubhef.supabase.co"
SERVICE_KEY = "sb_secret_Lfi3msl05N8YDzHymOey7A_jzliTVw7"
SCHEMA_FILE = Path(__file__).parent.parent / "schema.sql"

def split_sql(content):
    """Split SQL content into individual statements"""
    statements = []
    current = ""
    in_comment = False
    
    for line in content.split('\n'):
        stripped = line.strip()
        
        # Handle comments
        if stripped.startswith('--'):
            continue
        
        current += line + "\n"
        
        if stripped.endswith(';'):
            stmt = current.strip()
            if stmt and stmt != ';':
                statements.append(stmt)
            current = ""
    
    return [s for s in statements if s.strip() and not s.startswith('--')]

def execute_sql(statement):
    """Execute SQL statement via Supabase API"""
    headers = {
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "apikey": SERVICE_KEY
    }
    
    # Try using the query method
    payload = {
        "query": statement
    }
    
    try:
        response = requests.post(
            f"{SUPABASE_URL}/rest/v1/?select=*",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        return response.status_code < 400, response.text
    except Exception as e:
        return False, str(e)

def deploy_schema():
    """Deploy schema to Supabase"""
    if not SCHEMA_FILE.exists():
        print(f"❌ Schema file not found: {SCHEMA_FILE}")
        sys.exit(1)
    
    print("📖 Reading schema file...")
    schema_content = SCHEMA_FILE.read_text()
    
    print("✂️  Splitting into statements...")
    statements = split_sql(schema_content)
    print(f"📝 Found {len(statements)} statements\n")
    
    success_count = 0
    failed_count = 0
    
    for i, stmt in enumerate(statements, 1):
        preview = stmt.split('\n')[0][:70]
        print(f"[{i}/{len(statements)}] {preview}...", end=" ", flush=True)
        
        success, response = execute_sql(stmt)
        
        if success:
            print("✅")
            success_count += 1
        else:
            print(f"❌ {response[:50]}")
            failed_count += 1
    
    print(f"\n{'='*60}")
    print(f"✅ Success: {success_count} statements")
    print(f"❌ Failed: {failed_count} statements")
    print(f"{'='*60}")
    
    if failed_count > 0:
        print("\n⚠️  Some statements failed. This might be due to existing tables.")
        print("Check Supabase dashboard to verify schema was created.")

if __name__ == "__main__":
    deploy_schema()
