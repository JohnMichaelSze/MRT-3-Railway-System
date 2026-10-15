/* Shared application bundle: MRT portal, station directory, and editorial demos.
   Each feature initializes only on the page that provides its required markup. */
(() => {
  if (!document.querySelector(".site-header")) return;
/* Shared navigation, scroll effects, and page transitions for MRT pages. */
(() => {
  const links = [...document.querySelectorAll(".nav-container nav a")];
  if (!links.length) return;

  const normalizePath = (path) =>
    path.endsWith("/index.html") ? path.slice(0, -"index.html".length) : path;
  const updateActiveLink = () => {
    const currentPath = normalizePath(window.location.pathname);
    const currentHash = window.location.hash;
    let match = links.find((link) => {
      const target = new URL(link.href, window.location.href);
      return (
        normalizePath(target.pathname) === currentPath &&
        target.hash === currentHash &&
        (currentHash || !target.hash)
      );
    });
    if (!match) {
      match = links.find((link) => {
        const target = new URL(link.href, window.location.href);
        return normalizePath(target.pathname) === currentPath && !target.hash;
      });
    }
    links.forEach((link) => {
      const active = link === match;
      link.classList.toggle("active", active);
      if (active)
        link.setAttribute("aria-current", currentHash ? "location" : "page");
      else link.removeAttribute("aria-current");
    });
  };

  updateActiveLink();
  window.addEventListener("hashchange", updateActiveLink);
})();

(() => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);

  let progressQueued = false;
  const updateProgress = () => {
    if (progressQueued) return;
    progressQueued = true;
    window.requestAnimationFrame(() => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const amount = scrollable > 0 ? window.scrollY / scrollable : 0;
      progress.style.transform = `scaleX(${Math.max(0, Math.min(1, amount))})`;
      progressQueued = false;
    });
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  const revealTargets = document.querySelectorAll(
    "main > section, .main-container > section, .booking-page > .page-heading, .booking-page > .schedule-banner, .booking-page > .pass-type-tabs, .booking-grid > *, .map-header, .map-toolbar, .map-container, .map-legend",
  );
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealTargets.forEach((target) => target.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
  );

  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-on-scroll");
    target.style.setProperty(
      "--reveal-delay",
      `${Math.min(index % 4, 3) * 55}ms`,
    );
    observer.observe(target);
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-fade-in");

  const links = document.querySelectorAll(
    'a[href]:not([target="_blank"]):not([href^="#"]):not([href^="javascript:"])',
  );

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const destination = link.getAttribute("href");
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.hasAttribute("download") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      if (
        !destination ||
        destination === "#" ||
        link.hostname !== window.location.hostname
      ) {
        return;
      }

      event.preventDefault();
      document.body.classList.remove("page-fade-in");
      document.body.classList.add("page-fade-out");
      window.setTimeout(() => {
        window.location.href = destination;
      }, 280);
    });
  });
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    document.body.classList.remove("page-fade-out");
    document.body.classList.add("page-fade-in");
  }
});

})();

