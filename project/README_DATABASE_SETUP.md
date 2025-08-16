# 🗄️ Database Opsætning Guide

## 📋 Tjekliste for Supabase Opsætning

### 1. **Opret Supabase Projekt**
- [ ] Gå til [supabase.com](https://supabase.com)
- [ ] Klik "Start your project"
- [ ] Log ind eller opret konto
- [ ] Klik "New Project"
- [ ] Vælg organisation og indtast projekt navn
- [ ] Vælg region (Europe West for Danmark)
- [ ] Indtast database password (gem det sikkert!)
- [ ] Klik "Create new project"

### 2. **Hent API Keys**
- [ ] Gå til **Settings** > **API** i dit Supabase dashboard
- [ ] Kopier **Project URL**
- [ ] Kopier **anon public** key (IKKE service_role key!)

### 3. **Opdater Environment Variabler**
- [ ] Åbn `.env` filen i dit projekt
- [ ] Erstat `your_supabase_project_url_here` med din Project URL
- [ ] Erstat `your_supabase_anon_key_here` med din anon public key
- [ ] Sæt `EXPO_PUBLIC_DEV_MODE=false`

### 4. **Kør Database Migration**
- [ ] Gå til **SQL Editor** i Supabase dashboard
- [ ] Kopier indholdet fra `supabase/migrations/20250608175020_curly_tower.sql`
- [ ] Indsæt det i SQL editoren
- [ ] Klik **Run** for at oprette tabellerne

### 5. **Verificer Opsætning**
- [ ] Gå til **Table Editor** i Supabase
- [ ] Du skulle nu se disse tabeller:
  - ✅ `profiles`
  - ✅ `friends` 
  - ✅ `groups`
  - ✅ `group_members`
  - ✅ `check_ins`

### 6. **Test i Appen**
- [ ] Genstart din app (`npm run dev`)
- [ ] Gå til `/database-test` i browseren
- [ ] Klik "Test Database"
- [ ] Alle tests skulle være grønne ✅

## 🔧 Fejlfinding

### Problem: "No tables or views"
**Løsning**: Du har ikke kørt database migrationen. Følg trin 4 ovenfor.

### Problem: "Database fejl"
**Løsning**: Tjek at dine API keys er korrekte i `.env` filen.

### Problem: "Manglende environment variabler"
**Løsning**: Sørg for at `.env` filen er korrekt udfyldt og genstart appen.

### Problem: "Connection refused"
**Løsning**: Tjek at dit Supabase projekt er aktivt og ikke paused.

## 📝 Eksempel på korrekt .env fil

```env
EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjU0ODAwMCwiZXhwIjoxOTUyMTI0MDAwfQ.example_key_here
EXPO_PUBLIC_DEV_MODE=false
```

## 🎯 Næste Skridt

Når databasen er sat op:
1. **Test oprettelse af konto** - Prøv at oprette en ny bruger
2. **Tjek profil data** - Gå til profil siden og se om data gemmes
3. **Verificer i Supabase** - Gå til Table Editor og se om data er der

## 🆘 Har du stadig problemer?

Hvis du stadig har problemer efter at have fulgt denne guide:
1. Tjek console logs for fejlmeddelelser
2. Gå til `/database-test` og se hvad der fejler
3. Kontroller at alle environment variabler er sat korrekt
4. Sørg for at database migrationen er kørt succesfuldt

---

**Vigtigt**: Gem aldrig dine API keys i offentlige repositories! `.env` filen er allerede tilføjet til `.gitignore`.