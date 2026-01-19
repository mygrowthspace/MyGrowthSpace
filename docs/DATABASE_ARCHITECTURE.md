# 📊 Arquitectura de Base de Datos

## 🗄️ Diagrama Entidad-Relación (ER)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  auth.users (Supabase Auth - Builtin)                               │
│  ├── id (UUID)                                                      │
│  ├── email                                                          │
│  ├── password_hash                                                  │
│  └── created_at                                                     │
│                │                                                     │
│                │ REFERENCES (one-to-one)                            │
│                ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │  user_profiles                                          │        │
│  ├──────────────────────────────────────────────────────────│        │
│  │ id (PK)                        UUID                     │        │
│  │ user_id (FK)                   → auth.users             │        │
│  │ name                           VARCHAR                  │        │
│  │ email                          VARCHAR (unique)         │        │
│  │ avatar_url                     TEXT                     │        │
│  │ identity_statement             TEXT                     │        │
│  │ focus_areas                    TEXT[]                   │        │
│  │ narrative                      TEXT                     │        │
│  │ is_premium                     BOOLEAN                  │        │
│  │ premium_until                  TIMESTAMP                │        │
│  │ created_at / updated_at        TIMESTAMP                │        │
│  └─────────────────────────────────────────────────────────┘        │
│                │                                                     │
│                │ (one user has many habits)                         │
│                ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │  habits                                                 │        │
│  ├──────────────────────────────────────────────────────────│        │
│  │ id (PK)                        UUID                     │        │
│  │ user_id (FK)                   → auth.users             │        │
│  │ name                           VARCHAR                  │        │
│  │ description                    TEXT                     │        │
│  │ category                       VARCHAR                  │        │
│  │ frequency                      VARCHAR                  │        │
│  │ days_of_week                   INTEGER[]                │        │
│  │ time_of_day                    TIME                     │        │
│  │ start_date / end_date          DATE                     │        │
│  │ is_one_time                    BOOLEAN                  │        │
│  │ specific_dates                 DATE[]                   │        │
│  │ streak                         INTEGER                  │        │
│  │ last_completed_date            DATE                     │        │
│  │ total_completions              INTEGER                  │        │
│  │ created_at / updated_at        TIMESTAMP                │        │
│  └─────────────────────────────────────────────────────────┘        │
│                │                                                     │
│                │ (one habit has many completions)                   │
│                ▼                                                     │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │  habit_completions                                      │        │
│  ├──────────────────────────────────────────────────────────│        │
│  │ id (PK)                        UUID                     │        │
│  │ user_id (FK)                   → auth.users             │        │
│  │ habit_id (FK)                  → habits                 │        │
│  │ completed_date (UNIQUE pair)   DATE                     │        │
│  │ completed_at                   TIMESTAMP                │        │
│  │ notes                          TEXT                     │        │
│  │ created_at                     TIMESTAMP                │        │
│  └─────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │  ai_insights                                            │        │
│  ├──────────────────────────────────────────────────────────│        │
│  │ id (PK)                        UUID                     │        │
│  │ user_id (FK)                   → auth.users             │        │
│  │ insight_type                   VARCHAR                  │        │
│  │ title                          VARCHAR                  │        │
│  │ description                    TEXT                     │        │
│  │ action_step                    TEXT                     │        │
│  │ habit_id (optional FK)         → habits                 │        │
│  │ created_at                     TIMESTAMP                │        │
│  │ expires_at                     TIMESTAMP                │        │
│  └─────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │  suggested_cards                                        │        │
│  ├──────────────────────────────────────────────────────────│        │
│  │ id (PK)                        UUID                     │        │
│  │ user_id (FK)                   → auth.users             │        │
│  │ title                          VARCHAR                  │        │
│  │ description                    TEXT                     │        │
│  │ card_type                      VARCHAR                  │        │
│  │ action_label                   VARCHAR                  │        │
│  │ suggested_action               JSONB                    │        │
│  │ is_dismissed                   BOOLEAN                  │        │
│  │ dismissed_at                   TIMESTAMP                │        │
│  │ created_at / expires_at        TIMESTAMP                │        │
│  └─────────────────────────────────────────────────────────┘        │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │  sync_logs                                              │        │
│  ├──────────────────────────────────────────────────────────│        │
│  │ id (PK)                        UUID                     │        │
│  │ user_id (FK)                   → auth.users             │        │
│  │ sync_type                      VARCHAR                  │        │
│  │ entity_type                    VARCHAR                  │        │
│  │ entity_id                      UUID                     │        │
│  │ status                         VARCHAR                  │        │
│  │ error_message                  TEXT                     │        │
│  │ created_at / updated_at        TIMESTAMP                │        │
│  └─────────────────────────────────────────────────────────┘        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Tablas Principales