window.mrtApi = async function mrtApi(path, options = {}) {
  const route = String(path).replace(/^\/+/, '');
  const method = (options.method || 'GET').toUpperCase();
  const key = 'mrtUiPrototypeState';
  const defaults = { nextId: 1001, user: null, users: [], tickets: [] };
  let memoryState = structuredClone(defaults);
  const read = () => {
    try {
      let stored = localStorage.getItem(key);
      if (!stored) {
        stored = sessionStorage.getItem(key);
        if (stored) localStorage.setItem(key, stored);
      }
      return { ...defaults, ...JSON.parse(stored || '{}') };
    } catch { return memoryState; }
  };
  const write = (state) => { memoryState = state; try { localStorage.setItem(key, JSON.stringify(state)); } catch { /* Direct-file previews still work for this page session. */ } };
  const state = read();
  const body = options.body instanceof FormData ? options.body : (typeof options.body === 'string' ? JSON.parse(options.body || '{}') : (options.body || {}));
  const error = (message) => { throw new Error(message); };
  const rows = [
    ['North Avenue','Quezon City','TriNoma and SM North EDSA'],['Quezon Avenue','Quezon City','Centris Station Mall and EDSA Carousel'],['GMA-Kamuning','Quezon City','GMA Network Studios Annex, East Avenue and Timog Avenue'],['Araneta Center-Cubao','Quezon City','LRT-2 Cubao interchange, Gateway Mall and Smart Araneta Coliseum'],['Santolan-Anapolis','Quezon City','Camp Aguinaldo and Camp Crame'],['Ortigas','Pasig City','SM Megamall, Robinsons Galleria and Ortigas business district'],['Shaw Boulevard','Mandaluyong City','Shangri-La Plaza and Greenfield District'],['Boni','Mandaluyong City','Pioneer Center and Robinsons Place Pioneer'],['Guadalupe','Makati City','Guadalupe Commercial Center and Rockwell Center'],['Buendia','Makati City','Makati central business district and Gil Puyat Avenue'],['Ayala','Makati City','SM Makati, Glorietta, Greenbelt and One Ayala'],['Magallanes','Makati City','Magallanes Interchange and Southgate Mall'],['Taft Avenue','Pasay City','LRT-1 EDSA interchange and Metropoint Mall']
  ];
  const stations = rows.map(([name, city, landmarks], i) => ({ id: i + 1, name, city, landmarks, code: `MRT${String(i + 1).padStart(2, '0')}`, sequenceOrder: i + 1, line: 'MRT-3', status: 'OPEN' }));
  const activeUser = () => state.users.find((user) => user.id === state.user?.id) || null;
  const ticketsFor = (userId) => state.tickets.filter((item) => item.user_id === Number(userId));
  const displayTicketStatus = (journeyType, paymentStatus) => journeyType === 'BEEP_PASS'
    ? paymentStatus === 'UNPAID' ? 'RESERVED / PAY AT COUNTER' : 'PAID / READY FOR PICKUP'
    : paymentStatus === 'UNPAID' ? 'UNPAID / BOOKED' : 'RESERVED / PAID';
  if (route === 'stations' && method === 'GET') return { stations };
  if (route === 'fares' && method === 'GET') {
    const fares = [];
    stations.forEach((from) => stations.forEach((to) => {
      if (from.id === to.id) return;
      const distance = Math.abs(from.sequenceOrder - to.sequenceOrder);
      const regular = distance <= 3 ? 13 : distance <= 6 ? 16 : distance <= 9 ? 20 : distance <= 11 ? 24 : 28;
      const concessionary = distance <= 3 ? 6 : distance <= 6 ? 8 : distance <= 9 ? 10 : distance <= 11 ? 12 : 14;
      fares.push({ originId: from.id, destinationId: to.id, fareType: 'Regular', amount: regular }, { originId: from.id, destinationId: to.id, fareType: 'Concessionary', amount: concessionary });
    }));
    return { fares };
  }
  if (route === 'auth/me' && method === 'GET') { const user = activeUser(); if (!user) error('Sign in required.'); return { user }; }
  if (route === 'auth/register' && method === 'POST') {
    const email = String(body.email || '').trim().toLowerCase();
    if (!body.firstName || !body.lastName || !email || !String(body.password || '').trim()) error('Complete the required fields to create a demo account.');
    if (state.users.some((user) => user.email === email)) error('That demo email already has an account.');
    if (!body.phone || !body.address) error('Enter your phone number and address.');
    if (body.accountType !== 'regular' && !body.idDocumentSelected) error('Choose a sample ID file for this concessionary demo account.');
    const type = ({ regular: 'Regular', student: 'Student', senior: 'Senior', pwd: 'PWD' })[body.accountType] || 'Regular';
    const user = { id: state.nextId++, first_name: body.firstName, middle_name: body.middleName || '', last_name: body.lastName, email, phone_number: body.phone, address: body.address, emergency_name: '', emergency_phone: '', account_type: type, id_upload_status: type === 'Regular' ? 'not_required' : 'pending', id_type: '', id_front_uploaded: false, id_back_uploaded: false, wallet_balance: 500 };
    state.users.push(user); state.user = { id: user.id }; write(state); return { user, csrfToken: 'prototype' };
  }
  if (route === 'auth/login' && method === 'POST') {
    const email = String(body.email || '').trim().toLowerCase();
    const user = state.users.find((item) => item.email === email);
    if (!user || !body.password) error('For this UI demo, create your demo account in this browser first.');
    state.user = { id: user.id }; write(state); return { user, csrfToken: 'prototype' };
  }
  if (route === 'auth/logout' && method === 'POST') { state.user = null; write(state); return { ok: true }; }
  const userRoute = route.match(/^user\/(\d+)(\/id-documents|\/tickets)?$/);
  if (userRoute) {
    const user = activeUser(); if (!user || user.id !== Number(userRoute[1])) error('Sign in to manage this demo profile.');
    if (userRoute[2] === '/tickets' && method === 'GET') return { tickets: ticketsFor(user.id) };
    if (userRoute[2] === '/id-documents' && method === 'POST') {
      const type = body.get('account_type') || 'Regular'; const front = body.get('id_front'); const back = body.get('id_back');
      if (type !== 'Regular' && (!front?.name || !back?.name)) error('Choose both front and back sample images.');
      user.account_type = type; user.id_type = body.get('id_type') || '';
      user.id_front_uploaded = Boolean(front?.name); user.id_back_uploaded = Boolean(back?.name);
      user.id_upload_status = type === 'Regular' ? 'not_required' : 'pending'; write(state);
      return { user, message: 'Prototype update saved in this tab. Verification is simulated.' };
    }
    if (!userRoute[2] && method === 'GET') return { user };
    if (!userRoute[2] && method === 'PUT') { Object.assign(user, body); write(state); return { user, message: 'Demo profile saved in this tab.' }; }
  }
  if (route === 'tickets' && method === 'POST') {
    const user = activeUser(); if (!user) error('Sign in to purchase a demo pass.');
    const date = String(body.validDate || ''); if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) error('Choose a valid travel date.');
    let total; let origin = null; let destination = null; let quantity = 1; let type = body.ticketType;
    const journeyType = body.journeyType === 'BEEP_PASS' ? 'BEEP_PASS' : body.journeyType === 'BOOK_UNPAID' ? 'BOOK_UNPAID' : 'RESERVE_PAID';
    const beepPaymentChoice = body.paymentChoice === 'COUNTER' ? 'COUNTER' : body.paymentChoice === 'ONLINE' ? 'ONLINE' : null;
    if (journeyType === 'BEEP_PASS' && !beepPaymentChoice) error('Choose online payment or pay at the station counter.');
    if (journeyType === 'BEEP_PASS' && !Number.isInteger(Number(body.pickupStationId))) error('Choose an MRT-3 pickup station.');
    const paymentMethod = journeyType === 'BOOK_UNPAID' || (journeyType === 'BEEP_PASS' && beepPaymentChoice === 'COUNTER') ? 'COUNTER' : String(body.paymentMethod || 'DEMO_WALLET');
    if ((journeyType === 'RESERVE_PAID' || (journeyType === 'BEEP_PASS' && beepPaymentChoice === 'ONLINE')) && !['DEMO_WALLET', 'GCASH'].includes(paymentMethod)) error('Choose a supported payment method.');
    if (type === 'STORED_VALUE') {
      total = Number(journeyType === 'BEEP_PASS' ? body.cardValue : body.loadAmount); if (![100, 200, 500].includes(total)) error('Choose a ₱100, ₱200, or ₱500 stored-value amount.');
      if (journeyType === 'BEEP_PASS' && !stations[Number(body.pickupStationId) - 1]) error('Choose an MRT-3 pickup station.');
    } else if (type === 'SINGLE_JOURNEY') {
      origin = Number(body.originId); destination = Number(body.destinationId); quantity = Number(body.quantity);
      if (!origin || !destination || origin === destination || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) error('Choose two different stations and a quantity from 1 to 10.');
      const distance = Math.abs(origin - destination);
      if (body.fareType === 'Concessionary' && (!['Student','Senior','PWD'].includes(user.account_type) || user.id_upload_status !== 'verified')) error('Discounted fare is available only to verified concessionary accounts.');
      const discounted = body.fareType === 'Concessionary';
      const unit = discounted ? (distance <= 3 ? 6 : distance <= 6 ? 8 : distance <= 9 ? 10 : distance <= 11 ? 12 : 14) : (distance <= 3 ? 13 : distance <= 6 ? 16 : distance <= 9 ? 20 : distance <= 11 ? 24 : 28);
      total = unit * quantity;
    } else error('Choose a valid digital pass type.');
    const isPaid = journeyType === 'RESERVE_PAID' || (journeyType === 'BEEP_PASS' && beepPaymentChoice === 'ONLINE');
    const paidFromWallet = isPaid && paymentMethod === 'DEMO_WALLET';
    if (paidFromWallet && Number(user.wallet_balance) < total) error('Your demo wallet balance is too low. Choose GCash demo or a lower fare.');
    if (paidFromWallet) user.wallet_balance = Number(user.wallet_balance) - total;
    const paymentStatus = journeyType === 'BOOK_UNPAID' || (journeyType === 'BEEP_PASS' && beepPaymentChoice === 'COUNTER') ? 'UNPAID' : 'PAID';
    const paymentLabel = paymentMethod === 'COUNTER' ? 'Pay at station counter' : paymentMethod === 'GCASH' ? 'GCash (demo)' : 'Demo wallet';
    const referenceAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const randomBytes = new Uint8Array(8);
    if (window.crypto?.getRandomValues) window.crypto.getRandomValues(randomBytes);
    else randomBytes.forEach((_, index) => { randomBytes[index] = Math.floor(Math.random() * 256); });
    const referenceSuffix = Array.from(randomBytes, (value) => referenceAlphabet[value % referenceAlphabet.length]).join('');
    const reference = journeyType === 'BEEP_PASS' ? `MRT3-BEEP-${referenceSuffix.slice(0, 4)}` : `MRT3-${referenceSuffix}`;
    const pickupStation = journeyType === 'BEEP_PASS' ? stations[Number(body.pickupStationId) - 1].name : '';
    const ticket = { id: Date.now(), user_id: user.id, ticketType: type, journeyType, paymentChoice: journeyType === 'BEEP_PASS' ? beepPaymentChoice : null, paymentStatus, pickupStation, pickupDate: journeyType === 'BEEP_PASS' ? date : '', cardValue: journeyType === 'BEEP_PASS' ? total : 0, origin: origin ? stations[origin - 1].name : journeyType === 'BEEP_PASS' ? pickupStation : 'MRT-3 network', destination: destination ? stations[destination - 1].name : 'Stored-value pass', passengerType: journeyType === 'BEEP_PASS' ? 'Beep Stored-Value Pass' : type === 'STORED_VALUE' ? 'Stored value' : body.fareType || 'Regular', quantity: journeyType === 'BEEP_PASS' ? 1 : quantity, totalAmount: total, storedValue: type === 'STORED_VALUE' ? total : 0, travelDate: date, paymentMethod: paymentLabel, status: 'ACTIVE', reference, qrCodeData: JSON.stringify({ reference, origin: origin ? stations[origin - 1].name : 'MRT-3 network', destination: destination ? stations[destination - 1].name : 'Stored-value pass', pickupStation, pickupDate: journeyType === 'BEEP_PASS' ? date : '', cardValue: journeyType === 'BEEP_PASS' ? total : 0, validityDate: date, totalFare: total, fareCategory: journeyType === 'BEEP_PASS' ? 'Beep Stored-Value Pass' : type === 'STORED_VALUE' ? 'Stored value' : body.fareType || 'Regular', status: displayTicketStatus(journeyType, paymentStatus), paymentStatus, paymentMethod: paymentLabel }), createdAt: new Date().toISOString() };
    state.tickets.unshift(ticket); write(state);
    return { success: true, reference, ticketType: type, status: paymentStatus, farePaid: total, walletBalance: user.wallet_balance, validDate: date, ticket };
  }
  if (route === 'tickets/cancel' && method === 'POST') {
    const user = activeUser(); if (!user) error('Sign in required.');
    const ticket = ticketsFor(user.id).find((item) => item.reference === String(body.reference || ''));
    if (!ticket) error('That ticket could not be found in this demo account.');
    if (ticket.status !== 'ACTIVE') error('Only active tickets can be cancelled.');
    ticket.status = 'CANCELLED';
    const refundedAmount = ticket.paymentStatus !== 'UNPAID' && ticket.paymentMethod === 'Demo wallet' ? Number(ticket.totalAmount || 0) : 0;
    user.wallet_balance = Number(user.wallet_balance || 0) + refundedAmount;
    ticket.cancelledAt = new Date().toISOString();
    ticket.qrCodeData = JSON.stringify({ reference: ticket.reference, origin: ticket.origin, destination: ticket.destination, pickupStation: ticket.pickupStation || '', pickupDate: ticket.pickupDate || '', cardValue: Number(ticket.cardValue || 0), validityDate: ticket.pickupDate || ticket.travelDate, totalFare: Number(ticket.totalAmount || 0), fareCategory: ticket.passengerType || 'Regular', status: 'CANCELLED', bookingStatus: 'CANCELLED', paymentStatus: ticket.paymentStatus, paymentMethod: ticket.paymentMethod });
    write(state);
    return { success: true, ticket, walletBalance: user.wallet_balance, refundedAmount };
  }
  if (route === 'tickets/mine' && method === 'GET') { const user = activeUser(); if (!user) error('Sign in required.'); return { tickets: ticketsFor(user.id) }; }
  error('This action is not available in the UI-only prototype.');
};/* ===== account.js ===== */
(() => {
  if (!document.querySelector("#loginTab")) return;
  const $ = (selector) => document.querySelector(selector);
  const loginTab = document.querySelector('#loginTab');
  const registerTab = document.querySelector('#registerTab');
  const loginPanel = document.querySelector('#loginPanel');
  const registerPanel = document.querySelector('#registerPanel');
  const accountType = document.querySelector('#accountType');
  const uploadSection = document.querySelector('#idUploadSection');
  const idTypeLabel = document.querySelector('#idTypeLabel');
  const fileInput = document.querySelector('#concessionId');
  const filePreview = document.querySelector('#filePreview');
  const previewImage = document.querySelector('#previewImage');
  const previewIcon = document.querySelector('#previewIcon');
  const fileName = document.querySelector('#fileName');
  const fileError = document.querySelector('#idFileError');
  const dialog = document.querySelector('#successDialog');
  const passwordField = document.querySelector('#registerPassword');
  const passwordVisibility = document.querySelector('#togglePasswordVisibility');
  const accountCard = document.querySelector('.account-card');
  const dashboard = document.querySelector('#accountDashboard');
  let registeredUser = null;
  let objectUrl = null;
  let lastFocus = null;

  function selectTab(tab) {
    const isLogin = tab === 'login';
    loginTab.classList.toggle('is-active', isLogin);
    registerTab.classList.toggle('is-active', !isLogin);
    loginTab.setAttribute('aria-selected', String(isLogin));
    registerTab.setAttribute('aria-selected', String(!isLogin));
    loginPanel.hidden = !isLogin;
    registerPanel.hidden = isLogin;
    (isLogin ? loginPanel : registerPanel).querySelector('input,textarea,select')?.focus();
  }

  loginTab.addEventListener('click', () => selectTab('login'));
  registerTab.addEventListener('click', () => selectTab('register'));
  passwordVisibility.addEventListener('click', () => {
    const show = passwordField.type === 'password';
    passwordField.type = show ? 'text' : 'password';
    passwordVisibility.textContent = show ? 'Hide' : 'Show';
    passwordVisibility.setAttribute('aria-label', `${show ? 'Hide' : 'Show'} password`);
    passwordVisibility.setAttribute('aria-pressed', String(show));
    passwordField.focus();
  });

  function updateUpload() {
    const needsId = accountType.value !== 'regular';
    uploadSection.hidden = !needsId;
    idTypeLabel.textContent = accountType.options[accountType.selectedIndex].text.toLowerCase();
    if (!needsId) clearFile();
  }

  function clearFile() {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = null;
    fileInput.value = '';
    filePreview.hidden = true;
    previewImage.hidden = true;
    previewImage.removeAttribute('src');
    previewIcon.hidden = false;
    fileError.textContent = '';
    fileInput.removeAttribute('aria-invalid');
  }

  const typeLabels = { Regular: 'Regular', Student: 'Student', Senior: 'Senior Citizen', PWD: 'PWD' };
  const verificationLabels = { not_required: 'No ID required', pending: 'Pending review', verified: 'Verified', rejected: 'Rejected' };
  const idTypeSelect = $('#idType');
  const concessionType = $('#concessionAccountType');
  const concessionFields = $('#concessionIdFields');
  const idChoices = {
    Regular: ['PhilSys National ID', 'Driver’s License', 'UMID (Unified Multi-Purpose ID)', 'Philippine Passport', 'Postal ID', 'Student ID', 'Senior Citizen ID', 'PWD ID', 'Other Government-Issued ID'],
    Student: ['Student ID'],
    Senior: ['Senior Citizen ID'],
    PWD: ['PWD ID'],
  };
  function syncIdChoices() {
    const accountKind = concessionType.value;
    const options = idChoices[accountKind] || idChoices.Regular;
    const previous = idTypeSelect.value;
    const selected = accountKind === 'Regular'
      ? (options.includes(previous) ? previous : '')
      : options[0];
    idTypeSelect.replaceChildren(new Option('Select your ID', ''), ...options.map((value) => new Option(value, value)));
    idTypeSelect.value = selected;
    const hasSelectedFile = $('#idFront').files.length > 0 || $('#idBack').files.length > 0;
    const hasSavedFile = $('#idVerificationForm').dataset.frontUploaded === '1' || $('#idVerificationForm').dataset.backUploaded === '1';
    concessionFields.hidden = accountKind === 'Regular' && !selected && !hasSelectedFile && !hasSavedFile;
    idTypeSelect.required = accountKind !== 'Regular' || hasSelectedFile;
    $('#idTypeRequired').textContent = idTypeSelect.required ? '(required)' : '(optional)';
  }
  async function showDashboard(user) {
    document.dispatchEvent(new Event('mrt:auth-signed-in'));
    accountCard.hidden = true;
    dashboard.hidden = false;
    dashboard.dataset.userId = user.id;
    $('#dashboardTitle').focus();
    dashboard.setAttribute('aria-busy', 'true');
    try {
      const { user: profile } = await window.mrtApi(`/user/${user.id}`);
      const walletBalance = $('#accountWalletBalance');
      if (walletBalance) walletBalance.textContent = `₱${Number(profile.wallet_balance || 0).toFixed(2)}`;
      $('#accountIdBadge').textContent = `ID ${profile.id}`;
      $('#profileFirstName').value = profile.first_name;
      $('#profileMiddleName').value = profile.middle_name || '';
      $('#profileLastName').value = profile.last_name;
      $('#profilePhone').value = profile.phone_number;
      $('#profileAddress').value = profile.address;
      $('#emergencyName').value = profile.emergency_name || '';
      $('#emergencyPhone').value = profile.emergency_phone || '';
      $('#profileEmail').value = profile.email;
      $('#accountTypeBadge').textContent = typeLabels[profile.account_type] || profile.account_type;
      $('#concessionAccountType').value = profile.account_type;
      $('#idType').value = profile.id_type || '';
      $('#idVerificationForm').dataset.frontUploaded = profile.id_front_uploaded ? '1' : '0';
      $('#idVerificationForm').dataset.backUploaded = profile.id_back_uploaded ? '1' : '0';
      $('#idFrontName').textContent = profile.id_front_uploaded ? 'Front image already submitted' : 'No image selected';
      $('#idBackName').textContent = profile.id_back_uploaded ? 'Back image already submitted' : 'No image selected';
      syncIdChoices();
      const verification = profile.id_upload_status || 'not_required';
      const verificationBadge = $('#verificationBadge');
      verificationBadge.textContent = verificationLabels[verification] || verification;
      verificationBadge.className = `verification-badge verification-${verification}`;
      $('#verificationCopy').textContent = verification === 'pending'
        ? 'Your concessionary ID is awaiting review. Regular fare bookings are available while you wait.'
        : verification === 'verified'
          ? 'Your concessionary ID has been verified and the eligible fare tier is active.'
          : verification === 'rejected'
            ? 'Your ID verification was not approved. Contact the station service desk for assistance.'
            : 'This account uses the regular fare tier; no concessionary ID is required.';
      await loadReservationHistory(profile.id);
    } catch (error) {
      $('#profileMessage').textContent = error.message;
    } finally { dashboard.setAttribute('aria-busy', 'false'); }
  }
  let reservationTickets = [];
  let activeHistoryTab = 'ACTIVE';
  const ticketLabel = (ticket) => ticket.status === 'CANCELLED' ? 'CANCELLED' : ticket.journeyType === 'BEEP_PASS' ? ticket.paymentStatus === 'UNPAID' ? 'RESERVED / PAY AT COUNTER' : 'PAID / READY FOR PICKUP' : ticket.paymentStatus === 'UNPAID' ? 'UNPAID / BOOKED' : ticket.paymentStatus === 'PAID' ? 'RESERVED / PAID' : ticket.status;
  function renderReservationHistory() {
    const list = $('#reservationHistory');
    const visibleTickets = reservationTickets.filter((ticket) => ticket.status === activeHistoryTab);
    const activeCount = reservationTickets.filter((ticket) => ticket.status === 'ACTIVE').length;
    const cancelledCount = reservationTickets.filter((ticket) => ticket.status === 'CANCELLED').length;
    $('#activePassCount').textContent = activeCount;
    $('#cancelledPassCount').textContent = cancelledCount;
    list.setAttribute('aria-labelledby', activeHistoryTab === 'ACTIVE' ? 'activePassesTab' : 'cancelledPassesTab');
    list.replaceChildren();
    if (!visibleTickets.length) {
      const empty = document.createElement('p');
      empty.className = 'history-empty';
      empty.textContent = activeHistoryTab === 'ACTIVE' ? 'No active passes found.' : 'No cancelled bookings.';
      list.append(empty);
      return;
    }
    visibleTickets.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'reservation-card';
      const heading = document.createElement('div');
      heading.className = 'reservation-card-heading';
      const title = document.createElement('h3');
      title.textContent = item.journeyType === 'BEEP_PASS' ? `Beep Pass pickup · ${item.pickupStation}` : item.ticketType === 'STORED_VALUE' ? 'MRT-3 stored-value pass' : `${item.origin} → ${item.destination}`;
      const status = document.createElement('span');
      status.className = `reservation-status ${item.status === 'CANCELLED' ? 'status-cancelled' : item.paymentStatus === 'UNPAID' ? 'status-booked' : 'status-active'}`;
      status.textContent = ticketLabel(item);
      heading.append(title, status);
      const meta = document.createElement('p');
      const kind = item.journeyType === 'BEEP_PASS' ? `Beep Stored-Value Pass · ₱${Number(item.cardValue || 0).toFixed(2)} initial value` : item.ticketType === 'STORED_VALUE' ? 'Stored-value load' : 'Single-journey digital ticket';
      const displayDate = item.journeyType === 'BEEP_PASS' ? item.pickupDate : item.travelDate;
      const travelDate = displayDate ? new Date(`${displayDate}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Date not set';
      meta.textContent = item.journeyType === 'BEEP_PASS' ? `${kind} · Pickup ${travelDate}` : `${kind} · ${item.quantity} ticket${item.quantity === 1 ? '' : 's'} · Valid ${travelDate}`;
      const reference = document.createElement('span');
      reference.className = 'reservation-reference';
      reference.textContent = `Reference ${item.reference}`;
      const total = document.createElement('strong');
      total.className = 'reservation-total';
      total.textContent = item.ticketType === 'STORED_VALUE' ? `Pass value ₱${Number(item.cardValue || item.storedValue || 0).toFixed(2)}` : `₱${Number(item.totalAmount || 0).toFixed(2)}`;
      const actions = document.createElement('div');
      actions.className = 'ticket-card-actions';
      const view = document.createElement('button');
      view.type = 'button'; view.className = 'ticket-action ticket-action-primary';
      view.textContent = 'View ticket'; view.dataset.ticketAction = 'view'; view.dataset.reference = item.reference;
      actions.append(view);
      if (item.status === 'ACTIVE') {
        const cancel = document.createElement('button');
        cancel.type = 'button'; cancel.className = 'ticket-action';
        cancel.textContent = 'Cancel booking'; cancel.dataset.ticketAction = 'cancel'; cancel.dataset.reference = item.reference;
        actions.append(cancel);
      }
      card.append(heading, meta, reference, total, actions);
      list.append(card);
    });
  }
  function setHistoryTab(tab) {
    if (!['ACTIVE', 'CANCELLED'].includes(tab)) return;
    activeHistoryTab = tab;
    document.querySelectorAll('[data-history-tab]').forEach((button) => {
      const selected = button.dataset.historyTab === tab;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    renderReservationHistory();
  }
  document.querySelectorAll('[data-history-tab]').forEach((button, index, buttons) => {
    button.addEventListener('click', () => setHistoryTab(button.dataset.historyTab));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : buttons.length - 1)) % buttons.length;
      buttons[next].focus();
      setHistoryTab(buttons[next].dataset.historyTab);
    });
  });
  async function loadReservationHistory(userId) {
    const list = $('#reservationHistory');
    const message = $('#historyMessage');
    list.setAttribute('aria-busy', 'true');
    message.textContent = 'Loading your saved bookings…';
    list.replaceChildren();
    try {
      const { tickets } = await window.mrtApi(`/user/${userId}/tickets`);
      reservationTickets = tickets;
      const { user } = await window.mrtApi('/auth/me');
      const walletBalance = $('#accountWalletBalance');
      if (walletBalance) walletBalance.textContent = `₱${Number(user.wallet_balance || 0).toFixed(2)}`;
      message.textContent = tickets.length ? `${tickets.length} pass${tickets.length === 1 ? '' : 'es'} across both tabs.` : '';
      renderReservationHistory();
    } catch (error) { reservationTickets = []; renderReservationHistory(); message.textContent = error.message; }
    finally { list.setAttribute('aria-busy', 'false'); }
  }

  const ticketModal = $('#ticketDetailsDialog');
  const cancelModal = $('#cancelTicketDialog');
  const toast = $('#accountToast');
  let selectedTicket = null;
  let modalReturnFocus = null;
  let toastTimer;
  const ticketMoney = (value) => `₱${Number(value || 0).toFixed(2)}`;
  function notify(text) {
    if (!toast) return;
    toast.textContent = text; toast.hidden = false;
    window.clearTimeout(toastTimer); toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3600);
  }
  function closeDialog(dialog) {
    if (!dialog) return;
    dialog.hidden = true;
    if (modalReturnFocus?.isConnected) modalReturnFocus.focus();
    modalReturnFocus = null;
  }
  function showTicket(ticket) {
    if (!ticketModal) return;
    selectedTicket = ticket;
    window.dispatchEvent(new CustomEvent('mrt:ticket-open', { detail: { ticket, trigger: document.activeElement } }));
  }
  function prepareCancelDialog(ticket) {
    const copy = $('#cancelTicketCopy');
    const confirm = $('#cancelTicketConfirm');
    if (ticket.journeyType === 'BEEP_PASS' && ticket.paymentStatus === 'UNPAID') {
      copy.textContent = 'This Beep Pass order will be cancelled. Payment is due at pickup, so no refund is due.';
      confirm.textContent = 'Cancel Beep Pass order';
    } else if (ticket.paymentStatus === 'UNPAID') {
      copy.textContent = 'This unpaid counter voucher will be cancelled. No payment was taken, so no refund is due.';
      confirm.textContent = 'Cancel voucher';
    } else if (ticket.paymentMethod === 'Demo wallet') {
      copy.textContent = `Cancel this reservation? ₱${Number(ticket.totalAmount || 0).toFixed(2)} will be returned to your demo wallet.`;
      confirm.textContent = 'Cancel & refund wallet';
    } else {
      copy.textContent = 'Cancel this reservation? GCash is simulated in this UI demo; no real charge or refund will be processed.';
      confirm.textContent = 'Cancel reservation';
    }
  }
  $('#reservationHistory')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-ticket-action]'); if (!button) return;
    window.mrtApi(`/user/${dashboard.dataset.userId}/tickets`).then(({ tickets }) => {
      const ticket = tickets.find((item) => item.reference === button.dataset.reference);
      if (!ticket) return;
      if (button.dataset.ticketAction === 'view') showTicket(ticket);
      else {
        selectedTicket = ticket;
        prepareCancelDialog(ticket);
        modalReturnFocus = button;
        cancelModal.hidden = false; $('#cancelTicketConfirm')?.focus();
      }
    }).catch((error) => notify(error.message));
  });
  window.addEventListener('mrt:ticket-export-error', (event) => notify(event.detail?.message || 'Could not export the pass image. Please try again.'));
  window.addEventListener('mrt:ticket-cancel', (event) => {
    const ticket = event.detail?.ticket;
    if (!ticket) return;
    selectedTicket = ticket;
    prepareCancelDialog(ticket);
    modalReturnFocus = event.detail.trigger || document.activeElement;
    cancelModal.hidden = false; $('#cancelTicketConfirm')?.focus();
  });
  $('#cancelTicketClose')?.addEventListener('click', () => closeDialog(cancelModal));
  $('#cancelTicketKeep')?.addEventListener('click', () => closeDialog(cancelModal));
  $('#cancelTicketConfirm')?.addEventListener('click', async (event) => {
    if (!selectedTicket) return;
    const button = event.currentTarget; button.disabled = true;
    try {
      const { walletBalance, refundedAmount } = await window.mrtApi('/tickets/cancel', { method: 'POST', body: JSON.stringify({ reference: selectedTicket.reference }) });
      closeDialog(cancelModal);
      $('#accountWalletBalance').textContent = ticketMoney(walletBalance);
      await loadReservationHistory(dashboard.dataset.userId);
      notify(refundedAmount ? `${selectedTicket.reference} cancelled. ${ticketMoney(refundedAmount)} returned to your demo wallet.` : `${selectedTicket.reference} cancelled.`);
    } catch (error) { notify(error.message); }
    finally { button.disabled = false; }
  });
  [cancelModal].filter(Boolean).forEach((dialog) => {
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(dialog); });
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { closeDialog(dialog); return; }
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])')].filter((item) => !item.hidden);
      if (!controls.length) return;
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  });

  document.querySelector('#profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = $('#profileMessage');
    const button = event.currentTarget.querySelector('[type="submit"]');
    const body = Object.fromEntries(new FormData(event.currentTarget).entries());
    if (!body.first_name.trim() || !body.last_name.trim() || !/^(?:\+63|0)9\d{9}$/.test(body.phone_number.replace(/[\s()-]/g, '')) || body.address.trim().length < 5) {
      message.textContent = 'Check your name, Philippine mobile number, and address.';
      return;
    }
    button.disabled = true;
    message.textContent = 'Saving profile…';
    try {
      const { user: profile } = await window.mrtApi(`/user/${dashboard.dataset.userId}`, { method: 'PUT', body: JSON.stringify(body) });
      $('#profileFirstName').value = profile.first_name;
      $('#profileMiddleName').value = profile.middle_name || '';
      $('#profileLastName').value = profile.last_name;
      $('#profilePhone').value = profile.phone_number;
      $('#profileAddress').value = profile.address;
      $('#emergencyName').value = profile.emergency_name || '';
      $('#emergencyPhone').value = profile.emergency_phone || '';
      message.textContent = 'Profile saved.';
    } catch (error) { message.textContent = error.message; }
    finally { button.disabled = false; }
  });
  concessionType.addEventListener('change', syncIdChoices);
  idTypeSelect.addEventListener('change', syncIdChoices);
  [['#idFront','#idFrontName'],['#idBack','#idBackName']].forEach(([inputSelector,nameSelector]) => {
    $(inputSelector).addEventListener('change', (event) => { $(nameSelector).textContent = event.target.files[0]?.name || 'No image selected'; syncIdChoices(); });
  });
  $('#idVerificationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = $('#idVerificationMessage');
    const submit = form.querySelector('[type="submit"]');
    const regularFare = concessionType.value === 'Regular';
    const frontSelected = $('#idFront').files.length > 0;
    const backSelected = $('#idBack').files.length > 0;
    const uploadsSelected = frontSelected || backSelected;
    const requiredId = { Student: 'Student ID', Senior: 'Senior Citizen ID', PWD: 'PWD ID' }[concessionType.value];
    if (!regularFare && ($('#idType').value !== requiredId || !frontSelected || !backSelected)) { status.textContent = `Choose ${requiredId} and attach both sides of the ID.`; return; }
    if (regularFare && uploadsSelected && (!$('#idType').value || !frontSelected || !backSelected)) { status.textContent = 'For an optional ID upload, choose an ID type and attach both sides.'; return; }
    if ([...$('#idFront').files, ...$('#idBack').files].some((file) => file.size > 5 * 1024 * 1024)) { status.textContent = 'Each image must be no larger than 5 MB.'; return; }
    submit.disabled = true; status.textContent = 'Submitting ID images securely…';
    try {
      const { user: profile, message } = await window.mrtApi(`/user/${dashboard.dataset.userId}/id-documents`, { method: 'POST', body: new FormData(form) });
      $('#accountTypeBadge').textContent = typeLabels[profile.account_type] || profile.account_type;
      concessionType.value = profile.account_type;
      idTypeSelect.value = profile.id_type || '';
      $('#idVerificationForm').dataset.frontUploaded = profile.id_front_uploaded ? '1' : '0';
      $('#idVerificationForm').dataset.backUploaded = profile.id_back_uploaded ? '1' : '0';
      syncIdChoices();
      const badge = $('#verificationBadge'); badge.textContent = verificationLabels[profile.id_upload_status] || profile.id_upload_status; badge.className = `verification-badge verification-${profile.id_upload_status}`;
      $('#idFrontName').textContent = profile.id_front_uploaded ? (frontSelected ? 'Front image submitted' : 'Front image already submitted') : 'No image selected';
      $('#idBackName').textContent = profile.id_back_uploaded ? (backSelected ? 'Back image submitted' : 'Back image already submitted') : 'No image selected';
      $('#verificationCopy').textContent = regularFare
        ? 'This account uses the regular fare tier; no concessionary ID is required.'
        : 'Your concessionary ID is awaiting review. Regular fare bookings are available while you wait.';
      status.textContent = message;
    } catch (error) { status.textContent = error.message; }
    finally { submit.disabled = false; }
  });
  $('#refreshHistory').addEventListener('click', async (event) => {
    const button = event.currentTarget; button.classList.add('is-refreshing'); button.disabled = true;
    try { await loadReservationHistory(dashboard.dataset.userId); }
    finally { button.classList.remove('is-refreshing'); button.disabled = false; }
  });
  window.addEventListener('storage', (event) => {
    if (event.key === 'mrtUiPrototypeState' && !dashboard.hidden && dashboard.dataset.userId) loadReservationHistory(dashboard.dataset.userId);
  });
  document.addEventListener('mrt:auth-signed-out', () => {
    dashboard.hidden = true;
    accountCard.hidden = false;
    selectTab('login');
    $('#loginMessage').textContent = 'You have signed out.';
  });
  window.mrtApi('/auth/me').then(({ user }) => showDashboard(user)).catch(() => {});

  accountType.addEventListener('change', updateUpload);
  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    fileError.textContent = '';
    fileInput.removeAttribute('aria-invalid');
    if (!file) { filePreview.hidden = true; return; }
    if (file.size > 5 * 1024 * 1024) {
      fileError.textContent = 'Choose a file smaller than 5 MB.';
      fileInput.setAttribute('aria-invalid', 'true');
      clearFile();
      fileError.textContent = 'Choose a file smaller than 5 MB.';
      return;
    }
    const validImage = file.type.startsWith('image/');
    const validPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!validImage && !validPdf) {
      fileError.textContent = 'Choose an image or PDF file.';
      fileInput.setAttribute('aria-invalid', 'true');
      clearFile();
      fileError.textContent = 'Choose an image or PDF file.';
      return;
    }
    fileName.textContent = file.name;
    filePreview.hidden = false;
    previewIcon.hidden = validImage;
    previewImage.hidden = !validImage;
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    if (validImage) {
      objectUrl = URL.createObjectURL(file);
      previewImage.src = objectUrl;
    }
  });
  document.querySelector('#removeFile').addEventListener('click', clearFile);

  const validations = {
    firstName: (value) => value.trim() ? '' : 'Enter your first name.',
    lastName: (value) => value.trim() ? '' : 'Enter your last name.',
    phone: (value) => /^(?:\+63|0)9\d{9}$/.test(value.replace(/[\s()-]/g, '')) ? '' : 'Enter a valid Philippine mobile number.',
    address: (value) => value.trim().length >= 5 ? '' : 'Enter your residential address.'
  };

  registerPanel.addEventListener('submit', async (event) => {
    event.preventDefault();
    let firstInvalid = null;
    let valid = true;
    Object.entries(validations).forEach(([name, validate]) => {
      const input = registerPanel.elements.namedItem(name);
      const error = document.querySelector(`#${name}Error`);
      const message = validate(input.value);
      error.textContent = message;
      input.setAttribute('aria-invalid', String(Boolean(message)));
      if (message) { valid = false; firstInvalid ||= input; }
    });
    const emailInput = document.querySelector('#registerEmail');
    const emailError = document.querySelector('#emailError');
    emailError.textContent = emailInput.validity.valid && emailInput.value.trim() ? '' : 'Enter a valid email address.';
    emailInput.setAttribute('aria-invalid', String(Boolean(emailError.textContent)));
    if (emailError.textContent) { valid = false; firstInvalid ||= emailInput; }
    const passwordInput = document.querySelector('#registerPassword');
    const passwordError = document.querySelector('#passwordError');
    passwordError.textContent = passwordInput.value.length >= 10 ? '' : 'Use at least 10 characters.';
    passwordInput.setAttribute('aria-invalid', String(Boolean(passwordError.textContent)));
    if (passwordError.textContent) { valid = false; firstInvalid ||= passwordInput; }
    if (accountType.value !== 'regular' && !fileInput.files?.length) {
      fileError.textContent = 'Upload your concessionary ID to continue.';
      fileInput.setAttribute('aria-invalid', 'true');
      valid = false;
      firstInvalid ||= fileInput;
    }
    if (!valid) {
      document.querySelector('#registerMessage').textContent = 'Please review the highlighted fields.';
      firstInvalid?.focus();
      return;
    }
    const submitButton = registerPanel.querySelector('[type="submit"]');
    const message = document.querySelector('#registerMessage');
    message.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = 'Creating account…';
    try {
      const result = await window.mrtApi('/auth/register', { method: 'POST', body: JSON.stringify({
        firstName: registerPanel.elements.namedItem('firstName').value,
        middleName: registerPanel.elements.namedItem('middleName').value,
        lastName: registerPanel.elements.namedItem('lastName').value,
        email: emailInput.value, password: passwordInput.value,
        phone: registerPanel.elements.namedItem('phone').value,
        address: registerPanel.elements.namedItem('address').value,
        accountType: accountType.value,
        idDocumentSelected: accountType.value === 'regular' || Boolean(fileInput.files?.length),
      }) });
      registeredUser = result.user;
    } catch (error) {
      message.textContent = error.message;
      submitButton.disabled = false;
      submitButton.textContent = 'Register / Submit';
      return;
    }
    lastFocus = document.activeElement;
    dialog.hidden = false;
    document.querySelector('#successClose').focus();
  });

  document.querySelector('#successClose').addEventListener('click', () => {
    dialog.hidden = true;
    if (registeredUser) showDashboard(registeredUser);
    else lastFocus?.focus();
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.hidden = true;
      if (registeredUser) showDashboard(registeredUser);
      else lastFocus?.focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dialog.hidden) {
      dialog.hidden = true;
      if (registeredUser) showDashboard(registeredUser);
      else lastFocus?.focus();
    }
  });
  document.querySelector('#loginPanel').addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.querySelector('#loginEmail');
    const password = document.querySelector('#loginPassword');
    const message = document.querySelector('#loginMessage');
    if (!email.value.trim() || !email.validity.valid || !password.value) {
      message.textContent = 'Enter a valid email address and password.';
      (!email.value.trim() || !email.validity.valid ? email : password).focus();
      return;
    }
    const button = loginPanel.querySelector('[type="submit"]');
    button.disabled = true;
    message.textContent = 'Signing in…';
    try {
      const { user } = await window.mrtApi('/auth/login', { method: 'POST', body: JSON.stringify({ email: email.value, password: password.value }) });
      message.textContent = `Signed in as ${user.first_name} ${user.last_name}. You can now book and claim released passes.`;
      await showDashboard(user);
    } catch (error) {
      message.textContent = error.message;
    } finally { button.disabled = false; }
  });
})();


