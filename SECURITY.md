# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Architecture Security

UnZip Web processes all files **entirely in the browser**. No data is ever sent to external servers.

- All ZIP extraction is performed client-side using [JSZip](https://stuk.github.io/jszip/)
- Files exist only in browser memory during the session
- Closing the tab permanently destroys all processed data
- No cookies, tracking, or analytics are collected

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** create a public GitHub issue
2. Email: rajk4435689@gmail.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 7 days
- **Fix Release**: Within 30 days for critical issues

## Scope

The following are in scope:

- XSS vulnerabilities in file handling
- Malicious ZIP files causing client-side issues (zip bombs, path traversal)
- Dependencies with known vulnerabilities
- Information leakage

The following are out of scope:

- Social engineering
- Denial of service on client browsers (intentional large file upload)
- Issues requiring physical access to the device

## Security Best Practices

This project follows these security practices:

- Dependabot automated dependency updates
- No server-side file processing
- Content Security Policy recommendations in deployment
- Subresource Integrity for CDN assets
- Regular dependency audits