### 1. **user_profiles** (Información del Usuario)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Referencia a auth.users (FK) |
| `name` | VARCHAR | Nombre del usuario |
| `email` | VARCHAR | Email único |
| `avatar_url` | TEXT | URL de foto de perfil |
| `identity_statement` | TEXT | Declaración de identidad (ej: "Soy disciplinado") |
| `focus_areas` | TEXT[] | Array: ['Health', 'Mindset', 'Productivity'] |
| `narrative` | TEXT | Historias personales |
| `is_premium` | BOOLEAN | ¿Es usuario premium? |
| `premium_until` | TIMESTAMP | Fecha de expiración premium |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

**Índices**: `user_id`, `email`

---

### 2. **habits** (Hábitos del Usuario)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuario dueño (FK) |
| `name` | VARCHAR | Nombre: "Morning Meditation" |
| `description` | TEXT | Detalles del hábito |
| `category` | VARCHAR | Health/Mindset/Productivity/Finance/Social |
| `frequency` | VARCHAR | 'daily' o 'weekly' |
| `days_of_week` | INTEGER[] | [0,1,2,3,4,5,6] (0=Dom, 6=Sab) |
| `time_of_day` | TIME | '06:30' (HH:mm) |
| `start_date` | DATE | Cuándo comienza |
| `end_date` | DATE | Cuándo termina (NULL = indefinido) |
| `is_one_time` | BOOLEAN | ¿Es hábito de una sola vez? |
| `specific_dates` | DATE[] | Fechas para one-time |
| `streak` | INTEGER | Racha actual (# de días) |
| `last_completed_date` | DATE | Última vez completado |
| `total_completions` | INTEGER | Total historico |
| `created_at` | TIMESTAMP | Fecha creación |
| `updated_at` | TIMESTAMP | Última actualización |

**Índices**: `user_id`, `category`, `created_at`

---

### 3. **habit_completions** (Registro de Completiciones)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuario (FK) |
| `habit_id` | UUID | Hábito completado (FK) |
| `completed_date` | DATE | Fecha completada (YYYY-MM-DD) |
| `completed_at` | TIMESTAMP | Cuándo se registró |
| `notes` | TEXT | Notas opcionales |
| `created_at` | TIMESTAMP | Timestamp creación |

**Constraint**: `UNIQUE(habit_id, completed_date)` - Un hábito solo puede completarse una vez por día

**Índices**: `user_id`, `habit_id`, `completed_date`

---

### 4. **ai_insights** (Análisis de Gemini)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuario (FK) |
| `insight_type` | VARCHAR | daily_inspiration/progress_analysis/habit_suggestion |
| `title` | VARCHAR | Título del insight |
| `description` | TEXT | Contenido del análisis |
| `action_step` | TEXT | Acción recomendada |
| `habit_id` | UUID | Hábito relacionado (optional) |
| `created_at` | TIMESTAMP | Fecha creación |
| `expires_at` | TIMESTAMP | Cuándo expira (para inspiración diaria) |

**Índices**: `user_id`, `created_at`

---

### 5. **suggested_cards** (Recomendaciones AI)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuario (FK) |
| `title` | VARCHAR | Título de sugerencia |
| `description` | TEXT | Descripción |
| `card_type` | VARCHAR | optimization/schedule/priority |
| `action_label` | VARCHAR | Texto del botón |
| `suggested_action` | JSONB | `{type: 'create_habit', payload: {...}}` |
| `is_dismissed` | BOOLEAN | ¿Usuario rechazó? |
| `dismissed_at` | TIMESTAMP | Cuándo rechazó |
| `created_at` | TIMESTAMP | Fecha creación |
| `expires_at` | TIMESTAMP | Fecha expiración |

**Índices**: `user_id`, `created_at`

---

### 6. **sync_logs** (Historial de Sincronización)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `user_id` | UUID | Usuario (FK) |
| `sync_type` | VARCHAR | upload/download/conflict |
| `entity_type` | VARCHAR | habit/profile/completion |
| `entity_id` | UUID | ID de lo que se sincronizó |
| `status` | VARCHAR | success/pending/failed |
| `error_message` | TEXT | Si hubo error |
| `created_at` | TIMESTAMP | Fecha creación |
| `updated_at` | TIMESTAMP | Última actualización |

---

## 🔒 Row Level Security (RLS)

Todas las tablas tienen RLS habilitado:

```sql
-- Patrón general
CREATE POLICY "users_can_view_their_data" ON table_name
  FOR SELECT
  USING (auth.uid() = user_id);
```

Esto asegura que:
- ✅ Usuario A solo ve sus datos
- ✅ Usuario B no puede acceder a datos de A
- ✅ Imposible hacer queries que expongan otros usuarios
- ✅ Seguro incluso si alguien obtiene `anon_key`

---

## 📈 Vistas Útiles

### `v_current_streaks` - Todas las rachas actuales

```sql
SELECT * FROM v_current_streaks
WHERE user_id = 'user-id'
ORDER BY streak DESC;
```

Retorna:
- Nombre del hábito
- Racha actual
- Última completición
- Estado (at-risk, due-today, completed-today)

### `v_weekly_stats` - Estadísticas semanales

```sql
SELECT * FROM v_weekly_stats
WHERE user_id = 'user-id';
```

Retorna:
- Completiciones esta semana
- Porcentaje de éxito
- Comparación contra objetivo

---

## 💾 Ejemplos de Operaciones CRUD

### CREATE - Crear un hábito

```typescript
const { data, error } = await supabase
  .from('habits')
  .insert({
    user_id: user.id,
    name: 'Morning Meditation',
    category: 'Mindset',
    frequency: 'daily',
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    time_of_day: '06:30',
    description: 'Meditación de 10 minutos',
    streak: 0,
  })
  .select()
  .single();
```

### READ - Obtener hábitos del usuario

```typescript
const { data: habits, error } = await supabase
  .from('habits')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false });
```

### UPDATE - Actualizar racha

```typescript
const { data, error } = await supabase
  .from('habits')
  .update({
    streak: newStreak,
    last_completed_date: today,
  })
  .eq('id', habitId)
  .eq('user_id', user.id);
```

### DELETE - Eliminar hábito

```typescript
const { error } = await supabase
  .from('habits')
  .delete()
  .eq('id', habitId)
  .eq('user_id', user.id);
```

---

## 🎯 Búsquedas Comunes

### Hábitos debidos hoy

```typescript
const today = new Date();
const dayOfWeek = today.getDay(); // 0-6

const { data } = await supabase
  .from('habits')
  .select('*')
  .eq('user_id', user.id)
  .contains('days_of_week', [dayOfWeek])
  .is('end_date', null);
```

### Hábitos en riesgo (sin completar últimos 3 días)

```typescript
const { data } = await supabase
  .from('habits')
  .select('*')
  .eq('user_id', user.id)
  .lt('last_completed_date', threeDaysAgo);
```

### Insights no expirados

```typescript
const { data } = await supabase
  .from('ai_insights')
  .select('*')
  .eq('user_id', user.id)
  .gt('expires_at', now)
  .order('created_at', { ascending: false });
```

---

## 📊 Límites y Consideraciones

### Free Tier Supabase
- **Storage**: 500 MB
- **Database**: 500 MB
- **Queries**: 50,000/mes
- **Realtime**: 2 conexiones simultáneas

### Escalamiento Futuro
- Índices están optimizados para queries comunes
- Particionamiento por `user_id` si crece a millones
- Archivado de datos antiguos (completaciones de >1 año)

---

## ✅ Checklist de BD

- [ ] Schema ejecutado en Supabase
- [ ] Todas las tablas visibles en Table Editor
- [ ] RLS habilitado en todas las tablas
- [ ] Índices creados
- [ ] Triggers funcionando
- [ ] Vistas disponibles
- [ ] Usuario de prueba con datos

¡Base de datos lista! 🚀
