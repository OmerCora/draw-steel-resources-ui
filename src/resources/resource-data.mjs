/**
 * Class resource definitions for Draw Steel heroic resources.
 *
 * Each class entry defines:
 *   - id:             Lowercase class identifier
 *   - className:      Display name of the class
 *   - resourceName:   The heroic resource name (matches classItem.system.primary)
 *   - gains[]:        Ways to gain the resource
 *   - spends[]:       Ways to spend the resource
 *   - passiveEffects[]: Threshold-based passive effects table
 *
 * Gain / spend entries:
 *   - id:          Unique identifier within the class
 *   - description: User-facing text
 *   - amount|cost: Number, dice formula string, or "victories"
 *   - minLevel:    Minimum hero level to unlock
 *   - replaces:    (optional) ID of the entry this one supersedes
 *   - damage:      (optional) { formula, type } for spend-triggered damage rolls
 *
 * Passive effect entries:
 *   - threshold:   Resource value required to activate
 *   - description: Effect text
 *   - minLevel:    Minimum hero level to display
 */

// ── Censor ────────────────────────────────────────────────────────────────────

const CENSOR = {
  id: "censor",
  className: "Censor",
  resourceName: "Wrath",

  gains: [
    {
      id: "combat-start",
      description: "At the start of combat, gain wrath equal to your Victories.",
      amount: "victories",
      minLevel: 1,
    },
    {
      id: "turn-start",
      description: "At the start of each of your turns during combat, you gain 2 wrath.",
      amount: 2,
      minLevel: 1,
    },
    {
      id: "turn-start-lv7",
      description: "At the start of each of your turns during combat, you gain 3 wrath.",
      amount: 3,
      minLevel: 7,
      replaces: "turn-start",
    },
    {
      id: "turn-start-lv10",
      description: "At the start of each of your turns during combat, you gain 4 wrath.",
      amount: 4,
      minLevel: 10,
      replaces: "turn-start-lv7",
    },
    {
      id: "judged-damages-you",
      description: "First time each combat round that a creature judged by you deals damage to you, you gain 1 wrath.",
      amount: 1,
      minLevel: 1,
    },
    {
      id: "damage-judged",
      description: "First time each combat round that you deal damage to a creature judged by you, you gain 1 wrath.",
      amount: 1,
      minLevel: 1,
    },
    {
      id: "damage-judged-lv4",
      description: "First time each combat round that you deal damage to a creature judged by you, you gain 2 wrath.",
      amount: 2,
      minLevel: 4,
      replaces: "damage-judged",
    },
  ],

  spends: [
    {
      id: "spend-free-strike",
      description: "When an adjacent creature judged by you starts to shift, make a melee free strike against them and their speed becomes 0 until end of turn. [[/apply slowed turn]]",
      cost: 1,
      minLevel: 1,
    },
    {
      id: "spend-bane",
      description: "When a creature judged by you within 10 squares makes a power roll, cause them to take a bane.",
      cost: 1,
      minLevel: 1,
    },
    {
      id: "spend-reduce-potency",
      description: "When a creature judged by you within 10 squares uses an ability with potency targeting one creature, reduce potency by 1.",
      cost: 1,
      minLevel: 1,
    },
    {
      id: "spend-taunt",
      description: "If you damage a creature judged by you with a melee ability, the creature is [[/apply taunted turn]] by you until end of their next turn.",
      cost: 1,
      minLevel: 1,
    },
    {
      id: "spend-judgment-frighten",
      description: "When you use Judgment, if the target has P < AVERAGE, they are [[/apply frightened save]] of you (save ends).",
      cost: 1,
      minLevel: 3,
    },
    {
      id: "spend-judgment-chain-frighten",
      description: "When a creature judged by you is reduced to 0 Stamina and you use Judgment as a free triggered action, if the new target has P < STRONG, they are [[/apply frightened save]] (save ends). If already frightened, they take [[/damage 2*@characteristics.presence.value type=holy]] holy damage.",
      cost: 1,
      minLevel: 3,
    },
  ],

  passiveEffects: [],
};

// ── Stubs for remaining classes (rules TBD) ──────────────────────────────────

// ── Domain Piety Conditions (Conduit) ────────────────────────────────────────