/* ===== film.js ===== */
(() => {
  if (!document.querySelector("#inkFilm")) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.querySelector('#inkFilm');
  const ctx = canvas.getContext('2d', { alpha: false });
  const buffer = document.createElement('canvas'); buffer.width = 200; buffer.height = 113;
  const bctx = buffer.getContext('2d', { alpha: false });
  const pixels = bctx.createImageData(buffer.width, buffer.height);
  const colors = ['#D8FF3E','#FF5C38','#6FE3FF','#FF3D9A'].map(hex => [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)));
  const sections = [...document.querySelectorAll('.section')];
  const stations = [
    ['North Avenue','Quezon City','TriNoma and SM North EDSA'],
    ['Quezon Avenue','Quezon City','Centris Station Mall and EDSA Carousel'],
    ['GMA Kamuning','Quezon City','GMA Network Studios Annex, East Avenue and Timog Avenue'],
    ['Araneta Center-Cubao','Quezon City','LRT-2 Cubao interchange, Gateway Mall, Farmers Plaza and Smart Araneta Coliseum'],
    ['Santolan-Annapolis','Quezon City','Camp Aguinaldo, Camp Crame and Greenhills Shopping Center'],
    ['Ortigas','Pasig City','SM Megamall, Robinsons Galleria, The Podium and Ortigas business district'],
    ['Shaw Boulevard','Mandaluyong City','Shangri-La Plaza, Greenfield District and EDSA Central'],
    ['Boni','Mandaluyong City','Pioneer Center, Robinsons Place Pioneer and Globe Telecom Plaza'],
    ['Guadalupe','Makati City','Guadalupe Commercial Center, Rockwell Center and Guadalupe Ferry Station'],
    ['Buendia','Makati City','Makati central business district and Gil Puyat Avenue'],
    ['Ayala','Makati City','SM Makati, Glorietta, Greenbelt and One Ayala'],
    ['Magallanes','Makati City','Magallanes Interchange, Southgate Mall and Chino Roces Avenue'],
    ['Taft Avenue','Pasay City','LRT-1 EDSA interchange and Metropoint Mall']
  ];
  const stack = document.querySelector('#stationStack');
  if (stack) stack.innerHTML = stations.map(([name, city, landmarks], i) => {
    const number = String(i + 1).padStart(2, '0');
    const query = encodeURIComponent(`MRT 3 ${name} Station Manila Philippines`);
    return `<article class="station-card" role="listitem" style="--i:${i}" aria-labelledby="station-${i + 1}">
      <div class="station-copy"><span class="station-kicker">MRT-3 STATION / ${number}</span><h3 id="station-${i + 1}">${name}</h3><span class="station-city">${city} · EDSA CORRIDOR</span>
      <div class="station-connection"><small>Nearby landmarks & connections</small><p>${landmarks}</p></div>
      <a class="maps-link" href="https://www.google.com/maps/search/?api=1&amp;query=${query}" target="_blank" rel="noopener noreferrer" aria-label="Get directions to ${name} MRT-3 station via Google Maps">Get directions via Google Maps <b aria-hidden="true">↗</b></a></div>
    </article>`;
  }).join('');
  let scrollP = 0, targetP = 0, active = 0, running = false, lastFrame = 0, pointerX = innerWidth/2, pointerY = innerHeight/2, cursorX = pointerX, cursorY = pointerY, velocity = 0, lastScroll = scrollY, skew = 0;
  const water = new Float32Array(buffer.width*buffer.height);
  for(let i=0;i<water.length;i++) water[i] = Math.random()*.22;
  const hash=(x,y,z)=>{let n=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(Math.floor(z*1000)|0,1442695041))|0;n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295};
  const smooth=t=>t*t*(3-2*t);
  function noise(x,y,z){const xi=Math.floor(x),yi=Math.floor(y),xf=smooth(x-xi),yf=smooth(y-yi);const a=hash(xi,yi,z),b=hash(xi+1,yi,z),c=hash(xi,yi+1,z),d=hash(xi+1,yi+1,z);return (a+(b-a)*xf)*(1-yf)+(c+(d-c)*xf)*yf}
  function hsvMix(a,b,t){const toHsv=c=>{c=c.map(v=>v/255);const max=Math.max(...c),min=Math.min(...c),d=max-min;let h=0;if(d){if(max===c[0])h=((c[1]-c[2])/d)%6;else if(max===c[1])h=(c[2]-c[0])/d+2;else h=(c[0]-c[1])/d+4;h*=60;if(h<0)h+=360}return [h,max?d/max:0,max]};const A=toHsv(a),B=toHsv(b);let dh=((B[0]-A[0]+540)%360)-180;let h=(A[0]+dh*t+360)%360,s=A[1]+(B[1]-A[1])*t,v=A[2]+(B[2]-A[2])*t;let c=v*s,x=c*(1-Math.abs((h/60)%2-1)),m=v-c,r=0,g=0,bl=0;if(h<60)[r,g,bl]=[c,x,0];else if(h<120)[r,g,bl]=[x,c,0];else if(h<180)[r,g,bl]=[0,c,x];else if(h<240)[r,g,bl]=[0,x,c];else if(h<300)[r,g,bl]=[x,0,c];else [r,g,bl]=[c,0,x];return [(r+m)*255,(g+m)*255,(bl+m)*255]}
  const accentMap={acid:colors[0],orange:colors[1],cyan:colors[2],magenta:colors[3]};let hueStops=[];function updateHueStops(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);hueStops=sections.map(s=>({at:(s.offsetTop+s.offsetHeight/2-innerHeight/2)/max,color:accentMap[s.dataset.accent]||colors[0]})).sort((a,b)=>a.at-b.at)}function hueAt(p){if(!hueStops.length)updateHueStops();if(p<=hueStops[0].at)return hueStops[0].color;for(let i=1;i<hueStops.length;i++){if(p<=hueStops[i].at){const a=hueStops[i-1],b=hueStops[i],t=(p-a.at)/Math.max(.0001,b.at-a.at);return hsvMix(a.color,b.color,t)}}return hueStops[hueStops.length-1].color}
  function draw(now){running=false;if(reduced.matches)return;if(now-lastFrame<38){requestAnimationFrame(draw);running=true;return}lastFrame=now;scrollP+=(targetP-scrollP)*.065;const color=hueAt(scrollP);for(let y=0;y<buffer.height;y++)for(let x=0;x<buffer.width;x++){const i=y*buffer.width+x;const wx=x/39+scrollP*3,wy=y/37;const warpX=noise(wx,wy,scrollP*2)*2-1,warpY=noise(wx+8.1,wy+3.2,scrollP*2.4)*2-1;let field=0,amp=.52,freq=1;for(let o=0;o<4;o++){field+=noise((wx+warpX*.8)*freq,(wy+warpY*.8)*freq,scrollP*2+o*3)*amp;amp*=.5;freq*=2}field+=water[i]*.06;const core=Math.max(0,Math.min(1,(field-.77)*12)),skirt=Math.max(0,Math.min(1,(field-.59)*3.4));const bloom=core*.78+skirt*.2;const base=7+bloom*30;const j=i*4;pixels.data[j]=Math.min(255,base+color[0]*bloom*.65);pixels.data[j+1]=Math.min(255,base+color[1]*bloom*.65);pixels.data[j+2]=Math.min(255,base+color[2]*bloom*.65);pixels.data[j+3]=255}bctx.putImageData(pixels,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(buffer,0,0,canvas.width,canvas.height);const desiredSkew=Math.max(-2.2,Math.min(2.2,velocity*.018));skew+=(desiredSkew-skew)*.18;document.querySelector('#scrollRoot').style.transform=`skewY(${skew}deg)`;velocity*=.82;cursorX+=(pointerX-cursorX)*.09;cursorY+=(pointerY-cursorY)*.09;document.querySelector('#cursorBloom').style.transform=`translate3d(${cursorX-260}px,${cursorY-260}px,0)`;if(Math.abs(targetP-scrollP)>.001||Math.abs(velocity)>.015||Math.abs(pointerX-cursorX)>.6||Math.abs(pointerY-cursorY)>.6){requestAnimationFrame(draw);running=true}}
  function wake(){if(!running&&!reduced.matches){running=true;requestAnimationFrame(draw)}}
  function resize(){canvas.width=innerWidth;canvas.height=innerHeight;updateHueStops();wake()}
  function onScroll(){const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);targetP=scrollY/max;velocity=scrollY-lastScroll;lastScroll=scrollY;let closest=0,dist=Infinity;sections.forEach((s,i)=>{const r=s.getBoundingClientRect(),d=Math.abs(r.top+r.height/2-innerHeight/2);if(d<dist){dist=d;closest=i}});active=closest;document.documentElement.style.setProperty('--accent',`var(--${sections[active].dataset.accent||'acid'})`);wake()}
  function initHeadline(el){const lines=[...el.children].map(child=>child.textContent.trim());el.textContent='';let charIndex=0;lines.forEach(line=>{const lineEl=document.createElement('span');lineEl.className='manifesto-line';const words=line.split(/\s+/);words.forEach((word,wi)=>{const mask=document.createElement('span');mask.className='char-mask';[...word].forEach(ch=>{const inner=document.createElement('span');inner.style.setProperty('--i',charIndex++);inner.textContent=ch;mask.append(inner)});lineEl.append(mask);if(wi<words.length-1)lineEl.append(document.createTextNode(' '))});el.append(lineEl)})}
  const manifesto=document.querySelector('#manifesto');initHeadline(manifesto);
  if(!reduced.matches){document.body.classList.add('motion-on');const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('entered');reveal.unobserve(e.target)}}),{threshold:.28});document.querySelectorAll('.section').forEach(s=>reveal.observe(s));window.addEventListener('pointermove',e=>{pointerX=e.clientX;pointerY=e.clientY},{passive:true});window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',resize);onScroll();resize();}
  else {document.body.classList.add('motion-reduced');canvas.style.display='none';document.querySelectorAll('.section').forEach(s=>s.classList.add('entered'));}
  document.querySelectorAll('.section').forEach(s=>s.addEventListener('mouseenter',()=>{const accent=s.dataset.accent||'acid';document.documentElement.style.setProperty('--accent',`var(--${accent})`)}));
  const bloom=document.querySelector('#cursorBloom');if(matchMedia('(pointer:fine)').matches&&!reduced.matches){bloom.style.cssText='position:fixed;z-index:-2;width:520px;height:520px;inset:0 auto auto 0;border-radius:50%;background:radial-gradient(circle, color-mix(in srgb,var(--accent) 17%,transparent),transparent 68%);mix-blend-mode:screen;will-change:transform;pointer-events:none'}
  const cmp=document.querySelector('.compare-stage'),designed=document.querySelector('.designed-pane'),line=document.querySelector('.compare-line'),handle=document.querySelector('.compare-handle');
  function scrub(){const section=document.querySelector('#s03');if(!section)return;const r=section.getBoundingClientRect(),p=Math.max(0,Math.min(1,-r.top/(r.height-innerHeight)));const cut=72-p*48;designed.style.clipPath=`inset(${cut}% 0 0)`;line.style.top=`${cut}%`;handle.style.top=`${cut}%`;}
  if(!reduced.matches)window.addEventListener('scroll',scrub,{passive:true});
  const words=[...manifesto.querySelectorAll('.char-mask')];function wordScrub(){const r=document.querySelector('#s05').getBoundingClientRect(),p=Math.max(0,Math.min(1,-r.top/(r.height-innerHeight)));words.forEach((w,i)=>{const start=i/(words.length+1),q=Math.max(0,Math.min(1,(p-start)*words.length*1.5));w.style.setProperty('--reveal',q);w.style.opacity=.1+q*.9;w.style.transform=`translateY(${(1-q)*.35}em)`})}
  if(!reduced.matches)window.addEventListener('scroll',wordScrub,{passive:true});
  const stat=document.querySelector('[data-count]');let counted=false;new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&!counted){counted=true;const start=performance.now();function count(t){const p=Math.min(1,(t-start)/1400);stat.textContent=String(Math.round(Number(stat.dataset.count)*(1-Math.pow(1-p,3)))).padStart(2,'0');if(p<1)requestAnimationFrame(count)}requestAnimationFrame(count)}}),{threshold:.5}).observe(stat);
  reduced.addEventListener?.('change',e=>{if(e.matches)location.reload()});
})();









