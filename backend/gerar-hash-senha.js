import bcrypt from 'bcryptjs';

// Gerar hash para a senha configurada no Railway
const senha = 'Supersuti[1]';
const hash = bcrypt.hashSync(senha, 10);

console.log('========================================');
console.log('HASH GERADO PARA SENHA: ' + senha);
console.log('========================================');
console.log(hash);
console.log('========================================');
console.log('\nSQL para inserir no Railway:');
console.log('========================================\n');
console.log(`INSERT INTO users (name, email, password, role, active)
VALUES (
  'Administrador',
  'ti.services@lgservices.com.br',
  '${hash}',
  'admin',
  true
)
ON CONFLICT (email) DO NOTHING;`);
console.log('\n========================================\n');
