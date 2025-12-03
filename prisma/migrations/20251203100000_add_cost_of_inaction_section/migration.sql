-- CreateTable
CREATE TABLE "cost_of_inaction_section" (
    "id" TEXT NOT NULL,
    "badgeText" TEXT NOT NULL DEFAULT 'Coût de ne rien faire',
    "title" TEXT NOT NULL DEFAULT 'Ce qui te coûte le plus cher aujourd''hui…',
    "subtitle" TEXT,
    "painPoints" JSONB NOT NULL DEFAULT '[]',
    "warningTitle" TEXT,
    "warningSubtitle" TEXT,
    "solutionText1" TEXT,
    "solutionText2" TEXT,
    "solutionHighlight" TEXT,
    "ctaTitle" TEXT,
    "ctaDescription" TEXT,
    "ctaButtonText" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cost_of_inaction_section_pkey" PRIMARY KEY ("id")
);

-- Insert default data
INSERT INTO "cost_of_inaction_section" (
    "id",
    "badgeText",
    "title",
    "subtitle",
    "painPoints",
    "warningTitle",
    "warningSubtitle",
    "solutionText1",
    "solutionText2",
    "solutionHighlight",
    "ctaTitle",
    "ctaDescription",
    "ctaButtonText",
    "updatedAt"
) VALUES (
    'default',
    'Coût de ne rien faire',
    'Ce qui te coûte le plus cher aujourd''hui…',
    'ce n''est pas ce que tu ne fais pas assez.<br /><strong class="text-orange-700">C''est de continuer à tout faire toi-même, sans structure claire ni véritable stratégie.</strong>',
    '["Créer du contenu non-stop sans vision d''ensemble.", "Laisser filer des ventes chaque jour faute d''un système optimisé.", "T''épuiser à maintenir un business qui dépend encore trop de toi."]',
    'Ne rien changer aujourd''hui = accepter que ton CA plafonne encore des mois.',
    'Ton système actuel bride ta croissance et siphonne ton énergie.',
    'Avec ma méthode, tu récupères du <strong class="text-primary-900">temps</strong>, de la <strong class="text-primary-900">clarté</strong>…',
    '… et tu casses enfin le plafond qui te bloque depuis trop longtemps.',
    'Pour un business qui tourne <span class="text-orange-600">sans toi</span>, <span class="text-primary-600">pour toi</span>.',
    'Une question avant de te lancer ?',
    'N''hésite pas à me contacter directement par mail. Je serai ravie de t''aider !',
    'Envoyer un message',
    NOW()
);