/* ===== label.js ===== */
(() => {
  if (!document.querySelector(".portal")) return;
  const portal = document.querySelector('.portal');
  const stage = document.querySelector('.portal-sticky');
  const title = document.querySelector('.portal-title');
  const titleParts = title.querySelectorAll('span');
  const doors = document.querySelectorAll('.door');
  const background = document.querySelector('.portal-image');
  const duotone = document.querySelector('.duotone');
  const dots = document.querySelectorAll('.portal-dot');
  const orbit = document.querySelector('.orbit-image');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let ticking = false;

  function setPortalProgress() {
    const rect = portal.getBoundingClientRect();
    const travel = Math.max(1, portal.offsetHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    if (!reduceMotion.matches) {
      portal.classList.add('motion-ready');
      doors[0].style.transform = `translateX(${-progress * 104}%)`;
      doors[1].style.transform = `translateX(${progress * 104}%)`;
      background.style.transform = `scale(${1.18 - progress * .18})`;
      duotone.style.opacity = String(progress * .24);
      title.style.transform = `translate(-50%,-50%) scale(${1 + progress * .16})`;
      title.style.letterSpacing = `${-.075 - progress * .02}em`;
      titleParts[0].style.transform = `translateX(${-progress * titleParts[0].offsetWidth * .5}px)`;
      titleParts[1].style.transform = `translateX(${progress * titleParts[1].offsetWidth * .5}px)`;
      dots[0].style.transform = `translate(${-progress * window.innerWidth * .38}px,${-progress * window.innerHeight * .38}px)`;
      dots[1].style.transform = `translate(${progress * window.innerWidth * .38}px,${progress * window.innerHeight * .38}px)`;
    }
    if (rect.bottom < window.innerHeight * 1.5 && rect.bottom > -window.innerHeight) {
      const drift = Math.max(-1, Math.min(1, (window.innerHeight * .7 - rect.top) / (window.innerHeight * 2)));
      orbit.style.transform = `translateY(calc(-50% + ${drift * 32}px)) rotate(${drift * 7}deg)`;
    }
    ticking = false;
  }
  function onScroll() {
    if (!ticking) { window.requestAnimationFrame(setPortalProgress); ticking = true; }
  }
  if (reduceMotion.matches) portal.classList.add('no-motion');
  else { portal.classList.add('motion-ready'); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll); setPortalProgress(); }
  reduceMotion.addEventListener?.('change', (event) => {
    if (event.matches) {
      window.removeEventListener('scroll', onScroll);
      portal.classList.add('no-motion');
      portal.classList.remove('motion-ready');
      doors.forEach((door) => door.style.removeProperty('transform'));
    } else {
      portal.classList.remove('no-motion');
      window.addEventListener('scroll', onScroll, { passive: true });
      setPortalProgress();
    }
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); current.unobserve(entry.target); }
    }), { threshold: .14 });
    revealItems.forEach((item) => observer.observe(item));
  } else revealItems.forEach((item) => item.classList.add('is-visible'));

  const deck = document.querySelector('#recordDeck');
  const cards = [...deck.querySelectorAll('.record-card')];
  const dotsProgress = [...document.querySelectorAll('.progress-dot')];
  const label = document.querySelector('.progress-label');
  let order = [0, 1, 2];
  let drag = null;
  const rest = [
    'translate(0,0) rotate(-3deg) scale(.94)',
    'translate(12px,-7px) rotate(2deg) scale(.97)',
    'translate(24px,-14px) rotate(-1deg) scale(1)'
  ];

  function renderDeck() {
    order.forEach((cardIndex, depth) => {
      const card = cards[cardIndex];
      card.style.zIndex = String(depth + 1);
      card.style.transform = rest[depth];
      card.style.transition = 'transform .45s cubic-bezier(.2,.7,.2,1)';
    });
    dotsProgress.forEach((dot, i) => dot.classList.toggle('active', i === (3 - order[2] - 1) % 3));
    label.textContent = `${String(order[2] + 1).padStart(2, '0')} / 03`;
  }
  function throwTop(direction) {
    if (drag) return;
    const index = order.pop();
    const card = cards[index];
    card.style.transition = 'transform .35s cubic-bezier(.2,.7,.2,1)';
    card.style.transform = `translate(${direction * (deck.clientWidth + card.clientWidth)}px,-38px) rotate(${direction * 18}deg) scale(.92)`;
    window.setTimeout(() => { order.unshift(index); renderDeck(); }, 330);
  }
  deck.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); throwTop(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); throwTop(-1); }
  });
  cards.forEach((card) => {
    card.addEventListener('pointerdown', (event) => {
      if (drag) return;
      const top = cards[order[2]];
      if (card !== top) return;
      drag = { card, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
      card.setPointerCapture(event.pointerId);
      card.style.transition = 'none';
    });
    card.addEventListener('pointermove', (event) => {
      if (!drag || drag.card !== card || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (Math.abs(dx) > 4) drag.moved = true;
      card.style.transform = `translate(${dx}px,${dy - Math.abs(dx) * .07}px) rotate(${dx * .055}deg) scale(1.035)`;
    });
    const release = (event) => {
      if (!drag || drag.card !== card || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      const shouldThrow = Math.abs(dx) > deck.clientWidth * .1;
      drag = null;
      if (shouldThrow) throwTop(Math.sign(dx)); else renderDeck();
    };
    card.addEventListener('pointerup', release);
    card.addEventListener('pointercancel', () => { if (drag?.card === card) { drag = null; renderDeck(); } });
  });
  renderDeck();
})();


/* ===== map.js ===== */
(() => {
  if (!document.querySelector("#map")) return;
/**
 * MRT-3 Live Map Engine
 */

// Official Schedule & Operational Rules
const MRT3_SCHEDULE_CONFIG = {
  weekday: {
    firstTrip: "04:30",
    lastTrip: "22:30",
    peakHeadwayMs: 3.5 * 60 * 1000,
    offPeakHeadwayMs: 5.0 * 60 * 1000,
    peakHours: [
      { start: "06:00", end: "09:00" },
      { start: "17:00", end: "20:00" },
    ],
  },
  weekend: {
    firstTrip: "04:30",
    lastTrip: "21:30",
    peakHeadwayMs: 5.0 * 60 * 1000,
    offPeakHeadwayMs: 5.0 * 60 * 1000,
    peakHours: [],
  },
};

// Station Data Along EDSA
const mrt3StationsData = [
  { name: "North Avenue", lat: 14.6521, lng: 121.0323, pathIndex: 0 },
  { name: "Quezon Avenue", lat: 14.6428, lng: 121.0385, pathIndex: 1 },
  { name: "GMA-Kamuning", lat: 14.6352, lng: 121.0433, pathIndex: 2 },
  { name: "Cubao", lat: 14.6195, lng: 121.0511, pathIndex: 3 },
  { name: "Santolan-Annapolis", lat: 14.6078, lng: 121.0566, pathIndex: 5 },
  { name: "Ortigas", lat: 14.5878, lng: 121.0567, pathIndex: 9 },
  { name: "Shaw Boulevard", lat: 14.5811, lng: 121.0536, pathIndex: 10 },
  { name: "Boni", lat: 14.5737, lng: 121.0481, pathIndex: 11 },
  { name: "Guadalupe", lat: 14.5672, lng: 121.0456, pathIndex: 12 },
  { name: "Buendia", lat: 14.5547, lng: 121.0343, pathIndex: 13 },
  { name: "Ayala", lat: 14.5491, lng: 121.028, pathIndex: 14 },
  { name: "Magallanes", lat: 14.542, lng: 121.0195, pathIndex: 15 },
  { name: "Taft Avenue", lat: 14.5376, lng: 121.0006, pathIndex: 16 },
];

// Track Waypoints
const mrt3TrackPath = [
  [14.6521, 121.0323],
  [14.6428, 121.0385],
  [14.6352, 121.0433],
  [14.6195, 121.0511],
  [14.6135, 121.0538],
  [14.6078, 121.0566],
  [14.6025, 121.0588],
  [14.5968, 121.0592],
  [14.5915, 121.0582],
  [14.5878, 121.0567],
  [14.5811, 121.0536],
  [14.5737, 121.0481],
  [14.5672, 121.0456],
  [14.5547, 121.0343],
  [14.5491, 121.028],
  [14.542, 121.0195],
  [14.5376, 121.0006],
];

const totalStations = mrt3StationsData.length;
const segmentTotalMs = 180000;
const stationDwellTimeMs = 30000;
const fullTripDurationMs = (totalStations - 1) * segmentTotalMs;

let map = null;
let trainMarkers = [];
let stationMarkers = [];
let routeBounds = null;

function getCurrentScheduleStatus() {
  const now = new Date();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const schedule = isWeekend
    ? MRT3_SCHEDULE_CONFIG.weekend
    : MRT3_SCHEDULE_CONFIG.weekday;
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const isOperating =
    timeStr >= schedule.firstTrip && timeStr <= schedule.lastTrip;
  const isPeak = schedule.peakHours.some(
    (p) => timeStr >= p.start && timeStr <= p.end,
  );

  return {
    isOperating,
    isPeak,
    headwayMs: isPeak ? schedule.peakHeadwayMs : schedule.offPeakHeadwayMs,
  };
}

function initMap() {
  const container = document.getElementById("map");
  if (!container) return;

  // Scroll-wheel zoom is enabled so desktop users can zoom directly over the map.
  map = L.map("map", {
    zoomControl: false,
    attributionControl: true,
    scrollWheelZoom: true,
    wheelDebounceTime: 40,
    wheelPxPerZoomLevel: 90,
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    minZoom: 10,
    maxZoom: 19,
  });

  // Free Keyless Standard Tiles (Styled via CSS Filter into Dark Mode)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    subdomains: "abc",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>',
  }).addTo(map);

  routeBounds = L.latLngBounds(mrt3TrackPath);

  // Track Polyline with glowing effect
  L.polyline(mrt3TrackPath, {
    color: "#f59e0b",
    weight: 12,
    opacity: 0.35,
    smoothFactor: 1,
  }).addTo(map);
  L.polyline(mrt3TrackPath, {
    color: "#f59e0b",
    weight: 6,
    opacity: 0.95,
    smoothFactor: 1,
  }).addTo(map);

  // Station Nodes
  const stationSelect = document.getElementById("stationSelect");
  mrt3StationsData.forEach((station, index) => {
    const stationIcon = L.divIcon({
      className: "mrt3-station-node",
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    });
    const marker = L.marker([station.lat, station.lng], {
      icon: stationIcon,
    }).addTo(map);
    marker.bindPopup(
      `<div class="station-popup"><strong>${station.name}</strong><span>Station ${String(index + 1).padStart(2, "0")} of ${totalStations} · MRT-3 Yellow Line</span></div>`,
    );
    stationMarkers.push(marker);
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = station.name;
    stationSelect.append(option);
  });

  stationSelect.addEventListener("change", () => {
    document.getElementById("goToStation").disabled =
      stationSelect.value === "";
  });
  document.getElementById("goToStation").addEventListener("click", () => {
    const index = Number(stationSelect.value);
    const station = mrt3StationsData[index];
    const marker = stationMarkers[index];
    if (!station || !marker) return;
    const target = L.latLng(station.lat, station.lng);
    if (map.getZoom() >= 14 && map.getCenter().distanceTo(target) < 1) {
      marker.openPopup();
      return;
    }
    map.flyTo([station.lat, station.lng], Math.max(map.getZoom(), 14), {
      duration: 0.75,
    });
    map.once("moveend", () => marker.openPopup());
  });
  document
    .getElementById("zoomIn")
    .addEventListener("click", () => map.zoomIn(0.5));
  document
    .getElementById("zoomOut")
    .addEventListener("click", () => map.zoomOut(0.5));
  document.getElementById("fitRoute").addEventListener("click", fitFullRoute);

  // Force tile recalculation
  fitFullRoute();
  setTimeout(() => {
    if (map) map.invalidateSize();
  }, 250);

  updateTrainPositions();
  setInterval(updateTrainPositions, 1000);
}

function fitFullRoute() {
  if (map && routeBounds)
    map.fitBounds(routeBounds, {
      padding: [52, 52],
      maxZoom: 13.5,
      animate: true,
      duration: 0.75,
    });
}

function getAccurateTrainState(train) {
  const now = Date.now() + train.offsetMs;
  const cycleTime = now % fullTripDurationMs;

  const stationSegIdx = Math.min(
    Math.floor(cycleTime / segmentTotalMs),
    totalStations - 2,
  );
  const timeInSegment = cycleTime % segmentTotalMs;

  let startStation, endStation;
  if (train.direction === "SB") {
    startStation = mrt3StationsData[stationSegIdx];
    endStation = mrt3StationsData[stationSegIdx + 1];
  } else {
    startStation = mrt3StationsData[totalStations - 1 - stationSegIdx];
    endStation = mrt3StationsData[totalStations - 1 - stationSegIdx - 1];
  }

  if (timeInSegment < stationDwellTimeMs) {
    return {
      lat: startStation.lat,
      lng: startStation.lng,
      statusText: `Boarding at ${startStation.name}`,
    };
  }

  const transitTime = timeInSegment - stationDwellTimeMs;
  const travelDuration = segmentTotalMs - stationDwellTimeMs;
  const progress = transitTime / travelDuration;

  const startPathIdx = startStation.pathIndex;
  const endPathIdx = endStation.pathIndex;

  const subPoints = [];
  if (startPathIdx < endPathIdx) {
    for (let i = startPathIdx; i <= endPathIdx; i++)
      subPoints.push(mrt3TrackPath[i]);
  } else {
    for (let i = startPathIdx; i >= endPathIdx; i--)
      subPoints.push(mrt3TrackPath[i]);
  }

  const totalSubSegments = subPoints.length - 1;
  const globalProgress = progress * totalSubSegments;
  const currentSubIdx = Math.min(
    Math.floor(globalProgress),
    totalSubSegments - 1,
  );
  const subProgress = globalProgress - currentSubIdx;

  const p1 = subPoints[currentSubIdx];
  const p2 = subPoints[currentSubIdx + 1];

  const lat = p1[0] + (p2[0] - p1[0]) * subProgress;
  const lng = p1[1] + (p2[1] - p1[1]) * subProgress;

  return { lat, lng, statusText: `En route to ${endStation.name}` };
}

function updateTrainPositions() {
  if (!map || document.hidden) return;

  const status = getCurrentScheduleStatus();
  const headway = status.headwayMs;

  const activeFleet = [
    { id: "MRT3-SB1", direction: "SB", offsetMs: 0 },
    { id: "MRT3-SB2", direction: "SB", offsetMs: headway },
    { id: "MRT3-SB3", direction: "SB", offsetMs: headway * 2 },
    { id: "MRT3-NB1", direction: "NB", offsetMs: headway / 2 },
    { id: "MRT3-NB2", direction: "NB", offsetMs: headway / 2 + headway },
    { id: "MRT3-NB3", direction: "NB", offsetMs: headway / 2 + headway * 2 },
  ];

  activeFleet.forEach((train, index) => {
    const state = getAccurateTrainState(train);
    const dirSymbol = train.direction === "SB" ? "⬇️" : "⬆️";
    let marker = trainMarkers[index];
    if (!marker) {
      const trainIcon = L.divIcon({
        className: "custom-train-container",
        html: `<div class="mrt3-train-marker">${dirSymbol} ${train.id}</div>`,
        iconSize: [104, 30],
        iconAnchor: [52, 15],
      });
      marker = L.marker([state.lat, state.lng], {
        icon: trainIcon,
        keyboard: true,
      }).addTo(map);
      marker.bindPopup("");
      trainMarkers[index] = marker;
    } else {
      marker.setLatLng([state.lat, state.lng]);
    }
    const popupContent = `
            <div class="train-popup"><strong>${train.id} · ${train.direction === "SB" ? "Southbound" : "Northbound"}</strong>
            <span>${state.statusText}</span><small>Simulated interval: ${status.isPeak ? "3.5 min (peak)" : "5 min (off-peak)"}</small></div>
        `;
    if (marker._mrtPopupContent !== popupContent) {
      marker.setPopupContent(popupContent);
      marker._mrtPopupContent = popupContent;
    }
  });
}

// Ensure execution triggers correctly on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMap);
} else {
  initMap();
}

})();


