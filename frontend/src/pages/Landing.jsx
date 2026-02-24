import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const speakers = [
  {
    name: 'Faris Isnawan',
    title: 'Profesional Trainer | CEO @transcemerlangindonesia',
    image: '/images/person_2.png',
  },
  {
    name: 'Bilal Al-Hafiz',
    title: 'Ulama Muda Palestina',
    topic: '',
    image: '/images/person_1.png',
  },

]

function HexPattern() {
  return (
    <div className="absolute inset-0 geometric-bg opacity-30 pointer-events-none" />
  )
}

function StarDivider() {
  return (
    <div className="flex items-center gap-3 justify-center my-2">
      <div className="h-px w-12 sm:w-16 bg-seratif-300" />
      <svg className="w-4 h-4 text-seratif-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
      </svg>
      <div className="h-px w-12 sm:w-16 bg-seratif-300" />
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar transparent />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative hero-gradient min-h-screen flex items-center overflow-hidden">
        <HexPattern />

        {/* Decorative orbs - hidden on mobile */}
        <div className="hidden sm:block absolute top-20 right-10 w-72 h-72 bg-seratif-500 rounded-full opacity-10 blur-3xl" />
        <div className="hidden sm:block absolute bottom-20 left-10 w-96 h-96 bg-sky-accent rounded-full opacity-10 blur-3xl" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:pt-24 sm:pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-2 mb-6 sm:mb-8 animate-fade-in-up text-xs sm:text-sm">
            <div className="w-2 h-2 bg-sky-accent rounded-full animate-pulse" />
            <span className="text-white/90 font-medium tracking-widest uppercase">Pendaftaran Dibuka</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight mb-3 sm:mb-4 animate-fade-in-up animate-delay-100">
            SEMARAK RAMADHAN
            <span className="block text-sky-accent text-2xl sm:text-4xl md:text-5xl lg:text-6xl mt-2">Smkit Ihsanul Fikri 2026</span>
          </h1>

          <p className="text-seratif-200 text-sm sm:text-lg md:text-xl lg:text-2xl font-light mb-2 sm:mb-3 animate-fade-in-up animate-delay-200">
            Kembali ke Ilahi: Langkah Pasti, Penuh Aksi, Ridho Menanti
          </p>

          <StarDivider />

          <p className="text-white/70 text-xs sm:text-sm md:text-base max-w-xl mx-auto mt-3 sm:mt-4 mb-6 sm:mb-10 leading-relaxed animate-fade-in-up animate-delay-300">
            Sebuah event Islami yang menghadirkan pembicara inspiratif untuk membangkitkan semangat generasi muda dalam mendalami nilai-nilai Islam.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center animate-fade-in-up animate-delay-400">
            <Link to="/register"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-seratif-800 font-semibold rounded-xl hover:bg-seratif-50 transition-all duration-200 active:scale-95 text-sm shadow-lg shadow-black/20">
              Daftar Sekarang
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="#about"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-200 active:scale-95 text-sm">
              Pelajari Lebih Lanjut
            </a>
          </div>

          {/* Event quick facts */}
          <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 max-w-2xl mx-auto mt-10 sm:mt-16 animate-fade-in-up animate-delay-500">
            {[
              { label: 'Pembicara', value: '2' },
              { label: 'Sesi', value: '2' },
            ].map(f => (
              <div key={f.label} className="flex-1 max-w-[160px] bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl py-4 sm:py-5 px-4 sm:px-6 border border-white/15">
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">{f.value}</div>
                <div className="text-white/60 text-xs mt-1">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex-col items-center gap-2">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/20 animate-pulse" />
        </div>
      </section>
      {/* ── HERO END──────────────────────────────────────────────────────── */}

      {/* ── ABOUT ────────────────────────────────────────────────────────── */}
      <section id="about" className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <span className="text-seratif-600 text-xs font-semibold tracking-widest uppercase">Tentang Acara</span>
            <h2 className="section-heading mt-2 mb-4 sm:mb-6 leading-tight">
              Menginspirasi Lewat Ilmu dan Iman
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base">
              SERATIF 2026 adalah forum talkshow dan lomba-lomba Islami tahunan yang dirancang untuk menginspirasi generasi muda melalui sesi ceramah, diskusi panel, dan sharing session bersama tokoh-tokoh Islam.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
              Acara ini terbuka untuk siswa dan siswi SMA yang ingin memperdalam wawasan keislaman dalam suasana yang edukatif dan penuh semangat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="btn-primary text-center">Daftar Sekarang</Link>
              <a href="#speakers" className="btn-secondary text-center">Lihat Pembicara</a>
            </div>
          </div>
          <div className="relative">
            <div className="bg-seratif-800 geometric-bg rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center">
              <p className="text-seratif-200 text-base sm:text-lg font-light italic leading-loose">
                "Menuntut ilmu adalah kewajiban bagi setiap Muslim"
              </p>
              <p className="text-seratif-400 text-sm mt-4">— HR. Ibnu Majah</p>
            </div>
          </div>
        </div>
      </section>
      {/* ── ABOUT END─────────────────────────────────────────────────────── */}

      {/* ── SPEAKERS ─────────────────────────────────────────────────────── */}
      <section id="speakers" className="py-14 sm:py-20 px-4 sm:px-6 bg-seratif-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-seratif-600 text-xs font-semibold tracking-widest uppercase">Pembicara</span>
            <h2 className="section-heading mt-2">Speaker Highlights</h2>
            <StarDivider />
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl w-full">
              {speakers.map((s) => (
                <div key={s.name} className="card hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto mb-4 object-cover border-4 border-seratif-100 shadow-md"
                  />
                  <h3 className="font-semibold text-seratif-900 text-base">{s.name}</h3>
                  <p className="text-slate-500 text-xs mt-1">{s.title}</p>
                  {s.topic && (
                    <div className="mt-4 bg-seratif-50 rounded-lg px-3 py-2">
                      <p className="text-seratif-700 text-xs font-medium">"{s.topic}"</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DATE & LOCATION ──────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-seratif-600 text-xs font-semibold tracking-widest uppercase">Detail Acara</span>
            <h2 className="section-heading mt-2">Tanggal & Lokasi</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="card flex items-start gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-seratif-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-seratif-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-seratif-600 uppercase tracking-wide">Tanggal</div>
                <div className="font-display text-lg sm:text-xl font-semibold text-seratif-900 mt-1">Sabtu, 7 Maret 2026</div>
                <div className="text-slate-500 text-sm mt-1">12.00 – 18.00 WIB</div>
              </div>
            </div>
            <div className="card flex items-start gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-seratif-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-seratif-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-semibold text-seratif-600 uppercase tracking-wide">Lokasi</div>
                <div className="font-display text-lg sm:text-xl font-semibold text-seratif-900 mt-1">SMKIT Ihsanul Fikri</div>
                <div className="text-slate-500 text-xs sm:text-sm mt-1">Jl. Blabak - Mendut, Mertan, Paremono, Kec. Mungkid, Kabupaten Magelang, Jawa Tengah 56512</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKETS ──────────────────────────────────────────────────────── */}
      <section id="tickets" className="py-14 sm:py-20 px-4 sm:px-6 bg-seratif-900 geometric-bg">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-sky-accent text-xs font-semibold tracking-widest uppercase">Tiket</span>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Informasi Tiket</h2>
          <p className="text-seratif-300 mb-8 sm:mb-10 max-w-xl mx-auto text-sm sm:text-base">
            Ayo daftar tiket early bird SERATIF 2026, hanya sampai tanggal 1 Maret 2026. Peserta akan menerima e-ticket berupa PDF dengan QR Code unik.
          </p>

          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md mx-auto shadow-2xl shadow-black/30">
            <div className="text-xs font-semibold text-seratif-600 uppercase tracking-widest mb-2">Tiket Early Bird</div>
            <div className="font-display text-4xl sm:text-5xl font-bold text-seratif-900 mb-1">Rp 15.000</div>
            <div className="text-slate-500 text-sm mb-6">per orang</div>
            <ul className="text-sm text-slate-600 text-left space-y-3 mb-8">
              {['Akses penuh semua sesi talkshow', 'E-Ticket PDF dengan QR Code', 'Snack & konsumsi tersedia', 'Sertifikat kehadiran'].map(item => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-seratif-100 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-seratif-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="btn-primary w-full text-center justify-center py-4">
              Daftar & Bayar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ── GALLERY ───────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-seratif-600 text-xs font-semibold tracking-widest uppercase">Galeri</span>
            <h2 className="section-heading mt-2">Event Moments</h2>
            <StarDivider />
            <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-sm sm:text-base">
              Lihat momen-momen indah dari acara SERATIF sebelumnya
            </p>
          </div>

          {/* Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-[250px] md:auto-rows-[200px]">

            {/* Large Image */}
            <div className="md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="/images/958a7220-85ee-4b51-800d-790045bc5495.jpeg"
                alt="Event SERATIF 1"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* Right Top */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="/images/post-rohis.sekatif-sep-09-2024-1.jpeg"
                alt="Event SERATIF 2"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* Right Middle */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="/images/post-rohis.sekatif-sep-09-2024-2.jpeg"
                alt="Event SERATIF 3"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            {/* Bottom 3 */}
            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="/images/post-rohis.sekatif-sep-09-2024-3.jpeg"
                alt="Event SERATIF 4"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="/images/post-rohis.sekatif-sep-09-2024-4.jpeg"
                alt="Event SERATIF 5"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <img
                src="/images/post-rohis.sekatif-sep-09-2024-5.jpeg"
                alt="Event SERATIF 6"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-heading mb-4">
            Siap Bergabung?
          </h2>
          <p className="text-slate-600 mb-8 text-sm sm:text-base">
            Jangan lewatkan kesempatan ini untuk memperkaya diri dengan ilmu dan inspirasi dari para tokoh Islam terbaik.
          </p>
          <Link to="/register" className="btn-primary px-10 py-4 text-base">
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────── */}
      <footer className="bg-seratif-950 text-seratif-400 text-center py-10 sm:py-12 px-6">
        <div className="font-display font-semibold text-white text-lg mb-2">SERATIF 2026</div>
        <div className="text-xs text-seratif-500">© 2026 ROHIS Muhammad Al Fatih. All rights reserved.</div>
      </footer>
    </div>
  )
}
