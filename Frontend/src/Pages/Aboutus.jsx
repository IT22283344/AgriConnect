import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// NOTE: Ensure fonts are added in index.html or Tailwind config
const heroImages = ["/img/happyfarmer.png", "/img/sustain.jpg", "/img/local.jpg"];

const Section = ({ title, description, children, className }) => (
  <section className={`py-20 ${className}`}>
    <div className="max-w-7xl mx-auto px-6 md:px-12">
      {title && (
        <h2
          className="text-4xl font-bold text-center mb-6 text-emerald-700 font-poppins"
          data-aos="fade-up"
        >
          {title}
        </h2>
      )}
      {description && (
        <p className="text-center text-lg text-gray-600 mb-12 font-light font-poppins">
          {description}
        </p>
      )}
      {children}
    </div>
  </section>
);

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 900 });
  }, []);

  const features = [
    {
      title: "Empowering Farmers",
      desc: "We help farmers access better markets and data-driven tools to optimize their crop yields and earnings.",
      img: "/img/empower.png",
    },
    {
      title: "Sustainable Growth",
      desc: "Through sustainable farming practices, we ensure minimal environmental impact while maximizing productivity.",
      img: "/img/goodsustain.png",
    },
    {
      title: "Smart Consumer Choices",
      desc: "Our platform empowers consumers to buy ethically sourced products, supporting local communities.",
      img: "/img/choice.png",
    },
    {
      title: "Tech-Driven Impact",
      desc: "With AI-powered insights and tools, AgroConnect transforms traditional farming into smart agriculture.",
      img: "/img/datadriven1.png",
    },
  ];

  const missionIcons = [
    {
      title: "Fair Pricing",
      desc: "We ensure that farmers get fair prices for their produce, eliminating unnecessary middlemen.",
      icon: "https://cdn-icons-png.flaticon.com/512/2910/2910764.png",
    },
    {
      title: "Sustainability",
      desc: "Promoting practices that protect the environment and promote long-term agricultural health.",
      icon: "https://cdn-icons-png.flaticon.com/512/3304/3304579.png",
    },
    {
      title: "Direct Connection",
      desc: "Connecting farmers directly with consumers and businesses for transparency and fairness.",
      icon: "https://cdn-icons-png.flaticon.com/512/411/411763.png",
    },
    {
      title: "Tech Innovation",
      desc: "Leveraging AI and analytics to optimize farming decisions and market efficiency.",
      icon: "https://cdn-icons-png.flaticon.com/512/1055/1055687.png",
    },
  ];

  return (
    <div className="bg-white text-gray-800 font-poppins">
      {/* Hero Section */}
      <Section className="bg-green-50">
        <div data-aos="fade-up">
          <h1 className="text-5xl font-bold text-center text-lime-700 mb-6">
            About AgroConnect
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-center text-gray-600">
            Empowering farmers, serving consumers — connecting both through
            smart, sustainable, and tech-driven solutions.
          </p>
        </div>

        <div className="mt-12 max-w-5xl mx-auto" data-aos="zoom-in">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
          >
            {heroImages.map((src, idx) => (
              <div key={idx} className="px-2">
                <img
                  src={src}
                  alt={`Slide ${idx + 1}`}
                  className="object-cover h-96 rounded-3xl border-4 border-lime-300 shadow-xl"
                />
              </div>
            ))}
          </Carousel>
        </div>
      </Section>

      {/* Mission & Values */}
      <Section title="Our Mission & Values">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8" data-aos="fade-up">
          {missionIcons.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1 text-center border border-lime-100"
            >
              <img
                src={item.icon}
                alt={item.title}
                className="mx-auto mb-4 h-14 drop-shadow-md"
              />
              <h4 className="text-lg font-semibold text-lime-800">{item.title}</h4>
              <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Features Section */}
      {features.map((item, idx) => (
        <Section
          key={idx}
          title={item.title}
          description={item.desc}
          className={idx % 2 === 0 ? "bg-lime-50" : "bg-white"}
        >
          <div
            className={`grid md:grid-cols-2 gap-10 items-center ${
              idx % 2 !== 0 ? "md:flex-row-reverse" : ""
            }`}
            data-aos={idx % 2 === 0 ? "fade-right" : "fade-left"}
          >
            <div>
              <h3 className="text-2xl font-bold text-lime-800 mb-4">{item.title}</h3>
              <p className="text-gray-700 text-lg leading-relaxed">{item.desc}</p>
            </div>
            <img
              src={item.img}
              alt={item.title}
              className="rounded-xl shadow-2xl object-cover h-72 md:h-80 w-full border-2 border-lime-200"
            />
          </div>
        </Section>
      ))}

      {/* CTA Footer */}
      <Section className="bg-green-700 text-white text-center">
        <h2 className="text-3xl font-semibold mb-2">Join Us in Revolutionizing Agriculture</h2>
        <p className="text-lg">
          Together, let’s build a fairer, smarter future for our farmers and consumers.
        </p>
      </Section>
    </div>
  );
};

export default AboutUs;