/* ===== stations.js ===== */
(() => {
  if (!document.querySelector("#stationStack")) return;
  const fallbackData = [
    ['North Avenue', 'Quezon City', 'TriNoma and SM North EDSA'],
    ['Quezon Avenue', 'Quezon City', 'Centris Station Mall and the EDSA Carousel stop'],
    ['GMA-Kamuning', 'Quezon City', 'GMA Network Studios Annex, East Avenue and Timog Avenue'],
    ['Araneta Center-Cubao', 'Quezon City', 'LRT-2 Cubao interchange, Gateway Mall, Farmers Market and Smart Araneta Coliseum'],
    ['Santolan-Anapolis', 'Quezon City', 'Camp Aguinaldo, Camp Crame and Greenhills Shopping Center'],
    ['Ortigas', 'Pasig City', 'SM Megamall, Robinsons Galleria, The Podium and Ortigas business district'],
    ['Shaw Boulevard', 'Mandaluyong City', 'Shangri-La Plaza, Greenfield District and EDSA Central'],
    ['Boni', 'Mandaluyong City', 'Pioneer Center, Robinsons Place Pioneer and Globe Telecom Plaza'],
    ['Guadalupe', 'Makati City', 'Guadalupe Commercial Center and Rockwell Center'],
    ['Buendia', 'Makati City', 'Makati central business district and Forbes Park gate'],
    ['Ayala', 'Makati City', 'SM Makati, Glorietta, Greenbelt, The Landmark and One Ayala'],
    ['Magallanes', 'Makati City', 'Magallanes Interchange, Southgate Mall and Chino Roces Avenue'],
    ['Taft Avenue', 'Pasay City', 'LRT-1 EDSA interchange and Metropoint Mall']
  ];
  const data = Array.isArray(window.mrtStations) && window.mrtStations.length
    ? window.mrtStations.map(({ name, city, landmarks }) => [name, city, landmarks])
    : fallbackData;
  const stack = document.querySelector('#stationStack');
  const fragment = document.createDocumentFragment();
  data.forEach(([name, city, landmarks], index) => {
    const number = String(index + 1).padStart(2, '0');
    const card = document.createElement('article');
    card.className = 'station-card';
    card.setAttribute('role', 'listitem');
    card.style.setProperty('--station-index', index);
    const info = document.createElement('div');
    info.className = 'station-info';
    const meta = document.createElement('div');
    meta.className = 'station-meta';
    const dot = document.createElement('i');
    dot.setAttribute('aria-hidden', 'true');
    meta.append(dot, document.createTextNode(`STATION ${number} / 13`));
    const heading = document.createElement('h2');
    heading.id = `station-${number}`;
    heading.textContent = name;
    const jurisdiction = document.createElement('span');
    jurisdiction.className = 'station-city';
    jurisdiction.textContent = `${city} · EDSA CORRIDOR`;
    const divider = document.createElement('div');
    divider.className = 'station-divider';
    divider.setAttribute('aria-hidden', 'true');
    const landmarkLabel = document.createElement('span');
    landmarkLabel.className = 'landmark-label';
    landmarkLabel.textContent = 'Nearby landmarks & connections';
    const description = document.createElement('p');
    description.textContent = landmarks;
    const directions = document.createElement('a');
    directions.className = 'station-directions';
    const query = new URLSearchParams({ api: '1', query: `MRT 3 ${name} Station Manila Philippines` });
    directions.href = `https://www.google.com/maps/search/?${query.toString()}`;
    directions.target = '_blank';
    directions.rel = 'noopener noreferrer';
    directions.setAttribute('aria-label', `Get directions to ${name} MRT-3 station via Google Maps`);
    directions.append(document.createTextNode('Get Directions via Google Maps'));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    directions.append(arrow);
    info.append(meta, heading, jurisdiction, divider, landmarkLabel, description, directions);
    card.setAttribute('aria-labelledby', heading.id);
    card.append(info);
    fragment.append(card);
  });
  stack.append(fragment);
})();


