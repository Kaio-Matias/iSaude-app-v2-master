export const chatConversations = [
  {
    id: '1',
    name: 'Dr. Marcos Toledo',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=MarcosToledo&backgroundColor=20B2AA&size=100' },
    verified: true,
    messages: [
      { _id: 1, text: 'Olá', createdAt: new Date('2023-10-10T06:25:00'), user: { _id: 2 } },
      { _id: 2, text: 'Dr. Glenda', createdAt: new Date('2023-10-10T06:30:00'), user: { _id: 2 } },
      { _id: 3, text: 'Tudo bem com você??', createdAt: new Date('2023-10-10T06:30:00'), user: { _id: 2 } },
      { _id: 4, text: 'Bom dia', createdAt: new Date('2023-10-10T06:40:00'), user: { _id: 1 } },
      { _id: 5, text: 'Estou sim, e você?', createdAt: new Date('2023-10-10T06:40:00'), user: { _id: 1 } },
      { _id: 6, text: 'Você tem disponibilidade para atender hj às 17hrs', createdAt: new Date('2023-10-10T07:10:00'), user: { _id: 2 } },
      { _id: 7, text: 'Tenho sim', createdAt: new Date('2023-10-10T07:21:00'), user: { _id: 1 } },
      { _id: 8, text: 'Vou precisar apenas do seu cpf para fazer o cadastro', createdAt: new Date('2023-10-10T07:21:00'), user: { _id: 1 } },
      { _id: 9, type: 'status', status: 'Chamada Recebida', color: '#19B99A', createdAt: new Date('2023-10-10T07:00:00') },
      { _id: 10, type: 'status', status: 'Chamada Finalizada', color: '#F25A5A', createdAt: new Date('2023-10-10T07:20:00') },
    ],
  },
  {
    id: '2',
    name: 'Dra. Maria Genda',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=MariaGenda&backgroundColor=2ECC71&size=100' },
    verified: true,
    messages: [
      { _id: 1, text: 'Oi Maria!', createdAt: new Date('2023-10-09T09:00:00'), user: { _id: 2 } },
      { _id: 2, text: 'Olá! Tudo bem?', createdAt: new Date('2023-10-09T09:01:00'), user: { _id: 1 } },
    ],
  },
  {
    id: '3',
    name: 'Jamile Correa',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=JamileCorrea&backgroundColor=E74C3C&size=100' },
    verified: false,
    messages: [
      { _id: 1, text: 'KKKKKKKK Eu não acredito!', createdAt: new Date('2023-10-08T10:00:00'), user: { _id: 1 } },
    ],
  },
  {
    id: '4',
    name: 'Luana Paiva',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=LuanaPaiva&backgroundColor=27AE60&size=100' },
    verified: false,
    messages: [
      { _id: 1, text: 'Você: Olá! Bom dia amiga', createdAt: new Date('2023-10-07T08:00:00'), user: { _id: 2 } },
    ],
  },
  {
    id: '5',
    name: 'Dr. Walter Alencar',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=WalterAlencar&backgroundColor=9B59B6&size=100' },
    verified: true,
    messages: [
      { _id: 1, text: 'Fico no aguardo da nossa Consulta', createdAt: new Date('2023-10-06T11:00:00'), user: { _id: 1 } },
    ],
  },
  {
    id: '6',
    name: 'iSaúde',
    avatar: { uri: 'https://api.dicebear.com/7.x/avataaars/png?seed=Isaude&backgroundColor=4576F2&size=100' },
    verified: true,
    messages: [
      { _id: 1, text: 'Você sabia que no iSaúde, você tem muito mais qualidade de vida?', createdAt: new Date('2023-10-05T12:00:00'), user: { _id: 1 } },
    ],
  },
];
