"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Bath, BedDouble, Check,
  ChevronDown, Compass, Heart, MapPin, Menu, MessageCircle, MoveUpRight, Search,
  Square, X,
} from "lucide-react";
import { formatPrice, properties, whatsappUrl, type Property } from "@/lib/properties";

const VideoTour = dynamic(() => import("@/components/video-tour"), {
  ssr: false,
  loading: () => <div className="tour-placeholder">Preparing your tour...</div>,
});

function Logo({ dark = false }: { dark?: boolean }) {
  return <a className={`logo ${dark ? "logo-dark" : ""}`} href="#home" aria-label="Emlak home"><span className="logo-mark"><i /><i /><i /></span><span>emlak<span className="logo-dot">.</span></span></a>;
}

function PropertyCard({ property, onOpen }: { property: Property; onOpen: (property: Property) => void }) {
  const [saved, setSaved] = useState(false);
  return (
    <article className="property-card">
      <div className="card-image">
        <img src={property.image} alt={`${property.title} interior`} loading="lazy" />
        <div className="card-label">{property.label}</div>
        <button className={`save-button ${saved ? "saved" : ""}`} aria-label={saved ? `Remove ${property.title} from favorites` : `Save ${property.title} to favorites`} aria-pressed={saved} onClick={() => setSaved(!saved)}><Heart size={18} fill={saved ? "currentColor" : "none"} /></button>
        <button className="tour-badge" onClick={() => onOpen(property)}><span className="tour-cube">◇</span> VIDEO WALKTHROUGH <ArrowUpRight size={14} /></button>
      </div>
      <div className="card-info">
        <div className="card-topline"><span><MapPin size={14} /> {property.neighborhood}, {property.location}</span><span className="card-number">0{properties.indexOf(property) + 1}</span></div>
        <div className="card-title-row"><button onClick={() => onOpen(property)}>{property.title}</button><span>{formatPrice(property.price)}</span></div>
        <div className="card-bottom"><div className="specs"><span><BedDouble size={17} /> {property.bedrooms} beds</span><span><Bath size={17} /> {property.bathrooms} baths</span><span><Square size={15} /> {property.area} m²</span></div><button className="card-arrow" aria-label={`View ${property.title}`} onClick={() => onOpen(property)}><ArrowUpRight size={19} /></button></div>
      </div>
    </article>
  );
}

function PropertyModal({ property, onClose }: { property: Property; onClose: () => void }) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" && !document.fullscreenElement) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); };
  }, [onClose]);
  const message = `Hello, I am interested in viewing the property ${property.title} listed for ${formatPrice(property.price)}. When can we schedule a visit?`;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="property-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button className="modal-close" onClick={onClose} aria-label="Close property details"><X size={20} /></button>
        <div className="modal-main">
          <div className="modal-heading"><div><span className="eyebrow"><span /> THE VIRTUAL EXPERIENCE</span><h2 id="modal-title">{property.title}</h2><p><MapPin size={15} /> {property.neighborhood}, {property.location}</p></div><div className="modal-price">{formatPrice(property.price)}</div></div>
          <VideoTour poster={property.image} />
          <div className="modal-description"><div><span className="eyebrow"><span /> ABOUT THIS HOME</span><h3>Made for living beautifully.</h3><p>{property.description}</p></div><div className="feature-list">{property.features.map((feature) => <span key={feature}><Check size={14} /> {feature}</span>)}</div></div>
        </div>
        <aside className="modal-sidebar">
          <span className="eyebrow"><span /> THE DETAILS</span>
          <h3>A closer look</h3>
          <div className="detail-row"><span>Bedrooms</span><strong>{property.bedrooms}</strong></div>
          <div className="detail-row"><span>Bathrooms</span><strong>{property.bathrooms}</strong></div>
          <div className="detail-row"><span>Living area</span><strong>{property.area} m²</strong></div>
          <div className="floor-title">FLOOR PLAN <span>CONCEPT</span></div>
          <div className="floor-plan" aria-label="Illustrative floor plan, not to scale"><div>LIVING</div><div>KITCHEN</div><div>BEDROOM</div><div>BATH</div></div>
          <p className="floor-note">Illustrative layout, not to scale.</p>
          <div className="agent"><div className="agent-avatar">E</div><div><strong>Your Emlak advisor</strong><span>Here to help you find home</span></div></div>
          <a className="whatsapp-button" href={whatsappUrl(message)} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Inquire via WhatsApp <ArrowUpRight size={16} /></a>
        </aside>
      </section>
    </div>
  );
}

