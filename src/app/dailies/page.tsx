'use client';

import { ProjectPage, Media, Row, Chapter } from '@/components/project/ProjectPage';
import { useT } from '@/components/i18n';
import { DailiesSystem } from '@/components/project/DesignSystem';

type T = <V,>(fr: V, en: V) => V;

const W = { width: 2000, height: 1250 };

const problems = (t: T) => [
  {
    title: t('Les versions sont éparpillées', 'Versions are scattered'),
    text: t('Les générations vivent dans plusieurs outils, puis dans un Drive ou une conversation.', 'Generations live in several tools, then in a Drive or a chat thread.'),
  },
  {
    title: t('On perd l’origine d’une image', 'An image loses its origin'),
    text: t('Le prompt, le modèle et l’image de départ d’un plan validé ne sont plus retrouvables.', 'The prompt, model and source image behind an approved shot can’t be found again.'),
  },
  {
    title: t('Les retours sont flous', 'Feedback is vague'),
    text: t('« Plus lumineux », « la fille du début » : sans plan ni timecode, l’équipe interprète.', '“Brighter”, “the girl at the start”: with no shot or timecode, the team guesses.'),
  },
  {
    title: t('La mauvaise version est validée', 'The wrong version gets approved'),
    text: t('Le client reçoit plusieurs liens et ne sait pas lequel est le dernier.', 'The client gets several links and can’t tell which one is the latest.'),
  },
  {
    title: t('Le coût est invisible', 'The cost is invisible'),
    text: t('Chaque génération consomme des crédits. Le dépassement se voit à la fin.', 'Every generation uses credits. Overspending shows up at the end.'),
  },
];

const roles = (t: T) => [
  {
    name: t('Inès, productrice', 'Inès, producer'),
    does: t('Suit chaque plan, envoie les versions au client.', 'Tracks every shot, sends versions to the client.'),
    wants: t('Livrer à temps sans dépasser le budget de rendus.', 'Deliver on time without blowing the render budget.'),
  },
  {
    name: t('Théo, artiste IA', 'Théo, AI artist'),
    does: t('Génère les variantes, choisit, refait après retour.', 'Generates variants, picks, redoes after feedback.'),
    wants: t('Retrouver vite ce qui a marché : prompt, modèle, image de départ.', 'Find what worked fast: prompt, model, source image.'),
  },
  {
    name: t('Mia, cliente', 'Mia, client'),
    does: t('Regarde le film, commente, valide.', 'Watches the film, comments, approves.'),
    wants: t('Donner un avis clair sans se perdre dans les versions.', 'Give clear feedback without getting lost in versions.'),
  },
];

const flow = (t: T) => [
  t('Brief et liste des plans', 'Brief and shot list'),
  t('Générer les variantes', 'Generate variants'),
  t('Choisir et comparer', 'Pick and compare'),
  t('Envoyer une version', 'Send one version'),
  t('Revue et commentaires', 'Review and comments'),
  t('Validée, ou retour sur le plan concerné', 'Approved, or back to the shot in question'),
];

const personas = (t: T) => [
  {
    who: 'Inès',
    task: t('« Est-ce qu’on tient le budget ? »', '“Are we within budget?”'),
    found: t('Elle voyait les crédits utilisés, pas ce qu’il faudrait pour finir.', 'She saw credits used, not what it would take to finish.'),
    change: t('Barre de budget : utilisé, estimé pour finir, marge. Bascule crédits / euros.', 'Budget bar: used, estimated to finish, margin. Credits / euros switch.'),
  },
  {
    who: 'Théo',
    task: t('« Corriger un plan après un retour »', '“Fix a shot after feedback”'),
    found: t('Il voulait retoucher le prompt avant de régénérer, et masquer les dizaines de variantes écartées.', 'He wanted to edit the prompt before regenerating, and hide the dozens of rejected variants.'),
    change: t('Prompt modifiable au même endroit, variantes écartées masquées.', 'Prompt editable in place, rejected variants hidden.'),
  },
  {
    who: 'Mia',
    task: t('« Relire la v3 entre deux réunions »', '“Review v3 between two meetings”'),
    found: t('Elle ne savait pas ce qui avait changé depuis la v2, ni combien de tours de retours étaient prévus.', 'She didn’t know what had changed since v2, or how many feedback rounds were included.'),
    change: t('« Ce qui a changé depuis la v2 », tour de retours affiché, commentaire possible sur tout le film.', '“What changed since v2”, feedback round shown, comments on the whole film.'),
  },
];

