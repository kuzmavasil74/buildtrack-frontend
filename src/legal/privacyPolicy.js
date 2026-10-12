// The controller's details. Fill these in before the policy is shared
// publicly; a value still in [BRACKETS] is shown highlighted on the page.
export const CONTROLLER = {
  name: '[SANJO – FULL LEGAL NAME]',
  nif: '[NIF]',
  address: '[REGISTERED ADDRESS]',
  email: '[CONTACT EMAIL]',
}

export const LAST_UPDATED = '2026-10-12'

export const isPlaceholder = (value) => /^\[.*\]$/.test(value)

// Sections are { heading, paragraphs?, items? }. `{controller}` lines are
// rendered from CONTROLLER by the page.
const uk = {
  title: 'Політика конфіденційності',
  updated: 'Оновлено',
  intro:
    'Sanjo — застосунок для обліку робіт на будівельних об\'єктах: робочі години, бригади, зарплата й чеки. Тут пояснено, які дані ми збираємо, навіщо, хто має до них доступ і які у вас права відповідно до Загального регламенту ЄС про захист даних (GDPR).',
  sections: [
    {
      heading: '1. Хто відповідає за ваші дані',
      paragraphs: ['Контролер персональних даних:'],
      controller: true,
      after: [
        'Дані, які фірма вносить про своїх працівників (імена, години, ставки), фірма обробляє для власних цілей. Щодо цих даних фірма-користувач є контролером, а Sanjo обробляє їх від її імені й лише для надання сервісу. Фірма відповідає за те, щоб мати законну підставу вносити такі дані та повідомити про це своїх працівників.',
      ],
    },
    {
      heading: '2. Які дані ми обробляємо',
      items: [
        'Дані акаунта: email, пароль (лише у вигляді незворотного хешу), назва фірми, роль (власник або бригадир), обрана валюта, дата реєстрації та час останньої активності.',
        'Робочі дані, які вносите ви або ваша команда: назви, адреси й координати об\'єктів; назви бригад та імена працівників; години, ставки, примітки, виконані роботи й матеріали.',
        'Фото чеків. На них можуть бути назва магазину, суми, дата й частково замаскований номер картки. Перед завантаженням фото стискаються у вашому браузері.',
        'Запрошення: email запрошеної людини та хто її запросив.',
        'Технічні дані: IP-адреса, тип браузера й час запитів у журналах сервера. Вони потрібні для безпеки та пошуку помилок.',
      ],
    },
    {
      heading: '3. Навіщо й на якій підставі',
      items: [
        'Щоб надавати сервіс: вхід, облік робіт, розрахунок зарплати, звіти й зберігання чеків. Підстава — виконання договору (ст. 6(1)(b) GDPR).',
        'Щоб захищати сервіс від зловживань і підбору паролів, робити резервні копії та виправляти помилки. Підстава — законний інтерес (ст. 6(1)(f) GDPR).',
        'Щоб надсилати службові листи: відновлення пароля й запрошення до фірми. Рекламних розсилок ми не робимо.',
      ],
    },
    {
      heading: '4. Файли cookie',
      paragraphs: [
        'Ми використовуємо лише один необхідний cookie: він тримає вас у системі після входу. Аналітичних і рекламних cookie та трекерів немає, тому окремої згоди на cookie не потрібно. Мова інтерфейсу зберігається у вашому браузері.',
      ],
    },
    {
      heading: '5. Хто бачить дані',
      items: [
        'Учасники вашої фірми, відповідно до ролі. Власник бачить усе. Бригадир бачить об\'єкти, бригади, записи й чеки, але не бачить сторінку зарплати. Інші фірми ваших даних не бачать.',
        'Адміністратор Sanjo для підтримки бачить лише email, фірму, дати й кількість записів, а не їхній вміст.',
        'Постачальники, які зберігають і обробляють дані від нашого імені: Vercel (вебзастосунок), Railway (сервер і база PostgreSQL), MongoDB Atlas (база записів), Amazon Web Services S3, регіон Стокгольм, ЄС (фото чеків і резервні копії), а також поштовий сервіс для службових листів.',
        'Частина постачальників може обробляти дані за межами ЄС, зокрема у США. У таких випадках передача захищена стандартними договірними положеннями Європейської комісії або рамкою EU-US Data Privacy Framework.',
        'Ми не продаємо дані і не передаємо їх для реклами.',
      ],
    },
    {
      heading: '6. Скільки зберігаємо',
      items: [
        'Дані акаунта й робочі дані зберігаються, поки існує акаунт або фірма.',
        'Після запиту на видалення ми видаляємо дані протягом 30 днів. Резервні копії зберігаються до 30 днів, після чого автоматично видаляються.',
        'Запрошення діють 14 днів, посилання для відновлення пароля — 1 годину.',
      ],
    },
    {
      heading: '7. Безпека',
      paragraphs: [
        'З\'єднання шифрується (HTTPS). Паролі зберігаються лише як хеш (bcrypt). Фото чеків лежать у приватному сховищі й відкриваються лише через тимчасові посилання для учасників фірми. Доступ обмежено ролями. Щоночі робиться резервна копія.',
      ],
    },
    {
      heading: '8. Ваші права',
      items: [
        'Отримати копію своїх даних. Записи також можна експортувати в CSV прямо в застосунку.',
        'Виправити неточні дані.',
        'Видалити акаунт і дані.',
        'Обмежити обробку або заперечити проти неї.',
        'Отримати дані у машиночитному форматі (перенесення).',
        'Подати скаргу до наглядового органу з захисту даних. У Португалії це CNPD (www.cnpd.pt).',
      ],
      after: ['Щоб скористатися правами, напишіть на email, вказаний у розділі 1. Ми відповімо протягом 30 днів.'],
    },
    {
      heading: '9. Вік',
      paragraphs: ['Сервіс призначено для людей від 16 років.'],
    },
    {
      heading: '10. Зміни',
      paragraphs: [
        'Якщо ми змінимо цю політику, то оновимо дату вгорі. Про суттєві зміни повідомимо в застосунку або листом.',
      ],
    },
  ],
  controllerLabels: { name: 'Назва', nif: 'NIF', address: 'Адреса', email: 'Email' },
}