export const DOMAIN_PIETY_TABLE = {
  Creation: "A creature within 10 squares uses an area ability.",
  Death: "A non-minion creature within 10 squares is reduced to 0 Stamina, or a solo creature within 10 squares becomes winded.",
  Fate: "An ally within 10 squares gets a tier 3 outcome, or an enemy within 10 squares gets a tier 1 outcome on a power roll.",
  Knowledge: "The Director spends Malice.",
  Life: "A creature within 10 squares regains Stamina.",
  Love: "You or any ally within 10 squares uses the Aid Attack maneuver or an ability targeting an ally.",
  Nature: "You or a creature within 10 squares takes acid, cold, fire, lightning, poison, or sonic damage.",
  Protection: "You or any ally within 10 squares gains temporary Stamina, or uses a triggered action to reduce incoming damage or impose a bane/double bane on an enemy's power roll.",
  Storm: "An enemy within 10 squares is force moved.",
  Sun: "An enemy within 10 squares takes fire or holy damage.",
  Trickery: "You or a creature within 10 squares takes the Aid Attack or Hide maneuver.",
  War: "You or a creature within 10 squares takes damage greater than 10 + your level in a single turn.",
};

// ── Domain Prayer Effects (Conduit — activated on pray roll of 3) ─────────────

export const DOMAIN_PRAYER_EFFECTS = {
  Creation: "Create a wall of stone within 10 squares, size 5 + @I. Lasts until end of encounter.",
  Death: "Up to two enemies within 10 squares take [[/damage 2*@I corruption]].",
  Fate: "Choose a creature within 10 squares. They automatically obtain a tier 1 or tier 3 outcome (your choice) on their next power roll before end of encounter.",
  Knowledge: "Up to five allies within 10 squares (or yourself instead of one ally) each [[/gain 1 surge]].",
  Life: "Choose yourself or one ally within 10 squares. They can spend a Recovery, end one save-ends or end-of-turn effect, or stand up if prone. Alternatively, you or one ally within 10 squares gains [[/heal 2*@I type=temporary]].",
  Love: "Each ally within 10 squares gains [[/heal 2*@I type=temporary]].",
  Nature: "Vines appear within 10 squares, wrapping @I creatures. Slide each up to @I squares, then the vines fade.",
  Protection: "One ally within 10 squares gains [[/heal 4*@I type=temporary]].",
  Storm: "Each enemy in a 3 cube within 10 squares takes [[/damage 2*@I lightning]].",
  Sun: "One enemy within 10 squares takes [[/damage 3*@I fire]].",
  Trickery: "Slide one creature within 10 squares up to 5+@level squares.",
  War: "Up to three allies within 10 squares (or yourself instead of one ally) each [[/gain 2 surge]].",
};

// ── Conduit ───────────────────────────────────────────────────────────────────