/* ===== timetable.js ===== */
(() => {
  if (!document.querySelector("#scheduleTableBody")) return;
// MRT-3 Station List in exact sequence (13 Stations)
const stations = [
  "North Avenue",
  "Quezon Avenue",
  "GMA-Kamuning",
  "Araneta Center-Cubao",
  "Santolan-Anapolis",
  "Ortigas",
  "Shaw Boulevard",
  "Boni",
  "Guadalupe",
  "Buendia",
  "Ayala",
  "Magallanes",
  "Taft Avenue",
];

// ProjectLIGTAS Exact Station-by-Station Operational Schedule & Gate Closures
const MRT3_SCHEDULE_CONFIG = {
  weekday: {
    northFirst: "04:30",
    taftFirst: "05:05",
    peakHeadwaySec: 210, // 3.5 minutes
    offPeakHeadwaySec: 300, // 5.0 minutes
    peakHours: [
      { start: "06:00", end: "09:00" },
      { start: "17:00", end: "20:00" },
    ],
    stationFirstDepartures: {
      "North Avenue": {
        time: "04:30 AM",
        dest: "Taft Avenue",
        platform: "Platform 1",
      },
      "Quezon Avenue": {
        time: "04:35 AM",
        dest: "Taft Avenue",
        platform: "Platform 2",
      },
      "GMA-Kamuning": {
        time: "04:40 AM",
        dest: "Taft Avenue",
        platform: "Platform 1",
      },
      "Araneta Center-Cubao": {
        time: "04:45 AM",
        dest: "Taft Avenue",
        platform: "Platform 2",
      },
      "Santolan-Anapolis": {
        time: "04:50 AM",
        dest: "Taft Avenue",
        platform: "Platform 1",
      },
      Ortigas: {
        time: "04:55 AM",
        dest: "Taft Avenue",
        platform: "Platform 2",
      },
      "Shaw Boulevard": {
        time: "05:00 AM",
        dest: "North Avenue",
        platform: "Platform 1",
      },
      Boni: { time: "05:05 AM", dest: "North Avenue", platform: "Platform 2" },
      Guadalupe: {
        time: "05:10 AM",
        dest: "North Avenue",
        platform: "Platform 1",
      },
      Buendia: {
        time: "05:15 AM",
        dest: "North Avenue",
        platform: "Platform 2",
      },
      Ayala: { time: "05:20 AM", dest: "North Avenue", platform: "Platform 1" },
      Magallanes: {
        time: "05:25 AM",
        dest: "North Avenue",
        platform: "Platform 2",
      },
      "Taft Avenue": {
        time: "05:30 AM",
        dest: "North Avenue",
        platform: "Platform 1",
      },
    },
    southbound: {
      "North Avenue": { gateClose: "22:25", lastTrain: "22:30" },
      "Quezon Avenue": { gateClose: "22:28", lastTrain: "22:33" },
      "GMA-Kamuning": { gateClose: "22:30", lastTrain: "22:35" },
      "Araneta Center-Cubao": { gateClose: "22:32", lastTrain: "22:38" },
      "Santolan-Anapolis": { gateClose: "22:37", lastTrain: "22:40" },
      Ortigas: { gateClose: "22:40", lastTrain: "22:43" },
      "Shaw Boulevard": { gateClose: "22:41", lastTrain: "22:48" },
      Boni: { gateClose: "22:45", lastTrain: "22:48" },
      Guadalupe: { gateClose: "22:47", lastTrain: "22:50" },
      Buendia: { gateClose: "22:48", lastTrain: "22:56" },
      Ayala: { gateClose: "22:50", lastTrain: "22:55" },
      Magallanes: { gateClose: "22:53", lastTrain: "22:58" },
      "Taft Avenue": { gateClose: "22:55", lastTrain: "23:00" },
    },
    northbound: {
      "Taft Avenue": { gateClose: "23:04", lastTrain: "23:09" },
      Magallanes: { gateClose: "23:09", lastTrain: "23:14" },
      Ayala: { gateClose: "23:10", lastTrain: "23:15" },
      Buendia: { gateClose: "23:11", lastTrain: "23:19" },
      Guadalupe: { gateClose: "23:17", lastTrain: "23:20" },
      Boni: { gateClose: "23:19", lastTrain: "23:22" },
      "Shaw Boulevard": { gateClose: "23:20", lastTrain: "23:27" },
      Ortigas: { gateClose: "23:23", lastTrain: "23:26" },
      "Santolan-Anapolis": { gateClose: "23:26", lastTrain: "23:35" },
      "Araneta Center-Cubao": { gateClose: "23:27", lastTrain: "23:33" },
      "GMA-Kamuning": { gateClose: "23:30", lastTrain: "23:35" },
      "Quezon Avenue": { gateClose: "23:32", lastTrain: "23:37" },
      "North Avenue": { gateClose: "23:35", lastTrain: "23:40" },
    },
  },
  weekend: {
    northFirst: "04:30",
    taftFirst: "05:05",
    peakHeadwaySec: 300,
    offPeakHeadwaySec: 300,
    peakHours: [],
    stationFirstDepartures: {
      "North Avenue": {
        time: "04:30 AM",
        dest: "Taft Avenue",
        platform: "Platform 1",
      },
      "Quezon Avenue": {
        time: "04:35 AM",
        dest: "Taft Avenue",
        platform: "Platform 2",
      },
      "GMA-Kamuning": {
        time: "04:40 AM",
        dest: "Taft Avenue",
        platform: "Platform 1",
      },
      "Araneta Center-Cubao": {
        time: "04:45 AM",
        dest: "Taft Avenue",
        platform: "Platform 2",
      },
      "Santolan-Anapolis": {
        time: "04:50 AM",
        dest: "Taft Avenue",
        platform: "Platform 1",
      },
      Ortigas: {
        time: "04:55 AM",
        dest: "Taft Avenue",
        platform: "Platform 2",
      },
      "Shaw Boulevard": {
        time: "05:00 AM",
        dest: "North Avenue",
        platform: "Platform 1",
      },
      Boni: { time: "05:05 AM", dest: "North Avenue", platform: "Platform 2" },
      Guadalupe: {
        time: "05:10 AM",
        dest: "North Avenue",
        platform: "Platform 1",
      },
      Buendia: {
        time: "05:15 AM",
        dest: "North Avenue",
        platform: "Platform 2",
      },
      Ayala: { time: "05:20 AM", dest: "North Avenue", platform: "Platform 1" },
      Magallanes: {
        time: "05:25 AM",
        dest: "North Avenue",
        platform: "Platform 2",
      },
      "Taft Avenue": {
        time: "05:30 AM",
        dest: "North Avenue",
        platform: "Platform 1",
      },
    },
  },
};

// 2026 MRT-3 Fare Tables
const regularFareMatrix = {
  0: 13,
  1: 13,
  2: 13,
  3: 16,
  4: 16,
  5: 16,
  6: 20,
  7: 20,
  8: 20,
  9: 24,
  10: 24,
  11: 24,
  12: 28,
};
const discountedFareMatrix = {
  0: 6,
  1: 6,
  2: 6,
  3: 8,
  4: 8,
  5: 8,
  6: 10,
  7: 10,
  8: 10,
  9: 12,
  10: 12,
  11: 12,
  12: 14,
};

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function calculateFare(origin, destination, isDiscounted = false) {
  const originIndex = stations.indexOf(origin);
  const destIndex = stations.indexOf(destination);
  if (originIndex === -1 || destIndex === -1) return isDiscounted ? 6 : 13;
  const stationDistance = Math.abs(destIndex - originIndex);
  const matrix = isDiscounted ? discountedFareMatrix : regularFareMatrix;
  return matrix[stationDistance] !== undefined
    ? matrix[stationDistance]
    : isDiscounted
      ? 14
      : 28;
}

let pendingNodeOrigin = "";

function calculateQuickFare() {
  const origin = document.getElementById("quickFrom");
  const destination = document.getElementById("quickTo");
  const fareDisplay = document.getElementById("quickFareDisplay");
  const bookLink = document.getElementById("quickBookPass");
  if (!origin || !destination || !fareDisplay || !bookLink) return;

  const from = origin.value;
  const to = destination.value;
  const selectedFare = document.querySelector(
    'input[name="passengerFareType"]:checked',
  );
  const fareType =
    selectedFare?.value === "discounted" && !selectedFare.disabled ? "discounted" : "regular";
  const validRoute = Boolean(from && to && from !== to);

  if (!validRoute) {
    fareDisplay.textContent =
      from && to ? "Choose a different station" : "Select another station";
    bookLink.href = "#";
    bookLink.classList.add("quick-book-disabled");
    bookLink.setAttribute("aria-disabled", "true");
    bookLink.tabIndex = -1;
  } else {
    const fare = calculateFare(from, to, fareType === "discounted");
    fareDisplay.textContent = `₱ ${fare.toFixed(2)}`;
    const params = new URLSearchParams({ from, to, type: fareType });
    bookLink.href = `booking.html?${params.toString()}`;
    bookLink.classList.remove("quick-book-disabled");
    bookLink.removeAttribute("aria-disabled");
    bookLink.removeAttribute("tabindex");
  }

  document.querySelectorAll(".station-node").forEach((node) => {
    const station = node.dataset.station;
    const isSelected = station === from || station === to;
    node.classList.toggle("selected", isSelected);
    node.setAttribute("aria-pressed", String(isSelected));
  });
}

function selectNodeStation(station) {
  const origin = document.getElementById("quickFrom");
  const destination = document.getElementById("quickTo");
  if (!origin || !destination) return;

  if (!pendingNodeOrigin) {
    pendingNodeOrigin = station;
    origin.value = station;
    destination.value = "";
  } else if (pendingNodeOrigin !== station) {
    origin.value = pendingNodeOrigin;
    destination.value = station;
    pendingNodeOrigin = "";
  }

  calculateQuickFare();
}

function updateLiveClock() {
  const clockEl = document.getElementById("liveClock");
  if (clockEl) {
    const now = new Date();
    clockEl.textContent = `LIVE: ${now.toLocaleTimeString()}`;
  }
}

function getCurrentScheduleStatus() {
  const now = new Date();
  const day = now.getDay();
  const isWeekend = day === 0 || day === 6;
  const schedule = isWeekend
    ? MRT3_SCHEDULE_CONFIG.weekend
    : MRT3_SCHEDULE_CONFIG.weekday;

  const currentMins = now.getHours() * 60 + now.getMinutes();
  const firstMins = timeToMinutes(schedule.northFirst);
  let latestMins = timeToMinutes("23:40");

  const isOperating = currentMins >= firstMins && currentMins <= latestMins;
  const isPastService = currentMins > latestMins || currentMins < firstMins;
  const isPeak =
    schedule.peakHours &&
    schedule.peakHours.some((p) => {
      return (
        currentMins >= timeToMinutes(p.start) &&
        currentMins <= timeToMinutes(p.end)
      );
    });

  return {
    isOperating,
    isPastService,
    isPeak,
    headwaySec: isPeak ? schedule.peakHeadwaySec : schedule.offPeakHeadwaySec,
    firstTrip: schedule.northFirst,
  };
}

// ==========================================
// REAL-TIME TRAIN TRACKING ENGINE
// ==========================================
const MRT3_CONFIG = { travelTimePerSegmentSec: 150, dwellTimeSec: 30 };

function getActiveTrainPositions() {
  const scheduleStatus = getCurrentScheduleStatus();
  if (!scheduleStatus.isOperating) return [];

  const now = new Date();
  const currentSeconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const headwaySec = scheduleStatus.headwaySec;
  const segmentTime =
    MRT3_CONFIG.travelTimePerSegmentSec + MRT3_CONFIG.dwellTimeSec;
  const totalOneWayTimeSec = (stations.length - 1) * segmentTime;
  const numberOfTrains = Math.floor(totalOneWayTimeSec / headwaySec);
  const activeTrains = [];

  for (let i = 0; i < numberOfTrains; i++) {
    const trainOffset = i * headwaySec;
    const elapsedTime = (currentSeconds + trainOffset) % totalOneWayTimeSec;
    const currentSegment = Math.floor(elapsedTime / segmentTime);
    const nextStation =
      stations[currentSegment + 1] || stations[currentSegment];
    const segmentProgressSec = elapsedTime % segmentTime;
    const currentStation = stations[currentSegment];
    const isStopped = segmentProgressSec < MRT3_CONFIG.dwellTimeSec;
    const totalProgressPercent =
      ((currentSegment * segmentTime + segmentProgressSec) /
        totalOneWayTimeSec) *
      100;

    activeTrains.push({
      id: `MRT3-TR-${101 + i}`,
      direction: "Southbound (Taft Ave)",
      currentStation,
      nextStation,
      status: isStopped
        ? `Boarding at ${currentStation}`
        : `En route to ${nextStation}`,
      progressPercent: Math.min(Math.max(totalProgressPercent, 0), 100),
    });
  }
  return activeTrains;
}

function renderLiveTrainMap() {
  if (document.hidden) return;
  const container = document.getElementById("trainMarkersContainer");
  const listContainer = document.getElementById("activeTrainList");
  if (!container || !listContainer) return;

  const trains = getActiveTrainPositions();
  if (trains.length === 0) {
    if (container.dataset.state !== "closed") {
      container.replaceChildren();
      listContainer.replaceChildren();
      const trackMessage = document.createElement("div");
      trackMessage.className = "train-tracker-closed";
      trackMessage.textContent =
        "🔒 ALL TRAIN STATIONS CLOSED — Outside operational hours.";
      container.append(trackMessage);
      const closedCard = document.createElement("div");
      closedCard.className = "train-closed-card";
      closedCard.innerHTML =
        "<strong>System Offline / Stations Closed</strong><span>Terminal operations have concluded for the day. Previewing next-day morning trips starting at 4:30 AM below.</span>";
      listContainer.append(closedCard);
      container.dataset.state = "closed";
      listContainer.dataset.state = "closed";
    }
    return;
  }

  const trainIds = trains.map((train) => train.id);
  const displayedIds = [
    ...container.querySelectorAll(".train-marker-position"),
  ].map((marker) => marker.dataset.trainId);
  const fleetChanged =
    trainIds.length !== displayedIds.length ||
    trainIds.some((id, index) => id !== displayedIds[index]);
  if (container.dataset.state !== "active" || fleetChanged) {
    container.replaceChildren();
    listContainer.replaceChildren();
    const markerFragment = document.createDocumentFragment();
    const cardFragment = document.createDocumentFragment();
    trains.forEach((train) => {
      const marker = document.createElement("div");
      marker.className = "train-marker-position";
      marker.dataset.trainId = train.id;
      const badge = document.createElement("div");
      badge.className = "home-train-marker";
      badge.textContent = `🚆 ${train.id}`;
      marker.append(badge);
      markerFragment.append(marker);

      const card = document.createElement("article");
      card.className = "home-train-card";
      card.dataset.trainId = train.id;
      const heading = document.createElement("div");
      heading.className = "home-train-card-heading";
      const label = document.createElement("strong");
      label.textContent = train.id;
      const active = document.createElement("span");
      active.textContent = "Active";
      const status = document.createElement("div");
      status.className = "home-train-status";
      heading.append(label, active);
      card.append(heading, status);
      cardFragment.append(card);
    });
    container.append(markerFragment);
    listContainer.append(cardFragment);
    container.dataset.state = "active";
    listContainer.dataset.state = "active";
  }

  trains.forEach((train) => {
    const marker = container.querySelector(`[data-train-id="${train.id}"]`);
    const card = listContainer.querySelector(`[data-train-id="${train.id}"]`);
    if (marker) marker.style.left = `${train.progressPercent}%`;
    const status = card?.querySelector(".home-train-status");
    if (status && status.textContent !== train.status)
      status.textContent = train.status;
  });
}

// ==========================================
// MULTI-STATION FULL TIMETABLE GENERATOR
// ==========================================
function generateRealTimeSchedules() {
  const scheduleStatus = getCurrentScheduleStatus();
  const weekdaysConfig = MRT3_SCHEDULE_CONFIG.weekday;
  const masterList = [];
  let trainCounter = 101;

  const startHour = 4;
  const startMinute = 30;
  const endHour = 22;

  let currentTotalMins = startHour * 60 + startMinute;
  const endTotalMins = endHour * 60;
  const headwayMins = Math.round(scheduleStatus.headwaySec / 60);

  while (currentTotalMins <= endTotalMins) {
    const hh = Math.floor(currentTotalMins / 60);
    const mm = currentTotalMins % 60;
    const ampm = hh >= 12 ? "PM" : "AM";
    const displayHh = hh % 12 === 0 ? 12 : hh % 12;
    const timeStr = `${String(displayHh).padStart(2, "0")}:${String(mm).padStart(2, "0")} ${ampm}`;

    const northStationInfo = weekdaysConfig.southbound["North Avenue"] || {
      gateClose: "22:25",
    };

    // Southbound Departure from North Avenue
    masterList.push({
      origin: "North Avenue",
      dest: "Taft Avenue",
      id: `MRT-3 ${trainCounter++}`,
      time: timeStr,
      platform: "Platform 1",
      status: `Gate Closes: ${northStationInfo.gateClose}`,
      statusBg: "rgba(59, 130, 246, 0.15)",
      statusColor: "#60a5fa",
      isNextDay: scheduleStatus.isPastService,
    });

    // Intermediate Stations (Quezon Ave down to Magallanes)
    stations.forEach((st, idx) => {
      if (idx > 0 && idx < 12) {
        const arrivalMins = currentTotalMins + idx * 4;
        const arrHh = Math.floor(arrivalMins / 60);
        const arrMm = arrivalMins % 60;
        const arrAmpm = arrHh >= 12 ? "PM" : "AM";
        const arrDisp = arrHh % 12 === 0 ? 12 : arrHh % 12;
        const arrTimeStr = `${String(arrDisp).padStart(2, "0")}:${String(arrMm).padStart(2, "0")} ${arrAmpm}`;
        const stationInfo = weekdaysConfig.southbound[st] || {
          gateClose: "22:30",
        };

        masterList.push({
          origin: st,
          dest: "Taft Avenue",
          id: `MRT-3 ${trainCounter++}`,
          time: arrTimeStr,
          platform: `Platform ${(idx % 2) + 1}`,
          status: `Gate Closes: ${stationInfo.gateClose}`,
          statusBg: "rgba(59, 130, 246, 0.15)",
          statusColor: "#60a5fa",
          isNextDay: scheduleStatus.isPastService,
        });
      }
    });

    // Northbound Departure from Taft Avenue
    const nbMins = currentTotalMins + 35;
    const nbh = Math.floor(nbMins / 60);
    const nbm = nbMins % 60;
    if (nbh <= 23) {
      const nbAmpm = nbh >= 12 ? "PM" : "AM";
      const nbDisp = nbh % 12 === 0 ? 12 : nbh % 12;
      const nbTimeStr = `${String(nbDisp).padStart(2, "0")}:${String(nbm).padStart(2, "0")} ${nbAmpm}`;
      const taftStationInfo = weekdaysConfig.northbound["Taft Avenue"] || {
        gateClose: "23:04",
      };

      masterList.push({
        origin: "Taft Avenue",
        dest: "North Avenue",
        id: `MRT-3 ${trainCounter++}`,
        time: nbTimeStr,
        platform: "Platform 2",
        status: `Gate Closes: ${taftStationInfo.gateClose}`,
        statusBg: "rgba(59, 130, 246, 0.15)",
        statusColor: "#60a5fa",
        isNextDay: scheduleStatus.isPastService,
      });
    }

    currentTotalMins += Math.max(headwayMins, 5);
  }

  return {
    schedules: masterList,
    isNextDayPreview: scheduleStatus.isPastService,
  };
}

function populateTimetable(filterStation = "ALL") {
  const tableBody = document.getElementById("scheduleTableBody");
  if (!tableBody) return;

  const { schedules, isNextDayPreview } = generateRealTimeSchedules();

  const filtered =
    filterStation === "ALL"
      ? schedules.slice(0, 30)
      : schedules.filter(
          (s) => s.origin === filterStation || s.dest === filterStation,
        );

  const selectedFareType = document.querySelector(
    'input[name="passengerFareType"]:checked',
  );
  const isDiscounted = selectedFareType
    ? selectedFareType.value === "discounted"
    : false;

  let previewBanner = "";
  if (isNextDayPreview) {
    previewBanner = `
            <tr>
                <td colspan="8" style="padding: 12px 16px; background: rgba(245, 158, 11, 0.1); color: var(--accent-gold); font-size: 0.8rem; font-weight: 700; text-align: center; border-bottom: 1px solid var(--border);">
                    ⚠️ Stations are currently closed. Displaying Next-Day Morning Preview Schedule starting at 4:30 AM.
                </td>
            </tr>`;
  }

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--text-muted);">No active departures found for ${filterStation}.</td></tr>`;
    return;
  }

  tableBody.innerHTML =
    previewBanner +
    filtered
      .map((item) => {
        const fare = calculateFare(item.origin, item.dest, isDiscounted);
        return `
            <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding: 14px 16px; font-weight: 700; color: var(--text-primary);">${item.origin}</td>
                <td style="padding: 14px 16px; color: var(--text-muted);">${item.dest}</td>
                <td style="padding: 14px 16px; font-weight: 600; color: var(--accent-gold);">${item.id}</td>
                <td style="padding: 14px 16px; font-weight: 700; color: var(--text-primary);">${item.time}</td>
                <td style="padding: 14px 16px; color: var(--text-muted);">${item.platform}</td>
                <td style="padding: 14px 16px;">
                    <span style="font-size: 0.75rem; background: ${item.statusBg}; color: ${item.statusColor}; padding: 4px 10px; border-radius: 99px; font-weight: 700;">
                        ${item.status}
                    </span>
                </td>
                <td style="padding: 14px 16px; font-weight: 800; color: var(--text-primary);">₱ ${fare}.00</td>
                <td style="padding: 14px 16px; text-align: right;">
                    <a href="booking.html?from=${encodeURIComponent(item.origin)}&to=${encodeURIComponent(item.dest)}&type=${isDiscounted ? "discounted" : "regular"}" 
                       style="font-size: 0.8rem; color: var(--accent-gold); font-weight: 700; text-decoration: none;">
                       Book Pass &rarr;
                    </a>
                </td>
            </tr>
        `;
      })
      .join("");
}

