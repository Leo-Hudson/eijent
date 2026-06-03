import Activity from '@/components/Activity';

const ActivitySection = () => (
  <section className="sec">
    <div className="container container--narrow reveal" style={{ textAlign: 'center', marginBottom: 48 }}>
      <div className="eyebrow eyebrow--indigo">Activity & interaction layer</div>
      <h2 className="display-lg" style={{ marginTop: 12 }}>One timeline. <em style={{ fontWeight: 700, color: 'var(--indigo-700)' }}>Every signal.</em></h2>
      <p className="lede" style={{ marginTop: 16 }}>Email, comments, AI actions, transitions, Pulse — every interaction lands in one stream, attached to the right entity.</p>
    </div>
    <div className="container container--narrow reveal">
      <Activity />
    </div>
  </section>
);

export default ActivitySection;
