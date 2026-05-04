/**
 * Draw Steel Resource Tracker
 * Main module entry point, registers hooks, sidebar button, and re-render triggers.
 */

import { MODULE_ID, SYSTEM_ID } from "./config.mjs";
import { ResourceApp } from "./resources/resource-app.mjs";
import { updateHeroicResource } from "./resources/resource-logic.mjs";

const log = (...args) => console.log(`${MODULE_ID} |`, ...args);

let _systemValid = false;

// ── Init ─────────────────────────────────────────────────────────────────────

Hooks.once("init", () => {
  if (game.system?.id !== SYSTEM_ID) return;
  _systemValid = true;

  foundry.applications.handlebars.loadTemplates([
    `modules/${MODULE_ID}/templates/resource-panel.hbs`,
  ]);

  Handlebars.registerHelper("eq", function (a, b) { return a === b; });

  // ── Settings ─────────────────────────────────────────────────────────────
  game.settings.register(MODULE_ID, "combatTracking", {
    name: game.i18n.localize("DSRESOURCES.Settings.CombatTracking"),
    hint: game.i18n.localize("DSRESOURCES.Settings.CombatTrackingHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => {
      if (ResourceApp._instance?.rendered) ResourceApp._instance.render(false);
      Hooks.callAll("dsresources.trackingChanged");
    },
  });

  game.settings.register(MODULE_ID, "sharedTracking", {
    name: game.i18n.localize("DSRESOURCES.Settings.SharedTracking"),
    hint: game.i18n.localize("DSRESOURCES.Settings.SharedTrackingHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => {
      if (ResourceApp._instance?.rendered) ResourceApp._instance.render(false);
      Hooks.callAll("dsresources.trackingChanged");
    },
  });

  game.settings.register(MODULE_ID, "diceAnimation", {
    name: game.i18n.localize("DSRESOURCES.Settings.DiceAnimation"),
    hint: game.i18n.localize("DSRESOURCES.Settings.DiceAnimationHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  log("Initialized");
});

// ── Ready ────────────────────────────────────────────────────────────────────

Hooks.once("ready", () => {
  if (!_systemValid) return;

  game.modules.get(MODULE_ID).api = {
    ResourceApp,
    buildHeroicTabData: (actor, spendXValues) => ResourceApp.buildHeroicTabData(actor, spendXValues),
    executeGainHeroic: (actor, gainId) => ResourceApp.executeGainHeroic(actor, gainId),
    executeSpendHeroic: (actor, spendId) => ResourceApp.executeSpendHeroic(actor, spendId),
    executeConfirmSpendX: (actor, spendId, amount) => ResourceApp.executeConfirmSpendX(actor, spendId, amount),
    undoEntry: (actor, trackKey) => ResourceApp.undoEntry(actor, trackKey),
    adjustHeroicResource: (actor, delta) => updateHeroicResource(actor, delta),
    executeMindRecovery: (actor) => ResourceApp.executeMindRecovery(actor),
    executeStrainDamage: (actor) => ResourceApp.executeStrainDamage(actor),
    executePray: (actor) => ResourceApp.executePray(actor),
    resetUsedEntries: (scope) => ResourceApp.resetUsedEntries(scope),
    executeGainGrowthSurge: (actor, surgeAmount, tableLabel, trackKey) =>
      ResourceApp.executeGainGrowthSurge(actor, surgeAmount, tableLabel, trackKey),
  };

  log("Ready");
});

// ── Scene-control button (token tools bar – Foundry v13 object API) ─────────

Hooks.on("getSceneControlButtons", (controls) => {
  if (!_systemValid) return;

  // v13: controls is an object keyed by control name, tools is also an object
  const tokenGroup = controls.tokens ?? controls.token;
  if (!tokenGroup) return;

  tokenGroup.tools.dsresources = {
    name: "dsresources",
    title: game.i18n.localize("DSRESOURCES.SidebarButton"),
    icon: "fa-solid fa-bolt",
    button: true,
    onChange: () => ResourceApp.toggle(),
  };
});

// ── Re-render on actor updates ───────────────────────────────────────────────

Hooks.on("updateActor", (actor, _changes, _options, _userId) => {
  if (!_systemValid) return;
  if (!ResourceApp._instance?.rendered) return;

  if (game.user.isGM) {
    // GM sees all heroes, re-render for any hero actor update
    if (actor.type === "hero") ResourceApp._instance.render(false);
  } else {
    const myActor = game.user.character;
    if (myActor?.id === actor.id) ResourceApp._instance.render(false);
  }
});

// ── Re-render when hero tokens change (world setting) ────────────────────────

Hooks.on("updateSetting", (setting) => {
  if (!_systemValid) return;
  if (!ResourceApp._instance?.rendered) return;
  if (setting.key === `${SYSTEM_ID}.heroTokens`) {
    ResourceApp._instance.render(false);
  }
});

// ── Combat tracking: reset used entries on turn/round changes ────────────────

Hooks.on("updateCombat", async (_combat, changes) => {
  if (!_systemValid) return;
  if (!game.settings.get(MODULE_ID, "combatTracking")) return;

  if (changes.round !== undefined) {
    // New round: reset turn-scoped and round-scoped, but keep encounter-scoped
    await ResourceApp.resetUsedEntries("round");
  } else if (changes.turn !== undefined) {
    // New turn within same round: reset only turn-scoped entries
    await ResourceApp.resetUsedEntries("turn");
  }
});

Hooks.on("deleteCombat", async () => {
  if (!_systemValid) return;
  await ResourceApp.resetUsedEntries("all");
});
