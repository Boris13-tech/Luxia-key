import { cp } from 'node:fs/promises';
await cp('services/api/migrations','dist/api/services/api/migrations',{ recursive: true });
