/* WHITE WOLF V63.5 — Topic Question Bank
 * Local academic question bank for Adaptive Revision.
 * Questions are attached to real topic IDs; no external API is required.
 */
(function(global){
  'use strict';
  var BANK={
    s1_1:[
      {id:'q_s1_1_01',q:'En spectroscopie UV/Visible, quelle grandeur est principalement mesurée ?',options:['L’absorbance','La masse volumique','La viscosité','La pression'],answer:0,why:'L’UV/Visible permet notamment de mesurer l’absorbance ou la transmission en fonction de la longueur d’onde.'},
      {id:'q_s1_1_02',q:'Selon Beer-Lambert, à conditions adaptées, l’absorbance A dépend de la concentration c selon quelle relation ?',options:['A = εlc','A = ε/c','A = c/εl','A = l/c'],answer:0,why:'La loi de Beer-Lambert s’écrit A = εlc.'}
    ],
    s1_2:[
      {id:'q_s1_2_01',q:'Quelle information est particulièrement caractéristique d’un spectre IR ?',options:['Les vibrations de liaisons moléculaires','Le nombre de neutrons','La masse totale de l’échantillon','La pression de vapeur'],answer:0,why:'La spectroscopie IR renseigne principalement sur les transitions vibrationnelles des liaisons moléculaires.'},
      {id:'q_s1_2_02',q:'Une bande IR autour de 1700 cm⁻¹ est typiquement associée à quelle vibration ?',options:['C=O','O–H libre','C–H aromatique uniquement','N≡N'],answer:0,why:'L’élongation C=O apparaît souvent dans une zone voisine de 1650–1750 cm⁻¹ selon le composé.'}
    ],
    s1_3:[
      {id:'q_s1_3_01',q:'En RMN 1H, le déplacement chimique δ est exprimé en quelle unité ?',options:['ppm','mol·L⁻¹','Pa','nm'],answer:0,why:'Le déplacement chimique δ est conventionnellement exprimé en ppm.'},
      {id:'q_s1_3_02',q:'Dans une RMN 1H, le nombre de signaux différents renseigne principalement sur…',options:['Le nombre d’environnements chimiques de protons','Le nombre exact de molécules','La masse molaire uniquement','La température d’ébullition'],answer:0,why:'Des protons chimiquement équivalents donnent le même déplacement chimique dans des conditions usuelles.'}
    ],
    s1_4:[
      {id:'q_s1_4_01',q:'La RMN 13C sert principalement à observer…',options:['Les environnements chimiques des carbones','Les neutrons','La conductivité','La viscosité'],answer:0,why:'La RMN 13C permet de distinguer les environnements chimiques des atomes de carbone.'},
      {id:'q_s1_4_02',q:'Pourquoi le spectre RMN 13C présente-t-il souvent moins de signaux que le nombre total d’atomes de carbone ?',options:['Parce que des carbones peuvent être chimiquement équivalents','Parce que les carbones ne donnent jamais de signal','Parce que tous les carbones ont toujours le même déplacement','Parce que la RMN mesure uniquement les hydrogènes'],answer:0,why:'Les éléments de symétrie et l’équivalence chimique peuvent regrouper plusieurs carbones sur un même signal.'}
    ],
    s1_5:[
      {id:'q_s1_5_01',q:'En spectroscopie d’absorption atomique, l’absorption mesurée est liée principalement à…',options:['Des atomes libres dans un état approprié','Des molécules intactes uniquement','La viscosité du solvant','La pression atmosphérique seule'],answer:0,why:'L’AAS mesure l’absorption d’un rayonnement par des atomes libres, généralement après atomisation.'},
      {id:'q_s1_5_02',q:'Quel est le rôle de l’atomisation en AAS ?',options:['Transformer l’échantillon en atomes libres','Refroidir uniquement la lampe','Augmenter la viscosité','Créer des cristaux'],answer:0,why:'L’atomisation produit les atomes libres nécessaires à l’absorption atomique.'}
    ],
    s1_6:[
      {id:'q_s1_6_01',q:'La spectroscopie d’émission atomique repose sur la mesure de…',options:['Rayonnements émis par des atomes ou ions excités','La masse du récipient','La viscosité uniquement','La pression osmotique'],answer:0,why:'Après excitation, les espèces atomiques/ioniques peuvent émettre un rayonnement caractéristique.'},
      {id:'q_s1_6_02',q:'Un plasma en spectrométrie d’émission sert notamment à…',options:['Fournir une source d’excitation et d’atomisation efficace','Mesurer directement la masse volumique','Éliminer toute longueur d’onde','Refroidir l’échantillon'],answer:0,why:'Un plasma suffisamment énergétique peut atomiser et exciter les éléments de l’échantillon.'}
    ],
    s1_7:[
      {id:'q_s1_7_01',q:'Pourquoi utiliser plusieurs techniques spectroscopiques pour élucider une structure ?',options:['Parce qu’elles fournissent des informations complémentaires','Parce qu’elles donnent toujours le même signal','Pour éviter toute interprétation','Parce qu’une seule technique ne mesure jamais rien'],answer:0,why:'UV/Visible, IR et RMN apportent des informations différentes qui peuvent se compléter.'},
      {id:'q_s1_7_02',q:'Quelle stratégie est la plus cohérente pour identifier un composé inconnu ?',options:['Croiser plusieurs indices expérimentaux cohérents','Utiliser une seule valeur sans contrôle','Ignorer les données contradictoires','Choisir la structure la plus simple sans preuve'],answer:0,why:'L’identification robuste repose sur la convergence de plusieurs observations expérimentales.'}
    ],
    s1_8:[
      {id:'q_s1_8_01',q:'Lors de l’élucidation d’une structure, quel principe est essentiel ?',options:['Confronter la structure proposée à l’ensemble des données expérimentales','Se baser sur une seule bande spectrale','Ignorer la formule brute','Choisir au hasard parmi les isomères'],answer:0,why:'Une structure doit être compatible avec l’ensemble des données disponibles.'},
      {id:'q_s1_8_02',q:'La formule brute d’un composé permet notamment de…',options:['Contraindre les structures possibles','Donner automatiquement le spectre IR','Mesurer directement le pH','Remplacer toutes les techniques spectroscopiques'],answer:0,why:'La formule brute fixe notamment les nombres d’atomes et contribue à limiter les structures compatibles.'}
    ],
    s2_1:[
      {id:'q_s2_1_01',q:'En AAS avec flamme, la flamme sert principalement à…',options:['Atomiser l’échantillon','Mesurer la masse directement','Produire des cristaux','Refroidir la solution'],answer:0,why:'La flamme transforme l’aérosol en espèces atomiques libres.'},
      {id:'q_s2_1_02',q:'Avant d’atteindre la flamme, une solution en AAS est généralement…',options:['Nébulisée en aérosol','Cristallisée','Polymérisée','Solidifiée'],answer:0,why:'La nébulisation transforme la solution en fines gouttelettes permettant son introduction dans la flamme.'}
    ],
    s2_2:[
      {id:'q_s2_2_01',q:'Une interférence en analyse atomique peut conduire à…',options:['Une mesure biaisée du signal','Une augmentation obligatoire de la précision','Une disparition de toute absorption','Une masse nulle'],answer:0,why:'Les interférences peuvent modifier le signal analytique et donc biaiser le résultat.'},
      {id:'q_s2_2_02',q:'Pourquoi faut-il contrôler les effets de matrice ?',options:['Parce que les constituants de l’échantillon peuvent influencer la réponse analytique','Parce que la matrice n’a jamais aucun effet','Pour modifier l’identité de l’analyte','Pour supprimer les étalons'],answer:0,why:'La matrice peut affecter atomisation, transport ou réponse instrumentale.'}
    ],
    s2_3:[
      {id:'q_s2_3_01',q:'L’atomisation électrothermique présente notamment l’intérêt de…',options:['Utiliser un petit volume d’échantillon et atteindre une forte sensibilité','Nécessiter toujours plusieurs litres','Mesurer uniquement des gaz','Supprimer toute étape d’atomisation'],answer:0,why:'Les fours électrothermiques permettent l’analyse de très petits volumes avec une bonne sensibilité.'},
      {id:'q_s2_3_02',q:'Dans un four graphite, les étapes thermiques servent notamment à…',options:['Sécher, pyrolyser puis atomiser l’échantillon','Uniquement refroidir','Cristalliser le solvant','Mesurer le pH'],answer:0,why:'Le programme thermique contrôle successivement le séchage, la pyrolyse et l’atomisation.'}
    ],
    s2_4:[
      {id:'q_s2_4_01',q:'La génération d’hydrures est utilisée pour certains éléments capables de former…',options:['Des hydrures volatils','Des polymères toujours insolubles','Des cristaux de glace','Des sels uniquement solides'],answer:0,why:'Certains éléments forment des hydrures volatils qui peuvent être transportés vers l’atomiseur.'},
      {id:'q_s2_4_02',q:'Quel est l’objectif analytique principal de la génération d’hydrures ?',options:['Améliorer le transport et la sensibilité pour certains éléments','Éliminer toute calibration','Mesurer la température ambiante','Supprimer l’analyte'],answer:0,why:'La formation d’une espèce volatile peut améliorer l’introduction et la sensibilité.'}
    ],
    s2_5:[
      {id:'q_s2_5_01',q:'En émission atomique avec flamme, le signal provient principalement…',options:['Du rayonnement émis par des espèces excitées','De la masse du brûleur','De la viscosité seule','De la couleur du laboratoire'],answer:0,why:'Les atomes ou ions excités émettent des longueurs d’onde caractéristiques.'},
      {id:'q_s2_5_02',q:'L’intensité d’une raie d’émission peut être liée à…',options:['La population des espèces excitées','La taille du récipient uniquement','La couleur de la flamme uniquement','La masse du détecteur'],answer:0,why:'Dans des conditions données, l’intensité dépend notamment de la population des espèces dans l’état excité.'}
    ],
    s2_6:[
      {id:'q_s2_6_01',q:'Pourquoi utiliser un plasma en émission atomique ?',options:['Pour disposer d’une source d’excitation très énergétique et stable','Pour supprimer toute excitation','Pour mesurer uniquement les solides','Pour refroidir les atomes'],answer:0,why:'Les plasmas sont des sources d’excitation/atomisation efficaces pour l’analyse multiélémentaire.'},
      {id:'q_s2_6_02',q:'Une analyse par plasma peut être particulièrement intéressante pour…',options:['L’analyse simultanée de plusieurs éléments','La mesure exclusive de la viscosité','La détermination directe du goût','La pesée du récipient'],answer:0,why:'Les techniques d’émission avec plasma permettent notamment l’analyse multiélémentaire.'}
    ],
    s2_7:[
      {id:'q_s2_7_01',q:'Une norme ISO en laboratoire sert principalement à…',options:['Définir des exigences ou pratiques reconnues pour un domaine donné','Remplacer toute mesure expérimentale','Garantir automatiquement un résultat exact','Choisir le matériel selon sa couleur'],answer:0,why:'Les normes formalisent des exigences, méthodes ou bonnes pratiques selon leur domaine d’application.'},
      {id:'q_s2_7_02',q:'Pour appliquer une norme analytique correctement, il faut notamment…',options:['Vérifier son domaine d’application et ses exigences','Ignorer les conditions opératoires','Modifier librement les critères sans justification','Supprimer les contrôles qualité'],answer:0,why:'La conformité dépend notamment du domaine d’application, des conditions et des exigences documentées.'}
    ],
    s3_1:[
      {id:'q_s3_1_01',q:'En analyse statistique, l’écart-type décrit principalement…',options:['La dispersion des valeurs autour de la moyenne','La valeur maximale uniquement','Le nombre d’échantillons uniquement','La couleur d’un échantillon'],answer:0,why:'L’écart-type est une mesure de dispersion.'},
      {id:'q_s3_1_02',q:'La moyenne arithmétique est obtenue en…',options:['Additionnant les valeurs puis en divisant par leur nombre','Prenant toujours la valeur maximale','Multipliant toutes les valeurs','Prenant uniquement la première mesure'],answer:0,why:'La moyenne est la somme des observations divisée par leur nombre.'}
    ],
    s3_2:[
      {id:'q_s3_2_01',q:'L’objectif principal d’un échantillonnage représentatif est de…',options:['Obtenir un échantillon reflétant au mieux la population ou le lot étudié','Prendre systématiquement le plus petit volume','Éviter toute homogénéisation','Choisir uniquement la partie la plus visible'],answer:0,why:'La représentativité conditionne fortement la validité de l’analyse du lot.'},
      {id:'q_s3_2_02',q:'Pourquoi l’homogénéisation peut-elle être importante avant analyse ?',options:['Pour réduire les variations locales de composition','Pour augmenter artificiellement la concentration','Pour supprimer l’analyte','Pour changer la matrice'],answer:0,why:'L’homogénéisation vise à rendre la composition plus uniforme avant le prélèvement analytique.'}
    ],
    s3_3:[
      {id:'q_s3_3_01',q:'Le pH d’une solution aqueuse est lié principalement à…',options:['L’activité des ions H+','La masse du récipient','La couleur de la solution uniquement','La pression atmosphérique seule'],answer:0,why:'Le pH est défini à partir de l’activité des ions hydrogène.'},
      {id:'q_s3_3_02',q:'Une dilution d’une solution aqueuse consiste à…',options:['Ajouter du solvant pour diminuer la concentration','Ajouter obligatoirement du soluté','Éliminer tout le solvant','Changer le soluté en un autre'],answer:0,why:'La dilution diminue la concentration en augmentant le volume avec du solvant.'}
    ],
    s3_4:[
      {id:'q_s3_4_01',q:'Une méthode titrimétrique détermine généralement une quantité par…',options:['Mesure du volume d’un réactif de concentration connue','Pesée du récipient uniquement','Observation de la couleur sans protocole','Mesure de la pression uniquement'],answer:0,why:'Le titrage relie un volume de titrant connu à une quantité d’analyte via une réaction.'},
      {id:'q_s3_4_02',q:'Un titrant doit notamment avoir…',options:['Une concentration connue et adaptée au protocole','Une couleur obligatoirement bleue','Une température toujours nulle','Une masse inconnue'],answer:0,why:'La concentration du titrant est nécessaire au calcul de la quantité d’analyte.'}
    ],
    s3_5:[
      {id:'q_s3_5_01',q:'Lors d’un titrage acido-basique, l’équivalence correspond idéalement à…',options:['La quantité stœchiométrique de titrant ayant réagi','La fin de toute évaporation','La concentration nulle du solvant','Une température obligatoirement maximale'],answer:0,why:'À l’équivalence, les réactifs sont introduits dans les proportions stœchiométriques.'},
      {id:'q_s3_5_02',q:'À l’équivalence d’un titrage, quelle relation est centrale pour le calcul ?',options:['La relation stœchiométrique de la réaction','La masse du bécher','La couleur du titrant uniquement','La pression atmosphérique'],answer:0,why:'Le calcul repose sur la stœchiométrie entre analyte et titrant à l’équivalence.'}
    ],
    s3_6:[
      {id:'q_s3_6_01',q:'Un titrage par précipitation repose sur la formation de…',options:['Un composé peu soluble','Un gaz obligatoirement','Une flamme','Un polymère toujours soluble'],answer:0,why:'Le titrage par précipitation exploite une réaction formant un solide peu soluble.'},
      {id:'q_s3_6_02',q:'Pour exploiter un titrage par précipitation, il faut notamment connaître…',options:['La stœchiométrie de la réaction de précipitation','La couleur du récipient','La masse du support','La viscosité de l’air'],answer:0,why:'La stœchiométrie permet de relier le volume de titrant à la quantité d’analyte.'}
    ],
    s3_7:[
      {id:'q_s3_7_01',q:'Un titrage complexométrique utilise une réaction de…',options:['Complexation entre un ligand et un ion métallique','Combustion obligatoire','Précipitation de tous les solvants','Polymérisation'],answer:0,why:'La complexométrie exploite la formation de complexes entre métaux et ligands.'},
      {id:'q_s3_7_02',q:'Pourquoi contrôler le pH dans certains titrages complexométriques ?',options:['Parce que la formation et la stabilité des complexes dépendent du milieu','Parce que le pH n’a jamais aucun effet','Pour changer la masse du métal','Pour supprimer l’indicateur'],answer:0,why:'Le pH influence notamment les formes chimiques du ligand et la stabilité des complexes.'}
    ],
    s3_8:[
      {id:'q_s3_8_01',q:'Un titrage d’oxydoréduction met en jeu un transfert de…',options:['Électrons','Neutrons','Photons uniquement','Matière sans réaction'],answer:0,why:'Les réactions redox impliquent des transferts d’électrons.'},
      {id:'q_s3_8_02',q:'Dans une réaction redox, l’oxydant est l’espèce qui…',options:['Gagne des électrons','Perd toujours des protons uniquement','Ne réagit jamais','Gagne des neutrons'],answer:0,why:'Un oxydant accepte des électrons et est donc réduit.'}
    ],
    s3_9:[
      {id:'q_s3_9_01',q:'Une analyse gravimétrique repose principalement sur…',options:['La mesure d’une masse liée quantitativement à l’analyte','La mesure d’une couleur uniquement','La mesure de la pression','La RMN uniquement'],answer:0,why:'La gravimétrie exploite une masse mesurée après une transformation appropriée.'},
      {id:'q_s3_9_02',q:'Pour une précipitation gravimétrique, le précipité doit notamment être…',options:['De composition connue et suffisamment pur pour le calcul','Toujours liquide','De composition inconnue','Volatile à température ambiante'],answer:0,why:'La composition connue et la pureté du précipité sont essentielles au calcul.'}
    ],
    s4_1:[
      {id:'q_s4_1_01',q:'En chromatographie liquide, la séparation repose notamment sur…',options:['Les différences d’interaction avec la phase stationnaire et la phase mobile','La couleur uniquement','La masse du flacon','La température ambiante uniquement'],answer:0,why:'La rétention dépend des interactions entre analytes, phase stationnaire et phase mobile.'},
      {id:'q_s4_1_02',q:'En chromatographie, un composé fortement retenu par la phase stationnaire a généralement…',options:['Un temps de rétention plus élevé','Toujours un temps de rétention nul','Une masse nulle','Une pression infinie'],answer:0,why:'Une interaction plus forte avec la phase stationnaire tend à augmenter la rétention.'}
    ],
    s4_2:[
      {id:'q_s4_2_01',q:'Quel critère peut distinguer deux modes chromatographiques ?',options:['La nature des interactions et des phases utilisées','La couleur du laboratoire','La taille du flacon','Le nom de l’opérateur'],answer:0,why:'Les modes chromatographiques diffèrent notamment par les phases et mécanismes de séparation.'},
      {id:'q_s4_2_02',q:'La phase stationnaire est…',options:['La phase qui reste immobilisée dans le système chromatographique','Toujours un gaz','Toujours de l’eau','Le détecteur'],answer:0,why:'La phase stationnaire est immobilisée tandis que la phase mobile se déplace.'}
    ],
    s4_3:[
      {id:'q_s4_3_01',q:'Le rôle principal d’un détecteur chromatographique est de…',options:['Transformer le passage de l’analyte en un signal mesurable','Séparer les colonnes','Préparer le solvant','Peser l’échantillon'],answer:0,why:'Le détecteur convertit une propriété de l’effluent en signal analytique.'},
      {id:'q_s4_3_02',q:'Dans un chromatographe, la colonne est principalement le lieu où…',options:['La séparation des constituants s’effectue','Le signal est affiché uniquement','Les données sont imprimées','Le flacon est pesé'],answer:0,why:'Les interactions dans la colonne provoquent des rétentions différentes et donc la séparation.'}
    ],
    s4_4:[
      {id:'q_s4_4_01',q:'Optimiser une séparation chromatographique vise notamment à…',options:['Améliorer la résolution tout en gardant un temps d’analyse acceptable','Maximiser systématiquement le temps de rétention','Supprimer la phase mobile','Réduire toutes les interactions à zéro'],answer:0,why:'L’optimisation cherche un compromis entre résolution, durée, consommation et robustesse.'},
      {id:'q_s4_4_02',q:'Modifier la composition de la phase mobile peut influencer…',options:['La rétention et la sélectivité','Uniquement la couleur du détecteur','La masse molaire de l’analyte','Le nombre de protons'],answer:0,why:'La composition de la phase mobile influence les interactions et donc la rétention/sélectivité.'}
    ],
    s4_5:[
      {id:'q_s4_5_01',q:'La chromatographie en phase gazeuse est particulièrement adaptée aux composés…',options:['Volatils et suffisamment thermostables','Toujours ioniques en solution aqueuse','Uniquement métalliques','Toujours insolubles'],answer:0,why:'La GC nécessite que les analytes puissent être vaporisés sans décomposition excessive.'},
      {id:'q_s4_5_02',q:'Dans une GC, le gaz vecteur sert principalement à…',options:['Transporter les analytes à travers la colonne','Réagir avec tous les analytes','Remplacer le détecteur','Mesurer le pH'],answer:0,why:'Le gaz vecteur constitue la phase mobile gazeuse qui entraîne les analytes.'}
    ],
    s4_6:[
      {id:'q_s4_6_01',q:'L’électrophorèse capillaire sépare principalement les espèces selon leurs…',options:['Mobilités électrophorétiques dans un champ électrique','Couleurs','Masses des flacons','Températures d’ébullition uniquement'],answer:0,why:'La séparation dépend notamment de la charge, de la taille et des interactions avec le milieu.'},
      {id:'q_s4_6_02',q:'Le champ électrique en électrophorèse capillaire provoque…',options:['La migration des espèces chargées','La vaporisation obligatoire du solvant','La précipitation de tous les ions','La suppression du capillaire'],answer:0,why:'Les espèces chargées migrent sous l’effet du champ électrique.'}
    ],
    s4_7:[
      {id:'q_s4_7_01',q:'Le couplage LC/MS combine principalement…',options:['Une séparation chromatographique et une détection/identification par spectrométrie de masse','Deux colonnes de chromatographie identiques','Une RMN et une flamme','Une balance et un pH-mètre'],answer:0,why:'LC sépare les constituants tandis que MS fournit des informations liées aux ions et à leur rapport m/z.'},
      {id:'q_s4_7_02',q:'Le rapport m/z en spectrométrie de masse correspond à…',options:['La masse sur charge de l’ion','La concentration sur volume','La longueur d’onde sur absorbance','La pression sur température'],answer:0,why:'m/z désigne le rapport entre la masse de l’ion et sa charge.'}
    ],
    s5_1:[
      {id:'q_s5_1_01',q:'La microscopie électronique utilise principalement…',options:['Un faisceau d’électrons','Un faisceau de neutrons','Une flamme','Une solution titrante'],answer:0,why:'Les microscopes électroniques forment l’image à partir d’interactions entre électrons et matière.'},
      {id:'q_s5_1_02',q:'Un intérêt majeur de la microscopie électronique est…',options:['Une résolution élevée pour étudier la morphologie et la microstructure','La mesure directe du pH','La détermination automatique de la masse molaire','Le titrage des ions'],answer:0,why:'La longueur d’onde associée aux électrons permet une résolution très fine.'}
    ],
    s5_2:[
      {id:'q_s5_2_01',q:'La diffraction des rayons X sur poudre est particulièrement utile pour…',options:['Identifier des phases cristallines et étudier leur structure','Mesurer uniquement le pH','Déterminer directement la viscosité','Mesurer la masse du porte-échantillon'],answer:0,why:'Le diffractogramme permet notamment l’identification de phases cristallines.'},
      {id:'q_s5_2_02',q:'La loi de Bragg relie principalement…',options:['La longueur d’onde, l’espacement interréticulaire et l’angle de diffraction','La masse et le pH','La pression et la viscosité','La température et la concentration uniquement'],answer:0,why:'La relation de Bragg est nλ = 2d sinθ.'}
    ],
    s5_3:[
      {id:'q_s5_3_01',q:'La relation de Debye-Scherrer relie notamment la largeur d’un pic de diffraction à…',options:['La taille des cristallites','La masse du solvant','La pression atmosphérique uniquement','Le pH'],answer:0,why:'La largeur des raies peut être utilisée pour estimer la taille des cristallites.'},
      {id:'q_s5_3_02',q:'Dans l’approximation de Debye-Scherrer, un élargissement plus important du pic peut indiquer…',options:['Des cristallites plus petits','Des cristallites nécessairement plus grands','Une masse molaire nulle','Une concentration toujours maximale'],answer:0,why:'À autres paramètres constants, l’élargissement est inversement lié à la taille des cristallites.'}
    ],
    s5_4:[
      {id:'q_s5_4_01',q:'Une analyse qualitative des éléments cherche principalement à déterminer…',options:['Quels éléments sont présents','Uniquement la masse totale','Le pH exact sans instrument','La température de fusion de tous les composants'],answer:0,why:'L’analyse qualitative répond à la question de la présence ou de l’identité des éléments.'},
      {id:'q_s5_4_02',q:'Pour identifier un élément par une technique spectroscopique, on exploite notamment…',options:['Des signaux caractéristiques de cet élément','La couleur du récipient','Le volume du laboratoire','Le nom de l’opérateur'],answer:0,why:'Les éléments possèdent des signatures spectrales exploitables pour leur identification.'}
    ],
    s5_5:[
      {id:'q_s5_5_01',q:'L’ATG mesure principalement la variation de…',options:['Masse d’un échantillon en fonction de la température ou du temps','pH uniquement','Pression atmosphérique uniquement','Longueur de la cellule'],answer:0,why:'L’analyse thermogravimétrique suit la masse de l’échantillon pendant un programme thermique.'},
      {id:'q_s5_5_02',q:'L’ATD renseigne notamment sur…',options:['Les effets thermiques associés aux transformations','La masse molaire uniquement','La conductivité électrique seulement','Le nombre de protons'],answer:0,why:'L’analyse thermique différentielle détecte des différences de comportement thermique entre échantillon et référence.'}
    ],
    s5_6:[
      {id:'q_s5_6_01',q:'Le couplage ATG-CPG-MS peut servir à…',options:['Suivre une perte de masse et identifier les espèces volatiles dégagées','Mesurer uniquement le pH','Déterminer la dureté sans chauffage','Remplacer toutes les analyses'],answer:0,why:'ATG suit la perte de masse, la chromatographie sépare les volatils et MS apporte des informations d’identification.'},
      {id:'q_s5_6_02',q:'Pourquoi coupler plusieurs techniques analytiques ?',options:['Pour relier un événement thermique à une information de composition','Pour obtenir volontairement des résultats contradictoires','Pour supprimer les données','Pour éviter toute calibration'],answer:0,why:'Le couplage fournit des informations complémentaires sur le phénomène observé.'}
    ],
    s5_7:[
      {id:'q_s5_7_01',q:'L’analyse mécanique d’un composite vise notamment à caractériser…',options:['Sa réponse à une sollicitation mécanique','Uniquement sa couleur','Son pH','Son spectre RMN 1H'],answer:0,why:'Les essais mécaniques évaluent résistance, rigidité, déformation ou autres propriétés selon le protocole.'},
      {id:'q_s5_7_02',q:'Dans un composite, les propriétés mécaniques dépendent notamment…',options:['De la matrice, du renfort et de leur interface','Uniquement de la couleur','Uniquement de la masse du moule','Du nom commercial seulement'],answer:0,why:'La matrice, le renfort, leur architecture et l’interface influencent le comportement mécanique.'}
    ],
    s6_1:[
      {id:'q_s6_1_01',q:'Une norme définit généralement…',options:['Des exigences, règles ou méthodes reconnues pour un domaine','Une garantie absolue de résultat','La couleur obligatoire des équipements','Le programme personnel de l’analyste'],answer:0,why:'Une norme formalise des exigences ou pratiques applicables à son domaine.'},
      {id:'q_s6_1_02',q:'Pourquoi faut-il identifier la version d’une norme utilisée ?',options:['Parce que les exigences peuvent évoluer entre versions','Parce que le numéro n’a aucune importance','Pour modifier les résultats','Pour éviter la traçabilité'],answer:0,why:'La version permet de savoir précisément quelles exigences ont été appliquées.'}
    ],
    s6_2:[
      {id:'q_s6_2_01',q:'Le management de la qualité vise notamment à…',options:['Maîtriser et améliorer les processus afin d’obtenir des résultats fiables','Supprimer la documentation','Éviter les contrôles','Garantir qu’aucune erreur ne soit jamais possible'],answer:0,why:'La qualité repose sur la maîtrise, la traçabilité, l’évaluation et l’amélioration des processus.'},
      {id:'q_s6_2_02',q:'La traçabilité permet notamment de…',options:['Relier un résultat aux opérations et données qui l’ont produit','Modifier rétroactivement les mesures','Supprimer les étalonnages','Éviter toute identification'],answer:0,why:'La traçabilité documente l’historique et les conditions ayant conduit au résultat.'}
    ],
    s7_1:[
      {id:'q_s7_1_01',q:'Dans une analyse de risques, quel élément cherche-t-on notamment à identifier ?',options:['Les dangers et les scénarios susceptibles de produire un dommage','La couleur des équipements','Le nombre de bureaux','Le logo de l’entreprise'],answer:0,why:'L’analyse des risques vise notamment à identifier les dangers, événements redoutés et conséquences.'},
      {id:'q_s7_1_02',q:'Une mesure de prévention vise principalement à…',options:['Réduire la probabilité d’un événement dangereux ou son exposition','Augmenter le danger','Supprimer toute procédure','Remplacer l’analyse de risques'],answer:0,why:'La prévention agit en amont pour réduire la probabilité ou l’exposition au danger.'}
    ],
    s7_2:[
      {id:'q_s7_2_01',q:'Une procédure opérationnelle de sécurité sert notamment à…',options:['Décrire les actions et précautions à appliquer dans une situation donnée','Remplacer toute formation','Supprimer les équipements de protection','Ignorer les incidents'],answer:0,why:'Une procédure formalise les actions attendues et les mesures de sécurité.'},
      {id:'q_s7_2_02',q:'Après un incident, le retour d’expérience sert notamment à…',options:['Identifier les causes et améliorer les mesures de prévention','Chercher uniquement un responsable','Effacer les traces','Éviter toute modification'],answer:0,why:'Le retour d’expérience permet d’apprendre de l’événement et d’améliorer le système.'}
    ],
    s7_3:[
      {id:'q_s7_3_01',q:'La réglementation industrielle correspond principalement à…',options:['Des exigences légales et réglementaires applicables aux activités concernées','Des conseils sans aucune portée','Des préférences personnelles','Des règles de design'],answer:0,why:'La réglementation fixe des obligations légales dans son champ d’application.'},
      {id:'q_s7_3_02',q:'Avant d’appliquer une exigence réglementaire, il faut notamment vérifier…',options:['Son champ d’application et sa version en vigueur','Uniquement sa couleur','Le nom du fournisseur','La taille du laboratoire'],answer:0,why:'Le contexte, le champ et la version en vigueur déterminent l’applicabilité.'}
    ],
    s7_4:[
      {id:'q_s7_4_01',q:'Un incendie nécessite notamment la présence conjointe…',options:['D’un combustible, d’un comburant et d’une énergie d’activation','De trois solvants','D’eau uniquement','D’un détecteur uniquement'],answer:0,why:'Le triangle du feu représente combustible, comburant et énergie d’activation.'},
      {id:'q_s7_4_02',q:'Une action de prévention incendie peut consister à…',options:['Éloigner les sources d’ignition des matières combustibles','Augmenter les stocks combustibles près des flammes','Supprimer les contrôles','Bloquer les issues'],answer:0,why:'La maîtrise des sources d’ignition et des combustibles réduit le risque d’incendie.'}
    ],
    s7_5:[
      {id:'q_s7_5_01',q:'Une démarche d’hygiène en laboratoire vise notamment à…',options:['Limiter l’exposition aux contaminants et maintenir un environnement maîtrisé','Augmenter volontairement les contaminations','Supprimer le nettoyage','Ignorer les déchets'],answer:0,why:'L’hygiène contribue à réduire les contaminations et les expositions indésirables.'},
      {id:'q_s7_5_02',q:'La gestion des déchets doit notamment tenir compte…',options:['De leur nature et des filières d’élimination adaptées','Uniquement de leur couleur','Du poids du bureau','Du nom de l’analyste'],answer:0,why:'La nature et la dangerosité du déchet déterminent les précautions et filières appropriées.'}
    ],
    s8_1:[
      {id:'q_s8_1_01',q:'Un bilan matière sert principalement à…',options:['Relier les débits/quantités entrants, sortants et accumulés','Mesurer uniquement la température','Déterminer le pH automatiquement','Choisir une couleur de tuyauterie'],answer:0,why:'Le bilan matière repose sur la conservation de la matière, avec accumulation éventuelle.'},
      {id:'q_s8_1_02',q:'En régime stationnaire sans réaction ni accumulation, un bilan matière global implique…',options:['Débit entrant total = débit sortant total','Débit entrant = 0','Débit sortant = 0','Masse créée sans limite'],answer:0,why:'Sans accumulation, la conservation de la matière impose l’égalité des entrées et sorties globales.'}
    ],
    s8_2:[
      {id:'q_s8_2_01',q:'La mécanique des fluides étudie notamment…',options:['Le comportement des liquides et gaz en mouvement ou au repos','Uniquement les solides cristallins','Uniquement les réactions nucléaires','La grammaire scientifique'],answer:0,why:'Elle traite du comportement des fluides, de leur pression, vitesse et écoulement.'},
      {id:'q_s8_2_02',q:'La pression dans un fluide est une grandeur liée notamment…',options:['Aux forces exercées sur une surface','À la couleur du fluide','Au nombre de bureaux','À la masse du récipient uniquement'],answer:0,why:'La pression est une force normale rapportée à une surface.'}
    ],
    s8_3:[
      {id:'q_s8_3_01',q:'Le nombre de Reynolds sert notamment à caractériser…',options:['Le régime d’écoulement d’un fluide','La masse molaire uniquement','Le pH','La couleur d’une conduite'],answer:0,why:'Re permet de comparer les effets inertiels et visqueux et d’indiquer le régime d’écoulement.'},
      {id:'q_s8_3_02',q:'Un écoulement laminaire est généralement caractérisé par…',options:['Un mouvement relativement ordonné des couches de fluide','Des fluctuations totalement désordonnées à toutes les échelles','Une absence de viscosité','Une vitesse toujours nulle'],answer:0,why:'En régime laminaire, les couches de fluide s’écoulent de façon plus régulière.'}
    ],
    s8_4:[
      {id:'q_s8_4_01',q:'Un lit fluidisé est obtenu lorsque…',options:['Un fluide traverse un lit de particules avec une vitesse suffisante pour le fluidiser','Les particules sont totalement immobiles dans le vide','Le solide est dissous','Le fluide est supprimé'],answer:0,why:'La vitesse du fluide peut équilibrer le poids apparent des particules et créer un état fluidisé.'},
      {id:'q_s8_4_02',q:'Un lit fixe se distingue d’un lit fluidisé parce que…',options:['Les particules restent globalement immobiles dans le lit fixe','Le lit fixe ne contient jamais de fluide','Le lit fluidisé ne contient aucun solide','Le lit fixe fonctionne uniquement sous vide'],answer:0,why:'Dans un lit fixe, le solide reste immobile tandis que le fluide traverse le lit.'}
    ],
    s8_5:[
      {id:'q_s8_5_01',q:'Le transfert thermique peut se faire notamment par…',options:['Conduction, convection et rayonnement','Précipitation uniquement','Titrage uniquement','Chromatographie uniquement'],answer:0,why:'Ce sont les trois modes fondamentaux de transfert thermique.'},
      {id:'q_s8_5_02',q:'La conduction thermique correspond principalement à…',options:['Un transfert d’énergie à travers un milieu sous l’effet d’un gradient de température','Un transport obligatoire de matière à grande échelle','Une réaction chimique','Une séparation chromatographique'],answer:0,why:'La conduction transfère l’énergie thermique à travers le matériau sans mouvement macroscopique obligatoire de matière.'}
    ],
    s8_6:[
      {id:'q_s8_6_01',q:'Un transfert de matière est entraîné notamment par…',options:['Un gradient de concentration ou de potentiel chimique','La couleur du matériau','La masse du récipient','La pression atmosphérique uniquement'],answer:0,why:'Les différences de potentiel chimique ou de concentration peuvent provoquer un transfert de matière.'},
      {id:'q_s8_6_02',q:'La diffusion moléculaire correspond à…',options:['Un déplacement net dû à l’agitation moléculaire et aux gradients de concentration','Une réaction nucléaire','Une mesure de pH','Un transfert thermique uniquement'],answer:0,why:'La diffusion résulte du mouvement moléculaire et tend à réduire les gradients de concentration.'}
    ],
    s9_1:[
      {id:'q_s9_1_01',q:'L’énergie peut être définie comme…',options:['La capacité d’un système à produire un travail ou à provoquer une transformation','Une masse sans unité','Une température uniquement','Une couleur'],answer:0,why:'L’énergie est une grandeur physique associée à la capacité de produire du travail ou des transformations.'},
      {id:'q_s9_1_02',q:'L’unité SI de l’énergie est…',options:['Le joule','Le pascal','Le kelvin','Le mole'],answer:0,why:'L’unité SI de l’énergie est le joule (J).'}
    ],
    s9_2:[
      {id:'q_s9_2_01',q:'Une source d’énergie renouvelable est une source…',options:['Qui se reconstitue naturellement à une échelle compatible avec son usage','Qui est forcément nucléaire','Qui existe uniquement sous forme liquide','Qui ne peut jamais être transformée'],answer:0,why:'Le caractère renouvelable dépend de la capacité de renouvellement de la ressource à l’échelle considérée.'},
      {id:'q_s9_2_02',q:'La différence essentielle entre une source primaire et une énergie finale concerne…',options:['Le stade de transformation avant son utilisation','La couleur du combustible','La masse du bâtiment','Le nombre de capteurs'],answer:0,why:'L’énergie primaire correspond aux ressources avant transformations, tandis que l’énergie finale est livrée à l’utilisateur.'}
    ],
    s9_3:[
      {id:'q_s9_3_01',q:'Une transformation industrielle vise notamment à…',options:['Convertir des matières ou énergies en produits ou services selon un procédé maîtrisé','Éviter toute mesure','Supprimer les bilans','Fonctionner sans aucune variable opératoire'],answer:0,why:'Un procédé industriel organise des transformations sous des conditions contrôlées.'},
      {id:'q_s9_3_02',q:'Le rendement d’une transformation compare généralement…',options:['Une sortie utile à une entrée ou dépense correspondante','Deux couleurs','Deux noms de machines','La masse du laboratoire au volume du bureau'],answer:0,why:'Le rendement quantifie la part utile obtenue par rapport à la ressource engagée.'}
    ],
    s9_4:[
      {id:'q_s9_4_01',q:'Un échangeur thermique sert principalement à…',options:['Transférer de la chaleur entre deux fluides sans nécessairement les mélanger','Mesurer directement le pH','Séparer des ions par RMN','Peser les fluides'],answer:0,why:'L’échangeur transfère de l’énergie thermique entre fluides à travers une paroi ou selon sa conception.'},
      {id:'q_s9_4_02',q:'Une pompe sert principalement à…',options:['Fournir de l’énergie au fluide pour permettre son transport','Refroidir tous les fluides','Mesurer la concentration','Créer une réaction chimique'],answer:0,why:'La pompe augmente l’énergie mécanique du fluide afin de permettre son déplacement.'}
    ],
    s9_5:[
      {id:'q_s9_5_01',q:'L’efficacité énergétique cherche principalement à…',options:['Fournir un même service avec moins d’énergie consommée','Augmenter systématiquement les pertes','Supprimer toute mesure énergétique','Remplacer toute énergie par de la matière'],answer:0,why:'L’efficacité énergétique vise à réduire la consommation pour un service ou une production donnée.'},
      {id:'q_s9_5_02',q:'Un audit énergétique sert notamment à…',options:['Identifier les usages, pertes et possibilités d’amélioration énergétique','Supprimer les compteurs','Garantir zéro consommation','Choisir la couleur des machines'],answer:0,why:'L’audit analyse les usages et performances afin d’identifier des actions d’amélioration.'}
    ]
  };

  function fallback(topic){
    return {id:'fallback_'+(topic&&topic.id||'unknown'),q:'Rappel actif : quelle est l’idée, la relation ou le mécanisme essentiel que tu dois savoir expliquer pour « '+(topic&&topic.title||'ce chapitre')+' » ?',options:null,answer:null,why:'Aucune question MCQ dédiée n’est encore enregistrée pour ce topic. Formule ta réponse mentalement ou à l’oral avant de consulter ton cours.'};
  }
  function list(topicId,state){
    var base=(BANK[topicId]||[]).slice();
    var custom=state&&state.adaptiveCustomQuestions&&state.adaptiveCustomQuestions[topicId]||[];
    return base.concat(custom).map(function(q){if(!q.difficulty)q.difficulty='Medium';return q});
  }
  function all(topicId,state){return list(topicId,state)}
  function masteryScore(topic,state){
    try{
      if(global.WWMastery&&typeof global.WWMastery.score==='function') return Number(global.WWMastery.score(state,topic.id))||0;
    }catch(e){}
    var p=state&&state.progress&&state.progress[topic.id];
    return p&&Number.isFinite(Number(p.score))?Number(p.score):0;
  }
  function targetDifficulty(topic,state){
    var history=state&&state.adaptiveQuestionStats&&state.adaptiveQuestionStats[topic.id]||{};
    var keys=Object.keys(history),attempts=0,correct=0,wrong=0;
    keys.forEach(function(id){var h=history[id]||{};attempts+=Number(h.attempts)||0;correct+=Number(h.correct)||0;wrong+=Number(h.wrong)||0});
    var mastery=masteryScore(topic,state), accuracy=attempts?correct/attempts:null;
    var target=mastery<35?'Easy':(mastery<70?'Medium':'Hard');
    if(accuracy!==null && attempts>=2){
      if(accuracy<0.5) target=target==='Hard'?'Medium':'Easy';
      else if(accuracy>=0.85 && attempts>=3) target=target==='Easy'?'Medium':'Hard';
    }
    return {difficulty:target,mastery:Math.round(mastery),accuracy:accuracy===null?null:Math.round(accuracy*100),attempts:attempts,correct:correct,wrong:wrong};
  }
  function difficultyDistance(a,b){
    var order={Easy:0,Medium:1,Hard:2};return Math.abs((order[a]===undefined?1:order[a])-(order[b]===undefined?1:order[b]));
  }
  function get(topic,state){
    var listQ=list(topic&&topic.id,state);
    if(!listQ.length)return fallback(topic||{title:'ce chapitre'});
    var history=state&&state.adaptiveQuestionStats&&state.adaptiveQuestionStats[topic.id]||{};
    var target=targetDifficulty(topic,state), now=Date.now();
    var ranked=listQ.map(function(q){
      var h=history[q.id]||{}, attempts=Number(h.attempts)||0, correct=Number(h.correct)||0, wrong=Number(h.wrong)||0;
      var accuracy=attempts?correct/attempts:0;
      var days=Number(h.lastAnswered)?Math.max(0,(now-Number(h.lastAnswered))/86400000):999;
      var score=0;
      score += attempts===0 ? 42 : Math.max(0,20-Math.min(20,attempts*3));
      score += wrong>0 ? Math.min(30,(wrong/Math.max(1,attempts))*30) : 0;
      score += Math.min(15,days);
      score += difficultyDistance(q.difficulty,target.difficulty)===0?28:(difficultyDistance(q.difficulty,target.difficulty)===1?8:-8);
      if(accuracy<0.5&&attempts>=2) score += 8;
      if(accuracy>=0.85&&attempts>=3&&q.difficulty===target.difficulty) score += 5;
      return {q:q,score:score};
    }).sort(function(a,b){return b.score-a.score});
    var topScore=ranked[0].score, pool=ranked.filter(function(x){return x.score>=topScore-10}).slice(0,4);
    return pool[Math.floor(Math.random()*pool.length)].q;
  }
  function coverage(topics){
    var total=(topics||[]).length,covered=0,questions=0;
    (topics||[]).forEach(function(t){var n=(BANK[t.id]||[]).length;if(n){covered++;questions+=n}});
    return {topics:total,covered:covered,missing:Math.max(0,total-covered),questions:questions,coveragePercent:total?Math.round(covered/total*100):0};
  }
  global.WWAdaptiveQuiz={version:'63.5',get:get,list:list,all:all,coverage:coverage,targetDifficulty:targetDifficulty,bank:BANK};
})(window);
