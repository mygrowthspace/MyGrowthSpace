# 🧪 Guía de Testing - My Growth Space

## 📋 Estructura de Carpeta `/test`

```
/test
├── setup.ts                          # Utilities y mocks globales
├── services/
│   └── geminiService.test.ts        # Tests para integración con Gemini
├── types.test.ts                    # Tests de validación de tipos
└── integration/
    └── habitTracking.test.ts        # Tests de flujo completo
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install
```

Las siguientes librerías se instalan automáticamente:
- **Vitest** - Framework de testing rápido y moderno
- **@vitest/ui** - Interfaz visual interactiva
- **jsdom** - Simulador de DOM para tests

### 2. Archivo de Configuración

`vitest.config.ts` está ya configurado en la raíz del proyecto con:
- Soporte para React y JSX
- Entorno jsdom para tests de componentes
- Reportes de coverage automáticos
- Glob patterns para detectar tests automáticamente

## 📝 Escritura de Tests

### Estructura Base de un Test

```typescript
import { describe, it, expect } from 'vitest';

describe('Mi Feature', () => {
  it('debería hacer algo específico', () => {
    // Arrange (preparar)
    const input = { name: 'Test' };
    
    // Act (actuar)
    const result = myFunction(input);
    
    // Assert (verificar)
    expect(result).toBe(true);
  });
});
```

### Patrones de Testing

#### 1. Tests Unitarios
Prueban funciones individuales en aislamiento.

```typescript
describe('Habit Calculations', () => {
  it('debería calcular streak correctamente', () => {
    const habit = mockHabit({ streak: 5, completedDates: ['2026-01-19', '2026-01-18'] });
    expect(habit.streak).toBe(5);
    expect(habit.completedDates).toHaveLength(2);
  });
});
```

#### 2. Tests de Validación de Tipos
Aseguran que los tipos de datos sean correctos.

```typescript
describe('Type Validation', () => {
  it('debería validar categoría de hábito', () => {
    const categories = ['Health', 'Mindset', 'Productivity', 'Finance', 'Social'];
    const habit = mockHabit({ category: 'Health' });
    expect(categories).toContain(habit.category);
  });
});
```

#### 3. Tests de Integración
Prueban cómo interactúan múltiples componentes.

```typescript
describe('Habit Sync', () => {
  it('debería sincronizar hábitos a Supabase', async () => {
    const habits = [mockHabit(), mockHabit()];
    const result = await syncHabitsToSupabase('user-123', habits);
    expect(result).toBe(true);
  });
});
```

#### 4. Tests Async
Para funciones que retornan Promesas.

```typescript
it('debería obtener inspiración diaria', async () => {
  const result = await getDailyInspiration('Health');
  expect(result.quote).toBeDefined();
  expect(result.author).toBeDefined();
});
```

## 🏗️ Mocks y Fixtures

### Usando Mocks Predefinidos

```typescript
import { mockHabit, mockProfile } from '../setup';

describe('User Actions', () => {
  it('debería crear un hábito', () => {
    const habit = mockHabit({ name: 'Custom Habit', streak: 10 });
    expect(habit.name).toBe('Custom Habit');
    expect(habit.streak).toBe(10);
  });
});
```

### Crear Mocks Personalizados

```typescript
const customHabit = mockHabit({
  name: 'Evening Walk',
  category: 'Health',
  frequency: 'daily',
  daysOfWeek: [0, 2, 4], // Lunes, Miércoles, Viernes
});
```

## 🏃 Ejecutar Tests

### Todos los Tests
```bash
npm run test
```

### Modo Watch (Re-ejecuta en cambios)
```bash
npm run test:watch
```

### Interfaz Visual Interactiva
```bash
npm run test:ui
```
Abre un dashboard en `http://localhost:__/__vitest__/` donde puedes:
- Ver tests en tiempo real
- Filtrar por nombre
- Ver cobertura de código
- Re-ejecutar tests individuales

### Reporte de Cobertura
```bash
npm run test:coverage
```
Genera reportes de:
- **Lines**: Líneas de código ejecutadas
- **Functions**: Funciones probadas
- **Branches**: Caminos lógicos cubiertos
- **Statements**: Sentencias ejecutadas

El reporte está disponible en `coverage/index.html`

## 📊 Assertions Comunes

```typescript
// Igualdad
expect(value).toBe(5);                    // Igualdad estricta ===
expect(value).toEqual({ name: 'Test' });  // Comparación profunda

// Existencia
expect(value).toBeDefined();               // No undefined
expect(value).toBeNull();                  // Es null
expect(value).toBeTruthy();                // Es verdadero
expect(value).toBeFalsy();                 // Es falso

// Números
expect(value).toBeGreaterThan(5);         // > 5
expect(value).toBeLessThan(10);           // < 10
expect(value).toBeCloseTo(3.14159, 2);    // Aproximadamente igual

// Strings
expect(text).toContain('substring');      // Contiene texto
expect(text).toMatch(/regex/);            // Coincide con regex

// Arrays y Objetos
expect(array).toHaveLength(3);            // Largo del array
expect(array).toContain('item');          // Contiene elemento
expect(object).toHaveProperty('name');    // Tiene propiedad

// Excepciones
expect(() => { throw new Error(); }).toThrow();
expect(() => { throw new Error('test'); }).toThrow('test');
```

## 🎯 Checklist de Testing

Antes de hacer commit, verifica que todos los tests pasen:

- [ ] **Unit Tests**: Funciones individuales probadas
- [ ] **Type Safety**: Tipos validados
- [ ] **API Integration**: Llamadas a Gemini/Supabase mockadas
- [ ] **Local Storage**: Persistencia probada
- [ ] **Streak Logic**: Cálculo correcto de modas
- [ ] **Habit Filtering**: Filtrado por día funciona
- [ ] **One-time Habits**: Lógica especial probada
- [ ] **Error Handling**: Fallbacks funcionan

### Comando para Verificar Todo

```bash
npm run test:coverage
```

Objetivo de cobertura: **70%** mínimo en:
- Lines
- Functions
- Branches
- Statements

## 🔗 Integración con CI/CD

Para GitHub Actions, agregar este workflow (`.github/workflows/test.yml`):

```yaml
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

## 🐛 Debugging de Tests

### Ejecutar un Test Específico

```bash
npm run test -- geminiService.test.ts
```

### Ejecutar Tests que Coincidan con Patrón

```bash
npm run test -- --grep "streak"
```

### Modo Debug (Con breakpoints)

```bash
node --inspect-brk ./node_modules/vitest/vitest.mjs run
```

## 📚 Recursos Útiles

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Jest Matchers (compatible con Vitest)](https://jestjs.io/docs/expect)

## ✅ Mejores Prácticas

1. **Una cosa por test**: Un test = una funcionalidad
2. **Nombres descriptivos**: `it('debería...')` es claro
3. **No repetir setup**: Usa `beforeEach()` para reutilizar código
4. **Mocks determinísticos**: Evita dependencias externas
5. **Tests rápidos**: Mantén los tests bajo 1 segundo
6. **No probes detalles internos**: Prueba comportamiento externo
7. **DRY en tests**: Crea helpers para código repetido

## 🚨 Errores Comunes

| Error | Solución |
|-------|----------|
| `ReferenceError: describe is not defined` | Agrega `import { describe, it } from 'vitest'` |
| Tests lentos | Mockea llamadas externas (API, BD) |
| Tests flaky | Evita `setTimeout`, usa `vi.useFakeTimers()` |
| Coverage bajo | Agrega tests para ramas no cubiertas |

---

**¡Ahora a escribir tests! 🚀**