const en = {
  title: 'Privacy Policy',
  updated: 'Last updated',
  intro:
    'Sanjo is an app for tracking work on construction sites: working hours, crews, payroll and receipts. This page explains what data we collect, why, who can access it and what your rights are under the EU General Data Protection Regulation (GDPR).',
  sections: [
    {
      heading: '1. Who is responsible for your data',
      paragraphs: ['The data controller is:'],
      controller: true,
      after: [
        'The data a company enters about its workers (names, hours, rates) is processed for that company\'s own purposes. For that data the company using Sanjo is the controller, and Sanjo processes it on the company\'s behalf only to provide the service. The company is responsible for having a legal basis to enter it and for informing its workers.',
      ],
    },
    {
      heading: '2. What data we process',
      items: [
        'Account data: email, password (stored only as a one-way hash), company name, role (owner or foreman), chosen currency, sign-up date and time of last activity.',
        'Work data entered by you or your team: site names, addresses and coordinates; crew names and worker names; hours, rates, notes, work done and materials.',
        'Receipt photos. They may show the shop, amounts, date and a partly masked card number. Photos are compressed in your browser before upload.',
        'Invitations: the invited person\'s email and who invited them.',
        'Technical data: IP address, browser type and request times in server logs, used for security and troubleshooting.',
      ],
    },
    {
      heading: '3. Why and on what legal basis',
      items: [
        'To provide the service: sign-in, work records, payroll calculation, reports and receipt storage. Legal basis: performance of a contract (Art. 6(1)(b) GDPR).',
        'To protect the service against abuse and password guessing, make backups and fix errors. Legal basis: legitimate interest (Art. 6(1)(f) GDPR).',
        'To send service emails: password resets and company invitations. We do not send marketing emails.',
      ],
    },
    {
      heading: '4. Cookies',
      paragraphs: [
        'We use a single necessary cookie that keeps you signed in. There are no analytics or advertising cookies or trackers, so no cookie consent is needed. Your interface language is stored in your browser.',
      ],
    },
    {
      heading: '5. Who can see the data',
      items: [
        'Members of your company, according to their role. The owner sees everything. A foreman sees sites, crews, records and receipts but not the payroll page. Other companies cannot see your data.',
        'The Sanjo administrator, for support, sees only emails, company names, dates and the number of records, not their content.',
        'Providers that store and process data on our behalf: Vercel (web app), Railway (server and PostgreSQL database), MongoDB Atlas (records database), Amazon Web Services S3 in Stockholm, EU (receipt photos and backups), and an email service for service emails.',
        'Some providers may process data outside the EU, including in the USA. Such transfers are protected by the European Commission\'s Standard Contractual Clauses or the EU-US Data Privacy Framework.',
        'We do not sell data or share it for advertising.',
      ],
    },
    {
      heading: '6. How long we keep it',
      items: [
        'Account and work data are kept while the account or company exists.',
        'After a deletion request we delete the data within 30 days. Backups are kept for up to 30 days and then deleted automatically.',
        'Invitations are valid for 14 days and password reset links for 1 hour.',
      ],
    },
    {
      heading: '7. Security',
      paragraphs: [
        'Connections are encrypted (HTTPS). Passwords are stored only as a hash (bcrypt). Receipt photos are kept in private storage and opened only through temporary links for members of the company. Access is limited by role. A backup is made every night.',
      ],
    },
    {
      heading: '8. Your rights',
      items: [
        'Get a copy of your data. Records can also be exported to CSV in the app.',
        'Correct inaccurate data.',
        'Delete your account and data.',
        'Restrict or object to processing.',
        'Receive your data in a machine-readable format (portability).',
        'Complain to a data protection authority. In Portugal this is the CNPD (www.cnpd.pt).',
      ],
      after: ['To use these rights, write to the email in section 1. We reply within 30 days.'],
    },
    {
      heading: '9. Age',
      paragraphs: ['The service is intended for people aged 16 or over.'],
    },
    {
      heading: '10. Changes',
      paragraphs: [
        'If we change this policy we update the date at the top. We announce significant changes in the app or by email.',
      ],
    },
  ],
  controllerLabels: { name: 'Name', nif: 'NIF', address: 'Address', email: 'Email' },
}

// Ukrainian for Ukrainian and Russian speakers, English for everyone else.
export const getPrivacyPolicy = (language) => (language === 'uk' || language === 'ru' ? uk : en)