// ==========================================
// INITIALIZATION & EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  renderLiveTrainMap();
  setInterval(renderLiveTrainMap, 1000);

  const stationFilter = document.getElementById("scheduleStationFilter");
  if (stationFilter) {
    stationFilter.addEventListener("change", (e) => {
      populateTimetable(e.target.value);
    });
  }

  populateTimetable("ALL");

  const quickFrom = document.getElementById("quickFrom");
  const quickTo = document.getElementById("quickTo");
  quickFrom?.addEventListener("change", () => {
    pendingNodeOrigin = "";
    calculateQuickFare();
  });
  quickTo?.addEventListener("change", () => {
    pendingNodeOrigin = "";
    calculateQuickFare();
  });
  document
    .querySelectorAll('input[name="passengerFareType"]')
    .forEach((input) => {
      input.addEventListener("change", calculateQuickFare);
    });
  document.querySelectorAll(".station-node").forEach((node) => {
    node.setAttribute("role", "button");
    node.tabIndex = 0;
    node.setAttribute("aria-label", `Select ${node.dataset.station} station`);
    node.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectNodeStation(node.dataset.station);
    });
  });

  [
    ["regularFareRow", "fareTypeRegular"],
    ["discountedFareRow", "fareTypeDiscounted"],
  ].forEach(([rowId, inputId]) => {
    const row = document.getElementById(rowId);
    const input = document.getElementById(inputId);
    row?.addEventListener("click", (event) => {
      if (event.target === input || input.disabled) return;
      input.checked = true;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  calculateQuickFare();
  window.mrtSyncDiscountControls().then(calculateQuickFare);
});

  window.selectNodeStation = selectNodeStation;
})();