const principles = (t: T) => [
  { title: t('Gestes connus', 'Familiar gestures'), text: t('Valider, commenter, comparer restent des actions que tout le monde reconnaît. C’est la mise en page autour qui change.', 'Approve, comment, compare stay actions everyone recognises. The layout around them is what changes.') },
  { title: t('Le compteur toujours visible', 'The counter always visible'), text: t('En haut à gauche, à côté du menu : les crédits utilisés sur le budget, sur tous les écrans de l’équipe.', 'Top left, next to the menu: credits used out of the budget, on every team screen.') },
  { title: t('Chaque image garde son origine', 'Every image keeps its origin'), text: t('Prompt, modèle, image de départ et coût restent attachés à chaque génération.', 'Prompt, model, source image and cost stay attached to every generation.') },
  { title: t('Une seule version à valider', 'One version to approve'), text: t('Le client ne voit que la version envoyée. Les anciennes restent lisibles, jamais validables.', 'The client only sees the version sent. Older ones stay viewable, never approvable.') },
  { title: t('Deux tons', 'Two registers'), text: t('Sombre et dense pour le studio, comme un logiciel de montage. Clair et éditorial pour le client.', 'Dark and dense for the studio, like editing software. Light and editorial for the client.') },
];

const compare = (t: T) => [
  { label: t('Commentaires au timecode', 'Timecoded comments'), frame: '✓', preview: t('non précisé', 'not specified'), dailies: '✓' },
  { label: t('Versions comparées côte à côte', 'Side-by-side versions'), frame: '✓', preview: t('non précisé', 'not specified'), dailies: '✓' },
  { label: t('Génération intégrée, tous modèles', 'Built-in generation, any model'), frame: '—', preview: '✓', dailies: '✓' },
  { label: t('Origine de chaque image (prompt, modèle)', 'Origin of each image (prompt, model)'), frame: '—', preview: '✓', dailies: '✓' },
  { label: t('Coût des rendus, avant de générer', 'Render cost, before generating'), frame: '—', preview: t('non précisé', 'not specified'), dailies: '✓' },
  { label: t('Client qui ne voit qu’une version', 'Client sees a single version'), frame: t('selon partage', 'depends on share'), preview: t('non précisé', 'not specified'), dailies: '✓' },
];

const metrics = (t: T) => [
  { m: t('Temps pour retrouver une génération', 'Time to find a generation'), why: t('Hypothèse 2 : l’origine des images se perd.', 'Assumption 2: images lose their origin.') },
  { m: t('Part des retours rattachés à un plan', 'Share of feedback tied to a shot'), why: t('Hypothèse 3 : les retours sont flous.', 'Assumption 3: feedback is vague.') },
  { m: t('Validations sur une version dépassée', 'Approvals on an outdated version'), why: t('Hypothèse 4 : objectif zéro.', 'Assumption 4: target is zero.') },
  { m: t('Écart entre budget prévu et dépensé', 'Gap between planned and spent budget'), why: t('Hypothèse 5 : le coût est invisible.', 'Assumption 5: cost is invisible.') },
  { m: t('Nombre de tours de retours par film', 'Feedback rounds per film'), why: t('À comparer avec ce que prévoit le devis.', 'To compare with what the quote includes.') },
];

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] text-black/50 leading-relaxed pt-2 max-w-2xl">{children}</p>;
}