export function HomePage() {
  const [location, setLocation] = useState("all");
  const [price, setPrice] = useState("all");
  const [beds, setBeds] = useState("all");
  const [filters, setFilters] = useState({ location: "all", price: "all", beds: "all" });
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const filtered = properties.filter((property) => {
    const locationMatch = filters.location === "all" || property.location === filters.location;
    const priceMatch = filters.price === "all" || (filters.price === "under2" ? property.price < 2000000 : filters.price === "2to3" ? property.price >= 2000000 && property.price <= 3000000 : property.price > 3000000);
    const bedsMatch = filters.beds === "all" || property.bedrooms >= Number(filters.beds);
    return locationMatch && priceMatch && bedsMatch;
  });
  function searchProperties(event: React.FormEvent) {
    event.preventDefault();
    setFilters({ location, price, beds });
    document.getElementById("properties")?.scrollIntoView({ behavior: "smooth" });
  }
  function contact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = `Hello Emlak, my name is ${form.get("name")} (${form.get("email")}). ${form.get("message")}`;
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }
  return (
    <main id="home">
      <section className="hero">
        <video className="hero-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2000&q=85"><source src="/videos/house.mp4" type="video/mp4" /></video>
        <div className="hero-overlay" />
        <header className="header page-padding">
          <Logo />
          <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Main navigation">
            <a href="#properties" onClick={() => setMenuOpen(false)}>Properties</a><a href="#about" onClick={() => setMenuOpen(false)}>Our story</a><a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          </nav>
          <a href="#contact" className="header-contact">LET&apos;S TALK <ArrowUpRight size={16} /></a>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        </header>
        <div className="hero-content page-padding">
          <div className="hero-kicker"><span className="kicker-line" /> A DIFFERENT WAY TO FIND HOME</div>
          <h1>Spaces for a life<br /><em>well lived.</em></h1>
          <p>Exceptional homes, thoughtful spaces, and a place<br className="desktop-break" /> to make your own. Let&apos;s find what moves you.</p>
          <a href="#properties" className="hero-link">EXPLORE OUR PROPERTIES <span><ArrowDownRight size={19} /></span></a>
        </div>
        <div className="hero-bottom page-padding"><div><span>01</span><span className="hero-progress"><i /></span><span>04</span></div><span className="hero-bottom-right">CURATED HOMES. EXTRAORDINARY LIVING.</span><a href="#properties" aria-label="Scroll to properties"><ArrowDown size={18} /></a></div>
      </section>

      <div className="search-container page-padding">
        <form className="search-bar" onSubmit={searchProperties}>
          <div className="search-intro"><span className="search-icon"><Search size={20} /></span><div><strong>Find your place</strong><small>Let&apos;s make it personal.</small></div></div>
          <label><span>LOCATION</span><div><select value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">Where to?</option><option value="Bissau">Bissau</option><option value="Bijagós">Bijagós</option></select><ChevronDown size={15} /></div></label>
          <label><span>PRICE RANGE</span><div><select value={price} onChange={(event) => setPrice(event.target.value)}><option value="all">Any price</option><option value="under2">Under $2M</option><option value="2to3">$2M – $3M</option><option value="over3">Over $3M</option></select><ChevronDown size={15} /></div></label>
          <label><span>BEDROOMS</span><div><select value={beds} onChange={(event) => setBeds(event.target.value)}><option value="all">Any beds</option><option value="3">3+ beds</option><option value="4">4+ beds</option><option value="5">5+ beds</option></select><ChevronDown size={15} /></div></label>
          <button className="search-button" type="submit">SEARCH <ArrowRight size={18} /></button>
        </form>
      </div>

      <section className="listings section-padding page-padding" id="properties">
        <div className="section-heading"><div><span className="eyebrow"><span /> THE COLLECTION</span><h2>Homes with <em>something more.</em></h2><p>More than a place to live. Discover spaces to belong.</p></div><div className="heading-side"><span>THOUGHTFULLY SELECTED<br />FOR THE WAY YOU LIVE.</span><a href="#collection">VIEW THE COLLECTION <ArrowUpRight size={17} /></a></div></div>
        <div className="collection-bar" id="collection"><span>EXPLORE PROPERTIES <i>({String(filtered.length).padStart(2, "0")})</i></span><span>CURATED FOR YOU <span className="tiny-line" /></span></div>
        {filtered.length ? <div className="property-grid">{filtered.map((property) => <PropertyCard key={property.id} property={property} onOpen={setActiveProperty} />)}</div> : <div className="empty-state"><h3>No homes found just yet.</h3><p>Try adjusting your search to see more of the collection.</p><button onClick={() => { setLocation("all"); setPrice("all"); setBeds("all"); setFilters({ location: "all", price: "all", beds: "all" }); }}>Clear filters <ArrowRight size={16} /></button></div>}
      </section>

      <section className="about page-padding" id="about">
        <div className="about-image"><img src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=85" alt="Warm, thoughtfully designed living room" loading="lazy" /><div className="about-image-label"><span>THE ART OF</span><strong>living well.</strong></div></div>
        <div className="about-copy"><span className="eyebrow"><span /> A LITTLE ABOUT US</span><h2>Finding home is<br /><em>personal.</em></h2><p>We believe a home is more than an address. It&apos;s the morning light, the conversations around the table, and the feeling you get when you walk through the door.</p><p>At Emlak, we bring a thoughtful, human touch to finding a place that feels unmistakably yours.</p><a href="#contact" className="text-link">GET TO KNOW US <span><ArrowUpRight size={17} /></span></a><div className="about-signature">A more considered way to move. <span>✳</span></div></div>
      </section>

      <section className="contact section-padding page-padding" id="contact">
        <div className="contact-copy"><span className="eyebrow"><span /> START A CONVERSATION</span><h2>Let&apos;s find your<br /><em>place in the world.</em></h2><p>Tell us what you&apos;re looking for. We&apos;re here to help you take the next step, at your own pace.</p><div className="office"><MapPin size={18} /><div><strong>VISIT OUR OFFICE</strong><span>Bissau, Guinea-Bissau</span><small>By appointment</small></div></div><a href={whatsappUrl("Hello, I would like to know more about Emlak properties.")} target="_blank" rel="noreferrer" className="contact-number">+245 956 153 464 <ArrowUpRight size={17} /></a></div>
        <form className="contact-form" onSubmit={contact}><span>THE FIRST STEP TO SOMEWHERE SPECIAL.</span><label>Your name<input name="name" required placeholder="How should we call you?" /></label><label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label><label>How can we help?<textarea name="message" required rows={2} placeholder="Tell us a little about what you're looking for..." /></label><button type="submit">SEND VIA WHATSAPP <ArrowUpRight size={18} /></button><small>Your message will open in WhatsApp. No information is stored on this site.</small></form>
      </section>
      <footer className="footer page-padding"><div className="footer-top"><Logo /><p>Good spaces.<br /><em>Better living.</em></p><div><a href="#properties">Properties</a><a href="#about">Our story</a><a href="#contact">Contact</a></div><a className="footer-up" href="#home" aria-label="Back to top"><MoveUpRight size={20} /></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} EMLAK. ALL RIGHTS RESERVED.</span><span>MADE FOR THE WAY YOU LIVE <Compass size={14} /></span></div></footer>
      {activeProperty && <PropertyModal property={activeProperty} onClose={() => setActiveProperty(null)} />}
    </main>
  );
}
