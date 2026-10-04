const bcrypt = require('bcryptjs');

const password = 'a1d2m3i4n5';

const hash = bcrypt.hashSync(password, 10);

console.log(hash);