import { expect,it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Screen6AccountDetail } from '../../src/components/screens/Screen6AccountDetail.js';
import { INITIAL_ACCOUNTS } from '../../src/data/mockData.js';
it.each(['\"><script>alert(1)</script>','javascript:alert(1)','evil.example/\" onclick=\"alert(1)'])('prototype website link treats %s as text/HTTPS URL',website => {
  const html = renderToStaticMarkup(createElement(Screen6AccountDetail,{
    account: { ...INITIAL_ACCOUNTS[0],website },onNavigate: () => {},onDeleteAccount: () => {},onTogglePasskey: () => {},
  }));
  expect(html).not.toContain('<script>');
  expect(html).not.toContain('href="javascript:');
  expect(html).not.toContain('" onclick="');
  expect(html).toContain('href="https://');
});
