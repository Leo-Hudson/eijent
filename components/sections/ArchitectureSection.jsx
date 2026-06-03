import Architecture from '@/components/Architecture';

const ArchitectureSection = () => (
  <section className="sec" id="architecture">
    <div className="container reveal">
      <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
        <div className="eyebrow eyebrow--indigo">The architecture</div>
        <h2 className="display-lg" style={{ marginTop: 12 }}>Eight pillars. One system.</h2>
        <p className="lede" style={{ marginTop: 16 }}>Each pillar composes with every other. Click any node to explore.</p>
      </div>
      <Architecture />
    </div>
  </section>
);

export default ArchitectureSection;
