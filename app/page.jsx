import Hero from '@/components/sections/Hero';
import InviteBand from '@/components/sections/InviteBand';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';
import MarkDivider from '@/components/sections/MarkDivider';
import ArchitectureSection from '@/components/sections/ArchitectureSection';
import Pipelines from '@/components/sections/Pipelines';
import AiLayer from '@/components/sections/AiLayer';
import Workflows from '@/components/sections/Workflows';
import ActivitySection from '@/components/sections/ActivitySection';
import Pulse from '@/components/sections/Pulse';
import UseCases from '@/components/UseCases';
import Departments from '@/components/sections/Departments';
import Humans from '@/components/sections/Humans';
import Faq from '@/components/sections/Faq';
import Closer from '@/components/sections/Closer';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <Hero />
      <InviteBand />
      <Problem />
      <Solution />
      <MarkDivider />
      <ArchitectureSection />
      <Pipelines />
      <AiLayer />
      <Workflows />
      <ActivitySection />
      <Pulse />
      <UseCases />
      <Departments />
      <Humans />
      <Faq />
      <Closer />
      <Footer />
    </>
  );
}
