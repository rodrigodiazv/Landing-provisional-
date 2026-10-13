// FlowSuite — legal texts (single source for the landing modal and the standalone legal pages).
// Facts used: operator identity, address and contact as published by FlowSuite. Anything not
// confirmed is NOT asserted. Review with a lawyer before relying on these texts commercially.
(function () {
  const UPDATED = '13.10.2026';
  const MAIL = '<a href="mailto:info@flowsuite.ch">info@flowsuite.ch</a>';
  const ADDR = 'Rodrigo A. Díaz Videla · FlowSuite<br>Chemin de la Raverettaz 6, 1862 Ormont-Dessous (Les Mosses), Vaud, ' ;
  const PHONES = '+41 77 941 35 32 · +34 634 13 44 66 (WhatsApp)';
  const FDPIC = '<a href="https://www.edoeb.admin.ch" target="_blank" rel="noopener noreferrer">edoeb.admin.ch</a>';

  // Sub-processors actually used by the site/stack. Countries only where the provider's seat is public knowledge.
  const SUBS = {
    es: '<ul><li><strong>Vercel Inc.</strong> (EE. UU.) — alojamiento de la web y de las funciones del servidor.</li><li><strong>Make (Celonis)</strong> — automatización del formulario; región de datos UE (eu1).</li><li><strong>Airtable / Formagrid Inc.</strong> (EE. UU.) — registro de solicitudes, si se activa.</li><li><strong>Infomaniak Network SA</strong> (Suiza) — dominio y correo electrónico.</li><li><strong>ElevenLabs</strong>, <strong>Snowie.ai</strong> y <strong>Twilio Inc.</strong> — voz, agente conversacional y telefonía/SMS, solo cuando se activa un agente para un cliente.</li></ul>',
    fr: '<ul><li><strong>Vercel Inc.</strong> (États-Unis) — hébergement du site et des fonctions serveur.</li><li><strong>Make (Celonis)</strong> — automatisation du formulaire ; région de données UE (eu1).</li><li><strong>Airtable / Formagrid Inc.</strong> (États-Unis) — registre des demandes, si activé.</li><li><strong>Infomaniak Network SA</strong> (Suisse) — domaine et e-mail.</li><li><strong>ElevenLabs</strong>, <strong>Snowie.ai</strong> et <strong>Twilio Inc.</strong> — voix, agent conversationnel et téléphonie/SMS, uniquement lorsqu’un agent est activé pour un client.</li></ul>',
    de: '<ul><li><strong>Vercel Inc.</strong> (USA) — Hosting der Website und der Serverfunktionen.</li><li><strong>Make (Celonis)</strong> — Automatisierung des Formulars; Datenregion EU (eu1).</li><li><strong>Airtable / Formagrid Inc.</strong> (USA) — Erfassung der Anfragen, falls aktiviert.</li><li><strong>Infomaniak Network SA</strong> (Schweiz) — Domain und E-Mail.</li><li><strong>ElevenLabs</strong>, <strong>Snowie.ai</strong> und <strong>Twilio Inc.</strong> — Stimme, Gesprächsagent und Telefonie/SMS, nur wenn für einen Kunden ein Agent aktiviert wird.</li></ul>',
    it: '<ul><li><strong>Vercel Inc.</strong> (USA) — hosting del sito e delle funzioni server.</li><li><strong>Make (Celonis)</strong> — automazione del modulo; regione dati UE (eu1).</li><li><strong>Airtable / Formagrid Inc.</strong> (USA) — registro delle richieste, se attivato.</li><li><strong>Infomaniak Network SA</strong> (Svizzera) — dominio ed e-mail.</li><li><strong>ElevenLabs</strong>, <strong>Snowie.ai</strong> e <strong>Twilio Inc.</strong> — voce, agente conversazionale e telefonia/SMS, solo quando un agente viene attivato per un cliente.</li></ul>',
    en: '<ul><li><strong>Vercel Inc.</strong> (USA) — hosting of the website and server functions.</li><li><strong>Make (Celonis)</strong> — form automation; EU data region (eu1).</li><li><strong>Airtable / Formagrid Inc.</strong> (USA) — request log, if enabled.</li><li><strong>Infomaniak Network SA</strong> (Switzerland) — domain and e-mail.</li><li><strong>ElevenLabs</strong>, <strong>Snowie.ai</strong> and <strong>Twilio Inc.</strong> — voice, conversational agent and telephony/SMS, only when an agent is activated for a customer.</li></ul>',
  };

  const L = {
    es: {
      tabs: { imprint: 'Aviso legal', privacy: 'Privacidad', terms: 'Condiciones', dpa: 'DPA', cookies: 'Cookies' },
      updated: 'Última actualización: ' + UPDATED,
      imprint: `<h3>Titular del sitio</h3><p>${ADDR}Suiza<br>Forma jurídica: empresa individual (Einzelfirma), actividad a título accesorio<br>Email: ${MAIL} · Tel.: ${PHONES}</p>
<h3>Responsable del contenido</h3><p>Rodrigo A. Díaz Videla (dirección anterior).</p>
<h3>Fase beta</h3><p>FlowSuite está en fase beta. Las funciones, precios y textos pueden cambiar. Los precios mostrados son orientativos y no constituyen una oferta vinculante hasta la firma de un contrato.</p>
<h3>Ejemplos</h3><p>Los nombres de negocios y conversaciones que aparecen en las demostraciones de esta web son <strong>ejemplos ficticios</strong> con fines ilustrativos.</p>
<h3>Enlaces externos</h3><p>No somos responsables del contenido de sitios de terceros enlazados desde esta web.</p>
<h3>Propiedad intelectual</h3><p>Textos, diseño y logotipo de FlowSuite están protegidos por la Ley suiza de derechos de autor (LDA). No se permite su reproducción sin autorización previa.</p>`,
      privacy: `<h3>1. Responsable del tratamiento</h3><p>${ADDR}Suiza · ${MAIL}</p>
<h3>2. Marco legal</h3><p>Ley federal suiza de protección de datos (nLPD) y, cuando ofrecemos servicios a personas en la UE/EEE, el Reglamento General de Protección de Datos (RGPD).</p>
<h3>3. Qué datos tratamos y para qué</h3><ul>
<li><strong>Formulario de acceso beta</strong>: nombre, negocio, email, teléfono (opcional), sector y lo que quieras automatizar. Finalidad: responder a tu solicitud y darte acceso. Base: medidas precontractuales y tu consentimiento (art. 6.1.a y b RGPD; art. 31 nLPD).</li>
<li><strong>Contacto por email o WhatsApp</strong>: los datos que nos envíes, para responderte.</li>
<li><strong>Agentes IA de clientes</strong>: cuando un cliente activa un agente, las conversaciones de sus usuarios se procesan en nombre de ese cliente (ver DPA).</li>
<li><strong>Datos técnicos</strong>: el proveedor de alojamiento registra datos técnicos (p. ej. dirección IP, fecha y hora) para seguridad y funcionamiento. Base: interés legítimo (art. 6.1.f RGPD).</li>
<li><strong>Área cliente (beta)</strong>: en esta versión, la configuración del área cliente se guarda en el almacenamiento local de tu propio navegador.</li></ul>
<p>No vendemos datos personales ni los usamos para publicidad. No tomamos decisiones individuales automatizadas con efectos jurídicos sobre ti.</p>
<h3>4. Inteligencia artificial</h3><p>FLOW y los agentes de FlowSuite son sistemas de IA: cuando hablas con ellos no hablas con una persona. Sus respuestas pueden contener errores.</p>
<h3>5. Proveedores (encargados)</h3>${SUBS.es}
<h3>6. Transferencias internacionales</h3><p>Algunos proveedores están en EE. UU. Solo transferimos datos a países sin nivel de protección adecuado con garantías previstas por la ley (p. ej. cláusulas contractuales tipo o certificación Swiss-US / EU-US Data Privacy Framework) conforme a los arts. 16–17 nLPD y 44–49 RGPD.</p>
<h3>7. Conservación</h3><p>Conservamos los datos solo mientras sean necesarios para la finalidad indicada o mientras la ley lo exija (p. ej. 10 años para documentos contables, art. 958f CO). Después los suprimimos.</p>
<h3>8. Tus derechos</h3><p>Acceso, rectificación, supresión, limitación, oposición, portabilidad y retirada del consentimiento en cualquier momento (arts. 25–32 nLPD; arts. 7.3 y 15–22 RGPD). Escríbenos a ${MAIL}. Puedes reclamar ante el Encargado federal de protección de datos y transparencia (PFPDT, ${FDPIC}) o ante la autoridad de control de tu país de la UE.</p>
<h3>9. Menores</h3><p>El servicio no está dirigido a menores de 16 años.</p>
<h3>10. Seguridad</h3><p>La web se sirve solo por HTTPS, el acceso de administración está protegido en el servidor y aplicamos medidas técnicas y organizativas adecuadas al riesgo.</p>
<h3>11. Cambios</h3><p>Podemos actualizar esta política. La fecha de la última versión figura arriba.</p>`,
      terms: `<h3>1. Prestador</h3><p>${ADDR}Suiza · ${MAIL}</p>
<h3>2. Objeto</h3><p>FlowSuite ofrece agentes de inteligencia artificial y automatizaciones para negocios (atención, captación de contactos, agenda y contenido).</p>
<h3>3. Fase beta</h3><p>El acceso beta es gratuito y sin compromiso. Las funciones pueden cambiar o interrumpirse. FlowSuite puede finalizar el programa beta con 30 días de preaviso.</p>
<h3>4. Planes de pago</h3><p>Los precios se indican en CHF. Un plan de pago solo se activa con tu aceptación expresa de una oferta concreta. Puedes cancelar con 30 días de preaviso; sin permanencia.</p>
<h3>5. Obligaciones del cliente</h3><ul><li>Usar el servicio de forma lícita y no para spam, fraude o contenidos ilegales.</li><li>Informar a sus propios clientes de que hablan con un sistema de IA y disponer de base legal para tratar sus datos.</li><li>Revisar el contenido generado por IA antes de publicarlo.</li></ul>
<h3>6. Propiedad intelectual</h3><p>La plataforma y sus componentes pertenecen a FlowSuite. El contenido y los datos que aportes siguen siendo tuyos; nos concedes el derecho de usarlos solo para prestarte el servicio.</p>
<h3>7. Responsabilidad</h3><p>El servicio beta se presta «tal cual», sin garantía de disponibilidad. En la medida permitida por la ley, la responsabilidad se limita a los importes pagados en los 12 meses anteriores. No se excluye la responsabilidad por dolo o negligencia grave (art. 100 CO).</p>
<h3>8. Protección de datos</h3><p>Ver la Política de privacidad y el DPA.</p>
<h3>9. Ley y jurisdicción</h3><p>Derecho suizo. Tribunales del cantón de Vaud. Los consumidores conservan la protección imperativa y el fuero que les reconozca la ley de su país de residencia.</p>`,
      dpa: `<h3>Encargo de tratamiento (art. 9 nLPD / art. 28 RGPD)</h3><p>Cuando FlowSuite trata datos de los clientes de un cliente (p. ej. conversaciones con su agente), el cliente es responsable del tratamiento y FlowSuite actúa como encargado. FlowSuite se compromete a:</p>
<ul><li>tratar los datos solo según las instrucciones documentadas del cliente;</li><li>garantizar la confidencialidad de las personas autorizadas;</li><li>aplicar medidas técnicas y organizativas adecuadas al riesgo;</li><li>recurrir solo a los subencargados indicados abajo e informar de cambios;</li><li>ayudar al cliente a atender los derechos de los interesados;</li><li>notificar sin demora indebida cualquier violación de seguridad que afecte a sus datos;</li><li>suprimir o devolver los datos al finalizar el servicio, salvo obligación legal de conservarlos.</li></ul>
<h3>Subencargados</h3>${SUBS.es}<p>Puedes solicitar el DPA completo para firmar en ${MAIL}.</p>`,
      cookies: `<h3>Cookies y almacenamiento</h3><p>Esta web <strong>no usa cookies de seguimiento ni de publicidad</strong>, ni herramientas de analítica. Las fuentes tipográficas se sirven desde nuestro propio servidor.</p>
<ul><li><strong>Almacenamiento local del navegador</strong> (técnicamente necesario): idioma elegido, aviso de cookies y, si usas el área cliente beta, su configuración.</li><li><strong>Cookie de sesión de administración</strong> (HttpOnly, solo para el titular): necesaria para el acceso al panel; caduca a la hora.</li></ul>
<p>Puedes borrar estos datos en cualquier momento desde la configuración de tu navegador.</p>`,
    },
    fr: {
      tabs: { imprint: 'Mentions légales', privacy: 'Confidentialité', terms: 'Conditions', dpa: 'DPA', cookies: 'Cookies' },
      updated: 'Dernière mise à jour : ' + UPDATED,
      imprint: `<h3>Éditeur du site</h3><p>${ADDR}Suisse<br>Forme juridique : entreprise individuelle (raison individuelle), activité accessoire<br>E-mail : ${MAIL} · Tél. : ${PHONES}</p>
<h3>Responsable du contenu</h3><p>Rodrigo A. Díaz Videla (adresse ci-dessus).</p>
<h3>Phase bêta</h3><p>FlowSuite est en phase bêta. Les fonctions, prix et textes peuvent changer. Les prix affichés sont indicatifs et ne constituent pas une offre ferme avant la conclusion d’un contrat.</p>
<h3>Exemples</h3><p>Les noms d’entreprises et conversations des démonstrations de ce site sont des <strong>exemples fictifs</strong> à but illustratif.</p>
<h3>Liens externes</h3><p>Nous ne sommes pas responsables du contenu des sites tiers liés depuis ce site.</p>
<h3>Propriété intellectuelle</h3><p>Textes, design et logo de FlowSuite sont protégés par la loi suisse sur le droit d’auteur (LDA). Toute reproduction sans autorisation préalable est interdite.</p>`,
      privacy: `<h3>1. Responsable du traitement</h3><p>${ADDR}Suisse · ${MAIL}</p>
<h3>2. Cadre légal</h3><p>Loi fédérale sur la protection des données (nLPD) et, lorsque nous offrons des services à des personnes dans l’UE/EEE, le Règlement général sur la protection des données (RGPD).</p>
<h3>3. Données traitées et finalités</h3><ul>
<li><strong>Formulaire d’accès bêta</strong> : nom, entreprise, e-mail, téléphone (facultatif), secteur et ce que vous souhaitez automatiser. Finalité : répondre à votre demande et vous donner accès. Base : mesures précontractuelles et votre consentement (art. 6.1.a et b RGPD ; art. 31 nLPD).</li>
<li><strong>Contact par e-mail ou WhatsApp</strong> : les données que vous nous envoyez, pour vous répondre.</li>
<li><strong>Agents IA des clients</strong> : lorsqu’un client active un agent, les conversations de ses utilisateurs sont traitées pour le compte de ce client (voir DPA).</li>
<li><strong>Données techniques</strong> : l’hébergeur enregistre des données techniques (p. ex. adresse IP, date et heure) pour la sécurité et le fonctionnement. Base : intérêt légitime (art. 6.1.f RGPD).</li>
<li><strong>Espace client (bêta)</strong> : dans cette version, la configuration de l’espace client est enregistrée dans le stockage local de votre propre navigateur.</li></ul>
<p>Nous ne vendons pas de données personnelles et ne les utilisons pas à des fins publicitaires. Nous ne prenons pas de décisions individuelles automatisées produisant des effets juridiques.</p>
<h3>4. Intelligence artificielle</h3><p>FLOW et les agents FlowSuite sont des systèmes d’IA : vous ne parlez pas avec une personne. Leurs réponses peuvent contenir des erreurs.</p>
<h3>5. Prestataires (sous-traitants)</h3>${SUBS.fr}
<h3>6. Transferts internationaux</h3><p>Certains prestataires sont situés aux États-Unis. Les données ne sont transférées vers des pays sans niveau de protection adéquat qu’avec les garanties prévues par la loi (p. ex. clauses contractuelles types ou certification Swiss-US / EU-US Data Privacy Framework), conformément aux art. 16–17 nLPD et 44–49 RGPD.</p>
<h3>7. Conservation</h3><p>Nous conservons les données uniquement le temps nécessaire à la finalité ou exigé par la loi (p. ex. 10 ans pour les pièces comptables, art. 958f CO), puis nous les supprimons.</p>
<h3>8. Vos droits</h3><p>Accès, rectification, effacement, limitation, opposition, portabilité et retrait du consentement à tout moment (art. 25–32 nLPD ; art. 7.3 et 15–22 RGPD). Écrivez-nous à ${MAIL}. Vous pouvez déposer une plainte auprès du Préposé fédéral à la protection des données et à la transparence (PFPDT, ${FDPIC}) ou de l’autorité de contrôle de votre pays de l’UE.</p>
<h3>9. Mineurs</h3><p>Le service ne s’adresse pas aux personnes de moins de 16 ans.</p>
<h3>10. Sécurité</h3><p>Le site est servi uniquement en HTTPS, l’accès d’administration est protégé côté serveur et nous appliquons des mesures techniques et organisationnelles adaptées au risque.</p>
<h3>11. Modifications</h3><p>Nous pouvons mettre à jour cette politique. La date de la dernière version figure ci-dessus.</p>`,
      terms: `<h3>1. Prestataire</h3><p>${ADDR}Suisse · ${MAIL}</p>
<h3>2. Objet</h3><p>FlowSuite propose des agents d’intelligence artificielle et des automatisations pour les entreprises (accueil, prospection, agenda et contenu).</p>
<h3>3. Phase bêta</h3><p>L’accès bêta est gratuit et sans engagement. Les fonctions peuvent changer ou être interrompues. FlowSuite peut mettre fin au programme bêta moyennant un préavis de 30 jours.</p>
<h3>4. Offres payantes</h3><p>Les prix sont indiqués en CHF. Une offre payante n’est activée qu’avec votre acceptation expresse d’une offre concrète. Résiliation avec préavis de 30 jours ; sans engagement de durée.</p>
<h3>5. Obligations du client</h3><ul><li>Utiliser le service de manière licite, pas pour du spam, de la fraude ou des contenus illicites.</li><li>Informer ses propres clients qu’ils interagissent avec un système d’IA et disposer d’une base légale pour traiter leurs données.</li><li>Vérifier les contenus générés par l’IA avant publication.</li></ul>
<h3>6. Propriété intellectuelle</h3><p>La plateforme et ses composants appartiennent à FlowSuite. Vos contenus et données restent les vôtres ; vous nous accordez le droit de les utiliser uniquement pour fournir le service.</p>
<h3>7. Responsabilité</h3><p>Le service bêta est fourni « en l’état », sans garantie de disponibilité. Dans la mesure permise par la loi, la responsabilité est limitée aux montants payés au cours des 12 derniers mois. La responsabilité pour dol ou faute grave n’est pas exclue (art. 100 CO).</p>
<h3>8. Protection des données</h3><p>Voir la politique de confidentialité et le DPA.</p>
<h3>9. Droit applicable et for</h3><p>Droit suisse. Tribunaux du canton de Vaud. Les consommateurs conservent la protection impérative et le for prévus par le droit de leur pays de résidence.</p>`,
      dpa: `<h3>Sous-traitance (art. 9 nLPD / art. 28 RGPD)</h3><p>Lorsque FlowSuite traite les données des clients d’un client (p. ex. conversations avec son agent), le client est responsable du traitement et FlowSuite agit comme sous-traitant. FlowSuite s’engage à :</p>
<ul><li>traiter les données uniquement selon les instructions documentées du client ;</li><li>garantir la confidentialité des personnes autorisées ;</li><li>appliquer des mesures techniques et organisationnelles adaptées au risque ;</li><li>ne recourir qu’aux sous-traitants ultérieurs indiqués ci-dessous et informer de tout changement ;</li><li>aider le client à répondre aux demandes des personnes concernées ;</li><li>notifier sans retard injustifié toute violation de sécurité touchant ses données ;</li><li>supprimer ou restituer les données à la fin du service, sauf obligation légale de conservation.</li></ul>
<h3>Sous-traitants ultérieurs</h3>${SUBS.fr}<p>Le DPA complet à signer peut être demandé à ${MAIL}.</p>`,
      cookies: `<h3>Cookies et stockage</h3><p>Ce site <strong>n’utilise ni cookies de suivi ou publicitaires</strong>, ni outils d’analyse. Les polices sont servies depuis notre propre serveur.</p>
<ul><li><strong>Stockage local du navigateur</strong> (techniquement nécessaire) : langue choisie, bannière cookies et, si vous utilisez l’espace client bêta, sa configuration.</li><li><strong>Cookie de session d’administration</strong> (HttpOnly, uniquement pour l’éditeur) : nécessaire à l’accès au panneau ; expire après une heure.</li></ul>
<p>Vous pouvez supprimer ces données à tout moment dans les réglages de votre navigateur.</p>`,
    },
    de: {
      tabs: { imprint: 'Impressum', privacy: 'Datenschutz', terms: 'AGB', dpa: 'AVV', cookies: 'Cookies' },
      updated: 'Letzte Aktualisierung: ' + UPDATED,
      imprint: `<h3>Betreiber der Website</h3><p>${ADDR}Schweiz<br>Rechtsform: Einzelfirma im Nebenerwerb<br>E-Mail: ${MAIL} · Tel.: ${PHONES}</p>
<h3>Verantwortlich für den Inhalt</h3><p>Rodrigo A. Díaz Videla (Adresse oben).</p>
<h3>Beta-Phase</h3><p>FlowSuite befindet sich in der Beta-Phase. Funktionen, Preise und Texte können sich ändern. Angezeigte Preise sind Richtwerte und kein verbindliches Angebot vor Vertragsabschluss.</p>
<h3>Beispiele</h3><p>Firmennamen und Gespräche in den Demos dieser Website sind <strong>fiktive Beispiele</strong> zur Veranschaulichung.</p>
<h3>Externe Links</h3><p>Für Inhalte verlinkter Websites Dritter übernehmen wir keine Verantwortung.</p>
<h3>Urheberrecht</h3><p>Texte, Design und Logo von FlowSuite sind durch das Schweizer Urheberrechtsgesetz (URG) geschützt. Eine Vervielfältigung ohne vorherige Zustimmung ist untersagt.</p>`,
      privacy: `<h3>1. Verantwortlicher</h3><p>${ADDR}Schweiz · ${MAIL}</p>
<h3>2. Rechtsgrundlagen</h3><p>Schweizer Datenschutzgesetz (revDSG) und, soweit wir Personen in der EU/im EWR Leistungen anbieten, die Datenschutz-Grundverordnung (DSGVO).</p>
<h3>3. Welche Daten wir wofür bearbeiten</h3><ul>
<li><strong>Beta-Anmeldeformular</strong>: Name, Unternehmen, E-Mail, Telefon (optional), Branche und Automatisierungswunsch. Zweck: Beantwortung Ihrer Anfrage und Zugang. Grundlage: vorvertragliche Massnahmen und Ihre Einwilligung (Art. 6 Abs. 1 lit. a und b DSGVO; Art. 31 DSG).</li>
<li><strong>Kontakt per E-Mail oder WhatsApp</strong>: die von Ihnen gesendeten Daten, um zu antworten.</li>
<li><strong>KI-Agenten von Kunden</strong>: Aktiviert ein Kunde einen Agenten, werden die Gespräche seiner Nutzer im Auftrag dieses Kunden bearbeitet (siehe AVV).</li>
<li><strong>Technische Daten</strong>: Der Hosting-Anbieter protokolliert technische Daten (z. B. IP-Adresse, Datum und Uhrzeit) für Sicherheit und Betrieb. Grundlage: berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).</li>
<li><strong>Kundenbereich (Beta)</strong>: In dieser Version wird die Konfiguration des Kundenbereichs im lokalen Speicher Ihres eigenen Browsers abgelegt.</li></ul>
<p>Wir verkaufen keine Personendaten und nutzen sie nicht für Werbung. Es finden keine automatisierten Einzelentscheidungen mit Rechtswirkung statt.</p>
<h3>4. Künstliche Intelligenz</h3><p>FLOW und die FlowSuite-Agenten sind KI-Systeme: Sie sprechen nicht mit einem Menschen. Antworten können Fehler enthalten.</p>
<h3>5. Dienstleister (Auftragsbearbeiter)</h3>${SUBS.de}
<h3>6. Bekanntgabe ins Ausland</h3><p>Einige Dienstleister befinden sich in den USA. Daten werden in Länder ohne angemessenes Schutzniveau nur mit gesetzlich vorgesehenen Garantien übermittelt (z. B. Standardvertragsklauseln oder Zertifizierung nach dem Swiss-US / EU-US Data Privacy Framework), gemäss Art. 16–17 DSG und Art. 44–49 DSGVO.</p>
<h3>7. Aufbewahrung</h3><p>Wir bewahren Daten nur so lange auf, wie es für den Zweck nötig oder gesetzlich vorgeschrieben ist (z. B. 10 Jahre für Buchhaltungsunterlagen, Art. 958f OR), und löschen sie danach.</p>
<h3>8. Ihre Rechte</h3><p>Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenherausgabe und jederzeitiger Widerruf der Einwilligung (Art. 25–32 DSG; Art. 7 Abs. 3 und 15–22 DSGVO). Schreiben Sie an ${MAIL}. Sie können sich beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB, ${FDPIC}) oder bei der Aufsichtsbehörde Ihres EU-Landes beschweren.</p>
<h3>9. Minderjährige</h3><p>Der Dienst richtet sich nicht an Personen unter 16 Jahren.</p>
<h3>10. Sicherheit</h3><p>Die Website wird ausschliesslich über HTTPS ausgeliefert, der Admin-Zugang ist serverseitig geschützt und wir treffen dem Risiko angemessene technische und organisatorische Massnahmen.</p>
<h3>11. Änderungen</h3><p>Wir können diese Erklärung anpassen. Das Datum der aktuellen Fassung steht oben.</p>`,
      terms: `<h3>1. Anbieter</h3><p>${ADDR}Schweiz · ${MAIL}</p>
<h3>2. Gegenstand</h3><p>FlowSuite bietet KI-Agenten und Automatisierungen für Unternehmen (Kundenkontakt, Leadgewinnung, Termine und Inhalte).</p>
<h3>3. Beta-Phase</h3><p>Der Beta-Zugang ist kostenlos und unverbindlich. Funktionen können sich ändern oder unterbrochen werden. FlowSuite kann das Beta-Programm mit 30 Tagen Vorankündigung beenden.</p>
<h3>4. Kostenpflichtige Pläne</h3><p>Preise in CHF. Ein kostenpflichtiger Plan wird nur nach Ihrer ausdrücklichen Annahme eines konkreten Angebots aktiviert. Kündigung mit 30 Tagen Frist; keine Mindestlaufzeit.</p>
<h3>5. Pflichten des Kunden</h3><ul><li>Rechtmässige Nutzung, kein Spam, Betrug oder rechtswidrige Inhalte.</li><li>Eigene Kunden darüber informieren, dass sie mit einem KI-System sprechen, und über eine Rechtsgrundlage für deren Daten verfügen.</li><li>KI-generierte Inhalte vor der Veröffentlichung prüfen.</li></ul>
<h3>6. Geistiges Eigentum</h3><p>Die Plattform und ihre Bestandteile gehören FlowSuite. Ihre Inhalte und Daten bleiben Ihre; Sie räumen uns das Recht ein, sie nur zur Erbringung des Dienstes zu nutzen.</p>
<h3>7. Haftung</h3><p>Der Beta-Dienst wird «wie besehen» ohne Verfügbarkeitsgarantie erbracht. Soweit gesetzlich zulässig, ist die Haftung auf die in den letzten 12 Monaten bezahlten Beträge beschränkt. Die Haftung für Vorsatz und grobe Fahrlässigkeit bleibt vorbehalten (Art. 100 OR).</p>
<h3>8. Datenschutz</h3><p>Siehe Datenschutzerklärung und AVV.</p>
<h3>9. Recht und Gerichtsstand</h3><p>Schweizer Recht. Gerichte des Kantons Waadt. Konsumenten behalten den zwingenden Schutz und Gerichtsstand ihres Wohnsitzstaates.</p>`,
      dpa: `<h3>Auftragsbearbeitung (Art. 9 DSG / Art. 28 DSGVO)</h3><p>Bearbeitet FlowSuite Daten der Kunden eines Kunden (z. B. Gespräche mit dessen Agenten), ist der Kunde Verantwortlicher und FlowSuite Auftragsbearbeiter. FlowSuite verpflichtet sich:</p>
<ul><li>Daten nur nach dokumentierten Weisungen des Kunden zu bearbeiten;</li><li>die Vertraulichkeit der berechtigten Personen sicherzustellen;</li><li>dem Risiko angemessene technische und organisatorische Massnahmen zu treffen;</li><li>nur die unten genannten Unterauftragsbearbeiter einzusetzen und über Änderungen zu informieren;</li><li>den Kunden bei Betroffenenanfragen zu unterstützen;</li><li>Datensicherheitsverletzungen unverzüglich zu melden;</li><li>Daten bei Vertragsende zu löschen oder zurückzugeben, sofern keine gesetzliche Aufbewahrungspflicht besteht.</li></ul>
<h3>Unterauftragsbearbeiter</h3>${SUBS.de}<p>Den vollständigen AVV zur Unterzeichnung erhalten Sie unter ${MAIL}.</p>`,
      cookies: `<h3>Cookies und Speicher</h3><p>Diese Website verwendet <strong>keine Tracking- oder Werbe-Cookies</strong> und keine Analyse-Tools. Schriften werden von unserem eigenen Server geladen.</p>
<ul><li><strong>Lokaler Browserspeicher</strong> (technisch notwendig): gewählte Sprache, Cookie-Hinweis und – falls Sie den Beta-Kundenbereich nutzen – dessen Konfiguration.</li><li><strong>Admin-Sitzungscookie</strong> (HttpOnly, nur für den Betreiber): für den Zugang zum Panel nötig; läuft nach einer Stunde ab.</li></ul>
<p>Sie können diese Daten jederzeit in Ihren Browsereinstellungen löschen.</p>`,
    },
    it: {
      tabs: { imprint: 'Note legali', privacy: 'Privacy', terms: 'Condizioni', dpa: 'DPA', cookies: 'Cookie' },
      updated: 'Ultimo aggiornamento: ' + UPDATED,
      imprint: `<h3>Titolare del sito</h3><p>${ADDR}Svizzera<br>Forma giuridica: ditta individuale, attività accessoria<br>E-mail: ${MAIL} · Tel.: ${PHONES}</p>
<h3>Responsabile dei contenuti</h3><p>Rodrigo A. Díaz Videla (indirizzo sopra).</p>
<h3>Fase beta</h3><p>FlowSuite è in fase beta. Funzioni, prezzi e testi possono cambiare. I prezzi indicati sono orientativi e non costituiscono un’offerta vincolante prima della firma di un contratto.</p>
<h3>Esempi</h3><p>I nomi di attività e le conversazioni nelle demo di questo sito sono <strong>esempi fittizi</strong> a scopo illustrativo.</p>
<h3>Link esterni</h3><p>Non siamo responsabili dei contenuti dei siti di terzi collegati.</p>
<h3>Proprietà intellettuale</h3><p>Testi, design e logo di FlowSuite sono protetti dalla legge svizzera sul diritto d’autore (LDA). È vietata la riproduzione senza autorizzazione preventiva.</p>`,
      privacy: `<h3>1. Titolare del trattamento</h3><p>${ADDR}Svizzera · ${MAIL}</p>
<h3>2. Quadro giuridico</h3><p>Legge federale sulla protezione dei dati (nLPD) e, quando offriamo servizi a persone nell’UE/SEE, il Regolamento generale sulla protezione dei dati (GDPR).</p>
<h3>3. Dati trattati e finalità</h3><ul>
<li><strong>Modulo di accesso beta</strong>: nome, attività, e-mail, telefono (facoltativo), settore e cosa desideri automatizzare. Finalità: rispondere alla richiesta e darti accesso. Base: misure precontrattuali e consenso (art. 6.1.a e b GDPR; art. 31 nLPD).</li>
<li><strong>Contatto via e-mail o WhatsApp</strong>: i dati che ci invii, per risponderti.</li>
<li><strong>Agenti IA dei clienti</strong>: quando un cliente attiva un agente, le conversazioni dei suoi utenti sono trattate per conto di quel cliente (vedi DPA).</li>
<li><strong>Dati tecnici</strong>: il fornitore di hosting registra dati tecnici (es. indirizzo IP, data e ora) per sicurezza e funzionamento. Base: interesse legittimo (art. 6.1.f GDPR).</li>
<li><strong>Area clienti (beta)</strong>: in questa versione la configurazione dell’area clienti è salvata nella memoria locale del tuo browser.</li></ul>
<p>Non vendiamo dati personali né li usiamo per pubblicità. Non adottiamo decisioni individuali automatizzate con effetti giuridici.</p>
<h3>4. Intelligenza artificiale</h3><p>FLOW e gli agenti FlowSuite sono sistemi di IA: non stai parlando con una persona. Le risposte possono contenere errori.</p>
<h3>5. Fornitori (responsabili del trattamento)</h3>${SUBS.it}
<h3>6. Trasferimenti internazionali</h3><p>Alcuni fornitori si trovano negli USA. I dati sono trasferiti verso Paesi privi di protezione adeguata solo con le garanzie previste dalla legge (es. clausole contrattuali tipo o certificazione Swiss-US / EU-US Data Privacy Framework), ai sensi degli art. 16–17 nLPD e 44–49 GDPR.</p>
<h3>7. Conservazione</h3><p>Conserviamo i dati solo per il tempo necessario alla finalità o richiesto dalla legge (es. 10 anni per i documenti contabili, art. 958f CO), poi li cancelliamo.</p>
<h3>8. I tuoi diritti</h3><p>Accesso, rettifica, cancellazione, limitazione, opposizione, portabilità e revoca del consenso in qualsiasi momento (art. 25–32 nLPD; art. 7.3 e 15–22 GDPR). Scrivici a ${MAIL}. Puoi presentare reclamo all’Incaricato federale della protezione dei dati e della trasparenza (IFPDT, ${FDPIC}) o all’autorità di controllo del tuo Paese UE.</p>
<h3>9. Minori</h3><p>Il servizio non è rivolto a minori di 16 anni.</p>
<h3>10. Sicurezza</h3><p>Il sito è servito solo via HTTPS, l’accesso di amministrazione è protetto lato server e applichiamo misure tecniche e organizzative adeguate al rischio.</p>
<h3>11. Modifiche</h3><p>Possiamo aggiornare questa informativa. La data dell’ultima versione è indicata sopra.</p>`,
      terms: `<h3>1. Fornitore</h3><p>${ADDR}Svizzera · ${MAIL}</p>
<h3>2. Oggetto</h3><p>FlowSuite offre agenti di intelligenza artificiale e automazioni per le attività (accoglienza, acquisizione contatti, agenda e contenuti).</p>
<h3>3. Fase beta</h3><p>L’accesso beta è gratuito e senza impegno. Le funzioni possono cambiare o essere interrotte. FlowSuite può terminare il programma beta con 30 giorni di preavviso.</p>
<h3>4. Piani a pagamento</h3><p>Prezzi in CHF. Un piano a pagamento si attiva solo con la tua accettazione espressa di un’offerta concreta. Disdetta con 30 giorni di preavviso; nessun vincolo di durata.</p>
<h3>5. Obblighi del cliente</h3><ul><li>Usare il servizio in modo lecito, non per spam, frodi o contenuti illeciti.</li><li>Informare i propri clienti che interagiscono con un sistema di IA e disporre di una base giuridica per i loro dati.</li><li>Verificare i contenuti generati dall’IA prima di pubblicarli.</li></ul>
<h3>6. Proprietà intellettuale</h3><p>La piattaforma e i suoi componenti appartengono a FlowSuite. I tuoi contenuti e dati restano tuoi; ci concedi il diritto di usarli solo per fornire il servizio.</p>
<h3>7. Responsabilità</h3><p>Il servizio beta è fornito «così com’è», senza garanzia di disponibilità. Nei limiti di legge, la responsabilità è limitata agli importi pagati negli ultimi 12 mesi. Non è esclusa la responsabilità per dolo o colpa grave (art. 100 CO).</p>
<h3>8. Protezione dei dati</h3><p>Vedi l’informativa privacy e il DPA.</p>
<h3>9. Legge e foro</h3><p>Diritto svizzero. Tribunali del Canton Vaud. I consumatori mantengono la tutela imperativa e il foro previsti dalla legge del loro Paese di residenza.</p>`,
      dpa: `<h3>Trattamento per conto (art. 9 nLPD / art. 28 GDPR)</h3><p>Quando FlowSuite tratta dati dei clienti di un cliente (es. conversazioni con il suo agente), il cliente è titolare e FlowSuite responsabile del trattamento. FlowSuite si impegna a:</p>
<ul><li>trattare i dati solo secondo istruzioni documentate del cliente;</li><li>garantire la riservatezza delle persone autorizzate;</li><li>applicare misure tecniche e organizzative adeguate al rischio;</li><li>ricorrere solo ai sub-responsabili indicati sotto e comunicare eventuali modifiche;</li><li>assistere il cliente nel rispondere alle richieste degli interessati;</li><li>notificare senza ingiustificato ritardo ogni violazione di sicurezza dei suoi dati;</li><li>cancellare o restituire i dati alla fine del servizio, salvo obblighi legali di conservazione.</li></ul>
<h3>Sub-responsabili</h3>${SUBS.it}<p>Il DPA completo da firmare può essere richiesto a ${MAIL}.</p>`,
      cookies: `<h3>Cookie e memoria</h3><p>Questo sito <strong>non usa cookie di tracciamento o pubblicitari</strong> né strumenti di analisi. I font sono serviti dal nostro server.</p>
<ul><li><strong>Memoria locale del browser</strong> (tecnicamente necessaria): lingua scelta, avviso cookie e, se usi l’area clienti beta, la sua configurazione.</li><li><strong>Cookie di sessione di amministrazione</strong> (HttpOnly, solo per il titolare): necessario per accedere al pannello; scade dopo un’ora.</li></ul>
<p>Puoi cancellare questi dati in qualsiasi momento dalle impostazioni del browser.</p>`,
    },
    en: {
      tabs: { imprint: 'Legal notice', privacy: 'Privacy', terms: 'Terms', dpa: 'DPA', cookies: 'Cookies' },
      updated: 'Last updated: ' + UPDATED,
      imprint: `<h3>Site operator</h3><p>${ADDR}Switzerland<br>Legal form: sole proprietorship (Einzelfirma), secondary activity<br>E-mail: ${MAIL} · Phone: ${PHONES}</p>
<h3>Responsible for content</h3><p>Rodrigo A. Díaz Videla (address above).</p>
<h3>Beta phase</h3><p>FlowSuite is in beta. Features, prices and texts may change. Prices shown are indicative and are not a binding offer until a contract is signed.</p>
<h3>Examples</h3><p>Business names and conversations in the demos on this site are <strong>fictitious examples</strong> for illustration only.</p>
<h3>External links</h3><p>We are not responsible for the content of third-party sites linked from this site.</p>
<h3>Intellectual property</h3><p>FlowSuite texts, design and logo are protected by Swiss copyright law (CopA). Reproduction without prior permission is not allowed.</p>`,
      privacy: `<h3>1. Controller</h3><p>${ADDR}Switzerland · ${MAIL}</p>
<h3>2. Legal framework</h3><p>Swiss Federal Act on Data Protection (FADP) and, where we offer services to people in the EU/EEA, the General Data Protection Regulation (GDPR).</p>
<h3>3. What we process and why</h3><ul>
<li><strong>Beta access form</strong>: name, business, e-mail, phone (optional), sector and what you want to automate. Purpose: answer your request and give you access. Basis: pre-contractual steps and your consent (Art. 6(1)(a) and (b) GDPR; Art. 31 FADP).</li>
<li><strong>Contact by e-mail or WhatsApp</strong>: the data you send us, to reply.</li>
<li><strong>Customers’ AI agents</strong>: when a customer activates an agent, its users’ conversations are processed on behalf of that customer (see DPA).</li>
<li><strong>Technical data</strong>: the hosting provider logs technical data (e.g. IP address, date and time) for security and operation. Basis: legitimate interest (Art. 6(1)(f) GDPR).</li>
<li><strong>Customer area (beta)</strong>: in this version, customer-area settings are stored in your own browser’s local storage.</li></ul>
<p>We do not sell personal data or use it for advertising. We do not make automated individual decisions with legal effects.</p>
<h3>4. Artificial intelligence</h3><p>FLOW and the FlowSuite agents are AI systems: you are not talking to a person. Answers may contain mistakes.</p>
<h3>5. Providers (processors)</h3>${SUBS.en}
<h3>6. International transfers</h3><p>Some providers are in the USA. Data is only transferred to countries without adequate protection with legal safeguards (e.g. standard contractual clauses or Swiss-US / EU-US Data Privacy Framework certification), under Arts. 16–17 FADP and 44–49 GDPR.</p>
<h3>7. Retention</h3><p>We keep data only as long as needed for the purpose or required by law (e.g. 10 years for accounting records, Art. 958f CO), then delete it.</p>
<h3>8. Your rights</h3><p>Access, rectification, erasure, restriction, objection, portability and withdrawal of consent at any time (Arts. 25–32 FADP; Arts. 7(3) and 15–22 GDPR). Write to ${MAIL}. You can complain to the Federal Data Protection and Information Commissioner (FDPIC, ${FDPIC}) or to the supervisory authority of your EU country.</p>
<h3>9. Minors</h3><p>The service is not directed at people under 16.</p>
<h3>10. Security</h3><p>The site is served over HTTPS only, admin access is protected server-side and we apply technical and organisational measures appropriate to the risk.</p>
<h3>11. Changes</h3><p>We may update this policy. The date of the current version is shown above.</p>`,
      terms: `<h3>1. Provider</h3><p>${ADDR}Switzerland · ${MAIL}</p>
<h3>2. Subject</h3><p>FlowSuite provides AI agents and automations for businesses (customer contact, lead capture, scheduling and content).</p>
<h3>3. Beta phase</h3><p>Beta access is free and without commitment. Features may change or be interrupted. FlowSuite may end the beta programme with 30 days’ notice.</p>
<h3>4. Paid plans</h3><p>Prices in CHF. A paid plan is only activated when you expressly accept a specific offer. Cancel with 30 days’ notice; no minimum term.</p>
<h3>5. Customer obligations</h3><ul><li>Use the service lawfully, not for spam, fraud or illegal content.</li><li>Tell your own customers they are interacting with an AI system and have a legal basis for their data.</li><li>Review AI-generated content before publishing it.</li></ul>
<h3>6. Intellectual property</h3><p>The platform and its components belong to FlowSuite. Your content and data remain yours; you grant us the right to use them only to provide the service.</p>
<h3>7. Liability</h3><p>The beta service is provided “as is”, without availability guarantee. To the extent permitted by law, liability is limited to the amounts paid in the previous 12 months. Liability for intent or gross negligence is not excluded (Art. 100 CO).</p>
<h3>8. Data protection</h3><p>See the Privacy policy and the DPA.</p>
<h3>9. Law and jurisdiction</h3><p>Swiss law. Courts of the Canton of Vaud. Consumers keep the mandatory protection and venue granted by the law of their country of residence.</p>`,
      dpa: `<h3>Data processing (Art. 9 FADP / Art. 28 GDPR)</h3><p>When FlowSuite processes data of a customer’s own clients (e.g. conversations with its agent), the customer is the controller and FlowSuite the processor. FlowSuite undertakes to:</p>
<ul><li>process data only on the customer’s documented instructions;</li><li>ensure the confidentiality of authorised persons;</li><li>apply technical and organisational measures appropriate to the risk;</li><li>use only the sub-processors listed below and inform of changes;</li><li>help the customer respond to data-subject requests;</li><li>notify any security breach affecting its data without undue delay;</li><li>delete or return the data when the service ends, unless the law requires retention.</li></ul>
<h3>Sub-processors</h3>${SUBS.en}<p>The full DPA for signature is available on request at ${MAIL}.</p>`,
      cookies: `<h3>Cookies and storage</h3><p>This site uses <strong>no tracking or advertising cookies</strong> and no analytics tools. Fonts are served from our own server.</p>
<ul><li><strong>Browser local storage</strong> (strictly necessary): chosen language, cookie notice and, if you use the beta customer area, its settings.</li><li><strong>Admin session cookie</strong> (HttpOnly, operator only): needed to access the panel; expires after one hour.</li></ul>
<p>You can delete this data at any time in your browser settings.</p>`,
    },
  };

  window.FS_LEGAL = L;
  window.FS_LEGAL_DOCS = ['imprint', 'privacy', 'terms', 'dpa', 'cookies'];
})();
