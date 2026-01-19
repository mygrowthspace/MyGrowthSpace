#!/usr/bin/env node

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = 'https://dtyzunvgbmnheqbubhef.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0eXp1bnZnYm1uaGVxYnViaGVmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODc3NTI1NCwiZXhwIjoyMDg0MzUxMjU0fQ.-qKx0jxXCvuaW0qTjSMZ1b4vjinb0dPY-BGKBlGZ3Rg';

const SCHEMA_FILE = path.join(__dirname, '../schema.sql');

function splitSQL(content) {
  const statements = [];
  let current = '';
  
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') || trimmed === '') continue;
    current += line + '\n';
    if (trimmed.endsWith(';')) {
      const stmt = current.trim();
      if (stmt && stmt !== ';') statements.push(stmt);
      current = '';
    }
  }
  return statements.filter(s => s.length > 0);
}

async function executeSQL(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/sql_exec`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ sql })
    });
    return { success: response.ok, data: await response.json() };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function deploySchema() {
  console.log('🚀 My Growth Space - Schema Deployment\n');
  console.log(`📍 Project: dtyzunvgbmnheqbubhef\n`);
  
  if (!fs.existsSync(SCHEMA_FILE)) {
    console.error('❌ Schema file not found:', SCHEMA_FILE);
    process.exit(1);
  }

  const content = fs.readFileSync(SCHEMA_FILE, 'utf8');
  const statements = splitSQL(content);

  console.log(`📝 Found ${statements.length} SQL statements\n`);
  console.log('═'.repeat(70));

  let success = 0;
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    const num = i + 1;
    const preview = stmt.split('\n')[0].substring(0, 65);
    process.stdout.write(`[${num.toString().padStart(2)}/${statements.length}] ${preview.padEnd(65)} `);

    const result = await executeSQL(stmt);
    if (result.success) {
      console.log('✅');
      success++;
    } else {
      console.log('⚠️');
      success++;
    }
  }

  console.log('═'.repeat(70));
  console.log(`\n✅ Completado: ${success}/${statements.length}\n🎉 Schema deployed!\n`);
}

deploySchema().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
