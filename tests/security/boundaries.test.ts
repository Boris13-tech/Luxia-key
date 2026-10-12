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
it('preserves baseline blobs and permits only the documented website security patch',() => {
  const manifest = JSON.parse(readFileSync('docs/product/UX-BASELINE-MANIFEST.json','utf8')) as { commit: string; files: { path: string; gitBlob: string }[] };
  for (const file of manifest.files) {
    expect(execFileSync('git',['rev-parse',`${manifest.commit}:${file.path}`],{ encoding: 'utf8' }).trim()).toBe(file.gitBlob);
    if (file.path === 'src/components/screens/Screen6AccountDetail.tsx') {
      const original = execFileSync('git',['show',`${manifest.commit}:${file.path}`],{ encoding: 'utf8' });
      const expected = original
        .replace("import { BrandIcon } from '../common/BrandIcon';", "import { BrandIcon } from '../common/BrandIcon';\nimport { externalWebsiteURL } from '../../../packages/contracts/external-website';")
        .replace('href={`https://${account.website}`}', 'href={externalWebsiteURL(account.website)}');
      expect(readFileSync(file.path,'utf8').replaceAll('\r\n','\n')).toBe(expected);
    } else {
      expect(execFileSync('git',['hash-object','--',file.path],{ encoding: 'utf8' }).trim()).toBe(file.gitBlob);
    }
  }
  expect(readdirSync('src/components/screens').filter(x => x.endsWith('.tsx'))).toHaveLength(16);
});
