'use client';

import Image from 'next/image';
import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';

export default function Page() {
  const t = useT();
  const palette = [
    { hex: '#0b3628', label: t('Vert profond', 'Deep green') },
    { hex: '#629784', label: t('Vert sauge', 'Sage green') },
    { hex: '#eed349', label: t('Jaune', 'Yellow') },
    { hex: '#e6f9d4', label: t('Vert clair', 'Light green') },
  ];

  return (
    <ProjectPage
      title="Serena"
      subtitle={t('Un assistant IA pour l’administratif agricole', 'An AI assistant for farm paperwork')}
      meta={{
        year: '2024',
        context: t('Projet d’équipe, ESD', 'Team project, ESD'),
        role: t('Concept produit, wireframes, UI desktop & mobile', 'Product concept, wireframes, desktop & mobile UI'),
        tools: 'Figma',
      }}
      intro={t(
        <>
          <p>
            1,5 suicides par jour en France dans le secteur agricole. Les agriculteurs passent
            aujourd&apos;hui jusqu&apos;à 1h par jour, et une journée entière de leur week-end,
            à gérer des tâches administratives, une charge mentale qui s&apos;ajoute à un métier
            déjà exigeant.
          </p>
          <p>
            Serena répond à ce constat avec un assistant pensé pour prendre en charge
            l&apos;ensemble de ces démarches : automatisé, disponible, transparent sur
            l&apos;usage des données, et personnalisé selon les besoins de chaque exploitation.
          </p>
          <p>
            Des interviews terrain avec des agriculteurs ont nourri la compréhension du besoin
            réel. J&apos;ai porté le concept produit et le design, du wireframing des premières
            pistes jusqu&apos;aux maquettes finales, desktop et mobile.
          </p>
        </>,
        <>
          <p>
            In France, the farming sector sees 1.5 suicides a day. Farmers spend up to an hour
            a day, and a full day of their weekend, on paperwork: a mental load on top of an
            already demanding job.
          </p>
          <p>
            Serena answers this with an assistant built to handle all of that admin: automated,
            always available, transparent about data use, and tailored to each farm&apos;s needs.
          </p>
          <p>
            Field interviews with farmers shaped our understanding of the real need. I led the
            product concept and design, from the first wireframes to the final desktop and
            mobile screens.
          </p>
        </>
      )}
      next={{ href: '/z_lab', title: 'Z_Lab' }}
    >
      <Media src="/serena-dashboard.png" alt={t('Serena — tableau de bord', 'Serena — dashboard')} width={1010} height={632} priority className="max-w-4xl mx-auto" />

      <Chapter title="Desktop">
        <p>
          {t(
            'L’assistant est pensé comme un fil conducteur plutôt qu’un simple chatbot : suggestions d’actions contextuelles sur le tableau de bord, tâches priorisées, et bibliothèque de documents classés automatiquement.',
            'The assistant runs through the whole product rather than being a simple chatbot: contextual action suggestions on the dashboard, prioritised tasks, and a document library sorted automatically.'
          )}
        </p>
      </Chapter>
      <Media src="/serena-tasks.png" alt={t('Serena — gestion des tâches', 'Serena — tasks')} width={1011} height={631} className="max-w-4xl mx-auto" />
      <Row cols={2}>
        <Media src="/serena-documents.png" alt={t('Serena — bibliothèque de documents', 'Serena — document library')} width={1046} height={653} />
        <Media src="/serena-doc-viewer.png" alt={t('Serena — lecture de document', 'Serena — document viewer')} width={1047} height={653} />
      </Row>

      <Chapter title="Mobile">
        <p>
          {t(
            'Sur le terrain, l’agriculteur scanne un document depuis son téléphone pour alimenter l’assistant directement.',
            'Out in the field, farmers scan a document with their phone to feed the assistant directly.'
          )}
        </p>
      </Chapter>
      <Row cols={3} mobileCols={2} align="end" className="max-w-3xl mx-auto">
        <Media src="/serena-mobile-chat.png" alt={t('Serena — assistant mobile', 'Serena — mobile assistant')} width={283} height={591} />
        <Media src="/serena-mobile-scan.png" alt={t('Serena — scan de document', 'Serena — document scan')} width={375} height={759} />
        <Media src="/serena-mobile-tasks.png" alt={t('Serena — tâches mobile', 'Serena — mobile tasks')} width={368} height={768} />
      </Row>

      <Chapter title={t('Identité', 'Identity')}>
        <p>
          {t(
            'Une identité pensée pour rassurer plutôt qu’imposer : un vert profond et un jaune chaleureux, loin du vocabulaire froid des logiciels de gestion habituels du secteur. Serena s’exprime avec calme, clarté et bienveillance.',
            'An identity designed to reassure rather than impose: a deep green and a warm yellow, far from the cold vocabulary of the sector’s usual management software. Serena speaks with calm, clarity and kindness.'
          )}
        </p>
      </Chapter>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 py-6">
        <Image src="/serena-logo.png" alt={t('Logo Serena', 'Serena logo')} width={1166} height={463} className="w-64 md:w-80 h-auto" />
        <div className="flex gap-5 md:gap-6">
          {palette.map((c) => (
            <div key={c.hex} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-neutral-700" style={{ backgroundColor: c.hex }} />
              <span className="text-[0.6rem] uppercase tracking-widest text-neutral-500">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </ProjectPage>
  );
}
