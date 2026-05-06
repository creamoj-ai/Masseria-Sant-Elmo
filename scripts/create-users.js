const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const users = [
  { email: 'itjob.azienda@gmail.com', password: '1234' },
  { email: 'info@masseriasantelmo.com', password: '1234' },
]

async function createUsers() {
  console.log('Creando account in Supabase...\n')

  for (const user of users) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      })

      if (error) {
        console.error(`❌ Errore per ${user.email}:`, error.message)
      } else {
        console.log(`✅ ${user.email} creato con successo`)
        console.log(`   UID: ${data.user.id}\n`)
      }
    } catch (err) {
      console.error(`❌ Errore generico per ${user.email}:`, err.message)
    }
  }

  console.log('Fatto! 🎉')
}

createUsers()
