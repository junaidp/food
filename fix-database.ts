import pool from './server/db.js';

async function fixDatabase() {
  const client = await pool.connect();
  try {
    console.log('🔧 Adding missing columns to users table...');
    
    // Add OTP columns
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR(6);
    `);
    console.log('✅ Added otp_code column');
    
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE;
    `);
    console.log('✅ Added otp_expires_at column');
    
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_received_at TIMESTAMP WITH TIME ZONE;
    `);
    console.log('✅ Added last_received_at column');
    
    // Verify columns exist
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name IN ('otp_code', 'otp_expires_at', 'last_received_at')
      ORDER BY column_name;
    `);
    
    console.log('\n✅ Database fixed! Columns added:');
    result.rows.forEach(row => {
      console.log(`   - ${row.column_name} (${row.data_type})`);
    });
    
    console.log('\n🎉 You can now restart your server and try registration again!');
    
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixDatabase();
