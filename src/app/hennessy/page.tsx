'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';

export default function Page() {
  return (
    <ProjectPage
      title="Hennessy X.O Second Skin"
      subtitle="Art génératif & UI, avec OKCC"
      meta={[
        { label: 'Année', value: '2025' },
        { label: 'Contexte', value: 'OKCC — présenté à VivaTech 2025' },
        { label: 'Rôle', value: 'Visuels 3D, UI de la tablette de vente' },
        { label: 'Outils', value: 'Figma, Blender, After Effects' },
        { label: 'Distinction', value: 'Lovie Award — Best Experience Art Direction' },
      ]}
      intro={
        <>
          <p>
            Second Skin est une édition limitée du Hennessy X.O, née d&apos;une collaboration
            avec l&apos;artiste génératif Florian Zumbrunn. Chaque bouteille reçoit une seconde
            peau générée par ses algorithmes, comme un tableau, et porte un numéro de série qui
            la rend unique.
          </p>
          <p>
            Sur ce projet, j&apos;ai conçu les visuels 3D des bouteilles sous Blender ainsi que
            l&apos;UI de la tablette de vente destinée au château, où les visiteurs découvrent
            et personnalisent leur édition.
          </p>
        </>
      }
      next={{ href: '/shu-uemura', title: 'Shu Uemura' }}
    >
      <Media src="/hennessy.png" alt="Hennessy X.O Second Skin — rendu 3D" width={3000} height={1688} priority />

      <Chapter title="Le parcours tablette">
        <p>
          Le visiteur choisit une couleur dominante puis une couleur secondaire, l&apos;œuvre
          est générée en direct, et il valide sa création avant impression de la seconde peau.
        </p>
      </Chapter>
      <Media src="/hennessy1.png" alt="Hennessy — écran d’accueil de la tablette" width={1366} height={1024} />
      <Row cols={2}>
        <Media src="/hennessy2.png" alt="Hennessy — choix de la couleur dominante" width={1366} height={1024} />
        <Media src="/hennessy3.png" alt="Hennessy — choix de la couleur secondaire" width={1366} height={1024} />
      </Row>
      <Row cols={2}>
        <Media src="/hennessy4.png" alt="Hennessy — génération de l’œuvre" width={1366} height={1024} />
        <Media src="/hennessy5.png" alt="Hennessy — validation de la création" width={1366} height={1024} />
      </Row>
      <Media src="/hennessy6.png" alt="Hennessy — écran de remerciement" width={1366} height={1024} />
    </ProjectPage>
  );
}
