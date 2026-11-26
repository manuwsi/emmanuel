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
        context: t('Projet indépendant, en cours', 'Independent product design case study, in progress'),
        role: t('Cadrage, UX/UI, prototype codé', 'Framing, UX/UI, coded prototype'),
        tools: t('HTML/CSS avec Claude', 'HTML/CSS with Claude'),
      }}
      intro={t(
        <>
          <p>
            Une vidéo IA de 30 secondes pour une marque, c&apos;est des dizaines de plans et des
            centaines de générations, réparties entre plusieurs outils. À la fin, il faut retrouver la
            bonne version, savoir ce qu&apos;elle a coûté, et la faire valider par un client qui
            n&apos;a pas suivi le détail.
          </p>
          <p>
            Dailies est un outil web pour ces studios. Le nom vient du cinéma : les dailies sont les
            rushes qu&apos;on revoit chaque jour pour décider quoi garder.
          </p>
          <p className="text-black/60">
            Le studio, le client et le film sont fictifs. Les images viennent de mon projet Higan.
          </p>
        </>,
        <>
          <p>
            A 30-second AI video for a brand means dozens of shots and hundreds of generations, spread
            across several tools. At the end, someone has to find the right version, know what it cost,
            and get it approved by a client who didn&apos;t follow the details.
          </p>
          <p>
            Dailies is a web tool for those studios. The name comes from film: dailies are the rushes
            you review every day to decide what to keep.
          </p>
          <p className="text-black/60">
            The studio, client and film are fictional. The images come from my Higan project.
          </p>
        </>
      )}
    >
      <Media src="/dailies/01-projet.webp" alt={t('Dailies — le projet et ses huit plans', 'Dailies — the project and its eight shots')} {...W} priority />
      <p className="text-[13px] text-black/50 pt-2">
        <a href="/dailies/prototype/index.html" className="underline underline-offset-2 hover:text-black">
          {t('Ouvrir le prototype cliquable', 'Open the clickable prototype')}
        </a>{' '}
        — {t('à voir sur ordinateur.', 'best on a computer.')}
      </p>

      {/* PROBLEM */}
      <Chapter n={1} title={t('Le problème', 'The problem')} lede={t('Trop de versions, pas assez de traces.', 'Too many versions, not enough trace.')}>
        <p>
          {t(
            'Cinq hypothèses de départ, que je dois encore confirmer en parlant à des gens qui produisent de la vidéo IA en studio.',
            'Five starting assumptions, which I still need to confirm by talking to people who make AI video in studios.'
          )}
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
          {t(
            'Frame.io est la référence de la revue vidéo : commentaires au timecode, versions empilées, statuts de validation. Mais il reçoit des fichiers finis, sans le prompt ni le coût derrière. Preview, une plateforme de production IA récente, garde l’origine de chaque image et fonctionne avec tous les modèles ; sa page ne détaille ni la revue client ni les coûts.',
            'Frame.io is the reference for video review: timecoded comments, stacked versions, approval statuses. But it receives finished files, without the prompt or cost behind them. Preview, a recent AI production platform, keeps the origin of every image and works with any model; its page doesn’t detail client review or costs.'
          )}
        </p>
        <p>
          {t(
            'Dailies prend la revue de l’un et la traçabilité de l’autre, et ajoute ce qu’aucun des deux ne met en avant : le coût avant de générer.',
            'Dailies takes review from one and traceability from the other, and adds what neither puts forward: the cost before generating.'
          )}
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
        {t('D’après leurs pages publiques, novembre 2026. « Non précisé » : la page n’en parle pas, ce qui ne veut pas dire que la fonction n’existe pas.', 'Based on their public pages, November 2026. “Not specified”: the page doesn’t mention it, which doesn’t mean the feature doesn’t exist.')}
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
          {t(
            'Sur la page d’un plan, l’artiste voit les variantes gardées et, pour celle choisie, tout ce qui permet de la refaire : prompt, modèle, image de départ, graine, coût. Le prompt se modifie au même endroit avant de régénérer.',
            'On a shot’s page, the artist sees the variants kept and, for the chosen one, everything needed to redo it: prompt, model, source image, seed, cost. The prompt can be edited in place before regenerating.'
          )}
        </p>
      </Chapter>
      <Media src="/dailies/02-plan.webp" alt={t('Dailies — un plan et ses variantes', 'Dailies — a shot and its variants')} {...W} />
      <Chapter title={t('Comparer avant d’envoyer', 'Compare before sending')}>
        <p>
          {t(
            'Deux versions côte à côte, lues en même temps. Les mots qui changent dans le prompt sont surlignés : on voit d’où vient la différence d’image.',
            'Two versions side by side, played in sync. The words that change in the prompt are highlighted, so you see where the visual difference comes from.'
          )}
        </p>
      </Chapter>
      <Media src="/dailies/03-comparer.webp" alt={t('Dailies — comparer la v3 et la v4', 'Dailies — comparing v3 and v4')} {...W} />

      {/* CLIENT */}
      <Chapter n={6} title={t('Côté client', 'Client side')} lede={t('Le client ne voit qu’une version, et commente au bon endroit.', 'The client sees one version, and comments in the right place.')}>
        <p>
          {t(
            'Chaque commentaire est rattaché à un plan et à un timecode. En haut, ce qui a changé depuis la version précédente, pour ne pas tout revoir.',
            'Each comment is tied to a shot and a timecode. At the top, what changed since the previous version, so there’s no need to rewatch everything.'
          )}
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
          {t(
            'Côté studio, chaque commentaire devient une tâche sur le bon plan, avec son coût estimé. On peut régénérer directement depuis le retour.',
            'On the studio side, each comment becomes a task on the right shot, with its estimated cost. You can regenerate straight from the feedback.'
          )}
        </p>
      </Chapter>
      <Media src="/dailies/06-retours.webp" alt={t('Dailies — retours à traiter', 'Dailies — feedback to handle')} {...W} />

      {/* PERSONAS */}
      <Chapter n={7} title={t('Revue par personas', 'Persona review')} lede={t('Avant de montrer l’outil à de vraies personnes, je l’ai parcouru avec trois profils.', 'Before showing the tool to real people, I walked through it as three profiles.')}>
        <p>
          {t(
            'Ce n’est pas un test utilisateur : chaque profil avait une tâche précise, et j’ai noté où le parcours bloquait. Ça a déjà changé quatre écrans. Les écrans et le prototype sont codés directement en HTML/CSS : une correction se republie en quelques minutes.',
            'This isn’t user testing: each profile had a specific task, and I noted where the flow got stuck. It already changed four screens. The screens and prototype are coded directly in HTML/CSS, so a fix can be republished in minutes.'
          )}
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
          {t(
            'Trois cas que le parcours idéal ne montre pas : le budget qui ne suffit plus, une génération qui échoue, et un client qui ouvre un ancien lien sur son téléphone.',
            'Three cases the happy path doesn’t show: a budget that no longer covers the work, a generation that fails, and a client opening an old link on their phone.'
          )}
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
          {t(
            'Runway et Kling proposent des API. Une génération y est une tâche : on l’envoie avec un prompt et une image de départ, elle passe par « en cours », puis « réussie » ou « échouée », et l’outil est prévenu à chaque changement. Dailies peut donc enregistrer le prompt, le modèle, l’image de départ et le statut de chaque génération, et afficher l’écran « en cours » ou « échec » au bon moment.',
            'Runway and Kling offer APIs. A generation there is a task: you send it with a prompt and a source image, it goes through “processing”, then “succeeded” or “failed”, and the tool is notified at each change. Dailies can therefore store the prompt, model, source image and status of every generation, and show the “processing” or “failed” screen at the right time.'
          )}
        </p>
        <p>
          {t(
            'Le coût se calcule avant de lancer : chez Runway, chaque modèle coûte un nombre fixe de crédits par seconde de vidéo. Durée × tarif du modèle donne l’estimation affichée sur le bouton.',
            'Cost can be worked out before launching: at Runway, each model costs a fixed number of credits per second of video. Duration × model rate gives the estimate shown on the button.'
          )}
        </p>
        <p className="text-black/60">
          {t(
            'Ne pas compter une génération ratée dans le budget est un choix produit : selon le fournisseur, elle peut quand même être facturée au studio. La limite : une génération faite directement dans l’appli Runway, hors de Dailies, n’est pas captée. Il faut donc un import manuel, où l’artiste dépose le fichier et colle le prompt. Et les vidéos renvoyées par certaines API expirent : Dailies doit les copier tout de suite.',
            'Not counting a failed generation in the budget is a product choice: depending on the provider, the studio may still be billed for it. The limit: a generation made directly in the Runway app, outside Dailies, isn’t captured. So there has to be a manual import, where the artist drops the file and pastes the prompt. And videos returned by some APIs expire: Dailies has to copy them right away.'
          )}
        </p>
      </Chapter>

      {/* PRINCIPLES */}
      <Chapter n={10} title={t('Le système', 'The system')} lede={t('Deux modes, une seule grammaire.', 'Two modes, one grammar.')}>
        <p>
          {t(
            'Le studio passe ses journées sur des images : son interface est sombre et dense. Le client vient valider : la sienne est claire et calme. Les deux partagent les mêmes composants, et cinq statuts qui ne changent jamais de couleur.',
            'The studio spends its days looking at images: its interface is dark and dense. The client comes to approve: theirs is light and calm. Both share the same components, and five statuses that never change colour.'
          )}
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
          {t(
            'Cinq mesures, une par hypothèse. Je n’ai pas encore de chiffres : ce sont elles que les premiers tests devront remplir.',
            'Five measures, one per assumption. I don’t have figures yet: these are what the first tests will have to fill in.'
          )}
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
          {t(
            'Confronter les cinq hypothèses à des personnes qui produisent de la vidéo IA en studio, puis leur faire tester le parcours revue → validation avec le prototype. Ce qu’elles diront remplacera la revue par personas.',
            'Check the five assumptions with people who make AI video in studios, then have them test the review → approval flow with the prototype. What they say will replace the persona review.'
          )}
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
