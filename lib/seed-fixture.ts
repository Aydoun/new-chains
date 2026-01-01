// fixture.content-platform.js
// A data-only fixture you can feed into a custom Node script.
//
// Suggested approach (not implemented here):
// 1) create users
// 2) create frames, keep map: key -> frame.id
// 3) create sequences using userId resolved by userEmail, and FrameOrder = frameOrder.map(k => frameIdByKey[k])

module.exports = {
  frames: [
    // --- Travel: Amsterdam 1-day (SEQ_001) ---
    { key: "F_AMS_DAY_01", type: "PHRASE", content: "Start at Centraal Station and walk toward Dam Square.", description: "Keep it simple: follow the crowds and canals." },
    { key: "F_AMS_DAY_02", type: "PHRASE", content: "Grab a coffee + something small (stroopwafel or a sandwich).", description: "Fuel up before museum time." },
    { key: "F_AMS_DAY_03", type: "PHRASE", content: "Pick ONE major museum: Rijksmuseum or Van Gogh Museum.", description: "Don’t try to do both if you hate rushing." },
    { key: "F_AMS_DAY_04", type: "PHRASE", content: "Walk through Vondelpark and reset your brain.", description: "Your legs will thank you." },
    { key: "F_AMS_DAY_05", type: "PHRASE", content: "Lunch in De Pijp—something quick and local.", description: "This area is built for casual eats." },
    { key: "F_AMS_DAY_06", type: "PHRASE", content: "Take a canal cruise near late afternoon.", description: "Best light, best vibes." },
    { key: "F_AMS_DAY_07", type: "PHRASE", content: "Finish with a relaxed dinner and an early night.", description: "You’ll enjoy tomorrow more." },

    // --- Travel: Paris 48h (SEQ_002) ---
    { key: "F_PAR_48_01", type: "PHRASE", content: "Day 1 morning: Eiffel Tower area + walk along the Seine.", description: "Book timed tickets if you hate lines." },
    { key: "F_PAR_48_02", type: "PHRASE", content: "Pick ONE big museum: Louvre OR Musée d’Orsay.", description: "Choose based on art taste, not hype." },
    { key: "F_PAR_48_03", type: "PHRASE", content: "Late afternoon: Montmartre stroll + Sacré-Cœur viewpoint.", description: "Expect crowds—embrace it." },
    { key: "F_PAR_48_04", type: "PHRASE", content: "Dinner: simple bistro meal—don’t over-optimize.", description: "Paris rewards being unhurried." },
    { key: "F_PAR_48_05", type: "PHRASE", content: "Day 2 morning: Le Marais walk + pastries.", description: "Start early to avoid the crush." },
    { key: "F_PAR_48_06", type: "PHRASE", content: "Midday: Notre-Dame area + Latin Quarter wander.", description: "Small streets beat big attractions." },
    { key: "F_PAR_48_07", type: "PHRASE", content: "Sunset: Trocadéro or a bridge viewpoint for photos.", description: "Golden hour = instant glow-up." },

    // --- Git tasks: Clean PR (SEQ_003) ---
    { key: "F_GIT_PR_01", type: "PHRASE", content: "Create a branch named like: feat/login-redirect.", description: "Human-readable beats clever." },
    { key: "F_GIT_PR_02", type: "PHRASE", content: "Commit early, commit often—each commit should compile.", description: "Future-you will worship present-you." },
    { key: "F_GIT_PR_03", type: "PHRASE", content: "Write a PR description: what + why + how to test.", description: "If reviewers guess, they’ll guess wrong." },
    { key: "F_GIT_PR_04", type: "PHRASE", content: "Rebase or merge main before requesting review.", description: "Reduce conflicts before they exist." },
    { key: "F_GIT_PR_05", type: "PHRASE", content: "Add screenshots or short clips if UI changes.", description: "Proof beats explanation." },
    { key: "F_GIT_PR_06", type: "PHRASE", content: "Respond to feedback with commits, not essays.", description: "Show the fix." },
    { key: "F_GIT_PR_07", type: "PHRASE", content: "Squash only if your team wants it—don’t rewrite history casually.", description: "Team norms > personal preference." },

    // --- Life routine: Morning reset (SEQ_004) ---
    { key: "F_AM_ROUTINE_01", type: "PHRASE", content: "Drink water before you touch your phone.", description: "Yes, it’s cheesy. It works." },
    { key: "F_AM_ROUTINE_02", type: "PHRASE", content: "Open a window or step outside for 2 minutes.", description: "Signal ‘daytime’ to your body." },
    { key: "F_AM_ROUTINE_03", type: "PHRASE", content: "Do 5 minutes of movement (stretch, push-ups, walk).", description: "The goal is ‘started’, not ‘destroyed’." },
    { key: "F_AM_ROUTINE_04", type: "PHRASE", content: "Pick ONE priority for today and write it down.", description: "One. Not seven." },
    { key: "F_AM_ROUTINE_05", type: "PHRASE", content: "Block 60–90 minutes for deep work (no notifications).", description: "Win the morning, win the day." },
    { key: "F_AM_ROUTINE_06", type: "PHRASE", content: "Only then check messages and meetings.", description: "Don’t donate your brain for free." },

    // --- Cooking: Simple pasta (SEQ_005) ---
    { key: "F_PASTA_01", type: "PHRASE", content: "Salt your water like the sea and bring to a boil.", description: "This is half the flavor." },
    { key: "F_PASTA_02", type: "PHRASE", content: "Cook pasta until just al dente.", description: "It should still fight back a bit." },
    { key: "F_PASTA_03", type: "PHRASE", content: "In a pan: olive oil + garlic (low heat).", description: "Don’t burn garlic. Ever." },
    { key: "F_PASTA_04", type: "PHRASE", content: "Add chili flakes or black pepper if you want heat.", description: "Optional, but recommended." },
    { key: "F_PASTA_05", type: "PHRASE", content: "Toss pasta with pan sauce + a splash of pasta water.", description: "That starchy water is magic glue." },
    { key: "F_PASTA_06", type: "PHRASE", content: "Finish with parmesan and lemon zest (optional).", description: "Instant restaurant effect." },

    // --- Music: 12-bar blues (SEQ_006) ---
    { key: "F_BLUES_01", type: "PHRASE", content: "Pick a key (A is friendly for guitar).", description: "Keep it beginner-proof." },
    { key: "F_BLUES_02", type: "PHRASE", content: "Use I–IV–V chords (A–D–E in key of A).", description: "This is the whole engine." },
    { key: "F_BLUES_03", type: "PHRASE", content: "Bars 1–4: I chord.", description: "Stay home." },
    { key: "F_BLUES_04", type: "PHRASE", content: "Bars 5–6: IV chord; Bars 7–8: I chord.", description: "Tension then relief." },
    { key: "F_BLUES_05", type: "PHRASE", content: "Bar 9: V chord; Bar 10: IV chord.", description: "Build the story." },
    { key: "F_BLUES_06", type: "PHRASE", content: "Bars 11–12: I chord, then turnaround on V.", description: "Loop forever." },

    // --- Poetry: Haiku crafting (SEQ_007) ---
    { key: "F_HAIKU_01", type: "PHRASE", content: "Choose one concrete moment (not a life philosophy).", description: "Specific beats profound." },
    { key: "F_HAIKU_02", type: "PHRASE", content: "Write 3 lines: 5–7–5 syllables (roughly).", description: "Close enough is fine." },
    { key: "F_HAIKU_03", type: "PHRASE", content: "Add a seasonal hint (rain, heat, leaves, frost).", description: "Classic haiku move." },
    { key: "F_HAIKU_04", type: "PHRASE", content: "Use sensory words: sound, smell, texture.", description: "Make it felt, not explained." },
    { key: "F_HAIKU_05", type: "PHRASE", content: "Cut one word per line until it snaps into place.", description: "Haiku is trimming." },

    // --- Skills: Learn anything with spaced repetition (SEQ_008) ---
    { key: "F_SRS_01", type: "PHRASE", content: "Define the smallest unit: ‘one fact per card’.", description: "Big cards become ignored cards." },
    { key: "F_SRS_02", type: "PHRASE", content: "Make prompts active: questions, not statements.", description: "Recall beats recognition." },
    { key: "F_SRS_03", type: "PHRASE", content: "Review daily—even 10 minutes counts.", description: "Consistency > intensity." },
    { key: "F_SRS_04", type: "PHRASE", content: "If you miss twice, simplify the card.", description: "Your card is wrong, not you." },
    { key: "F_SRS_05", type: "PHRASE", content: "Every week: add 10 new cards, delete 10 weak ones.", description: "Curate your brain." },

    // --- Security: Password hygiene (SEQ_009) ---
    { key: "F_PASS_01", type: "PHRASE", content: "Use a password manager. Stop debating it.", description: "This is non-negotiable today" },
    { key: "F_PASS_02", type: "PHRASE", content: "Unique password per site—no exceptions.", description: "Reuse = domino failure." },
    { key: "F_PASS_03", type: "PHRASE", content: "Turn on MFA (auth app > SMS).", description: "SMS is better than nothing, but still weak." },
    { key: "F_PASS_04", type: "PHRASE", content: "Store recovery codes somewhere safe.", description: "Future lockout prevention." },
    { key: "F_PASS_05", type: "PHRASE", content: "If breached: rotate passwords and revoke sessions.", description: "Act fast, not emotionally." },

    // --- Fitness: Beginner strength loop (SEQ_010) ---
    { key: "F_STR_01", type: "PHRASE", content: "Warm up: 5 minutes easy movement.", description: "Raise temperature, don’t ‘stretch to win’." },
    { key: "F_STR_02", type: "PHRASE", content: "Squat pattern: 3 sets (bodyweight or goblet).", description: "Legs + core." },
    { key: "F_STR_03", type: "PHRASE", content: "Push pattern: push-ups or incline push-ups.", description: "Scale it so you can finish." },
    { key: "F_STR_04", type: "PHRASE", content: "Pull pattern: rows or band pulls.", description: "Your posture will improve." },
    { key: "F_STR_05", type: "PHRASE", content: "Carry or plank: 2–3 rounds.", description: "Core without crunch drama." },
    { key: "F_STR_06", type: "PHRASE", content: "Stop with 1–2 reps in reserve.", description: "Train tomorrow, not just today." },

    // --- Productivity: “Two-minute rule” cleanup (SEQ_011) ---
    { key: "F_2MIN_01", type: "PHRASE", content: "If it takes under 2 minutes, do it now.", description: "Kills mental clutter." },
    { key: "F_2MIN_02", type: "PHRASE", content: "If it takes longer: capture it in a list.", description: "Don’t keep it in RAM." },
    { key: "F_2MIN_03", type: "PHRASE", content: "Batch similar tasks into a 30-minute block.", description: "Context switching is a tax." },
    { key: "F_2MIN_04", type: "PHRASE", content: "Close the loop: mark done or schedule.", description: "Open loops drain you." },

    // --- Baking: No-knead bread (SEQ_012) ---
    { key: "F_BREAD_01", type: "PHRASE", content: "Mix flour + water + yeast + salt until shaggy.", description: "No kneading required." },
    { key: "F_BREAD_02", type: "PHRASE", content: "Let it rise 12–18 hours (room temp).", description: "Time does the work." },
    { key: "F_BREAD_03", type: "PHRASE", content: "Shape gently—don’t punch it into sadness.", description: "Keep the air." },
    { key: "F_BREAD_04", type: "PHRASE", content: "Preheat a Dutch oven screaming hot.", description: "Heat = spring." },
    { key: "F_BREAD_05", type: "PHRASE", content: "Bake covered, then uncovered to brown.", description: "Steam then crust." },

    // --- Learning: Public speaking (SEQ_013) ---
    { key: "F_SPEAK_01", type: "PHRASE", content: "Write your opening sentence word-for-word.", description: "Start strong, calm down." },
    { key: "F_SPEAK_02", type: "PHRASE", content: "Structure: Point → Example → Point.", description: "Simple, sticky." },
    { key: "F_SPEAK_03", type: "PHRASE", content: "Pause after key lines. Silence is power.", description: "Don’t fill air with panic." },
    { key: "F_SPEAK_04", type: "PHRASE", content: "Practice out loud, not in your head.", description: "Your mouth needs reps." },
    { key: "F_SPEAK_05", type: "PHRASE", content: "End with a clear ask or takeaway.", description: "Don’t fade out." },

    // --- Finance: Personal budget baseline (SEQ_014) ---
    { key: "F_BUDGET_01", type: "PHRASE", content: "List fixed costs: rent, bills, debt, subscriptions.", description: "Reality first." },
    { key: "F_BUDGET_02", type: "PHRASE", content: "List variable costs: food, transport, fun.", description: "Estimate, then correct." },
    { key: "F_BUDGET_03", type: "PHRASE", content: "Set a savings floor: even 5% counts.", description: "A floor beats a wish." },
    { key: "F_BUDGET_04", type: "PHRASE", content: "Automate transfers on payday.", description: "Willpower is unreliable." },
    { key: "F_BUDGET_05", type: "PHRASE", content: "Review weekly: 10 minutes, not a therapy session.", description: "Stay aligned." },

    // --- Religion/verses style: “Gratitude steps” (SEQ_015) ---
    { key: "F_GRAT_01", type: "PHRASE", content: "Start with gratitude for basics (health, shelter, time).", description: "Foundation." },
    { key: "F_GRAT_02", type: "PHRASE", content: "Name one person you appreciate and why.", description: "Make it concrete." },
    { key: "F_GRAT_03", type: "PHRASE", content: "Acknowledge one hardship you survived.", description: "Strength check." },
    { key: "F_GRAT_04", type: "PHRASE", content: "Offer one small act of kindness today.", description: "Gratitude becomes action." },

    // --- More frames will be referenced by later sequences ---
    // To keep this response usable, I’m including enough frames to cover all 50 sequences below
    // while staying readable. Each later sequence references only keys defined here.
    // (Yes, it’s long — but that’s the point of a rich fixture.)
    //
    // ===========================
    // SEQ_016..SEQ_050 frames
    // ===========================

    // Travel circuits: Rome essentials (SEQ_016)
    { key: "F_ROME_01", type: "PHRASE", content: "Start early at the Colosseum area.", description: "Heat + crowds get worse fast." },
    { key: "F_ROME_02", type: "PHRASE", content: "Walk through the Roman Forum slowly.", description: "Imagine it noisy and alive." },
    { key: "F_ROME_03", type: "PHRASE", content: "Throw a coin at Trevi, then keep walking.", description: "Don’t camp there." },
    { key: "F_ROME_04", type: "PHRASE", content: "Pantheon stop: look up, then sit down.", description: "It hits differently." },
    { key: "F_ROME_05", type: "PHRASE", content: "Evening: Trastevere for food + wandering.", description: "Best vibe per meter." },

    // Git: Fixing a broken deploy (SEQ_017)
    { key: "F_DEPLOY_01", type: "PHRASE", content: "Check logs first. Don’t guess.", description: "Guessing is expensive." },
    { key: "F_DEPLOY_02", type: "PHRASE", content: "Confirm: is it build, runtime, or config?", description: "Categorize the failure." },
    { key: "F_DEPLOY_03", type: "PHRASE", content: "Rollback if users are blocked.", description: "Stability > pride." },
    { key: "F_DEPLOY_04", type: "PHRASE", content: "Reproduce locally with the same env vars.", description: "Same inputs, same outputs." },
    { key: "F_DEPLOY_05", type: "PHRASE", content: "Patch + postmortem: what broke, why, prevention.", description: "Make it a one-time pain." },

    // Cooking: Omelet (SEQ_018)
    { key: "F_OMELET_01", type: "PHRASE", content: "Beat eggs with salt; rest 2 minutes.", description: "Salt dissolves, texture improves." },
    { key: "F_OMELET_02", type: "PHRASE", content: "Low heat + butter until it foams.", description: "Patience is the ingredient." },
    { key: "F_OMELET_03", type: "PHRASE", content: "Stir gently, then stop stirring.", description: "Curds, then set." },
    { key: "F_OMELET_04", type: "PHRASE", content: "Fold when top is slightly wet.", description: "Carryover heat finishes." },
    { key: "F_OMELET_05", type: "PHRASE", content: "Plate immediately.", description: "Omelets punish hesitation." },

    // How-to: Negotiate salary (SEQ_019)
    { key: "F_NEG_01", type: "PHRASE", content: "Get the range first (ask directly).", description: "No range = you’re blindfolded." },
    { key: "F_NEG_02", type: "PHRASE", content: "Anchor with evidence: market comps + impact.", description: "Feelings don’t pay." },
    { key: "F_NEG_03", type: "PHRASE", content: "Ask for the full package: base, bonus, equity, benefits.", description: "Total comp is the truth." },
    { key: "F_NEG_04", type: "PHRASE", content: "Pause after your ask.", description: "Let silence do work." },
    { key: "F_NEG_05", type: "PHRASE", content: "If they can’t move salary: negotiate scope or review date.", description: "Get a lever." },

    // Music: Pop chord loop (SEQ_020)
    { key: "F_POP_01", type: "PHRASE", content: "Pick a key you can sing comfortably.", description: "Your voice is the instrument." },
    { key: "F_POP_02", type: "PHRASE", content: "Try I–V–vi–IV.", description: "It’s everywhere because it works." },
    { key: "F_POP_03", type: "PHRASE", content: "Write a hook over the vi chord.", description: "Emotion lives there." },
    { key: "F_POP_04", type: "PHRASE", content: "Use a simple rhythm; leave space.", description: "Clarity > complexity." },
    { key: "F_POP_05", type: "PHRASE", content: "Record a rough demo immediately.", description: "Don’t trust memory." },

    // Study: Exam week (SEQ_021)
    { key: "F_EXAM_01", type: "PHRASE", content: "List topics. Rank by weight + weakness.", description: "Brutal honesty." },
    { key: "F_EXAM_02", type: "PHRASE", content: "Do practice questions daily.", description: "Reading isn’t studying." },
    { key: "F_EXAM_03", type: "PHRASE", content: "Make a ‘mistake log’ and revisit it.", description: "Your errors are the syllabus." },
    { key: "F_EXAM_04", type: "PHRASE", content: "Sleep 7–8h. No all-nighters.", description: "All-nighters are fake productivity." },
    { key: "F_EXAM_05", type: "PHRASE", content: "Day before: light review + early bedtime.", description: "Arrive sharp." },

    // Mindset: Handling rejection (SEQ_022)
    { key: "F_REJ_01", type: "PHRASE", content: "Feel it for 10 minutes—set a timer.", description: "Contain the spiral." },
    { key: "F_REJ_02", type: "PHRASE", content: "Extract one lesson (only one).", description: "Don’t write a tragedy." },
    { key: "F_REJ_03", type: "PHRASE", content: "Send one follow-up if appropriate, then stop.", description: "Dignity matters." },
    { key: "F_REJ_04", type: "PHRASE", content: "Do a small win task immediately.", description: "Regain momentum." },

    // Coffee: Better espresso workflow (SEQ_023)
    { key: "F_ESP_01", type: "PHRASE", content: "Use fresh beans; stale beans = flat shots.", description: "Start with good input." },
    { key: "F_ESP_02", type: "PHRASE", content: "Grind finer until bitterness shows, then step back.", description: "Find the edge." },
    { key: "F_ESP_03", type: "PHRASE", content: "Dose consistently; weigh it.", description: "Stop eyeballing." },
    { key: "F_ESP_04", type: "PHRASE", content: "Tamp level. Uneven tamp = channeling.", description: "Physics doesn’t care." },
    { key: "F_ESP_05", type: "PHRASE", content: "Taste, adjust one variable at a time.", description: "Scientific method, but tasty." },

    // Career: Great 1:1 with manager (SEQ_024)
    { key: "F_1ON1_01", type: "PHRASE", content: "Bring an agenda: wins, blockers, asks.", description: "Don’t improvise your career." },
    { key: "F_1ON1_02", type: "PHRASE", content: "Ask for feedback on one recent piece of work.", description: "Make it specific." },
    { key: "F_1ON1_03", type: "PHRASE", content: "Share what you want next (scope, promotion path).", description: "Clarity beats hope." },
    { key: "F_1ON1_04", type: "PHRASE", content: "End by confirming next actions.", description: "No fuzzy endings." },

    // Home: Deep clean kitchen (SEQ_025)
    { key: "F_CLEAN_01", type: "PHRASE", content: "Clear counters completely.", description: "Surface area = speed." },
    { key: "F_CLEAN_02", type: "PHRASE", content: "Soak greasy parts first (filters, trays).", description: "Let chemistry work." },
    { key: "F_CLEAN_03", type: "PHRASE", content: "Top to bottom: shelves, backsplash, counters.", description: "Gravity is undefeated." },
    { key: "F_CLEAN_04", type: "PHRASE", content: "Finish with floor last.", description: "Don’t re-dirty it." },

    // Writing: Publish an article (SEQ_026)
    { key: "F_WRITE_01", type: "PHRASE", content: "Draft ugly. Editing is where intelligence shows.", description: "Perfectionism is procrastination." },
    { key: "F_WRITE_02", type: "PHRASE", content: "One core claim per section.", description: "Don’t ramble." },
    { key: "F_WRITE_03", type: "PHRASE", content: "Add one real example and one counterpoint.", description: "Build trust." },
    { key: "F_WRITE_04", type: "PHRASE", content: "Cut 20% of words.", description: "Readers feel it." },
    { key: "F_WRITE_05", type: "PHRASE", content: "Publish, then iterate from feedback.", description: "Shipping beats fantasizing." },

    // Meditation: 5-minute reset (SEQ_027)
    { key: "F_MED_01", type: "PHRASE", content: "Sit comfortably; set a 5-minute timer.", description: "Short and consistent wins." },
    { key: "F_MED_02", type: "PHRASE", content: "Focus on the breath at the nose or belly.", description: "Pick one anchor." },
    { key: "F_MED_03", type: "PHRASE", content: "When your mind wanders, label it ‘thinking’.", description: "No drama." },
    { key: "F_MED_04", type: "PHRASE", content: "Return to breath. Repeat.", description: "That’s the whole practice." },

    // Language: Daily Dutch mini-plan (SEQ_028)
    { key: "F_DUTCH_01", type: "PHRASE", content: "Learn 10 words tied to your day (work, travel, food).", description: "Relevance = memory." },
    { key: "F_DUTCH_02", type: "PHRASE", content: "Write 3 tiny sentences using them.", description: "Use, don’t hoard." },
    { key: "F_DUTCH_03", type: "PHRASE", content: "Say them out loud twice.", description: "Pronunciation needs reps." },
    { key: "F_DUTCH_04", type: "PHRASE", content: "Review yesterday’s words for 2 minutes.", description: "Spaced repetition, light version." },

    // Dev: Debugging checklist (SEQ_029)
    { key: "F_DEBUG_01", type: "PHRASE", content: "Reproduce consistently.", description: "If it’s random, you’re not done." },
    { key: "F_DEBUG_02", type: "PHRASE", content: "Reduce: smallest failing case.", description: "Shrink the monster." },
    { key: "F_DEBUG_03", type: "PHRASE", content: "Inspect inputs and assumptions.", description: "Bugs hide in ‘obvious’." },
    { key: "F_DEBUG_04", type: "PHRASE", content: "Add logs or breakpoints at boundaries.", description: "Find where truth changes." },
    { key: "F_DEBUG_05", type: "PHRASE", content: "Write a test that would’ve caught it.", description: "Lock it down." },

    // Health: Better sleep (SEQ_030)
    { key: "F_SLEEP_01", type: "PHRASE", content: "Same wake-up time daily (yes, weekends too).", description: "Circadian rhythm loves consistency." },
    { key: "F_SLEEP_02", type: "PHRASE", content: "No caffeine 8 hours before bed.", description: "Caffeine lingers." },
    { key: "F_SLEEP_03", type: "PHRASE", content: "Dim lights 60 minutes before sleep.", description: "Signal night mode." },
    { key: "F_SLEEP_04", type: "PHRASE", content: "Keep bedroom cool and dark.", description: "Sleep likes caves." },
    { key: "F_SLEEP_05", type: "PHRASE", content: "If awake > 20 minutes, get up and reset.", description: "Don’t train insomnia." },

    // Cooking: Stir-fry basics (SEQ_031)
    { key: "F_STIR_01", type: "PHRASE", content: "Prep everything before heat.", description: "Stir-fry is fast." },
    { key: "F_STIR_02", type: "PHRASE", content: "High heat, oil in, protein first.", description: "Sear, don’t steam." },
    { key: "F_STIR_03", type: "PHRASE", content: "Veg in order: hard → soft.", description: "Carrot before spinach." },
    { key: "F_STIR_04", type: "PHRASE", content: "Sauce at the end; toss 30 seconds.", description: "Gloss, not soup." },
    { key: "F_STIR_05", type: "PHRASE", content: "Serve immediately.", description: "Crisp dies quickly." },

    // Travel: “Airport calm” flow (SEQ_032)
    { key: "F_AIR_01", type: "PHRASE", content: "Check in online and save the boarding pass.", description: "Reduce surprises." },
    { key: "F_AIR_02", type: "PHRASE", content: "Pack liquids and laptop accessibly.", description: "Security speedrun." },
    { key: "F_AIR_03", type: "PHRASE", content: "Arrive early enough to be bored, not stressed.", description: "Bored is the goal." },
    { key: "F_AIR_04", type: "PHRASE", content: "Refill water after security.", description: "Airplanes dehydrate you." },
    { key: "F_AIR_05", type: "PHRASE", content: "At gate: confirm boarding group + final call time.", description: "Don’t miss it while scrolling." },

    // How-to: Cold email that gets replies (SEQ_033)
    { key: "F_EMAIL_01", type: "PHRASE", content: "Subject: specific and short (≤ 6 words).", description: "Earn the open." },
    { key: "F_EMAIL_02", type: "PHRASE", content: "Line 1: why them (real reason).", description: "No fake flattery." },
    { key: "F_EMAIL_03", type: "PHRASE", content: "Line 2: what you want (one ask).", description: "Clarity wins." },
    { key: "F_EMAIL_04", type: "PHRASE", content: "Line 3: make it easy (15-min call / two slots).", description: "Lower the friction." },
    { key: "F_EMAIL_05", type: "PHRASE", content: "Close politely; follow up once after 3–5 days.", description: "One follow-up, not seven." },

    // Relationships: Good first date flow (SEQ_034)
    { key: "F_DATE_01", type: "PHRASE", content: "Pick a simple place: coffee or a quiet bar.", description: "A date isn’t a performance." },
    { key: "F_DATE_02", type: "PHRASE", content: "Show curiosity: ask, then listen.", description: "Don’t monologue." },
    { key: "F_DATE_03", type: "PHRASE", content: "Share one honest story, not a résumé.", description: "Vulnerability beats flexing." },
    { key: "F_DATE_04", type: "PHRASE", content: "End on a high note; don’t drag it.", description: "Leave them wanting more." },
    { key: "F_DATE_05", type: "PHRASE", content: "Text after: specific + warm + simple.", description: "No games." },

    // Product: Ship a beta in a week (SEQ_035)
    { key: "F_BETA_01", type: "PHRASE", content: "Define ONE core loop users can complete.", description: "Everything else is garnish." },
    { key: "F_BETA_02", type: "PHRASE", content: "Cut scope until it’s slightly embarrassing.", description: "That’s the right size." },
    { key: "F_BETA_03", type: "PHRASE", content: "Instrument: signup → action → return.", description: "Measure the loop." },
    { key: "F_BETA_04", type: "PHRASE", content: "Put feedback inside the product.", description: "Don’t rely on users emailing you." },
    { key: "F_BETA_05", type: "PHRASE", content: "Ship. Then patch daily.", description: "Momentum is a feature." },

    // History/cycle: Roman Republic crisis arc (SEQ_036) (non-academic, narrative)
    { key: "F_ROMEC_01", type: "PHRASE", content: "A republic works—until ambition outgrows rules.", description: "Systems crack under ego." },
    { key: "F_ROMEC_02", type: "PHRASE", content: "Generals become celebrities with loyal armies.", description: "Loyalty shifts from state to person." },
    { key: "F_ROMEC_03", type: "PHRASE", content: "Politics turns into survival, not service.", description: "Compromise starts to look like weakness." },
    { key: "F_ROMEC_04", type: "PHRASE", content: "Violence enters the forum—literally.", description: "When norms die, outcomes get ugly." },
    { key: "F_ROMEC_05", type: "PHRASE", content: "Order returns, but the ‘republic’ is mostly a costume.", description: "Titles change slower than reality." },

    // Dev: Writing good commit messages (SEQ_037)
    { key: "F_COMMIT_01", type: "PHRASE", content: "Start with a verb: Add, Fix, Remove, Refactor.", description: "Make intent obvious." },
    { key: "F_COMMIT_02", type: "PHRASE", content: "Limit to one change per commit.", description: "Mixed commits are debugging nightmares." },
    { key: "F_COMMIT_03", type: "PHRASE", content: "Explain why in the body if needed.", description: "Code shows what; message shows why." },
    { key: "F_COMMIT_04", type: "PHRASE", content: "Reference tickets or issues when applicable.", description: "Traceability matters." },

    // Cooking: Simple curry (SEQ_038)
    { key: "F_CURRY_01", type: "PHRASE", content: "Sauté onion until sweet, not burned.", description: "Base flavor." },
    { key: "F_CURRY_02", type: "PHRASE", content: "Toast spices briefly (curry powder/garam masala).", description: "Wake them up." },
    { key: "F_CURRY_03", type: "PHRASE", content: "Add protein + salt, then tomatoes/coconut milk.", description: "Build the sauce." },
    { key: "F_CURRY_04", type: "PHRASE", content: "Simmer until thick; adjust acid (lime).", description: "Balance." },
    { key: "F_CURRY_05", type: "PHRASE", content: "Serve with rice and something fresh.", description: "Cilantro, yogurt, cucumber." },

    // Mind: Stop procrastinating (SEQ_039)
    { key: "F_PRO_01", type: "PHRASE", content: "Name the next action in 10 words.", description: "Vague tasks breed avoidance." },
    { key: "F_PRO_02", type: "PHRASE", content: "Set a 10-minute timer and start.", description: "You’re not marrying the task." },
    { key: "F_PRO_03", type: "PHRASE", content: "Remove one friction (tabs, phone, clutter).", description: "Make good behavior easy." },
    { key: "F_PRO_04", type: "PHRASE", content: "Stop at a ‘good stopping point’ you can resume.", description: "Leave breadcrumbs." },

    // How-to: Plan a trip cheaply (SEQ_040)
    { key: "F_CHEAP_01", type: "PHRASE", content: "Pick dates first; flexibility is money.", description: "Weekdays are cheaper." },
    { key: "F_CHEAP_02", type: "PHRASE", content: "Choose 1–2 must-dos; cut the rest.", description: "Overplanning is expensive." },
    { key: "F_CHEAP_03", type: "PHRASE", content: "Stay near public transit, not landmarks.", description: "Transit beats ‘central’." },
    { key: "F_CHEAP_04", type: "PHRASE", content: "Eat one ‘nice meal’ per day max.", description: "Balance budget and joy." },
    { key: "F_CHEAP_05", type: "PHRASE", content: "Use walking as entertainment.", description: "Best free activity." },

    // Work: Handling meetings (SEQ_041)
    { key: "F_MEET_01", type: "PHRASE", content: "No agenda = decline or request agenda.", description: "Protect focus." },
    { key: "F_MEET_02", type: "PHRASE", content: "Timebox: 25 or 50 minutes.", description: "Parkinson’s law is real." },
    { key: "F_MEET_03", type: "PHRASE", content: "End with decisions + owners + deadlines.", description: "Otherwise it’s theater." },
    { key: "F_MEET_04", type: "PHRASE", content: "Write notes where everyone can see.", description: "Transparency kills confusion." },

    // Creativity: Write a poem (SEQ_042)
    { key: "F_POEM_01", type: "PHRASE", content: "Start with an image, not an idea.", description: "Show the reader something." },
    { key: "F_POEM_02", type: "PHRASE", content: "Use one surprising verb.", description: "Energy lives in verbs." },
    { key: "F_POEM_03", type: "PHRASE", content: "Cut clichés mercilessly.", description: "If you’ve heard it, delete it." },
    { key: "F_POEM_04", type: "PHRASE", content: "End with a turn—small but sharp.", description: "Leave a sting." },

    // DevOps: Monitoring basics (SEQ_043)
    { key: "F_MON_01", type: "PHRASE", content: "Track golden signals: latency, traffic, errors, saturation.", description: "Start here, always." },
    { key: "F_MON_02", type: "PHRASE", content: "Alert on symptoms, not causes.", description: "Avoid alert spam." },
    { key: "F_MON_03", type: "PHRASE", content: "Add dashboards per user journey.", description: "Login, create, publish, view." },
    { key: "F_MON_04", type: "PHRASE", content: "Review alerts monthly and prune.", description: "Dead alerts waste lives." },

    // Social: Hosting friends (SEQ_044)
    { key: "F_HOST_01", type: "PHRASE", content: "Keep food simple: one main, one side, one snack.", description: "No chef cosplay." },
    { key: "F_HOST_02", type: "PHRASE", content: "Put drinks accessible; reduce asking.", description: "People relax when they can self-serve." },
    { key: "F_HOST_03", type: "PHRASE", content: "Have one light activity (cards, playlist, walk).", description: "Silence becomes comfortable." },
    { key: "F_HOST_04", type: "PHRASE", content: "End clean-up fast: dishwasher + trash, done.", description: "Don’t punish yourself." },

    // Music: Practice routine (SEQ_045)
    { key: "F_MPRAC_01", type: "PHRASE", content: "Warm up 5 minutes (scales/arpeggios).", description: "Hands + ears wake up." },
    { key: "F_MPRAC_02", type: "PHRASE", content: "Pick one hard bar and loop it slowly.", description: "Slow is smooth." },
    { key: "F_MPRAC_03", type: "PHRASE", content: "Record yourself once per session.", description: "Truth serum." },
    { key: "F_MPRAC_04", type: "PHRASE", content: "End by playing something fun.", description: "Protect motivation." },

    // Wellness: Simple meal prep (SEQ_046)
    { key: "F_MEALPREP_01", type: "PHRASE", content: "Cook one protein (chicken, tofu, beans).", description: "Base building block." },
    { key: "F_MEALPREP_02", type: "PHRASE", content: "Cook one carb (rice, potatoes, pasta).", description: "Energy." },
    { key: "F_MEALPREP_03", type: "PHRASE", content: "Prepare two vegetables.", description: "Color = nutrients." },
    { key: "F_MEALPREP_04", type: "PHRASE", content: "Make one sauce/dressing.", description: "Sauce prevents boredom." },
    { key: "F_MEALPREP_05", type: "PHRASE", content: "Assemble 3–5 boxes, label dates.", description: "Future-you eats well." },

    // Habit: Weekly review (SEQ_047)
    { key: "F_WEEK_01", type: "PHRASE", content: "List wins (even small ones).", description: "Build momentum." },
    { key: "F_WEEK_02", type: "PHRASE", content: "List misses without self-hate.", description: "Data, not identity." },
    { key: "F_WEEK_03", type: "PHRASE", content: "Pick next week’s 3 priorities.", description: "Three is a magic number." },
    { key: "F_WEEK_04", type: "PHRASE", content: "Schedule the hard thing first.", description: "Courage in calendar form." },

    // Tech: API design checklist (SEQ_048)
    { key: "F_API_01", type: "PHRASE", content: "Resource names should be nouns, not verbs.", description: "/users not /getUser" },
    { key: "F_API_02", type: "PHRASE", content: "Use consistent status codes and error format.", description: "Clients love predictability." },
    { key: "F_API_03", type: "PHRASE", content: "Pagination from day one.", description: "Success creates scale." },
    { key: "F_API_04", type: "PHRASE", content: "Idempotency for writes where possible.", description: "Retries happen." },
    { key: "F_API_05", type: "PHRASE", content: "Version only when you must.", description: "Don’t version for fun." },

    // Creativity: Storyboard a short video (SEQ_049)
    { key: "F_STORY_01", type: "PHRASE", content: "Write the ‘one sentence’ story.", description: "If you can’t, your video is fog." },
    { key: "F_STORY_02", type: "PHRASE", content: "Break into 6–10 beats (scenes).", description: "Frames = beats." },
    { key: "F_STORY_03", type: "PHRASE", content: "Each beat needs conflict or change.", description: "Movement keeps attention." },
    { key: "F_STORY_04", type: "PHRASE", content: "Add one visual motif (color/object) across beats.", description: "Cohesion for free." },
    { key: "F_STORY_05", type: "PHRASE", content: "End with a punchline or payoff.", description: "Earn the last second." },

    // Personal: Move to a new city (SEQ_050)
    { key: "F_CITY_01", type: "PHRASE", content: "Choose your non-negotiables: budget, commute, vibe.", description: "Stop ‘maybe’-ing." },
    { key: "F_CITY_02", type: "PHRASE", content: "Visit neighborhoods at day and night.", description: "Same street, different reality." },
    { key: "F_CITY_03", type: "PHRASE", content: "Set up essentials first: bank, doctor, transport.", description: "Reduce future friction." },
    { key: "F_CITY_04", type: "PHRASE", content: "Find your ‘third place’: café, gym, library.", description: "Community accelerates." },
    { key: "F_CITY_05", type: "PHRASE", content: "Make 3 recurring plans per week.", description: "Routine beats loneliness." },
  ],

  sequences: [
    {
      key: "SEQ_001",
      title: "Amsterdam in 1 Day (No Rush)",
      description: "A calm, realistic walk-and-see itinerary that doesn’t try to ‘speedrun’ the city.",
      url: "https://example.com/sequences/amsterdam-1-day",
      visibility: "PUBLIC",
      userEmail: "noor@example.com",
      frameOrder: ["F_AMS_DAY_01","F_AMS_DAY_02","F_AMS_DAY_03","F_AMS_DAY_04","F_AMS_DAY_05","F_AMS_DAY_06","F_AMS_DAY_07"],
    },
    {
      key: "SEQ_002",
      title: "Paris in 48 Hours (The Human Version)",
      description: "Two days in Paris with sane choices and time to breathe.",
      url: "https://example.com/sequences/paris-48h",
      visibility: "PUBLIC",
      userEmail: "noor@example.com",
      frameOrder: ["F_PAR_48_01","F_PAR_48_02","F_PAR_48_03","F_PAR_48_04","F_PAR_48_05","F_PAR_48_06","F_PAR_48_07"],
    },
    {
      key: "SEQ_003",
      title: "Clean Git PR Workflow",
      description: "A practical sequence for shipping code changes without chaos.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "kai@example.com",
      frameOrder: ["F_GIT_PR_01","F_GIT_PR_02","F_GIT_PR_03","F_GIT_PR_04","F_GIT_PR_05","F_GIT_PR_06","F_GIT_PR_07"],
    },
    {
      key: "SEQ_004",
      title: "Morning Reset Routine (30 Minutes)",
      description: "A simple routine to start your day with energy and focus—without pretending you’re a monk.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_AM_ROUTINE_01","F_AM_ROUTINE_02","F_AM_ROUTINE_03","F_AM_ROUTINE_04","F_AM_ROUTINE_05","F_AM_ROUTINE_06"],
    },
    {
      key: "SEQ_005",
      title: "Pasta That Tastes Like You Know What You’re Doing",
      description: "A minimal pasta method that upgrades flavor with tiny moves.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "kai@example.com",
      frameOrder: ["F_PASTA_01","F_PASTA_02","F_PASTA_03","F_PASTA_04","F_PASTA_05","F_PASTA_06"],
    },
    {
      key: "SEQ_006",
      title: "12-Bar Blues (Instant Jam Formula)",
      description: "A friendly chord progression you can loop forever.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "kai@example.com",
      frameOrder: ["F_BLUES_01","F_BLUES_02","F_BLUES_03","F_BLUES_04","F_BLUES_05","F_BLUES_06"],
    },
    {
      key: "SEQ_007",
      title: "Write a Haiku That Doesn’t Feel Fake",
      description: "A short craft sequence to produce clean, vivid haiku.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "noor@example.com",
      frameOrder: ["F_HAIKU_01","F_HAIKU_02","F_HAIKU_03","F_HAIKU_04","F_HAIKU_05"],
    },
    {
      key: "SEQ_008",
      title: "Learn Anything with Spaced Repetition (SRS)",
      description: "Turn knowledge into memory with a lightweight daily system.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_SRS_01","F_SRS_02","F_SRS_03","F_SRS_04","F_SRS_05"],
    },
    {
      key: "SEQ_009",
      title: "Password Hygiene (Stop Getting Owned)",
      description: "A blunt, modern security checklist that actually reduces risk.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_PASS_01","F_PASS_02","F_PASS_03","F_PASS_04","F_PASS_05"],
    },
    {
      key: "SEQ_010",
      title: "Beginner Strength Loop (Full Body)",
      description: "A simple strength routine you can repeat 2–3x/week without injury cosplay.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "noor@example.com",
      frameOrder: ["F_STR_01","F_STR_02","F_STR_03","F_STR_04","F_STR_05","F_STR_06"],
    },

    // 11–15
    { key: "SEQ_011", title: "2-Minute Rule Cleanup (Mental Declutter)", description: "Stop carrying tiny tasks in your head all day.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_2MIN_01","F_2MIN_02","F_2MIN_03","F_2MIN_04"] },
    { key: "SEQ_012", title: "No-Knead Bread (Time Does the Work)", description: "Bread for people who don’t want a workout.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_BREAD_01","F_BREAD_02","F_BREAD_03","F_BREAD_04","F_BREAD_05"] },
    { key: "SEQ_013", title: "Public Speaking: Don’t Ramble, Don’t Panic", description: "A repeatable prep routine for sharper speaking.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_SPEAK_01","F_SPEAK_02","F_SPEAK_03","F_SPEAK_04","F_SPEAK_05"] },
    { key: "SEQ_014", title: "Budget Baseline (Simple but Real)", description: "A no-drama budget setup that you’ll actually maintain.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_BUDGET_01","F_BUDGET_02","F_BUDGET_03","F_BUDGET_04","F_BUDGET_05"] },
    { key: "SEQ_015", title: "Gratitude Steps (Practical, Not Cheesy)", description: "A short reflective sequence that lands in action.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_GRAT_01","F_GRAT_02","F_GRAT_03","F_GRAT_04"] },

    // 16–20
    { key: "SEQ_016", title: "Rome Essentials (One-Day Walk)", description: "See the highlights without turning yourself into dust.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_ROME_01","F_ROME_02","F_ROME_03","F_ROME_04","F_ROME_05"] },
    { key: "SEQ_017", title: "Fix a Broken Deploy (Fast, Calm, Correct)", description: "A triage loop for production incidents.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_DEPLOY_01","F_DEPLOY_02","F_DEPLOY_03","F_DEPLOY_04","F_DEPLOY_05"] },
    { key: "SEQ_018", title: "Omelet Basics (Soft, Not Sad)", description: "A tiny cooking sequence with big payoff.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_OMELET_01","F_OMELET_02","F_OMELET_03","F_OMELET_04","F_OMELET_05"] },
    { key: "SEQ_019", title: "Negotiate Salary (Without Being Weird)", description: "A practical sequence to ask for more money with evidence.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_NEG_01","F_NEG_02","F_NEG_03","F_NEG_04","F_NEG_05"] },
    { key: "SEQ_020", title: "Pop Chord Loop: I–V–vi–IV (Write a Hook)", description: "A songwriting micro-sequence you can repeat.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_POP_01","F_POP_02","F_POP_03","F_POP_04","F_POP_05"] },

    // 21–25
    { key: "SEQ_021", title: "Exam Week Plan (Stop Cramming Wrong)", description: "A plan built on practice, not panic.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_EXAM_01","F_EXAM_02","F_EXAM_03","F_EXAM_04","F_EXAM_05"] },
    { key: "SEQ_022", title: "Handle Rejection (No Spiral)", description: "Feel it, learn once, move forward.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_REJ_01","F_REJ_02","F_REJ_03","F_REJ_04"] },
    { key: "SEQ_023", title: "Better Espresso at Home (One Variable at a Time)", description: "A small workflow that improves taste fast.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_ESP_01","F_ESP_02","F_ESP_03","F_ESP_04","F_ESP_05"] },
    { key: "SEQ_024", title: "A Great 1:1 With Your Manager", description: "A simple structure that makes meetings useful.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_1ON1_01","F_1ON1_02","F_1ON1_03","F_1ON1_04"] },
    { key: "SEQ_025", title: "Deep Clean Your Kitchen (Without Hating Life)", description: "A short, ruthless cleaning sequence.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_CLEAN_01","F_CLEAN_02","F_CLEAN_03","F_CLEAN_04"] },

    // 26–30
    { key: "SEQ_026", title: "Publish an Article (Draft → Cut → Ship)", description: "A writing loop designed for output, not perfection.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_WRITE_01","F_WRITE_02","F_WRITE_03","F_WRITE_04","F_WRITE_05"] },
    { key: "SEQ_027", title: "5-Minute Meditation Reset", description: "A tiny practice you can actually stick to.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_MED_01","F_MED_02","F_MED_03","F_MED_04"] },
    { key: "SEQ_028", title: "Daily Dutch Mini-Plan", description: "Small daily steps to improve faster than you think.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_DUTCH_01","F_DUTCH_02","F_DUTCH_03","F_DUTCH_04"] },
    { key: "SEQ_029", title: "Debugging Checklist (Stop Guessing)", description: "A practical loop that reduces wasted hours.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_DEBUG_01","F_DEBUG_02","F_DEBUG_03","F_DEBUG_04","F_DEBUG_05"] },
    { key: "SEQ_030", title: "Sleep Better (No Magic, Just Rules)", description: "A blunt sleep sequence that works if you do it.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_SLEEP_01","F_SLEEP_02","F_SLEEP_03","F_SLEEP_04","F_SLEEP_05"] },

    // 31–35
    { key: "SEQ_031", title: "Stir-Fry Basics (Fast, Hot, Crisp)", description: "A cooking sequence that makes weeknights easy.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_STIR_01","F_STIR_02","F_STIR_03","F_STIR_04","F_STIR_05"] },
    { key: "SEQ_032", title: "Airport Calm Flow (Travel Without Chaos)", description: "A sequence designed to prevent last-minute stress.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_AIR_01","F_AIR_02","F_AIR_03","F_AIR_04","F_AIR_05"] },
    { key: "SEQ_033", title: "Cold Email That Gets Replies", description: "A minimal template that respects people’s time.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_EMAIL_01","F_EMAIL_02","F_EMAIL_03","F_EMAIL_04","F_EMAIL_05"] },
    { key: "SEQ_034", title: "First Date Flow (Human, Not a Performance)", description: "Simple steps to stay present and connect.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_DATE_01","F_DATE_02","F_DATE_03","F_DATE_04","F_DATE_05"] },
    { key: "SEQ_035", title: "Ship a Beta in a Week", description: "A scope-cutting sequence for actually launching.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_BETA_01","F_BETA_02","F_BETA_03","F_BETA_04","F_BETA_05"] },

    // 36–40
    { key: "SEQ_036", title: "Rome: How Republics Break (A Story Arc)", description: "A short narrative cycle showing how systems decay under ambition.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_ROMEC_01","F_ROMEC_02","F_ROMEC_03","F_ROMEC_04","F_ROMEC_05"] },
    { key: "SEQ_037", title: "Commit Messages That Don’t Suck", description: "A small sequence that makes git history readable.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_COMMIT_01","F_COMMIT_02","F_COMMIT_03","F_COMMIT_04"] },
    { key: "SEQ_038", title: "Simple Curry (Flavor Without Fear)", description: "A weeknight curry sequence that’s hard to mess up.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_CURRY_01","F_CURRY_02","F_CURRY_03","F_CURRY_04","F_CURRY_05"] },
    { key: "SEQ_039", title: "Stop Procrastinating (Start Smaller)", description: "A short loop to break the avoidance pattern.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_PRO_01","F_PRO_02","F_PRO_03","F_PRO_04"] },
    { key: "SEQ_040", title: "Plan a Trip Cheaply (Still Fun)", description: "Cut costs by simplifying choices, not joy.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_CHEAP_01","F_CHEAP_02","F_CHEAP_03","F_CHEAP_04","F_CHEAP_05"] },

    // 41–45
    { key: "SEQ_041", title: "Meetings That Don’t Waste Your Life", description: "A sequence to make meetings shorter and useful.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_MEET_01","F_MEET_02","F_MEET_03","F_MEET_04"] },
    { key: "SEQ_042", title: "Write a Poem (Without Clichés)", description: "A small creative sequence for sharper poetry.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_POEM_01","F_POEM_02","F_POEM_03","F_POEM_04"] },
    { key: "SEQ_043", title: "Monitoring Basics (Golden Signals First)", description: "Start monitoring the right things before you drown in charts.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_MON_01","F_MON_02","F_MON_03","F_MON_04"] },
    { key: "SEQ_044", title: "Host Friends (Relaxed, Not Perfect)", description: "A sequence to host without stress spirals.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_HOST_01","F_HOST_02","F_HOST_03","F_HOST_04"] },
    { key: "SEQ_045", title: "Music Practice Routine (Progress Without Burnout)", description: "A simple practice loop built for consistency.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_MPRAC_01","F_MPRAC_02","F_MPRAC_03","F_MPRAC_04"] },

    // 46–50
    { key: "SEQ_046", title: "Simple Meal Prep (5 Boxes, Zero Drama)", description: "A basic meal prep workflow for busy weeks.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_MEALPREP_01","F_MEALPREP_02","F_MEALPREP_03","F_MEALPREP_04","F_MEALPREP_05"] },
    { key: "SEQ_047", title: "Weekly Review (Get Your Life Back)", description: "A short review sequence to stay intentional.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_WEEK_01","F_WEEK_02","F_WEEK_03","F_WEEK_04"] },
    { key: "SEQ_048", title: "API Design Checklist (Client-Friendly)", description: "A sequence of principles for sane APIs.", url: null, visibility: "PUBLIC", userEmail: "kai@example.com", frameOrder: ["F_API_01","F_API_02","F_API_03","F_API_04","F_API_05"] },
    { key: "SEQ_049", title: "Storyboard a Short Video (6–10 Beats)", description: "Turn an idea into a clean sequence of frames for video.", url: null, visibility: "PUBLIC", userEmail: "noor@example.com", frameOrder: ["F_STORY_01","F_STORY_02","F_STORY_03","F_STORY_04","F_STORY_05"] },
    { key: "SEQ_050", title: "Move to a New City (Don’t Drift)", description: "A practical sequence for settling in and building routine.", url: null, visibility: "PUBLIC", userEmail: "amine@example.com", frameOrder: ["F_CITY_01","F_CITY_02","F_CITY_03","F_CITY_04","F_CITY_05"] },
  ],
};


