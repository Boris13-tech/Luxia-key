import { expect,it } from 'vitest';
import { externalWebsiteURL } from '../../packages/contracts/external-website.js';
it.each(['example.com','example.com/path?view=1','xn--bcher-kva.example','example.com:8443/path'])('allows valid HTTPS website %s',website => {
  expect(externalWebsiteURL(website)).toBe(new URL(`https://${website}`).href);
});
it.each(['','javascript:alert(1)','https://example.com','//example.com','user:pass@example.com','good.example@evil.example',
  'example.com\n','example.com\\evil','example.com/" onclick="alert(1)','<script>alert(1)</script>', 'example.com:99999'])('rejects unsafe or ambiguous website %s',website => {
  expect(externalWebsiteURL(website)).toBeUndefined();
});
