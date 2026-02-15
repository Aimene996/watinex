<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Importation Chine & Dubai | Solutions Import pour l'Algérie</title>
    <meta name="description" content="Plateforme d'importation depuis la Chine et Dubai pour les commerçants algériens. Service personnalisé, processus simplifié, livraison sécurisée.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        :root {
            --color-sand: #F5EFE7;
            --color-terracotta: #D4756F;
            --color-deep-blue: #1B4965;
            --color-teal: #3D8A8E;
            --color-warm-white: #FFFBF5;
            --color-charcoal: #2C3333;
            --color-gold: #C4926E;
            --color-light-teal: #E8F4F5;
            
            --font-display: 'Cormorant Garamond', serif;
            --font-body: 'Work Sans', sans-serif;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: var(--font-body);
            color: var(--color-charcoal);
            background: var(--color-warm-white);
            line-height: 1.6;
            overflow-x: hidden;
        }
        
        /* Navigation */
        nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255, 251, 245, 0.95);
            backdrop-filter: blur(10px);
            z-index: 1000;
            border-bottom: 1px solid rgba(27, 73, 101, 0.1);
            animation: slideDown 0.6s ease-out;
        }
        
        @keyframes slideDown {
            from {
                transform: translateY(-100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        nav .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-family: var(--font-display);
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--color-deep-blue);
            letter-spacing: 1px;
        }
        
        .nav-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--color-teal);
            color: white;
            padding: 0.7rem 1.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(61, 138, 142, 0.2);
        }
        
        .nav-cta:hover {
            background: var(--color-deep-blue);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(27, 73, 101, 0.3);
        }
        
        /* Hero Section */
        .hero {
            margin-top: 80px;
            padding: 4rem 2rem;
            background: linear-gradient(135deg, var(--color-light-teal) 0%, var(--color-sand) 100%);
            position: relative;
            overflow: hidden;
        }
        
        .hero::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -20%;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(61, 138, 142, 0.1) 0%, transparent 70%);
            border-radius: 50%;
            animation: float 8s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            50% { transform: translate(-30px, -30px) rotate(5deg); }
        }
        
        .hero .container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
            position: relative;
            z-index: 1;
        }
        
        .hero-content {
            animation: fadeInLeft 0.8s ease-out 0.2s both;
        }
        
        @keyframes fadeInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .hero h1 {
            font-family: var(--font-display);
            font-size: 3.5rem;
            font-weight: 700;
            color: var(--color-deep-blue);
            line-height: 1.2;
            margin-bottom: 1.5rem;
        }
        
        .hero-highlight {
            color: var(--color-terracotta);
            display: block;
        }
        
        .hero p {
            font-size: 1.2rem;
            color: var(--color-charcoal);
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .hero-ctas {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .btn-primary {
            display: inline-flex;
            align-items: center;
            gap: 0.7rem;
            background: var(--color-terracotta);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(212, 117, 111, 0.3);
        }
        
        .btn-primary:hover {
            background: var(--color-deep-blue);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(27, 73, 101, 0.4);
        }
        
        .btn-secondary {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: white;
            color: var(--color-deep-blue);
            padding: 1rem 2rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 500;
            font-size: 1.1rem;
            border: 2px solid var(--color-deep-blue);
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background: var(--color-deep-blue);
            color: white;
            transform: translateY(-3px);
        }
        
        .hero-visual {
            position: relative;
            animation: fadeInRight 0.8s ease-out 0.4s both;
        }
        
        @keyframes fadeInRight {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        .trust-badges {
            display: flex;
            gap: 2rem;
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(27, 73, 101, 0.1);
        }
        
        .trust-badge {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            opacity: 0;
            animation: fadeIn 0.6s ease-out forwards;
        }
        
        .trust-badge:nth-child(1) { animation-delay: 0.6s; }
        .trust-badge:nth-child(2) { animation-delay: 0.8s; }
        .trust-badge:nth-child(3) { animation-delay: 1s; }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .trust-icon {
            width: 40px;
            height: 40px;
            background: var(--color-teal);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
        }
        
        .trust-text {
            font-size: 0.9rem;
            color: var(--color-charcoal);
        }
        
        /* Visual Cards */
        .visual-cards {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
        }
        
        .visual-card {
            background: white;
            padding: 2rem;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            border: 1px solid rgba(61, 138, 142, 0.1);
        }
        
        .visual-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
        }
        
        .visual-card-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--color-teal), var(--color-deep-blue));
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            margin-bottom: 1rem;
        }
        
        .visual-card h3 {
            font-family: var(--font-display);
            font-size: 1.3rem;
            color: var(--color-deep-blue);
            margin-bottom: 0.5rem;
        }
        
        .visual-card p {
            color: var(--color-charcoal);
            opacity: 0.8;
            font-size: 0.95rem;
        }
        
        /* Services Section */
        .services {
            padding: 5rem 2rem;
            background: white;
        }
        
        .services .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }
        
        .section-tag {
            display: inline-block;
            background: var(--color-light-teal);
            color: var(--color-teal);
            padding: 0.5rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        
        .section-header h2 {
            font-family: var(--font-display);
            font-size: 2.8rem;
            color: var(--color-deep-blue);
            margin-bottom: 1rem;
        }
        
        .section-header p {
            font-size: 1.2rem;
            color: var(--color-charcoal);
            opacity: 0.8;
            max-width: 700px;
            margin: 0 auto;
        }
        
        .services-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
        }
        
        .service-card {
            background: var(--color-sand);
            padding: 2.5rem;
            border-radius: 20px;
            transition: all 0.4s ease;
            position: relative;
            overflow: hidden;
        }
        
        .service-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--color-terracotta), var(--color-teal));
            transform: scaleX(0);
            transition: transform 0.4s ease;
        }
        
        .service-card:hover::before {
            transform: scaleX(1);
        }
        
        .service-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
        }
        
        .service-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
        }
        
        .service-card h3 {
            font-family: var(--font-display);
            font-size: 1.6rem;
            color: var(--color-deep-blue);
            margin-bottom: 1rem;
        }
        
        .service-card ul {
            list-style: none;
            margin-bottom: 1.5rem;
        }
        
        .service-card li {
            padding: 0.5rem 0;
            color: var(--color-charcoal);
            position: relative;
            padding-left: 1.5rem;
        }
        
        .service-card li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: var(--color-teal);
            font-weight: bold;
        }
        
        /* Process Section */
        .process {
            padding: 5rem 2rem;
            background: var(--color-light-teal);
            position: relative;
        }
        
        .process::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><circle cx="1" cy="1" r="1" fill="%233D8A8E" opacity="0.05"/></svg>');
            pointer-events: none;
        }
        
        .process .container {
            max-width: 1200px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        .process-steps {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .process-step {
            background: white;
            padding: 2rem 1.5rem;
            border-radius: 15px;
            text-align: center;
            position: relative;
            transition: all 0.3s ease;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
        }
        
        .process-step:hover {
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .step-number {
            width: 50px;
            height: 50px;
            background: var(--color-terracotta);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-display);
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 auto 1rem;
            box-shadow: 0 4px 15px rgba(212, 117, 111, 0.3);
        }
        
        .process-step h3 {
            font-family: var(--font-display);
            font-size: 1.2rem;
            color: var(--color-deep-blue);
            margin-bottom: 0.5rem;
        }
        
        .process-step p {
            font-size: 0.9rem;
            color: var(--color-charcoal);
            opacity: 0.8;
        }
        
        /* Why Choose Section */
        .why-choose {
            padding: 5rem 2rem;
            background: var(--color-deep-blue);
            color: white;
        }
        
        .why-choose .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .why-choose .section-tag {
            background: rgba(255, 255, 255, 0.1);
            color: var(--color-sand);
        }
        
        .why-choose h2 {
            color: white;
        }
        
        .why-choose .section-header p {
            color: rgba(255, 255, 255, 0.9);
        }
        
        .advantages-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .advantage-card {
            background: rgba(255, 255, 255, 0.05);
            padding: 2rem;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .advantage-card:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(10px);
        }
        
        .advantage-icon {
            width: 60px;
            height: 60px;
            background: var(--color-terracotta);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
        }
        
        .advantage-card h3 {
            font-family: var(--font-display);
            font-size: 1.5rem;
            margin-bottom: 0.7rem;
        }
        
        .advantage-card p {
            opacity: 0.9;
            line-height: 1.7;
        }
        
        /* CTA Section */
        .cta-section {
            padding: 5rem 2rem;
            background: linear-gradient(135deg, var(--color-terracotta) 0%, var(--color-deep-blue) 100%);
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .cta-section::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: drift 20s linear infinite;
        }
        
        @keyframes drift {
            from { transform: translate(0, 0); }
            to { transform: translate(50px, 50px); }
        }
        
        .cta-section .container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            z-index: 1;
        }
        
        .cta-section h2 {
            font-family: var(--font-display);
            font-size: 3rem;
            margin-bottom: 1.5rem;
            line-height: 1.3;
        }
        
        .cta-section p {
            font-size: 1.3rem;
            margin-bottom: 2.5rem;
            opacity: 0.95;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn-white {
            background: white;
            color: var(--color-deep-blue);
            padding: 1.2rem 2.5rem;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            display: inline-flex;
            align-items: center;
            gap: 0.7rem;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .btn-white:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
        }
        
        /* Footer */
        footer {
            background: var(--color-charcoal);
            color: white;
            padding: 3rem 2rem 2rem;
        }
        
        footer .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 3rem;
            margin-bottom: 2rem;
        }
        
        .footer-brand h3 {
            font-family: var(--font-display);
            font-size: 1.8rem;
            margin-bottom: 1rem;
            color: var(--color-sand);
        }
        
        .footer-brand p {
            opacity: 0.8;
            line-height: 1.7;
            margin-bottom: 1.5rem;
        }
        
        .footer-links h4 {
            font-family: var(--font-display);
            font-size: 1.2rem;
            margin-bottom: 1rem;
            color: var(--color-sand);
        }
        
        .footer-links ul {
            list-style: none;
        }
        
        .footer-links li {
            margin-bottom: 0.7rem;
        }
        
        .footer-links a {
            color: white;
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.3s ease;
        }
        
        .footer-links a:hover {
            opacity: 1;
            color: var(--color-sand);
        }
        
        .contact-info {
            display: flex;
            align-items: center;
            gap: 0.7rem;
            margin-bottom: 0.7rem;
            opacity: 0.8;
        }
        
        .footer-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 2rem;
            text-align: center;
            opacity: 0.7;
        }
        
        /* Responsive Design */
        @media (max-width: 968px) {
            .hero .container {
                grid-template-columns: 1fr;
                text-align: center;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .hero-ctas {
                justify-content: center;
            }
            
            .trust-badges {
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .visual-cards {
                grid-template-columns: 1fr;
            }
            
            .services-grid {
                grid-template-columns: 1fr;
            }
            
            .process-steps {
                grid-template-columns: 1fr;
            }
            
            .advantages-grid {
                grid-template-columns: 1fr;
            }
            
            .footer-content {
                grid-template-columns: 1fr;
                text-align: center;
            }
        }
        
        @media (max-width: 640px) {
            nav .container {
                padding: 1rem;
            }
            
            .logo {
                font-size: 1.2rem;
            }
            
            .nav-cta {
                padding: 0.6rem 1.2rem;
                font-size: 0.9rem;
            }
            
            .hero {
                padding: 3rem 1rem;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .hero p {
                font-size: 1rem;
            }
            
            .btn-primary,
            .btn-secondary {
                padding: 0.9rem 1.5rem;
                font-size: 1rem;
            }
            
            .section-header h2 {
                font-size: 2rem;
            }
            
            .cta-section h2 {
                font-size: 2rem;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="container">
            <div class="logo">Import DZ</div>
            <a href="https://wa.me/213XXXXXXXXX" class="nav-cta">
                <span>📱</span>
                Contactez-nous
            </a>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-content">
                <h1>
                    Importez de Chine & Dubai
                    <span class="hero-highlight">Simplement et en Toute Confiance</span>
                </h1>
                <p>
                    La solution professionnelle pour les commerçants algériens qui souhaitent importer des produits de qualité avec un accompagnement personnalisé de A à Z.
                </p>
                <div class="hero-ctas">
                    <a href="https://wa.me/213XXXXXXXXX" class="btn-primary">
                        <span>💬</span>
                        Démarrer Mon Projet
                    </a>
                    <a href="#process" class="btn-secondary">
                        Comment ça marche ?
                    </a>
                </div>
                <div class="trust-badges">
                    <div class="trust-badge">
                        <div class="trust-icon">✓</div>
                        <div class="trust-text">
                            <strong>100%</strong><br>Sécurisé
                        </div>
                    </div>
                    <div class="trust-badge">
                        <div class="trust-icon">⚡</div>
                        <div class="trust-text">
                            <strong>Rapide</strong><br>et Efficace
                        </div>
                    </div>
                    <div class="trust-badge">
                        <div class="trust-icon">🤝</div>
                        <div class="trust-text">
                            <strong>Suivi</strong><br>Personnalisé
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="hero-visual">
                <div class="visual-cards">
                    <div class="visual-card">
                        <div class="visual-card-icon">🇨🇳</div>
                        <h3>Chine</h3>
                        <p>E-commerce & produits tendance</p>
                    </div>
                    <div class="visual-card">
                        <div class="visual-card-icon">🇦🇪</div>
                        <h3>Dubai</h3>
                        <p>Qualité contrôlée & rapidité</p>
                    </div>
                    <div class="visual-card">
                        <div class="visual-card-icon">📦</div>
                        <h3>Sourcing</h3>
                        <p>Recherche de produits</p>
                    </div>
                    <div class="visual-card">
                        <div class="visual-card-icon">🚚</div>
                        <h3>Logistique</h3>
                        <p>Livraison complète</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="services" id="services">
        <div class="container">
            <div class="section-header">
                <span class="section-tag">Nos Services</span>
                <h2>Solutions d'Importation Complètes</h2>
                <p>Nous gérons tout le processus d'importation pour vous permettre de vous concentrer sur votre business</p>
            </div>
            
            <div class="services-grid">
                <div class="service-card">
                    <div class="service-icon">🇨🇳</div>
                    <h3>Import depuis la Chine</h3>
                    <ul>
                        <li>Produits e-commerce</li>
                        <li>Électronique & accessoires</li>
                        <li>Mode & textile</li>
                        <li>Décoration & maison</li>
                        <li>Sourcing & négociation</li>
                    </ul>
                    <p style="margin-top: 1rem; opacity: 0.8;">
                        Accédez aux meilleurs fournisseurs chinois avec notre expertise locale.
                    </p>
                </div>
                
                <div class="service-card">
                    <div class="service-icon">🇦🇪</div>
                    <h3>Import depuis Dubai</h3>
                    <ul>
                        <li>Produits premium</li>
                        <li>Rotation rapide</li>
                        <li>Contrôle qualité strict</li>
                        <li>Opportunités commerciales</li>
                        <li>Délais courts</li>
                    </ul>
                    <p style="margin-top: 1rem; opacity: 0.8;">
                        Profitez de la rapidité et de la fiabilité du marché dubaïote.
                    </p>
                </div>
                
                <div class="service-card">
                    <div class="service-icon">🎯</div>
                    <h3>Services E-Commerce</h3>
                    <ul>
                        <li>Produits testables</li>
                        <li>Petites & moyennes quantités</li>
                        <li>Accompagnement personnalisé</li>
                        <li>Étude de marché</li>
                        <li>Conseils produits</li>
                    </ul>
                    <p style="margin-top: 1rem; opacity: 0.8;">
                        Solutions flexibles adaptées aux besoins des vendeurs en ligne.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Process Section -->
    <section class="process" id="process">
        <div class="container">
            <div class="section-header">
                <span class="section-tag">Notre Processus</span>
                <h2>Comment Ça Marche ?</h2>
                <p>Un processus simple et transparent en 5 étapes</p>
            </div>
            
            <div class="process-steps">
                <div class="process-step">
                    <div class="step-number">1</div>
                    <h3>Contact Initial</h3>
                    <p>Contactez-nous via WhatsApp ou téléphone</p>
                </div>
                
                <div class="process-step">
                    <div class="step-number">2</div>
                    <h3>Discussion</h3>
                    <p>Discutons de vos besoins, produits et budget</p>
                </div>
                
                <div class="process-step">
                    <div class="step-number">3</div>
                    <h3>Étude</h3>
                    <p>Étude de faisabilité et proposition sur mesure</p>
                </div>
                
                <div class="process-step">
                    <div class="step-number">4</div>
                    <h3>Import</h3>
                    <p>Nous gérons tout le processus d'importation</p>
                </div>
                
                <div class="process-step">
                    <div class="step-number">5</div>
                    <h3>Livraison</h3>
                    <p>Réception selon les termes convenus</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Section -->
    <section class="why-choose">
        <div class="container">
            <div class="section-header">
                <span class="section-tag">Nos Avantages</span>
                <h2>Pourquoi Nous Choisir ?</h2>
                <p>Des solutions adaptées au marché algérien avec un service de qualité</p>
            </div>
            
            <div class="advantages-grid">
                <div class="advantage-card">
                    <div class="advantage-icon">👥</div>
                    <h3>Accompagnement Personnalisé</h3>
                    <p>
                        Un conseiller dédié pour chaque projet. Nous comprenons vos besoins spécifiques et vous guidons à chaque étape avec expertise et professionnalisme.
                    </p>
                </div>
                
                <div class="advantage-card">
                    <div class="advantage-icon">🇩🇿</div>
                    <h3>Adapté au Marché Algérien</h3>
                    <p>
                        Solutions conçues pour répondre aux spécificités du marché algérien, avec une connaissance approfondie des réglementations et des opportunités locales.
                    </p>
                </div>
                
                <div class="advantage-card">
                    <div class="advantage-icon">⏱️</div>
                    <h3>Gain de Temps</h3>
                    <p>
                        Fini les démarches complexes et chronophages. Nous prenons en charge tout le processus d'importation pour que vous puissiez vous concentrer sur votre activité.
                    </p>
                </div>
                
                <div class="advantage-card">
                    <div class="advantage-icon">🛡️</div>
                    <h3>Réduction des Risques</h3>
                    <p>
                        Évitez les pièges de l'importation grâce à notre expertise. Nous vérifions la qualité, gérons la logistique et assurons le suivi pour minimiser tout risque.
                    </p>
                </div>
                
                <div class="advantage-card">
                    <div class="advantage-icon">💬</div>
                    <h3>Communication Transparente</h3>
                    <p>
                        Restez informé à chaque étape. Nous maintenons une communication claire et régulière pour que vous ayez toujours une visibilité complète sur votre projet.
                    </p>
                </div>
                
                <div class="advantage-card">
                    <div class="advantage-icon">🎯</div>
                    <h3>Focus sur Vos Besoins</h3>
                    <p>
                        Pas de solutions génériques. Nous analysons vos objectifs commerciaux et créons des stratégies d'importation qui correspondent exactement à vos attentes.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
        <div class="container">
            <h2>Prêt à Démarrer Votre Projet d'Importation ?</h2>
            <p>
                Contactez-nous dès aujourd'hui pour discuter de vos besoins et recevoir une proposition personnalisée
            </p>
            <div class="cta-buttons">
                <a href="https://wa.me/213XXXXXXXXX" class="btn-white">
                    <span>💬</span>
                    WhatsApp
                </a>
                <a href="tel:+213XXXXXXXXX" class="btn-white">
                    <span>📞</span>
                    Appeler
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>Import DZ</h3>
                    <p>
                        Votre partenaire de confiance pour l'importation depuis la Chine et Dubai. 
                        Nous simplifions l'accès aux marchés internationaux pour les commerçants algériens.
                    </p>
                </div>
                
                <div class="footer-links">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#services">Import Chine</a></li>
                        <li><a href="#services">Import Dubai</a></li>
                        <li><a href="#services">E-Commerce</a></li>
                        <li><a href="#process">Notre Processus</a></li>
                    </ul>
                </div>
                
                <div class="footer-links">
                    <h4>Contact</h4>
                    <div class="contact-info">
                        <span>📱</span>
                        <span>+213 XX XX XX XX XX</span>
                    </div>
                    <div class="contact-info">
                        <span>📧</span>
                        <span>contact@importdz.com</span>
                    </div>
                    <div class="contact-info">
                        <span>📍</span>
                        <span>Alger, Algérie</span>
                    </div>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; 2026 Import DZ. Tous droits réservés.</p>
            </div>
        </div>
    </footer>

    <script>
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll animation observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.service-card, .process-step, .advantage-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    </script>
</body>
</html>