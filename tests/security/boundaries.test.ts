import { expect,it,vi } from 'vitest';
import { readFileSync,readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { register } from '../../packages/sdk-js/webauthn.js';
it('API outage fails closed before authenticator access',async () => {
  vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline')));
  await expect(register('test')).rejects.toThrow('offline'); vi.unstubAllGlobals();
});
it('API denial cannot return registration success',async () => {
  vi.stubGlobal('fetch',vi.fn().mockResolvedValue({ ok: false }));
  await expect(register('test')).rejects.toThrow('Device verification failed'); vi.unstubAllGlobals();
});
it('preserves every tracked UX baseline file byte for byte',() => {
  const manifest = JSON.parse(readFileSync('docs/product/UX-BASELINE-MANIFEST.json','utf8')) as { files: { path: string; gitBlob: string }[] };
  for (const file of manifest.files) expect(execFileSync('git',['hash-object','--',file.path],{ encoding: 'utf8' }).trim()).toBe(file.gitBlob);
  expect(readdirSync('src/components/screens').filter(x => x.endsWith('.tsx'))).toHaveLength(16);
});