export default function Page() {
  const t = useT();

  return (
    <ProjectPage
      title="Dailies"
      subtitle={t('Concept d’outil pour les studios qui produisent des vidéos en IA', 'A tool concept for studios making AI video')}
      lede={t(
        'Suivre chaque plan d’un film en IA, faire valider la bonne version par le client, et savoir ce que ça coûte.',
        'Track every shot of an AI film, get the right version approved by the client, and know what it costs.'
      )}
      meta={{
        year: '2026',
        context: t('Projet personnel, concept', 'Personal project, concept'),
        role: t('Cadrage, UX/UI, prototype codé', 'Framing, UX/UI, coded prototype'),
        tools: t('HTML/CSS avec Claude', 'HTML/CSS with Claude'),
      }}
      hero={
        <>
      <Media src="/dailies/01-projet.webp" alt={t('Dailies — le projet et ses huit plans', 'Dailies — the project and its eight shots')} {...W} priority />
          <p className="text-[13px] text-black/50 pt-2">
            <a href="/dailies/prototype/index.html" className="underline underline-offset-2 hover:text-black">
              {t('Ouvrir le prototype cliquable', 'Open the clickable prototype')}
            </a>{' '}
            — {t('à voir sur ordinateur.', 'best on a computer.')}
          </p>
        </>
      }
      intro={t(
        <>
          <p>Une vidéo IA de 30 secondes, c&apos;est des centaines de générations réparties entre plusieurs outils. Dailies aide les studios à retrouver la bonne version, à savoir ce qu&apos;elle a coûté et à la faire valider par le client.</p>
          <p className="text-black/60">Le studio, le client et le film sont fictifs.</p>
        </>,
        <>
          <p>A 30-second AI video means hundreds of generations spread across tools. Dailies helps studios find the right version, know what it cost and get it approved by the client.</p>
          <p className="text-black/60">The studio, client and film are fictional.</p>
        </>
      )}
    >
      {/* PROBLEM */}
      <Chapter n={1} title={t('Le problème', 'The problem')} lede={t('Trop de versions, pas assez de traces.', 'Too many versions, not enough trace.')}>
        <p>
          {t('Cinq hypothèses de départ, à confronter à des studios qui produisent de la vidéo IA.', 'Five starting assumptions, to check with studios that make AI video.')}
        </p>
      </Chapter>
      <ol className="grid grid-cols-1 md:grid-cols-5 gap-px bg-black/15 border border-black/15">
        {problems(t).map((p, i) => (
          <li key={p.title} className="bg-white p-5 md:p-6 space-y-2">
            <span className="text-[13px] text-black/45">0{i + 1}</span>
            <h4 className="text-[13px] font-medium">{p.title}</h4>
            <p className="text-xs text-black/50 leading-relaxed">{p.text}</p>
          </li>
        ))}
      </ol>

      {/* EXISTING */}
      <Chapter n={2} title={t('L’existant', 'What exists')} lede={t('Les outils de revue ne savent pas d’où vient une image. Les plateformes de génération parlent peu du client.', 'Review tools don’t know where an image comes from. Generation platforms say little about the client.')}>
        <p>
          {t('Frame.io est la référence de la revue vidéo, mais il reçoit des fichiers finis, sans le prompt ni le coût. Preview, côté production IA, garde l’origine de chaque image mais parle peu de la revue client.', 'Frame.io is the reference for video review, but it receives finished files, without the prompt or the cost. Preview, on the AI production side, keeps where each image comes from but says little about client review.')}
        </p>
        <p>
          {t('Dailies prend la revue de l’un, la traçabilité de l’autre, et ajoute le coût avant de générer.', 'Dailies takes the review of one, the traceability of the other, and adds the cost before generating.')}
        </p>
      </Chapter>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-[13px] border-collapse">
          <thead>
            <tr className="text-black/45 text-left">
              <th className="font-normal py-3 pr-4 border-b border-black/15"></th>
              <th className="font-normal py-3 px-4 border-b border-black/15">Frame.io</th>
              <th className="font-normal py-3 px-4 border-b border-black/15">Preview</th>
              <th className="font-medium text-black py-3 px-4 border-b border-black/15">Dailies</th>
            </tr>
          </thead>
          <tbody>
            {compare(t).map((r) => (
              <tr key={r.label}>
                <td className="py-3 pr-4 border-b border-black/10">{r.label}</td>
                <td className="py-3 px-4 border-b border-black/10 text-black/60">{r.frame}</td>
                <td className="py-3 px-4 border-b border-black/10 text-black/60">{r.preview}</td>
                <td className="py-3 px-4 border-b border-black/10 font-medium">{r.dailies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Caption>
        {t('D’après leurs pages publiques, novembre 2026.', 'From their public pages, November 2026.')}
      </Caption>

      {/* USERS */}
      <Chapter n={3} title={t('Trois rôles', 'Three roles')} lede={t('Le studio prépare, le client décide. C’est entre les deux que les versions se perdent.', 'The studio prepares, the client decides. Versions get lost in between.')} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {roles(t).map((r) => (
          <div key={r.name} className="bg-white p-6 md:p-8 flex flex-col gap-4">
            <h4 className="text-xl md:text-2xl font-medium tracking-[-0.03em]">{r.name}</h4>
            <p className="text-sm text-black/70 leading-relaxed">{r.does}</p>
            <p className="mt-auto text-xs text-black/50 leading-relaxed">
              <span className="text-black/45">{t('Veut : ', 'Wants: ')}</span>
              {r.wants}
            </p>
          </div>
        ))}
      </div>

      {/* FLOW */}
      <Chapter n={4} title={t('Le parcours', 'The flow')}>
        <p>
          {t(
            'Un « non » du client ne repart pas de zéro : chaque commentaire revient sur le plan concerné, et on régénère seulement celui-là.',
            'A “no” from the client doesn’t restart everything: each comment goes back to the shot it concerns, and only that shot is regenerated.'
          )}
        </p>
      </Chapter>
      <ol className="grid grid-cols-2 md:grid-cols-6 gap-px bg-black/15 border border-black/15">
        {flow(t).map((s, i) => (
          <li key={s} className={`p-5 space-y-2 ${i < 4 ? 'bg-[#0b0b0c] text-white' : 'bg-[#f1efea]'}`}>
            <span className={`text-[13px] ${i < 4 ? 'text-white/45' : 'text-black/45'}`}>
              0{i + 1} · {i < 4 ? t('studio', 'studio') : t('client', 'client')}
            </span>
            <p className="text-[13px] font-medium leading-snug">{s}</p>
          </li>
        ))}
      </ol>

      {/* STUDIO */}
      <Chapter n={5} title={t('Côté studio', 'Studio side')} lede={t('Chaque génération garde son prompt, son modèle et son coût.', 'Every generation keeps its prompt, model and cost.')}>
        <p>
          {t('Sur la page d’un plan, l’artiste voit les variantes gardées et tout ce qui permet de refaire la bonne : prompt, modèle, image de départ, graine, coût.', 'On a shot page, the artist sees the kept variants and everything needed to redo the right one: prompt, model, source image, seed, cost.')}
        </p>
      </Chapter>
      <Media src="/dailies/02-plan.webp" alt={t('Dailies — un plan et ses variantes', 'Dailies — a shot and its variants')} {...W} />
      <Chapter title={t('Comparer avant d’envoyer', 'Compare before sending')}>
        <p>
          {t('Deux versions côte à côte. Les mots qui changent dans le prompt sont surlignés : on voit d’où vient la différence.', 'Two versions side by side. The words that change in the prompt are highlighted: you see where the difference comes from.')}
        </p>
      </Chapter>
      <Media src="/dailies/03-comparer.webp" alt={t('Dailies — comparer la v3 et la v4', 'Dailies — comparing v3 and v4')} {...W} />

      {/* CLIENT */}
      <Chapter n={6} title={t('Côté client', 'Client side')} lede={t('Le client ne voit qu’une version, et commente au bon endroit.', 'The client sees one version, and comments in the right place.')}>
        <p>
          {t('Chaque commentaire est rattaché à un plan et à un timecode, et le client voit d’abord ce qui a changé.', 'Each comment is tied to a shot and a timecode, and the client first sees what changed.')}
        </p>
      </Chapter>
      <Media src="/dailies/04-revue.webp" alt={t('Dailies — la revue client', 'Dailies — client review')} {...W} />
      <Chapter title={t('La validation', 'Approval')}>
        <p>
          {t(
            'Un panneau, une version, un bouton. Le client voit exactement ce qu’il valide et quand il recevra les fichiers.',
            'One panel, one version, one button. The client sees exactly what they approve and when they’ll get the files.'
          )}
        </p>
      </Chapter>
      <Row cols={2}>
        <Media src="/dailies/05-validation.webp" alt={t('Dailies — valider la version 4', 'Dailies — approving version 4')} {...W} />
        <Media src="/dailies/10-valide.webp" alt={t('Dailies — version validée', 'Dailies — version approved')} {...W} />
      </Row>
      <Chapter title={t('Le retour au studio', 'Back to the studio')}>
        <p>
          {t('Côté studio, chaque commentaire devient une tâche sur le bon plan, avec son coût estimé.', 'On the studio side, each comment becomes a task on the right shot, with its estimated cost.')}
        </p>
      </Chapter>
      <Media src="/dailies/06-retours.webp" alt={t('Dailies — retours à traiter', 'Dailies — feedback to handle')} {...W} />

      {/* PERSONAS */}
      <Chapter n={7} title={t('Revue par personas', 'Persona review')} lede={t('Avant de montrer l’outil à de vraies personnes, je l’ai parcouru avec trois profils.', 'Before showing the tool to real people, I walked through it as three profiles.')}>
        <p>
          {t('Chaque profil avait une tâche précise ; j’ai noté où le parcours bloquait. Ce n’est pas un test utilisateur, mais ça a déjà changé quatre écrans.', 'Each profile had a precise task; I noted where the flow got stuck. It isn’t a user test, but it already changed four screens.')}
        </p>
      </Chapter>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {personas(t).map((p) => (
          <div key={p.who} className="bg-white p-6 md:p-8 flex flex-col gap-4">
            <span className="text-[13px] text-black/45">{p.who}</span>
            <h4 className="text-xl md:text-2xl font-medium tracking-[-0.03em] leading-snug">{p.task}</h4>
            <p className="text-sm text-black/70 leading-relaxed">{p.found}</p>
            <p className="mt-auto text-xs text-black/50 leading-relaxed">→ {p.change}</p>
          </div>
        ))}
      </div>
      <Row cols={2}>
        <figure>
          <Media src="/dailies/04-revue-v1.webp" alt={t('Revue client, avant', 'Client review, before')} width={1440} height={900} />
          <Caption>{t('Avant : les retours, sans savoir ce qui avait changé.', 'Before: feedback, with no idea what had changed.')}</Caption>
        </figure>
        <figure>
          <Media src="/dailies/04-revue.webp" alt={t('Revue client, après', 'Client review, after')} {...W} />
          <Caption>{t('Après : ce qui a changé depuis la v2, le tour de retours, et un commentaire possible sur tout le film.', 'After: what changed since v2, the feedback round, and comments on the whole film.')}</Caption>
        </figure>
      </Row>

      {/* EDGE CASES */}
      <Chapter n={8} title={t('Quand ça se passe mal', 'When things go wrong')} lede={t('Prévenir avant de dépenser, jamais après.', 'Warn before spending, never after.')}>
        <p>
          {t('Trois cas que le parcours idéal ne montre pas : le budget qui ne suffit plus, une génération qui échoue, un ancien lien ouvert sur téléphone.', 'Three cases the ideal flow doesn’t show: a budget that runs out, a failed generation, an old link opened on a phone.')}
        </p>
      </Chapter>
      <Media src="/dailies/07-budget.webp" alt={t('Dailies — budget dépassé', 'Dailies — over budget')} {...W} />
      <Caption>{t('Rien n’est débité avant le choix : demander des crédits à la productrice, ou faire un brouillon moins cher.', 'Nothing is charged before the choice: ask the producer for credits, or make a cheaper draft.')}</Caption>
      <div className="pt-6" />
      <Media src="/dailies/08-echec.webp" alt={t('Dailies — génération ratée', 'Dailies — failed generation')} {...W} />
      <Caption>{t('Une génération ratée n’est pas comptée dans le budget, et le retour client qui l’a déclenchée reste affiché.', 'A failed generation isn’t counted in the budget, and the client feedback that triggered it stays visible.')}</Caption>
      <div className="max-w-[300px] mx-auto pt-10">
        <Media src="/dailies/09-mobile.webp" alt={t('Dailies — ancien lien sur mobile', 'Dailies — old link on mobile')} width={780} height={1688} />
        <Caption>{t('Un ancien lien ouvre la v2 : un bandeau envoie vers la v3, et la v2 n’est plus validable.', 'An old link opens v2: a banner points to v3, and v2 can no longer be approved.')}</Caption>
      </div>

      {/* FEASIBILITY */}
      <Chapter n={9} title={t('Est-ce faisable ?', 'Is it feasible?')} lede={t('Oui, si les générations passent par Dailies.', 'Yes, if generations go through Dailies.')}>
        <p>
          {t('Runway et Kling proposent des API où chaque génération est une tâche avec un statut. Dailies peut donc enregistrer le prompt, le modèle et le statut de chaque génération.', 'Runway and Kling offer APIs where each generation is a task with a status. So Dailies can record the prompt, model and status of every generation.')}
        </p>
        <p>
          {t('Le coût se calcule avant de lancer : chaque modèle coûte un nombre fixe de crédits par seconde. Durée × tarif donne l’estimation du bouton.', 'The cost is known before launching: each model costs a fixed number of credits per second. Duration × rate gives the button’s estimate.')}
        </p>
        <p className="text-black/60">
          {t('La limite : une génération faite hors de Dailies n’est pas captée. Un import manuel la rattache au bon plan.', 'The limit: a generation made outside Dailies isn’t captured. A manual import attaches it to the right shot.')}
        </p>
      </Chapter>

      {/* PRINCIPLES */}
      <Chapter n={10} title={t('Le système', 'The system')} lede={t('Deux modes, une seule grammaire.', 'Two modes, one grammar.')}>
        <p>
          {t('Le studio passe ses journées sur des images : interface sombre et dense. Le client vient valider : interface claire et calme. Mêmes composants, cinq statuts qui ne changent jamais de couleur.', 'The studio spends its days on images: a dark, dense interface. The client comes to approve: a light, calm one. Same components, five statuses that never change colour.')}
        </p>
      </Chapter>
      <DailiesSystem />

      <Chapter n={11} title={t('Choix de design', 'Design choices')}>
        <p>
          {t(
            'Les trois premiers viennent d’une analyse du studio Shovel sur le site de la marque Hyeja : garder les gestes connus, changer la surface.',
            'The first three come from Shovel studio’s breakdown of the Hyeja brand site: keep familiar gestures, change the surface.'
          )}
        </p>
      </Chapter>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-black/15 border border-black/15">
        {principles(t).map((p, i) => (
          <div key={p.title} className="bg-white p-5 md:p-6 space-y-2">
            <span className="text-[13px] text-black/45">0{i + 1}</span>
            <h4 className="text-[13px] font-medium">{p.title}</h4>
            <p className="text-xs text-black/50 leading-relaxed">{p.text}</p>
          </div>
        ))}
      </div>

      {/* METRICS */}
      <Chapter n={12} title={t('Comment savoir si ça marche', 'How to know it works')}>
        <p>
          {t('Cinq mesures, une par hypothèse, que les premiers tests rempliront.', 'Five measures, one per assumption, that the first tests will fill in.')}
        </p>
      </Chapter>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-black/15 border border-black/15">
        {metrics(t).map((x, i) => (
          <div key={x.m} className="bg-white p-5 md:p-6 space-y-2">
            <span className="text-[13px] text-black/45">0{i + 1}</span>
            <h4 className="text-[13px] font-medium">{x.m}</h4>
            <p className="text-xs text-black/50 leading-relaxed">{x.why}</p>
          </div>
        ))}
      </div>

      {/* NEXT */}
      <Chapter n={13} title={t('La suite', 'What’s next')}>
        <p>
          {t('Prochaine étape : faire tester le parcours revue → validation à des studios qui produisent de la vidéo IA.', 'Next step: have studios that make AI video test the review → approval flow.')}
        </p>
        <p>
          <a href="/dailies/prototype/index.html" className="underline underline-offset-2">
            {t('Ouvrir le prototype', 'Open the prototype')} →
          </a>
        </p>
      </Chapter>
    </ProjectPage>
  );
}
