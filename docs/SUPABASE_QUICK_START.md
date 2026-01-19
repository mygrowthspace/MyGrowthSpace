## 🚀 Guía Rápida de Configuración de Supabase

Te guía paso a paso para tener todo funcionando en **15 minutos**.

---

## ⏱️ **5 Minutos: Crear Proyecto**

### 1. Ir a Supabase
```
https://app.supabase.com → New Project
```

### 2. Llenar Formulario
- **Name**: `my-growth-space`
- **Password**: Guarda en lugar seguro
- **Region**: Más cercana (us-east-1 si es USA)
- **Pricing**: Free

Espera **2-3 minutos** a que se cree...

### 3. Copiar Credenciales
Cuando esté listo, ve a **Settings → API**:

```bash
# Copia esto a .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
```

---

## ⏱️ **3 Minutos: Crear Tablas**

### 1. Abrir SQL Editor
En Supabase Dashboard → **SQL Editor** → **New Query**

### 2. Copiar & Ejecutar Schema
Abre [schema.sql](../schema.sql) y copia TODO.

Pega en el editor y clickea **Run** (botón azul).

**Espera** a ver "Query succeeded" ✅

### 3. Verificar Tablas
**Table Editor** → Deben aparecer:
- ✅ user_profiles
- ✅ habits
- ✅ habit_completions
- ✅ ai_insights
- ✅ suggested_cards
- ✅ sync_logs

---

## ⏱️ **2 Minutos: Configurar Auth**

En Supabase Dashboard:

### 1. Email Auth
**Authentication → Providers**:
- Email Auth → **Toggle ON** ✅
- Auto confirm new users → **Toggle ON** ✅

### 2. Redirect URLs
**Authentication → URL Configuration**:
```
Site URL: http://localhost:3000
Redirect URLs:
  http://localhost:3000/auth/callback
```

---

## ⏱️ **2 Minutos: Actualizar .env.local**

Edita `.env.local`:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...

# Gemini
VITE_GEMINI_API_KEY=your_gemini_key

# Env
VITE_ENVIRONMENT=development
```

---

## ⏱️ **3 Minutos: Probar Conexión**

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en desarrollo
```bash
npm run dev
```

### 3. Ver en navegador
```
http://localhost:3000
```

Si en consola ves:
```
✅ Supabase conectado correctamente
```

¡**EXCELENTE!** 🎉

Si ves:
```
⚠️ Supabase no está configurado...
```

Revisa que `VITE_SUPABASE_URL` esté en `.env.local`

---

## 🔗 Documentación Completa

| Guía | Objetivo |
|------|----------|
| [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) | Setup detallado |
| [DATABASE_ARCHITECTURE.md](./DATABASE_ARCHITECTURE.md) | Estructura de datos |
| [AUTHENTICATION.md](./AUTHENTICATION.md) | Implementar login/registro |
| [SQL_QUERIES_REFERENCE.md](./SQL_QUERIES_REFERENCE.md) | Queries útiles |

---

## ✅ Checklist Final

- [ ] Proyecto Supabase creado
- [ ] Credenciales en `.env.local`
- [ ] Schema ejecutado (tablas visibles)
- [ ] Email Auth habilitado
- [ ] Redirect URLs configuradas
- [ ] `npm run dev` funciona
- [ ] Consola muestra ✅ Supabase conectado

---

## 🆘 Problemas Comunes

### Error: "Supabase API key not found"
1. Verifica `.env.local`
2. Reinicia: `Ctrl+C` → `npm run dev`

### Error: "Failed to fetch"
1. Ve a **Settings → API → CORS**
2. Agrega: `http://localhost:3000`

### Tablas no aparecen
1. Recarga la página
2. Si persiste, re-ejecuta schema.sql

### "RLS violation error"
Es normal en desarrollo. Crea un usuario:
1. **Authentication → Users → Add user**
2. Email: `test@example.com`
3. Password: `Test123`

---

## 🎯 Próximos Pasos

1. Leer [AUTHENTICATION.md](./AUTHENTICATION.md)
2. Implementar login/registro
3. Crear hábito de prueba
4. Probar sincronización

**¡Ya tienes Supabase listo! 🚀**
