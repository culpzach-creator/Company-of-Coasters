function calculateFinalAwards() {
  recalculateGlobalRecords();
  const categories = [
    { id: "attendance", title: "Most Attendance Chainwide", tickets: 5, unit: "guests", candidates: [] },
    { id: "park", title: "Best Park", tickets: 3, unit: "pts", candidates: [] },
    { id: "land", title: "Best Themed Area", tickets: 2, unit: "scenic pts", candidates: [] },
    { id: "ride", title: "Best Non-Coaster Ride", tickets: 2, unit: "pts", candidates: [] },
    { id: "coaster", title: "Best Roller Coaster", tickets: 2, unit: "pts", candidates: [] },
    { id: "mostRidesPark", title: "Most Rides in a Park", tickets: 1, unit: "rides", candidates: [] },
    { id: "mostCoastersPark", title: "Most Coasters in a Park", tickets: 1, unit: "coasters", candidates: [] },
    { id: "tallestSteel", title: "Tallest Steel Coaster", tickets: 1, unit: "ft", candidates: [] },
    { id: "longestSteel", title: "Longest Steel Coaster", tickets: 1, unit: "ft", candidates: [] },
    { id: "tallestWood", title: "Tallest Wood Coaster", tickets: 1, unit: "ft", candidates: [] },
    { id: "longestWood", title: "Longest Wood Coaster", tickets: 1, unit: "ft", candidates: [] }
  ];
  const byId = Object.fromEntries(categories.map(category => [category.id, category]));
  const standings = gameState.players.map(player => ({
    playerId: player.id, chainName: player.chainName, ceoName: player.ceoName,
    tickets: 0, parkPoints: 0
  }));
  const standingsById = new Map(standings.map(standing => [standing.playerId, standing]));

  for (const player of gameState.players) {
    byId.attendance.candidates.push({ playerId: player.id, label: player.chainName, value: player.totalAttendance || 0 });
    for (const park of player.parks) {
      const score = calculateParkScoreSummary(park, player).finalScore;
      standingsById.get(player.id).parkPoints += score;
      byId.park.candidates.push({ playerId: player.id, label: park.name, value: score });
      for (const land of park.zones || []) {
        if (land.unlocked === false) continue;
        const scenic = evaluateThemedLandBreakdown(park, land, player).totalPlotScenic;
        if (scenic > 0) byId.land.candidates.push({ playerId: player.id, label: `${land.name} (${park.name})`, value: scenic });
      }
      for (const ride of park.rides) {
        if (!isRideOperational(ride) || ride.category === "facility") continue;
        const score = calculateRideTotalScore(ride, player);
        const target = ride.category === "coaster" ? byId.coaster : byId.ride;
        target.candidates.push({ playerId: player.id, label: `${ride.name} (${park.name})`, value: score });
      }
    }
  }
  for (const id of ["mostRidesPark", "mostCoastersPark", "tallestSteel", "longestSteel", "tallestWood", "longestWood"]) {
    const record = gameState.records[id];
    for (const holder of record.holders) {
      byId[id].candidates.push({
        playerId: holder.player.id,
        label: holder.ride ? `${holder.ride.name} (${holder.park.name})` : holder.park.name,
        value: record.val
      });
    }
  }
  const awards = categories.map(category => {
    const top = category.candidates.length ? Math.max(...category.candidates.map(item => item.value)) : null;
    const holders = category.candidates.filter(item => item.value === top);
    for (const id of new Set(holders.map(item => item.playerId))) standingsById.get(id).tickets += category.tickets;
    return { id: category.id, title: category.title, tickets: category.tickets, unit: category.unit, value: top, holders };
  });
  standings.sort((a, b) => b.tickets - a.tickets || b.parkPoints - a.parkPoints || a.chainName.localeCompare(b.chainName));
  const best = standings[0];
  const winners = standings.filter(item => item.tickets === best.tickets && item.parkPoints === best.parkPoints).map(item => item.playerId);
  return { year: gameState.year, awards, standings, winners };
}

function openFinalAwards() {
  const results = gameState.finalAwards;
  if (!results) return;
  const winnerNames = results.standings.filter(item => results.winners.includes(item.playerId))
    .map(item => `${escapeHtml(item.ceoName)} · ${escapeHtml(item.chainName)}`).join("<br>");
  const number = value => Number.isInteger(value) ? value.toLocaleString() : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  const nameById = new Map(results.standings.map(item => [item.playerId, item.chainName]));
  document.getElementById("finalAwardsBody").innerHTML = `
    <div class="final-awards-winner"><span>Year ${results.year} · ${results.winners.length === 1 ? "Champion" : "Joint Champions"}</span><h2>${winnerNames}</h2><p>${results.standings[0].tickets} Bronze Tickets</p></div>
    <h3>Final Standings</h3>
    <div class="final-standings">${results.standings.map(item => `<div class="final-standing${results.winners.includes(item.playerId) ? " winner" : ""}">
      <span class="final-place">${results.standings.findIndex(other => other.tickets === item.tickets && other.parkPoints === item.parkPoints) + 1}</span><div><strong>${escapeHtml(item.chainName)}</strong><small>${escapeHtml(item.ceoName)} · ${number(item.parkPoints)} total park pts</small></div><b>${item.tickets} tickets</b>
    </div>`).join("")}</div>
    <p class="final-awards-note">Tied categories award each tied chain the full ticket value, once per category. Total park points break a tie in tickets; matching totals share the victory.</p>
    <h3>The Awards</h3>
    <p class="final-awards-note">Themed areas are ranked by scenic points. Ride and coaster awards use operational attractions; facilities do not count as rides. A park train counts once. Categories without an eligible entry are not awarded.</p>
    <div class="final-awards-list">${results.awards.map(award => `<article class="final-award">
      <div class="final-award-heading"><strong>${escapeHtml(award.title)}</strong><span>${award.tickets} ${award.tickets === 1 ? "ticket" : "tickets"}</span></div>
      ${award.holders.length ? `<div class="final-award-value">${number(award.value)} ${escapeHtml(award.unit)}</div>${award.holders.map(holder => `<div class="final-award-holder"><strong>${escapeHtml(nameById.get(holder.playerId))}</strong>${award.id === "attendance" ? "" : ` · ${escapeHtml(holder.label)}`}</div>`).join("")}` : '<div class="final-award-holder">No eligible entry</div>'}
    </article>`).join("")}</div>`;
  document.getElementById("finalAwardsModal").classList.add("active");
}

function applyLegacyGameLength() {
  const value = Number(document.getElementById("legacyLengthSelect").value);
  if (![25, 50, 100, 150, 200].includes(value)) {
    alert("Please choose a valid game length.");
    return;
  }
  gameState.maxYears = value;
  closeModal("legacyLengthModal");
}