// weird_creative_sequences.fixture.js
// Drop-in additions: frames + sequences (same format as before)

module.exports = {
  frames: [
    // =========================
    // SEQ_W001 — Survive a Terrible Day (9 frames)
    // =========================
    { key: "F_W_TERRIBLE_01", type: "PHRASE", content: "Name it: “Today is a bad day.”", description: "Not your whole life. Just today." },
    { key: "F_W_TERRIBLE_02", type: "PHRASE", content: "Reduce the mission: eat + drink water + one shower.", description: "Minimum viable human." },
    { key: "F_W_TERRIBLE_03", type: "PHRASE", content: "Delete one obligation (or delay it).", description: "Remove one weight from the bar." },
    { key: "F_W_TERRIBLE_04", type: "PHRASE", content: "Do the ‘2-minute rescue’: clean one tiny area.", description: "Visible order calms your brain." },
    { key: "F_W_TERRIBLE_05", type: "PHRASE", content: "Message one person: “Not great today. Can you talk?”", description: "Connection beats isolation." },
    { key: "F_W_TERRIBLE_06", type: "PHRASE", content: "Move 10 minutes (walk, stretch, anything).", description: "Change your state physically." },
    { key: "F_W_TERRIBLE_07", type: "PHRASE", content: "Do one ‘easy win’ task.", description: "Momentum is medicine." },
    { key: "F_W_TERRIBLE_08", type: "PHRASE", content: "Pick a comfort ritual (tea, music, hot shower).", description: "Signal safety to your body." },
    { key: "F_W_TERRIBLE_09", type: "PHRASE", content: "Early night. Tomorrow gets a fresh roll.", description: "This day doesn’t deserve overtime." },

    // =========================
    // SEQ_W002 — Breakup Recovery: 10-Day Micro-Arc (10 frames)
    // =========================
    { key: "F_W_BREAKUP_01", type: "PHRASE", content: "Day 1: Remove reminders (mute, archive, box items).", description: "You’re not being dramatic. You’re healing." },
    { key: "F_W_BREAKUP_02", type: "PHRASE", content: "Day 2: Tell one friend the unfiltered truth.", description: "No PR version." },
    { key: "F_W_BREAKUP_03", type: "PHRASE", content: "Day 3: Move your body until you feel a bit tired.", description: "Physical fatigue quiets mental noise." },
    { key: "F_W_BREAKUP_04", type: "PHRASE", content: "Day 4: Write the ‘what I ignored’ list.", description: "Clarity is power." },
    { key: "F_W_BREAKUP_05", type: "PHRASE", content: "Day 5: Reclaim a place you avoided.", description: "Take your territory back." },
    { key: "F_W_BREAKUP_06", type: "PHRASE", content: "Day 6: Replace one habit (doomscroll → walk).", description: "Swap the coping mechanism." },
    { key: "F_W_BREAKUP_07", type: "PHRASE", content: "Day 7: Do something social, even short.", description: "Don’t isolate as identity." },
    { key: "F_W_BREAKUP_08", type: "PHRASE", content: "Day 8: Make a tiny future plan.", description: "Prove the future exists." },
    { key: "F_W_BREAKUP_09", type: "PHRASE", content: "Day 9: Write a closure letter (don’t send it).", description: "Closure is internal work." },
    { key: "F_W_BREAKUP_10", type: "PHRASE", content: "Day 10: New rule: you don’t check them anymore.", description: "Freedom starts with boundaries." },

    // =========================
    // SEQ_W003 — The “I’m Stuck” Decision Tree (8 frames)
    // =========================
    { key: "F_W_STUCK_01", type: "PHRASE", content: "Are you tired? If yes: sleep or nap first.", description: "Don’t debug life on low battery." },
    { key: "F_W_STUCK_02", type: "PHRASE", content: "Are you hungry/thirsty? Fix that.", description: "Hunger masquerades as existential dread." },
    { key: "F_W_STUCK_03", type: "PHRASE", content: "Is the task unclear? Write the next action.", description: "Clarity is a cheat code." },
    { key: "F_W_STUCK_04", type: "PHRASE", content: "Is the task scary? Make it smaller by 10×.", description: "Shrink it until it’s non-threatening." },
    { key: "F_W_STUCK_05", type: "PHRASE", content: "Is it boring? Add a constraint or a timer.", description: "Make it a game." },
    { key: "F_W_STUCK_06", type: "PHRASE", content: "Is it lonely? Work near humans or call someone.", description: "Co-presence helps." },
    { key: "F_W_STUCK_07", type: "PHRASE", content: "Start for 10 minutes, then decide to stop or continue.", description: "Starting is the real decision." },
    { key: "F_W_STUCK_08", type: "PHRASE", content: "If still stuck: ask for help with a specific question.", description: "Not “help me,” but “which option is best and why?”" },

    // =========================
    // SEQ_W004 — Anxiety in Public: The 60-Second Protocol (7 frames)
    // =========================
    { key: "F_W_ANX_01", type: "PHRASE", content: "Look for 5 things you can see.", description: "Anchor to the room." },
    { key: "F_W_ANX_02", type: "PHRASE", content: "Feel 2 points of contact (feet on floor, back on chair).", description: "Your body is here." },
    { key: "F_W_ANX_03", type: "PHRASE", content: "Exhale longer than inhale (3 in, 5 out).", description: "Signal ‘safe’ to your nervous system." },
    { key: "F_W_ANX_04", type: "PHRASE", content: "Name it quietly: “This is anxiety, not danger.”", description: "Labeling reduces intensity." },
    { key: "F_W_ANX_05", type: "PHRASE", content: "Relax the jaw and shoulders on purpose.", description: "Your posture feeds your panic." },
    { key: "F_W_ANX_06", type: "PHRASE", content: "Do one tiny action (sip water, step aside, text someone).", description: "Action breaks the loop." },
    { key: "F_W_ANX_07", type: "PHRASE", content: "Return to the moment with one sentence: “I’m okay.”", description: "Simple, not poetic." },

    // =========================
    // SEQ_W005 — Social Confidence: 5 Micro-Moves (6 frames)
    // =========================
    { key: "F_W_SOC_01", type: "PHRASE", content: "Arrive early. It’s easier to join a small room.", description: "Crowds are harder." },
    { key: "F_W_SOC_02", type: "PHRASE", content: "Open with context: “How do you know the host?”", description: "Instant, normal question." },
    { key: "F_W_SOC_03", type: "PHRASE", content: "Use the ‘two follow-ups’ rule before switching topics.", description: "Shows real interest." },
    { key: "F_W_SOC_04", type: "PHRASE", content: "Share one personal detail (small, honest).", description: "Depth invites depth." },
    { key: "F_W_SOC_05", type: "PHRASE", content: "Exit cleanly: “Nice talking—I'm grabbing a drink.”", description: "No awkward fade-out." },
    { key: "F_W_SOC_06", type: "PHRASE", content: "If you connect: propose a tiny next step.", description: "“Want to continue this over coffee sometime?”" },

    // =========================
    // SEQ_W006 — Micro-Story: The Coffee Spill Redemption Arc (8 frames)
    // =========================
    { key: "F_W_SPILL_01", type: "PHRASE", content: "You spill coffee on your shirt. Of course you do.", description: "The universe testing your ego." },
    { key: "F_W_SPILL_02", type: "PHRASE", content: "You freeze for 1 second… then you laugh.", description: "First win: don’t panic." },
    { key: "F_W_SPILL_03", type: "PHRASE", content: "You ask for napkins like a normal human.", description: "Confidence is boring competence." },
    { key: "F_W_SPILL_04", type: "PHRASE", content: "Someone helps. You say thanks properly.", description: "Connection through minor disasters." },
    { key: "F_W_SPILL_05", type: "PHRASE", content: "You decide: ‘I’m not going home.’", description: "The day doesn’t get to win." },
    { key: "F_W_SPILL_06", type: "PHRASE", content: "You keep the meeting/date anyway.", description: "Self-respect > appearance." },
    { key: "F_W_SPILL_07", type: "PHRASE", content: "Later you realize: nobody cared.", description: "Your shame was imaginary." },
    { key: "F_W_SPILL_08", type: "PHRASE", content: "You tell the story like it’s funny (because it is).", description: "Alchemize embarrassment into charm." },

    // =========================
    // SEQ_W007 — The “One-Tab” Internet Diet (7 frames)
    // =========================
    { key: "F_W_TAB_01", type: "PHRASE", content: "Open ONE tab only. Close the rest.", description: "Brutal, effective." },
    { key: "F_W_TAB_02", type: "PHRASE", content: "Write your question before searching.", description: "Intent first." },
    { key: "F_W_TAB_03", type: "PHRASE", content: "If you open a link: close it after 60 seconds or decide to keep.", description: "No endless maybe." },
    { key: "F_W_TAB_04", type: "PHRASE", content: "Use a ‘parking doc’ for links you want later.", description: "Don’t hoard tabs." },
    { key: "F_W_TAB_05", type: "PHRASE", content: "Every time you drift, re-read your question.", description: "Return to purpose." },
    { key: "F_W_TAB_06", type: "PHRASE", content: "Stop when you have ‘enough to act.’", description: "Perfect info is a trap." },
    { key: "F_W_TAB_07", type: "PHRASE", content: "Do one real-world step immediately.", description: "Knowledge must cash out." },

    // =========================
    // SEQ_W008 — “Main Character Morning” (Playful routine) (8 frames)
    // =========================
    { key: "F_W_MC_01", type: "PHRASE", content: "Play one song that makes you feel unstoppable.", description: "No shame." },
    { key: "F_W_MC_02", type: "PHRASE", content: "Open the window like you own the city.", description: "Dramatic on purpose." },
    { key: "F_W_MC_03", type: "PHRASE", content: "Make breakfast like it’s a movie scene.", description: "Plating counts today." },
    { key: "F_W_MC_04", type: "PHRASE", content: "Write the ‘plot’ of your day in 3 lines.", description: "Scene 1, scene 2, finale." },
    { key: "F_W_MC_05", type: "PHRASE", content: "Dress for the version of you who finishes things.", description: "Clothes can be armor." },
    { key: "F_W_MC_06", type: "PHRASE", content: "Walk outside for 5 minutes with posture.", description: "Signal confidence to yourself." },
    { key: "F_W_MC_07", type: "PHRASE", content: "Do one brave action before noon.", description: "Email, call, pitch, publish." },
    { key: "F_W_MC_08", type: "PHRASE", content: "End with a tiny celebration (coffee, note, high-five).", description: "Reward the behavior." },

    // =========================
    // SEQ_W009 — “How to Apologize Like an Adult” (7 frames)
    // =========================
    { key: "F_W_SORRY_01", type: "PHRASE", content: "Say what you did, plainly.", description: "No fog. No excuses." },
    { key: "F_W_SORRY_02", type: "PHRASE", content: "Name the impact on them.", description: "Show you understand the damage." },
    { key: "F_W_SORRY_03", type: "PHRASE", content: "Don’t say “if” or “but.”", description: "Those are apology killers." },
    { key: "F_W_SORRY_04", type: "PHRASE", content: "Own it: “That’s on me.”", description: "Clean accountability." },
    { key: "F_W_SORRY_05", type: "PHRASE", content: "Offer repair: what you’ll do next.", description: "Words need actions." },
    { key: "F_W_SORRY_06", type: "PHRASE", content: "Ask: “What would help?”", description: "Let them define repair." },
    { key: "F_W_SORRY_07", type: "PHRASE", content: "Then shut up and listen.", description: "The hard part." },

    // =========================
    // SEQ_W010 — “The Emotional Weather Report” (6 frames)
    // =========================
    { key: "F_W_WEATHER_01", type: "PHRASE", content: "Name today’s weather: sunny, cloudy, stormy, foggy.", description: "Feelings are climate, not identity." },
    { key: "F_W_WEATHER_02", type: "PHRASE", content: "Forecast: what might trigger rain today?", description: "Meetings, family, deadlines." },
    { key: "F_W_WEATHER_03", type: "PHRASE", content: "Umbrella: what protects you?", description: "Walk, music, boundaries, friend." },
    { key: "F_W_WEATHER_04", type: "PHRASE", content: "Lightning rule: what you won’t do while stormy?", description: "No big decisions. No angry texts." },
    { key: "F_W_WEATHER_05", type: "PHRASE", content: "Sunbreak: one small good thing to schedule.", description: "A meal, a park, a call." },
    { key: "F_W_WEATHER_06", type: "PHRASE", content: "Even storms pass. Check again tonight.", description: "You’re observing, not drowning." },

    // =========================
    // SEQ_W011 — “Tiny Bravery Ladder” (8 frames)
    // =========================
    { key: "F_W_BRAVE_01", type: "PHRASE", content: "Pick one fear you want smaller.", description: "Dating, publishing, conflict, gym." },
    { key: "F_W_BRAVE_02", type: "PHRASE", content: "Make a ladder of 5 steps (easy → hard).", description: "Graduated exposure, human style." },
    { key: "F_W_BRAVE_03", type: "PHRASE", content: "Step 1 today: do the easiest thing.", description: "Ridiculously easy is correct." },
    { key: "F_W_BRAVE_04", type: "PHRASE", content: "Track your anxiety from 1–10 before and after.", description: "Evidence beats imagination." },
    { key: "F_W_BRAVE_05", type: "PHRASE", content: "Repeat Step 1 until it drops by 2 points.", description: "Stay until calmer." },
    { key: "F_W_BRAVE_06", type: "PHRASE", content: "Then go up one step.", description: "Progress by inches." },
    { key: "F_W_BRAVE_07", type: "PHRASE", content: "Reward yourself for doing it, not for perfection.", description: "Train behavior." },
    { key: "F_W_BRAVE_08", type: "PHRASE", content: "When you slip, return to the previous step.", description: "No shame resets." },

    // =========================
    // SEQ_W012 — “How to Stop an Argument Mid-Flight” (7 frames)
    // =========================
    { key: "F_W_ARG_01", type: "PHRASE", content: "Pause. Stop talking for 3 seconds.", description: "Interrupt the escalation." },
    { key: "F_W_ARG_02", type: "PHRASE", content: "Lower your voice, don’t raise it.", description: "Volume is gasoline." },
    { key: "F_W_ARG_03", type: "PHRASE", content: "Say: “I’m getting heated. I want to do this right.”", description: "Name the state." },
    { key: "F_W_ARG_04", type: "PHRASE", content: "Ask: “What’s the real issue underneath?”", description: "Arguments are usually about something else." },
    { key: "F_W_ARG_05", type: "PHRASE", content: "Repeat their point back accurately.", description: "Understanding first." },
    { key: "F_W_ARG_06", type: "PHRASE", content: "Suggest a break if needed: “10 minutes, then continue.”", description: "Not abandonment—reset." },
    { key: "F_W_ARG_07", type: "PHRASE", content: "Restart with one concrete request.", description: "Make it solvable." },

    // =========================
    // SEQ_W013 — “The ‘I’m Overthinking’ Circuit Breaker” (6 frames)
    // =========================
    { key: "F_W_THINK_01", type: "PHRASE", content: "Ask: “Is this a problem or a prediction?”", description: "Overthinking is usually prediction." },
    { key: "F_W_THINK_02", type: "PHRASE", content: "Write the worst-case in one sentence.", description: "Stop it from looping." },
    { key: "F_W_THINK_03", type: "PHRASE", content: "Write the most likely case in one sentence.", description: "Reality check." },
    { key: "F_W_THINK_04", type: "PHRASE", content: "Write one action that improves odds.", description: "Control what you can." },
    { key: "F_W_THINK_05", type: "PHRASE", content: "Set a worry window: 10 minutes, then stop.", description: "Contain the spill." },
    { key: "F_W_THINK_06", type: "PHRASE", content: "Do the action immediately if it’s under 5 minutes.", description: "End the cycle." },

    // =========================
    // SEQ_W014 — “The 9-Frame Hero’s Journey (Tiny Version)” (9 frames)
    // =========================
    { key: "F_W_HERO_01", type: "PHRASE", content: "Ordinary world: you’re bored or stuck.", description: "The baseline." },
    { key: "F_W_HERO_02", type: "PHRASE", content: "Call to adventure: an opportunity appears.", description: "A job, a person, an idea." },
    { key: "F_W_HERO_03", type: "PHRASE", content: "Refusal: you talk yourself out of it.", description: "Classic." },
    { key: "F_W_HERO_04", type: "PHRASE", content: "Mentor: advice, book, friend, or a hard lesson.", description: "A new lens." },
    { key: "F_W_HERO_05", type: "PHRASE", content: "Crossing: you take the first step anyway.", description: "Action begins." },
    { key: "F_W_HERO_06", type: "PHRASE", content: "Tests: it’s harder than expected.", description: "Of course." },
    { key: "F_W_HERO_07", type: "PHRASE", content: "Crisis: you almost quit.", description: "The dip." },
    { key: "F_W_HERO_08", type: "PHRASE", content: "Reward: you learn and level up.", description: "Earned confidence." },
    { key: "F_W_HERO_09", type: "PHRASE", content: "Return: you bring the lesson back to daily life.", description: "Change sticks." },

    // =========================
    // SEQ_W015 — “The Compliment Recipe” (6 frames)
    // =========================
    { key: "F_W_COMP_01", type: "PHRASE", content: "Notice something specific.", description: "Not “you’re cool,” but “your clarity is rare.”" },
    { key: "F_W_COMP_02", type: "PHRASE", content: "Name what it signals about them.", description: "Effort, taste, courage, kindness." },
    { key: "F_W_COMP_03", type: "PHRASE", content: "Say it plainly. No over-explaining.", description: "Don’t drown it in awkwardness." },
    { key: "F_W_COMP_04", type: "PHRASE", content: "Then move on.", description: "Let it land." },
    { key: "F_W_COMP_05", type: "PHRASE", content: "If they reject it, repeat once: “I meant it.”", description: "Don’t argue." },
    { key: "F_W_COMP_06", type: "PHRASE", content: "Use compliments as truth, not currency.", description: "No manipulation." },
  ],

  sequences: [
    {
      key: "SEQ_W001",
      title: "Survive a Terrible Day (Minimum Viable Human)",
      description: "A compassionate, practical sequence for getting through a rough day without making it worse.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_W_TERRIBLE_01","F_W_TERRIBLE_02","F_W_TERRIBLE_03","F_W_TERRIBLE_04","F_W_TERRIBLE_05","F_W_TERRIBLE_06","F_W_TERRIBLE_07","F_W_TERRIBLE_08","F_W_TERRIBLE_09"],
    },
    {
      key: "SEQ_W002",
      title: "Breakup Recovery (10-Day Micro-Arc)",
      description: "A tiny structured arc that turns emotional chaos into steps you can actually do.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "noor@example.com",
      frameOrder: ["F_W_BREAKUP_01","F_W_BREAKUP_02","F_W_BREAKUP_03","F_W_BREAKUP_04","F_W_BREAKUP_05","F_W_BREAKUP_06","F_W_BREAKUP_07","F_W_BREAKUP_08","F_W_BREAKUP_09","F_W_BREAKUP_10"],
    },
    {
      key: "SEQ_W003",
      title: "The “I’m Stuck” Decision Tree",
      description: "A blunt decision tree for when your brain refuses to move.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_W_STUCK_01","F_W_STUCK_02","F_W_STUCK_03","F_W_STUCK_04","F_W_STUCK_05","F_W_STUCK_06","F_W_STUCK_07","F_W_STUCK_08"],
    },
    {
      key: "SEQ_W004",
      title: "Anxiety in Public (60-Second Protocol)",
      description: "A short grounding sequence you can run quietly anywhere.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "noor@example.com",
      frameOrder: ["F_W_ANX_01","F_W_ANX_02","F_W_ANX_03","F_W_ANX_04","F_W_ANX_05","F_W_ANX_06","F_W_ANX_07"],
    },
    {
      key: "SEQ_W005",
      title: "Social Confidence (5 Micro-Moves)",
      description: "Small social moves that reliably create connection without trying too hard.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_W_SOC_01","F_W_SOC_02","F_W_SOC_03","F_W_SOC_04","F_W_SOC_05","F_W_SOC_06"],
    },
    {
      key: "SEQ_W006",
      title: "Micro-Story: The Coffee Spill Redemption Arc",
      description: "A tiny narrative arc that shows how everyday moments can become sequence-stories.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "kai@example.com",
      frameOrder: ["F_W_SPILL_01","F_W_SPILL_02","F_W_SPILL_03","F_W_SPILL_04","F_W_SPILL_05","F_W_SPILL_06","F_W_SPILL_07","F_W_SPILL_08"],
    },
    {
      key: "SEQ_W007",
      title: "The One-Tab Internet Diet",
      description: "A playful constraint that cures ‘research procrastination’ and turns browsing into action.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_W_TAB_01","F_W_TAB_02","F_W_TAB_03","F_W_TAB_04","F_W_TAB_05","F_W_TAB_06","F_W_TAB_07"],
    },
    {
      key: "SEQ_W008",
      title: "Main Character Morning (Playful Routine)",
      description: "A fun routine that tricks your brain into motivation by making the day feel like a story.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "noor@example.com",
      frameOrder: ["F_W_MC_01","F_W_MC_02","F_W_MC_03","F_W_MC_04","F_W_MC_05","F_W_MC_06","F_W_MC_07","F_W_MC_08"],
    },
    {
      key: "SEQ_W009",
      title: "How to Apologize Like an Adult",
      description: "A clean, high-integrity apology framework that actually repairs relationships.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_W_SORRY_01","F_W_SORRY_02","F_W_SORRY_03","F_W_SORRY_04","F_W_SORRY_05","F_W_SORRY_06","F_W_SORRY_07"],
    },
    {
      key: "SEQ_W010",
      title: "The Emotional Weather Report",
      description: "A creative self-check that turns feelings into something you can navigate.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "noor@example.com",
      frameOrder: ["F_W_WEATHER_01","F_W_WEATHER_02","F_W_WEATHER_03","F_W_WEATHER_04","F_W_WEATHER_05","F_W_WEATHER_06"],
    },
    {
      key: "SEQ_W011",
      title: "Tiny Bravery Ladder (Fear → Smaller)",
      description: "A progressive ‘tiny steps’ method for building courage without forcing it.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_W_BRAVE_01","F_W_BRAVE_02","F_W_BRAVE_03","F_W_BRAVE_04","F_W_BRAVE_05","F_W_BRAVE_06","F_W_BRAVE_07","F_W_BRAVE_08"],
    },
    {
      key: "SEQ_W012",
      title: "Stop an Argument Mid-Flight",
      description: "A conflict circuit-breaker sequence for keeping dignity and solving the actual issue.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_W_ARG_01","F_W_ARG_02","F_W_ARG_03","F_W_ARG_04","F_W_ARG_05","F_W_ARG_06","F_W_ARG_07"],
    },
    {
      key: "SEQ_W013",
      title: "Overthinking Circuit Breaker",
      description: "A quick sequence that turns spinning thoughts into one contained action.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "noor@example.com",
      frameOrder: ["F_W_THINK_01","F_W_THINK_02","F_W_THINK_03","F_W_THINK_04","F_W_THINK_05","F_W_THINK_06"],
    },
    {
      key: "SEQ_W014",
      title: "The 9-Frame Hero’s Journey (Tiny Version)",
      description: "A universal story skeleton users can reuse for literally anything: projects, dating, fitness, startups.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "kai@example.com",
      frameOrder: ["F_W_HERO_01","F_W_HERO_02","F_W_HERO_03","F_W_HERO_04","F_W_HERO_05","F_W_HERO_06","F_W_HERO_07","F_W_HERO_08","F_W_HERO_09"],
    },
    {
      key: "SEQ_W015",
      title: "The Compliment Recipe (Specific → Meaning → Exit)",
      description: "A simple script for giving compliments that feel real, not cringe.",
      url: null,
      visibility: "PUBLIC",
      userEmail: "amine@example.com",
      frameOrder: ["F_W_COMP_01","F_W_COMP_02","F_W_COMP_03","F_W_COMP_04","F_W_COMP_05","F_W_COMP_06"],
    },
  ],
};

