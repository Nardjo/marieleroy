-- Create extension for UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (for better-auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (for better-auth)
CREATE TABLE IF NOT EXISTS sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About section
CREATE TABLE IF NOT EXISTS about_section (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    image_url TEXT,
    skills TEXT[], -- Array of skills
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Method steps
CREATE TABLE IF NOT EXISTS method_steps (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    step_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Method section header
CREATE TABLE IF NOT EXISTS method_header (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    quote TEXT NOT NULL,
    embed_url TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAQ items
CREATE TABLE IF NOT EXISTS faq_items (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social links
CREATE TABLE IF NOT EXISTS social_links (
    id SERIAL PRIMARY KEY,
    platform VARCHAR(50) NOT NULL UNIQUE,
    url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEO settings
CREATE TABLE IF NOT EXISTS seo_settings (
    id SERIAL PRIMARY KEY,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    og_image TEXT,
    twitter_card VARCHAR(50),
    robots_txt VARCHAR(100),
    google_analytics_id VARCHAR(50),
    google_tag_manager_id VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123 - CHANGE THIS!)
INSERT INTO users (email, firstname, lastname, password_hash, email_verified)
VALUES (
    'admin@marieleroy.fr',
    'Marie',
    'Leroy',
    '$2a$10$rGHvQqZQJZqZQJZqZQJZqOx4x4x4x4x4x4x4x4x4x4x4x4x4x4x4x', -- Replace with actual hashed password
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (key, value, type) VALUES
    ('site_name', 'Marie Leroy', 'string'),
    ('site_description', 'Copywriter professionnelle - Des mots qui convertissent, des messages qui résonnent', 'string'),
    ('contact_email', 'contact@marieleroy.fr', 'string'),
    ('contact_phone', '+33 6 12 34 56 78', 'string'),
    ('contact_address', 'Paris, France', 'string'),
    ('cta_link', '', 'string')
ON CONFLICT (key) DO NOTHING;

-- Insert default about section
INSERT INTO about_section (title, subtitle, description, skills)
VALUES (
    'Qui suis-je?',
    'Votre copywriter professionnelle',
    'Passionnée par les mots et leur pouvoir de transformation, je vous aide à créer des contenus qui captivent et convertissent votre audience.',
    ARRAY['Copywriting', 'Storytelling', 'Marketing de contenu', 'Stratégie éditoriale']
) ON CONFLICT DO NOTHING;

-- Insert default method header
INSERT INTO method_header (title, subtitle, description)
VALUES (
    'Comment je travaille',
    'étape par étape',
    'Un processus éprouvé pour créer des contenus qui captivent et convertissent votre audience'
) ON CONFLICT DO NOTHING;

-- Insert default method steps
INSERT INTO method_steps (title, description, step_order) VALUES
    ('Consultation initiale', 'Nous commençons par une discussion approfondie pour comprendre vos objectifs, votre audience cible et vos attentes.', 1),
    ('Recherche et stratégie', 'J''analyse votre marché, votre concurrence et votre audience pour développer une stratégie de contenu efficace.', 2),
    ('Rédaction et optimisation', 'Je rédige votre contenu en utilisant des techniques de copywriting éprouvées pour maximiser l''impact et les conversions.', 3),
    ('Révisions et ajustements', 'Je travaille avec vous pour affiner le contenu jusqu''à ce qu''il corresponde parfaitement à vos attentes et objectifs.', 4),
    ('Livraison et suivi', 'Je vous livre le contenu final et reste disponible pour des ajustements mineurs et pour répondre à vos questions.', 5)
ON CONFLICT DO NOTHING;

-- Insert default testimonials
INSERT INTO testimonials (title, quote, embed_url, display_order) VALUES
    ('Marie', 'Grâce à Marie, j''ai pu transformer ma communication et atteindre mes objectifs de manière efficace.', 'https://www.youtube.com/embed/KJNbhiD9YLg', 1),
    ('Jessica', 'Un travail exceptionnel qui a dépassé toutes mes attentes. Ma marque a pris une toute nouvelle dimension.', 'https://www.youtube.com/embed/3enzfMLVIbo', 2),
    ('Lilie', 'Marie a su capter l''essence de mon message et créer un contenu qui résonne vraiment avec mon audience.', 'https://www.youtube.com/embed/3Ah-CkKIKx8', 3)
ON CONFLICT DO NOTHING;

-- Insert default FAQ items
INSERT INTO faq_items (question, answer, display_order) VALUES
    ('Quels types de contenus rédigez-vous ?', 'Je rédige une variété de contenus : pages de vente, articles de blog, newsletters, descriptions de produits, et bien plus encore. Chaque contenu est adapté à vos besoins spécifiques.', 1),
    ('Quel est votre processus de travail ?', 'Mon processus se déroule en 5 étapes : consultation initiale, recherche et stratégie, rédaction et optimisation, révisions, et livraison finale avec suivi.', 2),
    ('Combien de temps prend un projet ?', 'Le délai varie selon la complexité et l''ampleur du projet. Un article de blog prend généralement 3-5 jours, tandis qu''une page de vente complète peut nécessiter 1-2 semaines.', 3)
ON CONFLICT DO NOTHING;

-- Insert default social links
INSERT INTO social_links (platform, url) VALUES
    ('instagram', 'https://www.instagram.com/mari.eleroy94/'),
    ('facebook', NULL),
    ('twitter', NULL),
    ('linkedin', NULL),
    ('youtube', NULL),
    ('tiktok', NULL)
ON CONFLICT (platform) DO NOTHING;

-- Insert default SEO settings
INSERT INTO seo_settings (
    meta_title,
    meta_description,
    meta_keywords,
    twitter_card,
    robots_txt
) VALUES (
    'Marie Leroy - Copywriter Professionnelle',
    'Copywriter professionnelle spécialisée en storytelling et marketing de contenu. Des mots qui convertissent, des messages qui résonnent.',
    'copywriter, rédaction web, storytelling, marketing de contenu, copywriting, freelance',
    'summary_large_image',
    'index, follow'
) ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_method_steps_order ON method_steps(step_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(display_order);
CREATE INDEX IF NOT EXISTS idx_faq_items_order ON faq_items(display_order);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_section_updated_at BEFORE UPDATE ON about_section
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_method_steps_updated_at BEFORE UPDATE ON method_steps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_method_header_updated_at BEFORE UPDATE ON method_header
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at BEFORE UPDATE ON faq_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_settings_updated_at BEFORE UPDATE ON seo_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