const CONDUIT = {
  id: "conduit",
  className: "Conduit",
  resourceName: "Piety",

  gains: [
    {
      id: "combat-start",
      description: "At the start of a combat encounter, gain piety equal to your Victories.",
      amount: "victories",
      minLevel: 1,
    },
    {
      id: "turn-start",
      description: "At the start of each of your turns during combat, you gain 1d3 piety.",
      amount: "1d3",
      minLevel: 1,
      action: "roll",
    },
    {
      id: "turn-start-lv7",
      description: "At the start of each of your turns during combat, you gain 1d3 + 1 piety. (Faithful's Reward)",
      amount: "1d3 + 1",
      minLevel: 7,
      replaces: "turn-start",
      action: "roll",
    },
    {
      id: "pray",
      description: "Before rolling for piety, you can pray (no action required). Roll 1d3 with additional effects based on the result.",
      amount: "1d3",
      minLevel: 1,
      action: "pray",
    },
    {
      id: "domain-trigger",
      description: "Gain 2 piety from your domain's triggered piety condition.",
      amount: 2,
      minLevel: 1,
      action: "domain",
    },
    {
      id: "domain-trigger-lv4",
      description: "Gain 3 piety from your domain's triggered piety condition. (Blessed Domain: +1 additional piety)",
      amount: 3,
      minLevel: 4,
      replaces: "domain-trigger",
      action: "domain",
    },
  ],

  // Pray result tables — indexed by 1d3 result (1, 2, 3)
  prayResults: {
    1: {
      label: "Roll of 1",
      pietyBonus: 1,
      description: "Gain 1 additional piety, but take psychic damage equal to 1d6 + your level (can't be reduced).",
      damageEnricher: "[[/damage 1d6+@level type=psychic]]",
    },
    2: {
      label: "Roll of 2",
      pietyBonus: 1,
      description: "Gain 1 additional piety.",
    },
    3: {
      label: "Roll of 3",
      pietyBonus: 2,
      description: "Gain 2 additional piety and activate a domain effect of your choice.",
      domainChoice: true,
    },
  },

  // Level 10 pray bonus (Most Pious)
  prayLv10Bonus: {
    description: "When you pray, you gain 1 additional piety on top of all other effects. (Most Pious)",
    pietyBonus: 1,
    minLevel: 10,
  },

  spends: [
    {
      id: "spend-healing-grace",
      description: "<strong>Healing Grace</strong> — The target can spend a Recovery. (maneuver, once per turn)<br><strong>Spend 1+ piety</strong> for enhancements:<ul><li>Target one additional ally within distance.</li><li>End one effect on a target that is ended by a saving throw or that ends at the end of their turn.</li><li>A prone target can stand up.</li><li>A target can spend 1 additional Recovery.</li></ul>",
      spendXDetail: "The target can spend a Recovery. For each piety spent, choose one:<ul><li>Target one additional ally within distance.</li><li>End one effect on a target that is ended by a saving throw or that ends at the end of their turn.</li><li>A prone target can stand up.</li><li>A target can spend 1 additional Recovery.</li></ul>",
      cost: 1,
      minLevel: 1,
      action: "spendX",
      spendXTitle: "Healing Grace",
    },
    {
      id: "spend-word-of-guidance",
      description: "Triggered Action — Word of Guidance: An ally's damage-dealing ability power roll gains a double edge instead of an edge.",
      cost: 1,
      minLevel: 1,
      requiresAbility: "Word of Guidance",
    },
    {
      id: "spend-word-of-judgment",
      description: "Triggered Action — Word of Judgment: An enemy's power roll that would damage an ally gains a double bane instead of a bane.",
      cost: 1,
      minLevel: 1,
      requiresAbility: "Word of Judgment",
    },
    {
      id: "spend-faiths-sword",
      description: "Faith's Sword (free maneuver): Spend piety to give a chosen hero ally 1 of their Heroic Resource for every 2 piety spent.",
      cost: 2,
      minLevel: 9,
      action: "spendX",
      spendXTitle: "Faith's Sword",
      spendXStep: 2,
    },
  ],

  passiveEffects: [],
};
const ELEMENTALIST = { id: "elementalist", className: "Elementalist", resourceName: "Essence",    gains: [], spends: [], passiveEffects: [] };
const FURY      = { id: "fury",         className: "Fury",         resourceName: "Ferocity",   gains: [], spends: [], passiveEffects: [] };
const NULL      = { id: "null",         className: "Null",         resourceName: "Discipline",  gains: [], spends: [], passiveEffects: [] };
const SHADOW    = { id: "shadow",       className: "Shadow",       resourceName: "Insight",     gains: [], spends: [], passiveEffects: [] };
const TACTICIAN = { id: "tactician",    className: "Tactician",    resourceName: "Focus",       gains: [], spends: [], passiveEffects: [] };
const TALENT    = { id: "talent",       className: "Talent",       resourceName: "Clarity",     gains: [], spends: [], passiveEffects: [] };
const TROUBADOUR = { id: "troubadour",  className: "Troubadour",   resourceName: "Drama",       gains: [], spends: [], passiveEffects: [] };

// ── Registry ─────────────────────────────────────────────────────────────────

/** All built-in class definitions, keyed by lowercase class name. */
export const CLASS_DEFINITIONS = {
  censor:       CENSOR,
  conduit:      CONDUIT,
  elementalist: ELEMENTALIST,
  fury:         FURY,
  null:         NULL,
  shadow:       SHADOW,
  tactician:    TACTICIAN,
  talent:       TALENT,
  troubadour:   TROUBADOUR,
};

/**
 * Look up a class definition by the heroic resource name (e.g. "Wrath" → CENSOR).
 * Falls back to matching by className.
 */
export function getClassByResourceName(resourceName) {
  if (!resourceName) return null;
  const lower = resourceName.toLowerCase();
  return Object.values(CLASS_DEFINITIONS).find(
    (c) => c.resourceName.toLowerCase() === lower
  ) ?? null;
}

/**
 * Look up a class definition by class name (e.g. "Censor" → CENSOR).
 */
export function getClassByName(className) {
  if (!className) return null;
  return CLASS_DEFINITIONS[className.toLowerCase()] ?? null;
}
