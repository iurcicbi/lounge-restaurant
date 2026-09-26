import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

const BCRYPT_COST = 12;
const MIN_PASSWORD_LENGTH = 12;

async function readPassword() {
  const fromArgs = process.argv[2];
  if (fromArgs) return fromArgs;
  if (!stdin.isTTY) {
    const chunks: Buffer[] = [];
    for await (const chunk of stdin) chunks.push(Buffer.from(chunk));
    return Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '');
  }
  const rl = createInterface({ input: stdin, output: stdout });
  try {
    return await rl.question('Password staff (minimo 12 caratteri): ');
  } finally {
    rl.close();
  }
}

async function main() {
  const password = (await readPassword()).trim();
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`La password deve avere almeno ${MIN_PASSWORD_LENGTH} caratteri.`);
  }
  const hash = await bcrypt.hash(password, BCRYPT_COST);
  process.stdout.write(`${hash}\n`);
  process.stdout.write('Copialo in ADMIN_PASSWORD_HASH. Nessun valore viene scritto su file o log.\n');
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : 'Errore generazione hash'}\n`);
  process.exit(1);
});
