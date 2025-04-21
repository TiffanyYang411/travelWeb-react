// src/pages/Home.jsx
import '../styles/Home.css';
import Banner from '../components/Banner';
import TravelStyles from '../components/TravelStyles';
import ExploreCall from '../components/ExploreCall';
import Testimonial from '../components/Testimonial';
import WhyUs from '../components/WhyUs';
import Footer from '../components/Footer';

function Home() {
  return (
    <div className="home-page">
      <section className="section banner-section">
        <Banner />
      </section>

      <section className="section style-section">
        <TravelStyles />
      </section>

      <section className="section explore-section">
        <ExploreCall />
      </section>

      <section className="section testimonial-section">
        <Testimonial />
      </section>

      <section className="section whyus-section">
        <WhyUs />
      </section>

      {/* <Footer /> */}
    </div>
  );
}

export default Home;
