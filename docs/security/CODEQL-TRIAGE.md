# CodeQL triage

Alert 1: js/xss-through-dom, High, src/components/screens/Screen6AccountDetail.tsx:118, observed on foundation SHA 3837e37.
The flagged sink is React's JSX href property with a fixed `https://` prefix. The separate link label is a React text child. There is no innerHTML/document.write/HTML parsing sink on this path; React escapes attribute and text values. Input may select an external website but cannot select javascript: as the scheme or break out of the attribute.
tests/security/prototype-link.test.ts exercises HTML tag injection, attribute injection and javascript: payloads using the real React renderer. This is author triage evidence for a likely false positive, not independent approval. The historical UI remains unchanged; alert is left open for independent reviewer disposition. No CodeQL exclusion or suppression was added.
Do not treat successful analyzer execution as zero findings. This unresolved alert remains an explicit architectural/security review item.
