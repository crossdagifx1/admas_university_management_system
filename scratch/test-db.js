import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.aqokbotocmyabbftdyvq:DAGA54321@aws-1-eu-central-1.pooler.supabase.com:5432/postgres";

const client = new Client({ connectionString });

async function main() {
  try {
    console.log("Connecting...");
    await client.connect();
    console.log("Connected successfully!");
    const res = await client.query("SELECT NOW()");
    console.log("Time from DB:", res.rows[0]);
    await client.end();
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
}

main();
