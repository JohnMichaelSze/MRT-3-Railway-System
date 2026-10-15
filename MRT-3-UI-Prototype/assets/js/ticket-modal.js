/* Shared digital pass modal. Page scripts send ticket events; this module owns modal state and QR rendering. */
(() => {
  const account = Boolean(document.querySelector('#ticketDetailsDialog'));
  const booking = Boolean(document.querySelector('#bookingTicketDialog'));
  const id = (name) => document.getElementById(`${account ? 'ticketModal' : 'bookingTicket'}${name}`);
  const root = document.getElementById(account ? 'ticketDetailsDialog' : 'bookingTicketDialog');
  if (!root || (!account && !booking)) return;

  const nodes = {
    qr: id('Qr'), reference: id('Reference'), route: id('Route'), type: id('Type'),
    quantity: id('Quantity'), date: id(account ? 'Validity' : 'Date'), amount: id(account ? 'Amount' : 'Price'),
    status: id('Status'), payment: id('Payment'), timestamp: id('Timestamp'), payload: id(account ? 'QrText' : 'Payload'), instructions: id('Instructions'),
    routeLabel: document.getElementById(account ? 'ticketModalRouteLabel' : 'bookingTicketRouteLabel'),
    dateLabel: document.getElementById(account ? 'ticketModalDateLabel' : 'bookingTicketDateLabel'),
  };
  const closeButton = document.getElementById(account ? 'ticketModalClose' : 'bookingTicketDialogClose');
  const downloadButton = document.getElementById(account ? 'ticketModalDownload' : 'bookingTicketDownload');
  const cancelButton = document.getElementById(account ? 'ticketModalCancel' : 'bookingTicketCancel');
  const footerClose = document.getElementById(account ? 'ticketModalFooterClose' : 'bookingTicketFooterClose');
  let selectedTicket = null;
  let returnFocus = null;
  let isOpen = false;

  const money = (amount) => `₱${Number(amount || 0).toFixed(2)}`;
  const displayStatus = (ticket) => ticket.status === 'CANCELLED' ? 'CANCELLED'
    : ticket.journeyType === 'BEEP_PASS' ? ticket.paymentStatus === 'UNPAID' ? 'RESERVED / PAY AT COUNTER' : 'PAID / READY FOR PICKUP'
      : ticket.paymentStatus === 'UNPAID' ? 'UNPAID / BOOKED'
        : ticket.paymentStatus === 'PAID' ? 'RESERVED / PAID' : (ticket.status || 'ACTIVE');
  const instructionsFor = (ticket) => ticket.status === 'CANCELLED' ? 'This booking has been cancelled.'
    : ticket.journeyType === 'BEEP_PASS' ? ticket.paymentStatus === 'UNPAID'
      ? `Payment required upon pickup. Present this QR code at ${ticket.pickupStation || 'your selected station'} counter on ${ticket.pickupDate || ticket.travelDate || 'your pickup date'} to pay cash and claim your Beep Pass.`
      : `Pre-paid via ${ticket.paymentMethod || 'online payment'}. Present this QR code at ${ticket.pickupStation || 'your selected station'} counter on ${ticket.pickupDate || ticket.travelDate || 'your pickup date'} to claim your Beep Pass.`
      : ticket.paymentStatus === 'UNPAID' ? 'Present this QR code at the ticket counter to make payment and claim your physical ticket.'
        : `Paid via ${ticket.paymentMethod || 'online payment'}. Present this QR code directly at the entry turnstile or counter.`;
  const payloadFor = (ticket) => ({
    reference: ticket.reference,
    origin: ticket.origin || 'MRT-3 network',
    destination: ticket.destination || 'Stored-value pass',
    validityDate: ticket.pickupDate || ticket.travelDate || ticket.validDate || '',
    totalFare: Number(ticket.totalAmount ?? ticket.price ?? 0),
    fareCategory: ticket.passengerType || (ticket.ticketType === 'STORED_VALUE' ? 'Stored value' : 'Regular'),
    status: displayStatus(ticket),
    bookingStatus: ticket.status || 'ACTIVE',
    paymentStatus: ticket.paymentStatus || 'PAID',
    paymentMethod: ticket.paymentMethod || 'Demo wallet',
    pickupStation: ticket.pickupStation || '',
    pickupDate: ticket.pickupDate || '',
    cardValue: Number(ticket.cardValue || ticket.storedValue || 0),
  });
  const text = (node, value) => { if (node) node.textContent = value || '—'; };
  const renderQr = (container, ticket, size = 480) => {
    if (!container) return;
    container.replaceChildren();
    container.classList.remove('qr-unavailable');
    container.setAttribute('aria-label', `QR code for ticket ${ticket.reference || ''}`);
    if (!window.QRCode) {
      container.textContent = `QR code unavailable. Reference: ${ticket.reference || '—'}`;
      container.classList.add('qr-unavailable');
      return;
    }
    try {
      new window.QRCode(container, { text: JSON.stringify(payloadFor(ticket)), width: size, height: size, colorDark: '#080b12', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M });
    } catch {
      container.textContent = `Could not render QR. Reference: ${ticket.reference || '—'}`;
      container.classList.add('qr-unavailable');
    }
  };
  const show = (ticket, trigger) => {
    if (!ticket) return;
    selectedTicket = ticket;
    returnFocus = trigger || document.activeElement;
    isOpen = true;
    const payload = payloadFor(ticket);
    text(nodes.reference, ticket.reference);
    const isBeepPass = ticket.journeyType === 'BEEP_PASS';
    text(nodes.route, isBeepPass ? ticket.pickupStation : ticket.ticketType === 'STORED_VALUE' ? 'MRT-3 stored-value pass' : `${payload.origin} → ${payload.destination}`);
    if (nodes.routeLabel) nodes.routeLabel.textContent = isBeepPass ? 'Pickup station' : 'Route';
    text(nodes.type, isBeepPass ? `Beep Stored-Value Pass · ${money(ticket.cardValue || ticket.storedValue)}` : payload.fareCategory);
    text(nodes.quantity, isBeepPass ? '1 Beep Pass' : `${ticket.quantity || 1} ${Number(ticket.quantity || 1) === 1 ? 'ticket' : 'tickets'}`);
    if (nodes.dateLabel) nodes.dateLabel.textContent = isBeepPass ? 'Pickup date' : 'Valid date';
    text(nodes.date, payload.validityDate ? new Date(`${payload.validityDate}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : '—');
    text(nodes.amount, money(payload.totalFare));
    text(nodes.status, payload.status);
    if (nodes.status) nodes.status.className = `ticket-status-value ${ticket.status === 'CANCELLED' ? 'ticket-status-cancelled' : ticket.paymentStatus === 'UNPAID' ? 'ticket-status-booked' : 'ticket-status-reserved'}`;
    text(nodes.payment, ticket.paymentMethod || 'Demo wallet');
    text(nodes.timestamp, ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '—');
    text(nodes.payload, JSON.stringify(payload));
    text(nodes.instructions, instructionsFor(ticket));
    if (nodes.instructions) nodes.instructions.className = `pass-instructions ${ticket.status === 'CANCELLED' ? 'pass-instructions-cancelled' : ticket.paymentStatus === 'UNPAID' ? 'pass-instructions-booked' : 'pass-instructions-reserved'}`;
    if (cancelButton) cancelButton.hidden = ticket.status !== 'ACTIVE';
    renderQr(nodes.qr, ticket);
    root.hidden = false;
    closeButton?.focus();
  };
  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    root.hidden = true;
    if (returnFocus?.isConnected) returnFocus.focus();
    returnFocus = null;
  };

  const roundedRect = (ctx, x, y, width, height, radius, fill, stroke) => {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, width, height, radius);
    else {
      const right = x + width; const bottom = y + height;
      ctx.moveTo(x + radius, y); ctx.lineTo(right - radius, y); ctx.quadraticCurveTo(right, y, right, y + radius);
      ctx.lineTo(right, bottom - radius); ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
      ctx.lineTo(x + radius, bottom); ctx.quadraticCurveTo(x, bottom, x, bottom - radius);
      ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y);
    }
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  };
  const exportPng = async (ticket) => {
    if (!window.QRCode) throw new Error('QR generation is unavailable. Check your internet connection and try again.');
    const payload = payloadFor(ticket);
    const qrHost = document.createElement('div');
    new window.QRCode(qrHost, { text: JSON.stringify(payload), width: 480, height: 480, colorDark: '#080b12', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.M });
    let qrSource = qrHost.querySelector('canvas');
    if (!qrSource) {
      qrSource = qrHost.querySelector('img');
      if (qrSource?.decode) await qrSource.decode();
      if (!qrSource) throw new Error('Could not render this ticket QR code.');
    }

    const scale = Math.max(2, Math.min(3, window.devicePixelRatio || 1));
    const canvas = document.createElement('canvas');
    canvas.width = 640 * scale; canvas.height = 1100 * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('This browser cannot create a PNG image.');
    ctx.scale(scale, scale);
    ctx.fillStyle = '#0b0e17'; ctx.fillRect(0, 0, 640, 1100);
    roundedRect(ctx, 22, 22, 596, 1056, 26, '#121824', 'rgba(255,255,255,.16)');
    ctx.fillStyle = '#ff9e00'; ctx.fillRect(23, 23, 594, 5);
    roundedRect(ctx, 48, 52, 38, 38, 11, '#ff9e00');
    ctx.fillStyle = '#111827'; ctx.font = 'bold 20px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.fillText('≈', 67, 78);
    ctx.textAlign = 'left'; ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 17px Arial, sans-serif'; ctx.fillText('MRT-3 EXPRESS', 98, 76);
    ctx.fillStyle = '#ffb32c'; ctx.font = 'bold 12px Arial, sans-serif'; ctx.letterSpacing = '2px'; ctx.fillText('DIGITAL PASS', 48, 124);
    ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 28px Arial, sans-serif'; ctx.letterSpacing = '0px'; ctx.fillText('MRT-3 Digital Pass Summary', 48, 161);
    ctx.fillStyle = '#ffc15c'; ctx.font = 'bold 15px monospace'; ctx.fillText(ticket.reference || 'MRT3-TICKET', 48, 190);
    roundedRect(ctx, 196, 210, 248, 248, 18, '#ffffff');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qrSource, 210, 224, 220, 220);
    ctx.imageSmoothingEnabled = true;
    roundedRect(ctx, 48, 480, 544, 370, 18, '#0e1420', 'rgba(255,255,255,.1)');
    const isBeepPass = ticket.journeyType === 'BEEP_PASS';
    const route = isBeepPass ? ticket.pickupStation || 'Selected MRT-3 station' : ticket.ticketType === 'STORED_VALUE' ? 'MRT-3 stored-value pass' : `${payload.origin} → ${payload.destination}`;
    const rows = [
      [isBeepPass ? 'PICKUP STATION' : 'ROUTE', route],
      ['TICKET TYPE / COUNT', isBeepPass ? `Beep Stored-Value Pass · ${money(ticket.cardValue || ticket.storedValue)} initial value` : `${ticket.ticketType === 'STORED_VALUE' ? 'Stored value' : 'Single journey'} · ${ticket.quantity || 1} ${(ticket.quantity || 1) === 1 ? 'ticket' : 'tickets'}`],
      ['FARE CATEGORY', payload.fareCategory],
      [isBeepPass ? 'PICKUP DATE' : 'VALID DATE', payload.validityDate ? new Date(`${payload.validityDate}T00:00:00`).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'],
      ['TOTAL FARE', money(payload.totalFare)],
      ['PAYMENT', ticket.paymentMethod || '—'],
    ];
    rows.forEach(([label, value], index) => {
      const y = 516 + index * 55;
      ctx.fillStyle = '#94a3b8'; ctx.font = 'bold 10px Arial, sans-serif'; ctx.letterSpacing = '1.2px'; ctx.fillText(label, 72, y);
      ctx.fillStyle = '#f8fafc'; ctx.font = '600 16px Arial, sans-serif'; ctx.letterSpacing = '0px'; ctx.fillText(String(value).slice(0, 58), 72, y + 23);
      if (index < rows.length - 1) { ctx.fillStyle = 'rgba(255,255,255,.09)'; ctx.fillRect(72, y + 36, 496, 1); }
    });
    const isUnpaid = ticket.paymentStatus === 'UNPAID' && ticket.status !== 'CANCELLED';
    const statusColor = ticket.status === 'CANCELLED' ? '#cbd5e1' : isUnpaid ? '#fbbf24' : '#34d399';
    const statusFill = ticket.status === 'CANCELLED' ? 'rgba(148,163,184,.12)' : isUnpaid ? 'rgba(245,158,11,.12)' : 'rgba(52,211,153,.12)';
    roundedRect(ctx, 48, 864, 544, 38, 19, statusFill, 'rgba(255,255,255,.1)');
    ctx.fillStyle = statusColor; ctx.font = 'bold 12px Arial, sans-serif'; ctx.letterSpacing = '1.2px'; ctx.textAlign = 'center'; ctx.fillText(`STATUS · ${payload.status}`, 320, 888);
    roundedRect(ctx, 48, 916, 544, 126, 14, '#0e1420', 'rgba(255,255,255,.1)');
    ctx.textAlign = 'left'; ctx.fillStyle = '#f8fafc'; ctx.font = 'bold 11px Arial, sans-serif'; ctx.letterSpacing = '1px'; ctx.fillText('REDEMPTION INSTRUCTIONS', 68, 941);
    ctx.fillStyle = '#cbd5e1'; ctx.font = '12px Arial, sans-serif'; ctx.letterSpacing = '0px';
    const instruction = instructionsFor(ticket);
    const maxChars = 69;
    const instructionLines = [];
    for (let remaining = instruction; remaining.length > maxChars;) {
      let breakAt = remaining.lastIndexOf(' ', maxChars);
      if (breakAt < 1) breakAt = maxChars;
      instructionLines.push(remaining.slice(0, breakAt)); remaining = remaining.slice(breakAt).trim();
    }
    instructionLines.push(instruction);
    instructionLines.slice(0, 4).forEach((line, index) => ctx.fillText(line, 68, 965 + index * 16));
    ctx.textAlign = 'center'; ctx.fillStyle = '#94a3b8'; ctx.font = '11px Arial, sans-serif'; ctx.fillText('Demo pass only · Not valid for travel or payment', 320, 1065);
    const filename = `${String(ticket.reference || 'MRT3-ticket').replace(/[^A-Za-z0-9_-]/g, '')}-pass.png`;
    const blob = await new Promise((resolve, reject) => canvas.toBlob((result) => result ? resolve(result) : reject(new Error('PNG export failed.')), 'image/png'));
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = filename; link.type = 'image/png';
    document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  };

  window.addEventListener('mrt:ticket-open', (event) => show(event.detail?.ticket, event.detail?.trigger));
  window.addEventListener('mrt:ticket-qr-render', (event) => renderQr(event.detail?.container, event.detail?.ticket));
  closeButton?.addEventListener('click', close);
  footerClose?.addEventListener('click', close);
  downloadButton?.addEventListener('click', () => {
    if (selectedTicket) exportPng(selectedTicket).catch((error) => window.dispatchEvent(new CustomEvent('mrt:ticket-export-error', { detail: { message: error.message } })));
  });
  window.addEventListener('mrt:ticket-export-png', (event) => {
    if (event.detail?.ticket) exportPng(event.detail.ticket).catch((error) => window.dispatchEvent(new CustomEvent('mrt:ticket-export-error', { detail: { message: error.message } })));
  });
  cancelButton?.addEventListener('click', () => {
    if (!selectedTicket) return;
    const ticket = selectedTicket;
    const trigger = returnFocus || cancelButton;
    close();
    window.dispatchEvent(new CustomEvent('mrt:ticket-cancel', { detail: { ticket, trigger } }));
  });
  root.addEventListener('click', (event) => { if (event.target === root) close(); });
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { close(); return; }
    if (event.key !== 'Tab') return;
    const controls = [...root.querySelectorAll('button:not(:disabled):not([hidden]),a[href],input:not(:disabled)')].filter((item) => !item.hidden);
    if (!controls.length) return;
    if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
  });
})();
