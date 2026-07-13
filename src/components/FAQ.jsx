import { useState } from 'react'
import { useInView } from '../hooks/useAnimations'
import './FAQ.css'

const faqs = [
  {
    q: 'How large can my ZIP file be?',
    a: 'UnZip Web supports archives up to 10GB. We use streaming extraction to process large files efficiently without consuming excessive memory.'
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. All file processing happens entirely in your browser. Your files are never uploaded to any server. When you close the tab, all data is gone.'
  },
  {
    q: 'Can I download specific files from an archive?',
    a: 'Yes! You can select individual files, entire folders, or any combination. Download them individually, as folders with preserved structure, or re-packaged as a new ZIP.'
  },
  {
    q: 'What file formats can I preview?',
    a: 'We support previewing images (PNG, JPG, SVG, GIF, WEBP), videos (MP4, WEBM), audio (MP3, WAV), PDFs, text files, JSON, Markdown, and source code with syntax highlighting.'
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. UnZip Web is completely free to use with no registration required. No email, no sign-up, no tracking.'
  },
  {
    q: 'Can I extract multiple ZIP files at once?',
    a: 'Yes! You can upload and manage multiple ZIP archives simultaneously. Each archive gets its own file explorer view.'
  },
  {
    q: 'Does it work on mobile devices?',
    a: 'Yes, UnZip Web is fully responsive and works on phones and tablets. The file explorer adapts to smaller screens while keeping all functionality.'
  },
  {
    q: 'What archive formats are supported?',
    a: 'Currently we support ZIP archives, which is the most widely used compression format. Support for RAR, 7Z, and TAR.GZ is planned for future releases.'
  }
]

export default function FAQ() {
  const [ref, inView] = useInView()
  const [open, setOpen] = useState(null)

  return (
    <section id="faq" ref={ref} className={`faq ${inView ? 'faq--visible' : ''}`}>
      <div className="container">
        <div className="section-header">
          <span className="section-label">FAQ</span>
          <h2 className="section-title">
            Frequently asked<br />
            <span className="gradient-text">questions</span>
          </h2>
        </div>
        <div className="faq__list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq-item ${open === i ? 'faq-item--open' : ''}`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <button className="faq-item__q" onClick={() => setOpen(open === i ? null : i)}>
                <span>{faq.q}</span>
                <svg className="faq-item__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <div className="faq-item__a">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
