'use client';

import Image from 'next/image';
import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';

const palette = [
  { hex: '#0d3b2a', label: 'Vert profond' },
  { hex: '#629784', label: 'Vert sauge' },
  { hex: '#f0d94a', label: 'Jaune' },
  { hex: '#e6f9d4', label: 'Vert clair' },
];

export default function Page() {
  return (
    <ProjectPage
      title="Serena"
      subtitle="Un assistant IA pour l’administratif agricole"
      meta={[
        { label: 'Année', value: '2024' },
        { label: 'Contexte', value: 'Projet d’équipe, ESD' },
        { label: 'Rôle', value: 'Concept produit, wireframes, UI desktop & mobile' },
        { label: 'Outils', value: 'Figma' },
      ]}
      intro={
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
        </>
      }
      next={{ href: '/z_lab', title: 'Z_Lab' }}
    >
      <Media src="/serena-dashboard.png" alt="Serena — tableau de bord" width={1010} height={632} priority className="max-w-4xl mx-auto" />

      <Chapter title="Desktop">
        <p>
          L&apos;assistant est pensé comme un fil conducteur plutôt qu&apos;un simple chatbot :
          suggestions d&apos;actions contextuelles sur le tableau de bord, tâches priorisées, et
          bibliothèque de documents classés automatiquement.
        </p>
      </Chapter>
      <Media src="/serena-tasks.png" alt="Serena — gestion des tâches" width={1011} height={631} className="max-w-4xl mx-auto" />
      <Row cols={2}>
        <Media src="/serena-documents.png" alt="Serena — bibliothèque de documents" width={1046} height={653} />
        <Media src="/serena-doc-viewer.png" alt="Serena — lecture de document" width={1047} height={653} />
      </Row>

      <Chapter title="Mobile">
        <p>
          Sur le terrain, l&apos;agriculteur scanne un document depuis son téléphone pour
          alimenter l&apos;assistant directement.
        </p>
      </Chapter>
      <Row cols={3} mobileCols={2} align="end" className="max-w-3xl mx-auto">
        <Media src="/serena-mobile-chat.png" alt="Serena — assistant mobile" width={283} height={591} />
        <Media src="/serena-mobile-scan.png" alt="Serena — scan de document" width={375} height={759} />
        <Media src="/serena-mobile-tasks.png" alt="Serena — tâches mobile" width={368} height={768} />
      </Row>

      <Chapter title="Identité">
        <p>
          Une identité pensée pour rassurer plutôt qu&apos;imposer : un vert profond et un jaune
          chaleureux, loin du vocabulaire froid des logiciels de gestion habituels du secteur.
          Serena s&apos;exprime avec calme, clarté et bienveillance.
        </p>
      </Chapter>
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 py-6">
        <Image src="/serena-logo.png" alt="Logo Serena" width={156} height={48} className="w-48 h-auto" />
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
