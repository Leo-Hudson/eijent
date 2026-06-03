import FAQ from '@/components/FAQ';

const Faq = () => (
  <section className="faq">
    <div className="container reveal">
      <div className="faq__head">
        <div className="eyebrow eyebrow--indigo">Common questions</div>
        <h2 className="display-lg" style={{ marginTop: 12 }}>About the private beta.</h2>
      </div>
      <FAQ />
    </div>
  </section>
);

export default Faq;
