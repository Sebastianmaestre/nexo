import { PrismaClient, Role, DealStage, TaskStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.meeting.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('demo1234', 10);

  const admin = await prisma.user.create({
    data: { name: 'Sebastián Maestre', email: 'admin@iris.dev', passwordHash, role: Role.ADMIN },
  });
  const ventas = await prisma.user.create({
    data: { name: 'Ana Ventas', email: 'ventas@iris.dev', passwordHash, role: Role.VENTAS },
  });
  const soporte = await prisma.user.create({
    data: { name: 'Diego Soporte', email: 'soporte@iris.dev', passwordHash, role: Role.SOPORTE },
  });

  const clientesData = [
    { name: 'Marta Rojas', company: 'Andina Textiles', email: 'marta@andina.com', phone: '7123 4567', segment: 'VIP' },
    { name: 'Luis Fernández', company: 'ConstruBol SRL', email: 'luis@construbol.com', phone: '6980 1122', segment: 'Nuevo' },
    { name: 'Camila Suárez', company: 'Estudio Suárez', email: 'camila@estudiosuarez.com', phone: '7711 3345', segment: 'En riesgo' },
    { name: 'Jorge Paredes', company: 'Paredes Logística', email: 'jorge@paredeslog.com', phone: '7000 9911', segment: 'Nuevo' },
  ];
  const clients = [];
  for (const c of clientesData) {
    clients.push(await prisma.client.create({ data: c }));
  }

  await prisma.deal.createMany({
    data: [
      { title: 'Implementación ERP', value: 45000, stage: DealStage.PROPUESTA, clientId: clients[0].id },
      { title: 'Consultoría logística', value: 12000, stage: DealStage.CONTACTADO, clientId: clients[1].id },
      { title: 'Rediseño de marca', value: 8000, stage: DealStage.PROSPECTO, clientId: clients[2].id },
      { title: 'Sistema de rutas', value: 22000, stage: DealStage.CERRADO_GANADO, clientId: clients[3].id },
    ],
  });

  await prisma.meeting.createMany({
    data: [
      { date: new Date().toISOString().slice(0, 10), time: '09:00', note: 'Kickoff proyecto', clientId: clients[0].id, ownerId: ventas.id },
      { date: new Date().toISOString().slice(0, 10), time: '11:30', note: 'Seguimiento propuesta', clientId: clients[1].id, ownerId: ventas.id },
      { date: new Date().toISOString().slice(0, 10), time: '15:00', note: 'Soporte técnico', clientId: clients[2].id, ownerId: soporte.id },
    ],
  });

  await prisma.task.createMany({
    data: [
      { title: 'Enviar propuesta actualizada a Andina Textiles', status: TaskStatus.PENDIENTE, ownerId: ventas.id, dueDate: new Date().toISOString().slice(0, 10) },
      { title: 'Revisar ticket de soporte de Estudio Suárez', status: TaskStatus.EN_PROGRESO, ownerId: soporte.id },
      { title: 'Aprobar descuento para ConstruBol', status: TaskStatus.PENDIENTE, ownerId: admin.id },
    ],
  });

  await prisma.activity.createMany({
    data: [
      { type: 'llamada', note: 'Llamada inicial de diagnóstico', clientId: clients[0].id, userId: ventas.id },
      { type: 'email', note: 'Envío de propuesta comercial', clientId: clients[0].id, userId: ventas.id },
      { type: 'nota', note: 'Cliente pidió revisar tiempos de entrega', clientId: clients[2].id, userId: soporte.id },
    ],
  });

  console.log('Seed completo. Usuarios demo (password: demo1234):');
  console.log('  admin@iris.dev (ADMIN)');
  console.log('  ventas@iris.dev (VENTAS)');
  console.log('  soporte@iris.dev (SOPORTE)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
