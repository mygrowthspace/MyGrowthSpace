# 🔧 Guía de Configuración de Supabase

## 📋 Requisitos Previos

- Cuenta en [Supabase](https://supabase.com) (gratis)
- Acceso al proyecto de GitHub (naiam-studio/MyGrowthSpace)
- Archivo `.env.local` preparado

---

## 🚀 Paso 1: Crear Proyecto en Supabase

### 1.1 Crear Nueva Organización/Proyecto

1. Ve a [app.supabase.com](https://app.supabase.com)
2. Haz clic en **"New Project"**
3. Configura:
   - **Name**: `my-growth-space` (o tu preferencia)
   - **Database Password**: Guarda en lugar seguro (1Ppass, LastPass, etc.)
   - **Region**: Más cercana a tus usuarios (Recomendado: `us-east-1` si estás en US)
   - **Pricing**: Free tier (suficiente para desarrollo)

4. Espera a que se provisione (2-3 minutos)

### 1.2 Obtener Credenciales

Una vez creado, ve a **Settings → API**:

- **Project URL**: `https://xxxxx.supabase.co` → `VITE_SUPABASE_URL`
- **Anon Key** (public key): → `VITE_SUPABASE_ANON_KEY`
- **Service Role Key**: Guarda en lugar seguro (para backend)

---

## 🗄️ Paso 2: Crear Schema de Base de Datos

### 2.1 Ejecutar SQL Schema

1. En Supabase Dashboard, ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia TODO el contenido del archivo [schema.sql](../schema.sql)
4. Pega en el editor
5. Haz clic en **Run** (botón azul)

**Espera a que se complete** ✅ (Debe decir "Query succeeded")

### 2.2 Verificar Tablas Creadas

Ve a **Table Editor** y confirma que existen:
- ✅ `user_profiles`
- ✅ `habits`
- ✅ `habit_completions`
- ✅ `ai_insights`
- ✅ `suggested_cards`
- ✅ `sync_logs`

---

## 🔐 Paso 3: Configurar Autenticación

### 3.1 Habilitar Métodos de Autenticación

En **Authentication → Providers**:

#### Opción A: Email/Contraseña (Recomendado para desarrollo)
1. Email Auth → Habilitado ✅
2. Confirm email: Deshabilitado (para desarrollo fácil)
3. Auto confirm new users: Habilitado ✅

#### Opción B: OAuth (Producción)
1. **Google OAuth**:
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un proyecto
   - Ve a APIs & Services → Credenciales
   - Crea OAuth 2.0 Client ID (Web)
   - Obtén `Client ID` y `Client Secret`
   - En Supabase, va a Auth → Google → Pega credenciales

2. **GitHub OAuth**:
   - Ve a GitHub Settings → Developer settings → OAuth Apps
   - New OAuth App:
     - Homepage: `https://mygrowthspace.dev`
     - Authorization callback: `https://xxxxx.supabase.co/auth/v1/callback`
   - Copia `Client ID` y `Client Secret` en Supabase

### 3.2 Configurar URLs de Redirección

En **Authentication → URL Configuration**:

```
Site URL: http://localhost:3000
Redirect URLs:
  - http://localhost:3000/auth/callback
  - https://mygrowthspace.dev/auth/callback
  - https://staging.mygrowthspace.dev/auth/callback
```

---

## 📝 Paso 4: Actualizar Variables de Entorno

Edita `.env.local`:

```bash
# Obtén de Supabase → Settings → API
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Gemini (ya debería estar)
VITE_GEMINI_API_KEY=your_gemini_key_here

# Entorno
VITE_ENVIRONMENT=development
```

---

## 🔌 Paso 5: Conectar desde la Aplicación

### 5.1 Verificar Cliente Supabase

El archivo `services/supabaseClient.ts` ya está listo. Verifica que:
- ✅ Importa `@supabase/supabase-js`
- ✅ Lee variables de `.env.local`
- ✅ Maneja caso sin Supabase (fallback localStorage)

### 5.2 Test de Conexión

En terminal:

```bash
npm run dev
```

Abre la aplicación en `http://localhost:3000`

Si ves mensajes en consola como:
```
✅ Supabase conectado correctamente
```

¡Excelente! Si ves:
```
⚠️ Supabase no está configurado. Usando localStorage...
```

Verifica `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en `.env.local`

---

## 🧪 Paso 6: Probar Funcionalidades

### 6.1 Crear Usuario de Prueba

1. En Supabase Dashboard, ve a **Authentication → Users**
2. Haz clic en **Add user**
3. Email: `test@example.com`
4. Password: `TestPassword123`
5. Haz clic en **Create user**

### 6.2 Probar en la Aplicación

1. En tu app, ve a Onboarding
2. Haz clic en **Sign Up**
3. Usa: `test@example.com` / `TestPassword123`
4. Completa el perfil (nombre, identity statement, focus areas)
5. Crea un hábito
6. Marca como completado

### 6.3 Verificar en BD

En Supabase → Table Editor:

- **user_profiles**: Debe haber tu usuario
- **habits**: Debe estar el hábito creado
- **habit_completions**: Debe estar la completición

---

## 🔒 Paso 7: Row Level Security (RLS)

RLS ya está configurado en `schema.sql`. Esto significa:

✅ Los usuarios **solo pueden ver sus propios datos**  
✅ No pueden ver datos de otros usuarios  
✅ Seguro por defecto

Para verificar:

1. Ve a **Authentication → Policies**
2. Debe haber políticas para cada tabla
3. Todas comienzan con `auth.uid() = user_id`

---

## 📊 Paso 8: Monitorar y Mantener

### Verificar Cuota (Free Tier)

En **Settings → Usage**:
- ✅ Storage: 500 MB
- ✅ Database: 500 MB
- ✅ Monthly active users: Ilimitado
- ✅ API requests: 50,000/mes

Para monitoreo continuo:
```
Transactions/mes: FREE TIER
Realtime connections: 2
Backups: 7 días
```

### Backups Automáticos

Supabase hace backups diarios (Free tier: 7 días de retención)

Para backup manual:
1. Ve a **Settings → Backups**
2. Haz clic en **Create backup**

### Logs de BD

Para debugging:
1. Ve a **Database → Logs**
2. Filtra por errors o queries lentas

---

## 🚨 Troubleshooting

### Error: "Supabase API key not found"
```
✅ Solución: Verifica que VITE_SUPABASE_ANON_KEY esté en .env.local
✅ Restart: npm run dev
```

### Error: "Failed to execute 'fetch' on 'Window'"
```
✅ Solución: CORS. Ve a Settings → API → CORS Allow List
✅ Agrega: http://localhost:3000, https://tudominio.com
```

### RLS Policy Error: "new row violates row-level security"
```
✅ Solución: Asegúrate de pasar user_id en INSERT
✅ Ejemplo: { ...data, user_id: auth.user().id }
```

### Datos no syncan desde localStorage
```
✅ Solución: Usa syncHabitsToSupabase() en App.tsx
✅ Llamar después de cambios locales
```

---

## 🎯 Checklist de Configuración

- [ ] Proyecto Supabase creado
- [ ] URL y API Key copiados a `.env.local`
- [ ] SQL schema ejecutado (todas las tablas existen)
- [ ] Autenticación configurada (Email o OAuth)
- [ ] URLs de redirección configuradas
- [ ] Test de conexión pasado
- [ ] Usuario de prueba creado
- [ ] Usuario apareció en `user_profiles`
- [ ] Hábito de prueba sincronizado a BD
- [ ] RLS verificado
- [ ] Logs monitoreados

---

## 📚 Recursos Útiles

- [Documentación Supabase](https://supabase.com/docs)
- [Supabase Auth Reference](https://supabase.com/docs/reference/javascript/auth-signup)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Row Level Security Explained](https://supabase.com/docs/guides/auth/row-level-security)

---

## 🔄 Próximos Pasos

1. **Implementar Auth UI** - Login/Register en la app
2. **Sincronización** - Agregar botón "Sync to Cloud"
3. **Realtime** - Escuchar cambios en tiempo real
4. **Storage** - Guardar avatares en Supabase Storage
5. **Funciones Edge** - Para procesamiento en servidor

¡Supabase está listo! 🎉
