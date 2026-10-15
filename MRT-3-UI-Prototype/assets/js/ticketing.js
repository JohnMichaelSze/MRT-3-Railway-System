(() => {
  const form = document.querySelector('#ticketPurchaseForm');
  if (!form) return;
  const $ = (id) => document.getElementById(id);
  let stations = [];
  let mode = 'book';
  let beepPaymentChoice = 'COUNTER';
  let account = null;
  const fares = new Map();
  const money = (value) => `₱${Number(value || 0).toFixed(2)}`;
  const nameOf = (id) => stations.find((station) => Number(station.id) === Number(id))?.name || 'Station';
  let selectedTicket = null;
  let latestTicket = null;
  let returnFocus = null;
  let toastTimer;

  const today = new Date();
  const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  $('travelDate').value = todayText;
  $('travelDate').min = todayText;
  $('pickupDate').value = todayText;
  $('pickupDate').min = todayText;

  function fareFor(from, to, type) { return fares.get(`${Number(from)}:${Number(to)}:${type}`) || 0; }
  function notify(text) { const toast = $('bookingToast'); toast.textContent = text; toast.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { toast.hidden = true; }, 3600); }
  function ticketTitle(ticket) { return ticket.ticketType === 'STORED_VALUE' ? 'MRT-3 stored-value pass' : `${ticket.origin} → ${ticket.destination}`; }
  function ticketLabel(ticket) {
    if (ticket.status === 'CANCELLED') return 'CANCELLED';
    if (ticket.journeyType === 'BEEP_PASS') return ticket.paymentStatus === 'UNPAID' ? 'RESERVED / PAY AT COUNTER' : 'PAID / READY FOR PICKUP';
    return ticket.paymentStatus === 'UNPAID' ? 'UNPAID / BOOKED' : ticket.paymentStatus === 'PAID' ? 'RESERVED / PAID' : ticket.status;
  }
  function prepareCancelDialog(ticket) {
    if (ticket.journeyType === 'BEEP_PASS' && ticket.paymentStatus === 'UNPAID') {
      $('bookingCancelCopy').textContent = 'This Beep Pass order will be cancelled. Payment is due at pickup, so no refund is due.';
      $('bookingCancelConfirm').textContent = 'Cancel Beep Pass order';
    } else if (ticket.journeyType === 'BEEP_PASS' && ticket.paymentMethod === 'Demo wallet') {
      $('bookingCancelCopy').textContent = `Cancel this Beep Pass order? ${money(ticket.totalAmount)} will be returned to your demo wallet.`;
      $('bookingCancelConfirm').textContent = 'Cancel & refund wallet';
    } else if (ticket.paymentStatus === 'UNPAID') {
      $('bookingCancelCopy').textContent = 'This unpaid counter voucher will be cancelled. No payment was taken, so no refund is due.';
      $('bookingCancelConfirm').textContent = 'Cancel voucher';
    } else if (ticket.paymentMethod === 'Demo wallet') {
      $('bookingCancelCopy').textContent = `Cancel this reservation? ${money(ticket.totalAmount)} will be returned to your demo wallet.`;
      $('bookingCancelConfirm').textContent = 'Cancel & refund wallet';
    } else {
      $('bookingCancelCopy').textContent = 'Cancel this reservation? GCash is simulated in this UI demo; no real charge or refund will be processed.';
      $('bookingCancelConfirm').textContent = 'Cancel reservation';
    }
  }
  function closeDialog(dialog) { dialog.hidden = true; if (returnFocus?.isConnected) returnFocus.focus(); returnFocus = null; }
  function downloadPng(ticket) { window.dispatchEvent(new CustomEvent('mrt:ticket-export-png', { detail: { ticket } })); }
  function openTicket(ticket, trigger) {
    selectedTicket = ticket;
    window.dispatchEvent(new CustomEvent('mrt:ticket-open', { detail: { ticket, trigger: trigger || document.activeElement } }));
  }
  async function renderBookingTickets() {
    const list = $('bookingTickets'); const message = $('bookingTicketsMessage');
    list.setAttribute('aria-busy', 'true');
    try {
      const auth = await window.mrtApi('/auth/me'); account = auth.user;
      $('walletBalance').textContent = money(account.wallet_balance);
      const { tickets } = await window.mrtApi('/tickets/mine');
      list.replaceChildren(); message.textContent = tickets.length ? `${tickets.length} ticket${tickets.length === 1 ? '' : 's'} in this demo account` : '';
      if (!tickets.length) { const empty = document.createElement('p'); empty.className = 'history-empty'; empty.textContent = 'No tickets yet. Your purchases will appear here.'; list.append(empty); return; }
      tickets.forEach((ticket) => {
        const card = document.createElement('article'); card.className = 'reservation-card'; card.setAttribute('role', 'listitem');
        const heading = document.createElement('div'); heading.className = 'reservation-card-heading';
        const title = document.createElement('h3'); title.textContent = ticket.journeyType === 'BEEP_PASS' ? `Beep Pass pickup · ${ticket.pickupStation}` : ticketTitle(ticket);
        const status = document.createElement('span'); status.className = `reservation-status ${ticket.status === 'CANCELLED' ? 'status-cancelled' : ticket.paymentStatus === 'UNPAID' ? 'status-booked' : 'status-active'}`; status.textContent = ticketLabel(ticket); heading.append(title, status);
        const meta = document.createElement('p'); meta.textContent = ticket.journeyType === 'BEEP_PASS'
          ? `Beep Stored-Value Pass · ₱${Number(ticket.cardValue || 0).toFixed(2)} initial value · Pickup ${ticket.pickupDate || 'date unavailable'}`
          : `${ticket.passengerType || 'Regular'} · ${ticket.quantity || 1} pass${Number(ticket.quantity || 1) === 1 ? '' : 'es'} · Valid ${ticket.travelDate || 'date unavailable'}`;
        const ref = document.createElement('span'); ref.className = 'reservation-reference'; ref.textContent = `Reference ${ticket.reference}`;
        const price = document.createElement('strong'); price.className = 'reservation-total'; price.textContent = ticket.journeyType === 'BEEP_PASS' ? `Card value ${money(ticket.cardValue)}` : money(ticket.totalAmount);
        const actions = document.createElement('div'); actions.className = 'ticket-card-actions';
        const view = document.createElement('button'); view.type = 'button'; view.className = 'ticket-action ticket-action-primary'; view.textContent = 'View ticket'; view.dataset.action = 'view'; view.dataset.reference = ticket.reference; actions.append(view);
        const receipt = document.createElement('button'); receipt.type = 'button'; receipt.className = 'ticket-action'; receipt.textContent = 'Download PNG'; receipt.dataset.action = 'download'; receipt.dataset.reference = ticket.reference; actions.append(receipt);
        if (ticket.status === 'ACTIVE') { const cancel = document.createElement('button'); cancel.type = 'button'; cancel.className = 'ticket-action'; cancel.textContent = 'Cancel booking'; cancel.dataset.action = 'cancel'; cancel.dataset.reference = ticket.reference; actions.append(cancel); }
        card.append(heading, meta, ref, price, actions); list.append(card);
      });
    } catch (error) {
      account = null; $('walletBalance').textContent = 'Sign in required'; list.replaceChildren();
      const empty = document.createElement('p'); empty.className = 'history-empty'; empty.textContent = 'Sign in to view and manage your digital tickets.'; list.append(empty); message.textContent = '';
    } finally { list.setAttribute('aria-busy', 'false'); }
  }
  $('bookingTickets').addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]'); if (!button) return;
    try {
      const { tickets } = await window.mrtApi('/tickets/mine');
      const ticket = tickets.find((item) => item.reference === button.dataset.reference); if (!ticket) return;
      if (button.dataset.action === 'view') openTicket(ticket, button);
      if (button.dataset.action === 'download') downloadPng(ticket);
      if (button.dataset.action === 'cancel') {
        selectedTicket = ticket; returnFocus = button; prepareCancelDialog(ticket);
        $('bookingCancelDialog').hidden = false; $('bookingCancelConfirm').focus();
      }
    } catch (error) { notify(error.message); }
  });
  window.addEventListener('mrt:ticket-export-error', (event) => notify(event.detail?.message || 'Could not export the pass image. Please try again.'));
  window.addEventListener('mrt:ticket-cancel', (event) => {
    const ticket = event.detail?.ticket; if (!ticket) return;
    selectedTicket = ticket; returnFocus = event.detail.trigger || document.activeElement;
    prepareCancelDialog(ticket);
    $('bookingCancelDialog').hidden = false; $('bookingCancelConfirm').focus();
  });
  $('viewPurchasedTicket').addEventListener('click', (event) => { if (latestTicket) openTicket(latestTicket, event.currentTarget); });
  $('downloadPurchasedTicket').addEventListener('click', () => { if (latestTicket) downloadPng(latestTicket); });
  $('bookingCancelClose').addEventListener('click', () => closeDialog($('bookingCancelDialog')));
  $('bookingCancelKeep').addEventListener('click', () => closeDialog($('bookingCancelDialog')));
  $('bookingCancelConfirm').addEventListener('click', async (event) => {
    if (!selectedTicket) return; const button = event.currentTarget; button.disabled = true;
    try {
      const { walletBalance, refundedAmount } = await window.mrtApi('/tickets/cancel', { method: 'POST', body: JSON.stringify({ reference: selectedTicket.reference }) });
      closeDialog($('bookingCancelDialog')); $('walletBalance').textContent = money(walletBalance);
      await renderBookingTickets(); notify(refundedAmount ? `${selectedTicket.reference} cancelled. ${money(refundedAmount)} returned to your demo wallet.` : `${selectedTicket.reference} cancelled.`);
    } catch (error) { notify(error.message); } finally { button.disabled = false; }
  });
  [['bookingCancelDialog']].forEach(([id]) => {
    const dialog = $(id);
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(dialog); });
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') { closeDialog(dialog); return; }
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button:not(:disabled),a[href]')];
      if (!controls.length) return;
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); controls[0].focus(); }
    });
  });
  $('bookingRefreshTickets').addEventListener('click', async (event) => {
    const button = event.currentTarget; button.classList.add('is-refreshing'); button.disabled = true;
    try { await renderBookingTickets(); } finally { button.classList.remove('is-refreshing'); button.disabled = false; }
  });
  window.addEventListener('storage', (event) => { if (event.key === 'mrtUiPrototypeState') renderBookingTickets(); });
  document.addEventListener('mrt:auth-signed-out', () => { account = null; renderBookingTickets(); });
  function refreshSummary() {
    if (!stations.length) return;
    const selectedType = document.querySelector('input[name="fareType"]:checked')?.value || 'Regular';
    const regular = fareFor($('origin').value, $('destination').value, 'Regular');
    const discount = fareFor($('origin').value, $('destination').value, 'Concessionary');
    const quantity = Math.max(1, Math.min(10, Number($('quantity').value) || 1));
    const unit = mode === 'beep' ? Number($('cardValue').value) : selectedType === 'Concessionary' ? discount : regular;
    const total = mode === 'beep' ? unit : unit * quantity;
    $('regularFare').textContent = money(regular);
    $('discountedFare').textContent = money(discount);
    $('summaryTitle').textContent = mode === 'beep' ? 'Beep Pass pickup' : mode === 'book' ? 'Booking voucher' : 'Prepaid reservation';
    $('summaryRoute').textContent = mode === 'beep' ? `Pick up at ${nameOf($('pickupStation').value)}` : `${nameOf($('origin').value)} → ${nameOf($('destination').value)}`;
    $('summaryFareType').textContent = mode === 'beep' ? 'Beep Stored-Value Pass' : selectedType;
    $('summaryUnitLabel').textContent = mode === 'beep' ? 'Initial card value' : 'Single fare';
    $('summaryQuantityLabel').textContent = mode === 'beep' ? 'Pass count' : 'Quantity';
    $('summaryUnitFare').textContent = money(unit);
    $('summaryQuantity').textContent = mode === 'beep' ? '1 Beep Pass' : String(quantity);
    $('summaryTotal').textContent = money(total);
    $('summaryPayment').textContent = mode === 'book' || (mode === 'beep' && beepPaymentChoice === 'COUNTER')
      ? mode === 'beep' ? 'Pay at pickup counter' : 'Pay at station counter'
      : ($('paymentMethod').value === 'GCASH' ? 'GCash (demo)' : 'Demo Wallet Balance');
  }

  function syncTicketMode() {
    $('journeyFields').hidden = mode === 'beep';
    $('beepPassFields').hidden = mode !== 'beep';
    $('counterPaymentNote').hidden = mode !== 'book';
    $('beepCounterNote').hidden = mode !== 'beep' || beepPaymentChoice !== 'COUNTER';
    $('onlinePaymentFields').hidden = !(mode === 'reserve' || (mode === 'beep' && beepPaymentChoice === 'ONLINE'));
    $('purchaseButton').textContent = mode === 'book' ? 'Generate Booking Voucher' : mode === 'reserve' ? 'Pay & Reserve Pass' : 'Confirm Beep Pass Order';
  }
  document.querySelectorAll('.ticket-mode').forEach((button) => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    document.querySelectorAll('.ticket-mode').forEach((item) => {
      const selected = item === button;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    syncTicketMode();
    $('purchaseMessage').textContent = '';
    refreshSummary();
  }));
  document.querySelectorAll('input[name="beepPaymentChoice"]').forEach((input) => input.addEventListener('change', () => {
    beepPaymentChoice = input.value;
    syncTicketMode();
    refreshSummary();
  }));
  $('paymentMethod').addEventListener('change', () => {
    $('paymentMethodNote').textContent = $('paymentMethod').value === 'DEMO_WALLET'
      ? 'Funds will be deducted from your demo wallet balance.'
      : 'GCash is a simulated demo selection; no real payment will be processed.';
    refreshSummary();
  });
  $('swapStations').addEventListener('click', () => {
    const currentOrigin = $('origin').value;
    $('origin').value = $('destination').value;
    $('destination').value = currentOrigin;
    refreshSummary();
  });
  form.addEventListener('input', refreshSummary);
  form.addEventListener('change', refreshSummary);

  Promise.all([window.mrtApi('/stations'), window.mrtApi('/fares'), window.mrtApi('/auth/me').catch(() => null)]).then(([stationResult, fareResult, authResult]) => {
    stations = stationResult.stations;
    const originSelect = $('origin');
    const destinationSelect = $('destination');
    const pickupSelect = $('pickupStation');
    originSelect.replaceChildren();
    destinationSelect.replaceChildren();
    pickupSelect.replaceChildren();
    stations.forEach((station, index) => {
      [originSelect, destinationSelect].forEach((select) => {
        const option = document.createElement('option');
        option.value = station.id;
        option.textContent = station.name;
        if (select === destinationSelect && index === stations.length - 1) option.selected = true;
        select.append(option);
      });
      const pickupOption = document.createElement('option');
      pickupOption.value = station.id;
      pickupOption.textContent = `${station.name} Station`;
      pickupSelect.append(pickupOption);
    });
    fareResult.fares.forEach((item) => fares.set(`${Number(item.originId)}:${Number(item.destinationId)}:${item.fareType}`, Number(item.amount)));
    account = authResult?.user || null;
    $('walletBalance').textContent = account ? money(account.wallet_balance) : 'Sign in required';
    renderBookingTickets();
    const eligible = account && ['Student', 'Senior', 'PWD'].includes(account.account_type) && account.id_upload_status === 'verified';
    $('discountedFareRow').querySelector('input').disabled = !eligible;
    $('discountEligibility').textContent = eligible ? `Verified ${account.account_type} account` : 'Available to verified Student, Senior Citizen, or PWD accounts';
    refreshSummary();
  }).catch((error) => { $('purchaseMessage').textContent = error.message; });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = $('purchaseMessage');
    if (!account) {
      message.innerHTML = 'Create an account or <a href="account.html">sign in</a> to try the pass interactions.';
      return;
    }
    const quantity = Number($('quantity').value);
    if (mode !== 'beep' && Number($('origin').value) === Number($('destination').value)) { message.textContent = 'Choose two different stations.'; return; }
    if (mode !== 'beep' && (!Number.isInteger(quantity) || quantity < 1 || quantity > 10)) { message.textContent = 'Choose between 1 and 10 tickets.'; return; }
    const selectedDate = mode === 'beep' ? $('pickupDate').value : $('travelDate').value;
    if (!selectedDate || selectedDate < todayText) { message.textContent = 'Choose today or a future date.'; return; }
    const fareType = document.querySelector('input[name="fareType"]:checked')?.value || 'Regular';
    const payload = mode === 'beep'
      ? { ticketType: 'STORED_VALUE', journeyType: 'BEEP_PASS', pickupStationId: Number($('pickupStation').value), pickupDate: selectedDate, validDate: selectedDate, cardValue: Number($('cardValue').value), paymentChoice: beepPaymentChoice, paymentMethod: beepPaymentChoice === 'COUNTER' ? 'COUNTER' : $('paymentMethod').value, passengerType: 'Beep Stored-Value Pass' }
      : { ticketType: 'SINGLE_JOURNEY', journeyType: mode === 'book' ? 'BOOK_UNPAID' : 'RESERVE_PAID', originId: Number($('origin').value), destinationId: Number($('destination').value), fareType, passengerType: fareType, paymentMethod: mode === 'book' ? 'COUNTER' : $('paymentMethod').value, quantity, validDate: selectedDate };
    const button = $('purchaseButton');
    button.disabled = true;
    button.textContent = 'Processing…';
    message.textContent = '';
    try {
      const issued = await window.mrtApi('/tickets', { method: 'POST', body: JSON.stringify(payload) });
      latestTicket = issued.ticket;
      account.wallet_balance = issued.walletBalance;
      $('walletBalance').textContent = money(issued.walletBalance);
      $('passDetails').textContent = payload.journeyType === 'BEEP_PASS'
        ? `Beep Stored-Value Pass · ${issued.ticket.pickupStation} · Pickup ${issued.ticket.pickupDate} · ${money(issued.ticket.cardValue)}`
        : `${nameOf(payload.originId)} → ${nameOf(payload.destinationId)} · ${quantity} ticket${quantity === 1 ? '' : 's'} · ${money(issued.farePaid)}`;
      $('passReference').textContent = `PNR ${issued.reference}`;
      const unpaid = issued.ticket.paymentStatus === 'UNPAID';
      const beepPass = issued.ticket.journeyType === 'BEEP_PASS';
      $('issuedPassStatus').textContent = beepPass
        ? unpaid ? 'RESERVED / PAY AT COUNTER' : 'PAID / READY FOR PICKUP'
        : unpaid ? 'UNPAID / BOOKED' : 'RESERVED / PAID';
      $('issuedPassStatus').className = `ticket-status-value ${unpaid ? 'ticket-status-booked' : 'ticket-status-reserved'}`;
      $('issuedPassTitle').textContent = beepPass ? 'Beep Pass order ready' : unpaid ? 'Booking voucher ready' : 'Pass reserved';
      $('passInstructions').textContent = beepPass
        ? unpaid
          ? `Payment required upon pickup. Present this QR code at ${issued.ticket.pickupStation} counter on ${issued.ticket.pickupDate} to pay cash and claim your Beep Pass.`
          : `Pre-paid. Present this QR code at ${issued.ticket.pickupStation} counter on ${issued.ticket.pickupDate} to claim your Beep Pass.`
        : unpaid
          ? 'Present this QR code at the ticket counter to make payment and claim your physical ticket.'
          : `Paid via ${issued.ticket.paymentMethod}. Present this QR code directly at the entry turnstile or counter.`;
      $('passInstructions').className = `pass-instructions ${unpaid ? 'pass-instructions-booked' : 'pass-instructions-reserved'}`;
      window.dispatchEvent(new CustomEvent('mrt:ticket-qr-render', { detail: { container: $('purchaseQr'), ticket: issued.ticket } }));
      $('issuedPass').hidden = false;
      message.textContent = beepPass
        ? 'Beep Pass order saved in this browser. Pickup and payment details are shown on your voucher.'
        : unpaid
        ? 'Booking voucher saved in this browser. Pay at the station counter to claim your physical ticket.'
        : 'Prepaid demo reservation saved in this browser. No real payment was processed.';
      message.classList.add('purchase-success');
      refreshSummary();
      renderBookingTickets();
      window.dispatchEvent(new CustomEvent('mrt:ticket-open', { detail: { ticket: issued.ticket, trigger: $('purchaseButton') } }));
    } catch (error) {
      message.textContent = error.message;
      message.classList.remove('purchase-success');
    } finally {
      button.disabled = false;
      button.textContent = mode === 'book' ? 'Generate Booking Voucher' : mode === 'reserve' ? 'Pay & Reserve Pass' : 'Confirm Beep Pass Order';
    }
  });
})();
