// npm install -D tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@entrepreneur-os.com" },
    update: {},
    create: {
      email: "demo@entrepreneur-os.com",
      name: "Entrepreneur Démo",
      language: "fr",
      subscriptions: {
        create: { plan: "PRO" },
      },
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { id: "demo-workspace" },
    update: {},
    create: {
      id: "demo-workspace",
      name: "Espace Démo",
      ownerId: demoUser.id,
      members: {
        create: {
          userId: demoUser.id,
          role: "OWNER",
        },
      },
    },
  });

  const project1 = await prisma.project.upsert({
    where: { id: "demo-project-1" },
    update: {},
    create: {
      id: "demo-project-1",
      workspaceId: workspace.id,
      name: "EcoTrack - Application mobile",
      description: "Application mobile qui gamifie le suivi de l'empreinte carbone pour les particuliers",
      sector: "Greentech",
      stage: "VALIDATION",
      score: 62,
      businessData: {
        create: {
          problem: "Les particuliers veulent réduire leur empreinte carbone mais ne savent pas par où commencer ni comment mesurer leurs progrès",
          solution: "Une app mobile qui scanne les achats, calcule l'empreinte carbone et propose des défis ludiques pour la réduire",
          targetCustomer: "Particuliers 25-45 ans, urbains, sensibles à l'écologie, utilisateurs de smartphone",
          valueProposition: "Réduire son empreinte carbone de façon ludique et mesurable, sans culpabilisation",
          businessModel: "Freemium : version gratuite avec fonctionnalités de base, abonnement premium (5.99€/mois) pour analyses détaillées et défis personnalisés",
          competitors: JSON.stringify([
            "Yuka (alimentaire)",
            "Too Good To Go (gaspillage)",
            "Agir à l'échelle individuelle sans accompagnement"
          ]),
        },
      },
      progress: {
        create: {
          maturityLevel: 35,
          completionRate: 25,
        },
      },
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: "demo-project-2" },
    update: {},
    create: {
      id: "demo-project-2",
      workspaceId: workspace.id,
      name: "ConsultPro - Marketplace freelance",
      description: "Plateforme de mise en relation entre consultants indépendants et PME",
      sector: "Services",
      stage: "PREPARATION",
      score: 45,
      businessData: {
        create: {
          problem: "Les PME galèrent à trouver des consultants qualifiés sans passer par des cabinets coûteux",
          solution: "Une marketplace en ligne avec profils vérifiés, avis clients et matching par IA",
          targetCustomer: "PME de 10-200 salariés / Consultants freelances en activité",
          valueProposition: "Mise en relation rapide et fiable entre PME et consultants qualifiés, sans intermédiaire coûteux",
          businessModel: "Commission de 10-15% sur chaque mission, abonnement mensuel pour les consultants (29€/mois)",
        },
      },
      progress: {
        create: {
          maturityLevel: 20,
          completionRate: 15,
        },
      },
    },
  });

  await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        title: "Valider l'idée auprès de 20 utilisateurs cibles",
        priority: "HIGH",
        status: "IN_PROGRESS",
      },
      {
        projectId: project1.id,
        title: "Développer le MVP (scan + calcul empreinte)",
        priority: "CRITICAL",
        status: "TODO",
      },
      {
        projectId: project1.id,
        title: "Définir la stratégie de pricing",
        priority: "MEDIUM",
        status: "DONE",
      },
      {
        projectId: project2.id,
        title: "Analyser le marché des marketplaces freelance en France",
        priority: "HIGH",
        status: "TODO",
      },
    ],
  });

  console.log("✅ Seed completed");
  console.log(`  👤 Demo user: demo@entrepreneur-os.com`);
  console.log(`  📁 Project 1: ${project1.name} (score: ${project1.score})`);
  console.log(`  📁 Project 2: ${project2.name} (score: ${project2.score})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
