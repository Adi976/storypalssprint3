import React, { useState, useEffect, useRef } from 'react';
import './StoryScreen.css';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

const initialMessages: ChatMessage[] = [
  { sender: 'bot', text: `Hello there, young storyteller! I'm Luna, the Star Fairy. What magical adventure shall we create today?` },
  { sender: 'user', text: 'Can we go on a trip to the moon?' },
  { sender: 'bot', text: `What a wonderful idea! I know all about the moon! Did you know that the moon is Earth's only natural satellite? Let's pack our special space backpacks. What should we bring on our moon adventure?` },
  { sender: 'user', text: 'A telescope and some moon cookies!' },
  { sender: 'bot', text: `Perfect choices! A telescope to see the stars up close and moon cookies for energy. As we climb into our sparkly silver rocket ship, we can hear the countdown. 5...4...3...2...1... BLAST OFF! The rocket zooms up into the sky, pushing us back into our seats. What do you see out the window?` },
];

const StoryScreen: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [progressWidth, setProgressWidth] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgressWidth(scrollPercent);
      setShowBackToTop(scrollTop > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAcceptCookies = () => {
    setShowCookieBanner(false);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: 'user' as const, text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [...msgs, { sender: 'bot', text: data.reply || 'Sorry, I did not understand that.' }]);
    } catch {
      setMessages((msgs) => [...msgs, { sender: 'bot', text: 'Sorry, there was a problem connecting to the server.' }]);
    }
    setLoading(false);
  };

  return (
    <div className={`story-screen ${theme}`}>
      <div className="progress-bar" style={{ width: `${progressWidth}%` }}></div>
      <div className="bg-elements">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
        <div className="star" style={{ top: '10%', left: '20%' }}></div>
        <div className="star" style={{ top: '30%', left: '50%' }}></div>
        <div className="star" style={{ top: '50%', left: '80%' }}></div>
      </div>
      <nav className="nav-container">
        <div className="logo">
          <img src="/images/All of them.png" alt="StoryPals Logo" />
          <span className="logo-text">StoryPals</span>
        </div>
        <div className="nav-links">
          <a href="#hero-section">Home</a>
          <a href="#characters-section">Characters</a>
          <a href="#features-section">Features</a>
          <a href="#testimonials-section">Testimonials</a>
          <a href="#contact-section">Contact</a>
        </div>
        <button className="login-btn">Login</button>
      </nav>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <button className={`back-to-top ${showBackToTop ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        ↑
      </button>
      {showCookieBanner && (
        <div className="cookie-banner visible">
          <div className="cookie-content">
            <p>We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.</p>
          </div>
          <div className="cookie-buttons">
            <button onClick={handleAcceptCookies}>Accept</button>
          </div>
        </div>
      )}

      {/* Hero section */}
      <section className="hero" id="hero-section">
        <h1>Magical Friends for Young Storytellers</h1>
        <p>
          StoryPals brings storytelling to life with interactive AI companions who
          listen, respond, and create magical adventures alongside your child.
          Safe, educational, and endlessly imaginative!
        </p>
        <div className="cta-buttons">
          <a href="#try-now" className="cta-btn primary-btn">Start Your Adventure</a>
          <a href="#learn-more" className="cta-btn secondary-btn">Learn More</a>
        </div>
      </section>

      {/* Characters section */}
      <section className="characters" id="characters-section">
        <div className="character">
          <div className="glow"></div>
          <img src="/images/Luna.png" alt="Luna character" />
          <h3>Luna</h3>
          <p>The friendly star fairy who knows all about space and dreams</p>
        </div>
        <div className="character">
          <div className="glow"></div>
          <img src="/images/Gogo.png" alt="Gogo character" />
          <h3>Gogo</h3>
          <p>A brave explorer with tales of adventure from distant lands</p>
        </div>
        <div className="character">
          <div className="glow"></div>
          <img src="/images/Dodo.png" alt="Dodo character" />
          <h3>Dodo</h3>
          <p>The curious friend who loves solving mysteries and riddles</p>
        </div>
        <div className="character">
          <div className="glow"></div>
          <img src="/images/CaptainLeo.png" alt="Captain Leo character" />
          <h3>Captain Leo</h3>
          <p>A daring space captain who leads exciting cosmic adventures</p>
        </div>
      </section>

      {/* Features section */}
      <section className="features" id="features-section">
        <div className="features-container">
          <div className="section-header">
            <h2>Magical Features for Young Minds</h2>
            <p>
              StoryPals combines cutting-edge AI with child development expertise
              to create safe, engaging, and educational experiences.
            </p>
          </div>
          <div className="feature-cards">
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <h3>Interactive Storytelling</h3>
              <p>
                Children can co-create stories with their StoryPal, developing
                creativity and narrative skills while having fun. Each story can
                be saved and revisited!
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Child-Safe Environment</h3>
              <p>
                StoryPals is designed with safety first. All content is
                age-appropriate and interactions are monitored with advanced
                safety protocols.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Educational Content</h3>
              <p>
                Each character specializes in different educational areas, from
                science and nature to language arts, making learning an adventure!
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Creative Companion</h3>
              <p>
                StoryPals respond to children's ideas, ask thoughtful questions,
                and encourage imagination in a supportive, engaging way.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Personalized Experience</h3>
              <p>
                StoryPals remember preferences, past stories, and adapt to each
                child's interests and learning pace.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💖</div>
              <h3>Emotional Intelligence</h3>
              <p>
                StoryPals help children explore emotions through stories, building
                empathy and emotional vocabulary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chat demo section */}
      <section className="chat-demo" id="try-now">
        <div className="chat-container">
          <div className="section-header">
            <h2>Meet Your StoryPal</h2>
            <p>
              Try a conversation with one of our magical friends and see the StoryPals experience!
            </p>
          </div>
          <div className="chat-window">
            <div className="chat-header">
              <img src="/images/Luna_beauty.png" alt="Luna" />
              <h3>Luna the Star Fairy</h3>
            </div>
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="thinking">
                  <span></span><span></span><span></span>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div>
            <form className="chat-input" onSubmit={handleSend}>
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={handleInput}
                disabled={loading}
                autoFocus
              />
              <button type="submit" disabled={loading || !input.trim()}>✈️</button>
            </form>
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="testimonials" id="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <h2>What Families Are Saying</h2>
            <p>
              Join thousands of happy families who've discovered the magic of StoryPals
            </p>
          </div>
          <div className="testimonial-cards">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div>
                  <div className="testimonial-name">Sarah M.</div>
                  <div className="testimonial-role">Parent of Alex, 6</div>
                </div>
              </div>
              <div className="testimonial-text">
                StoryPals has completely transformed our bedtime routine. My son Alex used to resist going to bed, but now he can't wait to continue his adventure with Captain Leo. He's also learning so much about geography and history!
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div>
                  <div className="testimonial-name">David T.</div>
                  <div className="testimonial-role">Father of Lily, 7</div>
                </div>
              </div>
              <div className="testimonial-text">
                As a busy parent, I was looking for something both entertaining and educational. StoryPals exceeded my expectations. My daughter's vocabulary has expanded dramatically, and I love how the parent dashboard keeps me updated on her progress.
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div>
                  <div className="testimonial-name">Maya J.</div>
                  <div className="testimonial-role">Mother of Twins, 5</div>
                </div>
              </div>
              <div className="testimonial-text">
                My twins have very different interests, but StoryPals adapts to both of them perfectly. Emma loves space adventures with Luna while Noah enjoys solving mysteries with Whiskers. The personalization is impressive!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parent section */}
      <section className="parent-section">
        <div className="parent-container">
          <div className="parent-image">
            <img src="/images/parent-dashboard.png" alt="Parent dashboard" />
          </div>
          <div className="parent-content">
            <h2>For Parents: Safety & Learning</h2>
            <p>
              StoryPals was designed with parents in mind. Our comprehensive parent dashboard gives you complete oversight and control of your child's experience while providing insights into their learning journey.
            </p>
            <div className="parent-features">
              <div className="feature-item">✅ Content control and activity monitoring</div>
              <div className="feature-item">✅ Learning progress reports and insights</div>
              <div className="feature-item">✅ Time limits and usage schedules</div>
              <div className="feature-item">✅ Save and share your child's stories</div>
              <div className="feature-item">✅ Educational focus customization</div>
            </div>
            <button className="cta-btn primary-btn" onClick={() => window.location.href='parent-dashboard.html'}>Parent Dashboard</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact-section" className="contact">
        <div className="footer-container">
          <div className="footer-about">
            <div className="footer-logo">
              <img src="/images/All of them.png" alt="StoryPals Logo" />
              <span className="footer-logo-text">StoryPals</span>
            </div>
            <p>
              StoryPals brings magical AI companions to children, creating a safe space for creativity, learning, and fun through interactive storytelling.
            </p>
            <div className="social-icons">
              <a href="#">📘</a>
              <a href="#">🐦</a>
              <a href="#">📸</a>
              <a href="#">▶️</a>
            </div>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Characters</a></li>
              <li><a href="#">For Parents</a></li>
              <li><a href="#">Safety & Privacy</a></li>
              <li><a href="#">Subscription Plans</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h3>Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">✉️ hello@storypals.com</div>
              <div className="contact-item">📞 +1 234 567 8901</div>
            </div>
          </div>
          <div className="footer-newsletter">
            <h3>Newsletter</h3>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="Your email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} StoryPals. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default StoryScreen; 