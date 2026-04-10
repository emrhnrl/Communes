-- Seed script: 15 sample communes + 15 sample members
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query)

-- ─── 1. Communes ────────────────────────────────────────────────────────────

insert into communes (id, name, description, category, city) values
  ('11111111-0000-0000-0000-000000000001', 'Berlin Trail Runners',        'Weekly trail runs in and around Berlin''s forests and parks.', 'Sports',        'Berlin'),
  ('11111111-0000-0000-0000-000000000002', 'Vegane Köche München',        'Plant-based cooking workshops and potlucks every other Sunday.', 'Food',          'Munich'),
  ('11111111-0000-0000-0000-000000000003', 'Hamburg Board Game Nights',   'Competitive and casual board games in cosy cafés across Hamburg.', 'Gaming',        'Hamburg'),
  ('11111111-0000-0000-0000-000000000004', 'Frankfurt Tech Talks',        'Monthly lightning talks on software, AI, and startups.', 'Technology',    'Frankfurt'),
  ('11111111-0000-0000-0000-000000000005', 'Cologne Street Photography', 'Explore Cologne''s streets through a lens. All skill levels welcome.', 'Photography',  'Cologne'),
  ('11111111-0000-0000-0000-000000000006', 'Stuttgart Cyclists',          'Road and gravel rides departing from Schlossplatz every Saturday.', 'Sports',        'Stuttgart'),
  ('11111111-0000-0000-0000-000000000007', 'Düsseldorf Jazz Circle',      'Live sessions and listening nights celebrating jazz old and new.', 'Music',         'Düsseldorf'),
  ('11111111-0000-0000-0000-000000000008', 'Leipzig Makers Space',        'Hands-on electronics, woodworking, and 3D-printing projects.', 'Technology',    'Leipzig'),
  ('11111111-0000-0000-0000-000000000009', 'Nuremberg Book Club',         'Monthly reads spanning fiction, non-fiction, and translated works.', 'Books',         'Nuremberg'),
  ('11111111-0000-0000-0000-000000000010', 'Bremen Language Exchange',    'Practise German, English, Spanish and more with native speakers.', 'Education',     'Bremen'),
  ('11111111-0000-0000-0000-000000000011', 'Dresden Yoga & Meditation',   'Morning flows and guided meditation in parks and studios.', 'Wellness',      'Dresden'),
  ('11111111-0000-0000-0000-000000000012', 'Hannover Startup Founders',   'Peer support, pitching practice and investor meetups.', 'Business',      'Hannover'),
  ('11111111-0000-0000-0000-000000000013', 'Dortmund Urban Gardeners',    'Community allotments, composting workshops and seed swaps.', 'Nature',        'Dortmund'),
  ('11111111-0000-0000-0000-000000000014', 'Bonn Film Buffs',             'Weekly screenings of arthouse and classic cinema followed by discussion.', 'Film',          'Bonn'),
  ('11111111-0000-0000-0000-000000000015', 'Karlsruhe Sketch Club',       'Life drawing and urban sketching sessions every Thursday evening.', 'Art',           'Karlsruhe')
on conflict (id) do nothing;

-- ─── 2. Fake auth users (needed so member.user_id satisfies the FK) ─────────

insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data,
  is_super_admin, confirmation_token, recovery_token,
  email_change_token_new, email_change
) values
  ('22222222-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'alice@example.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'bob@example.com',     crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'carol@example.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'david@example.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'eva@example.com',     crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'felix@example.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'grace@example.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'henry@example.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'iris@example.com',    crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'james@example.com',   crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kate@example.com',    crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'liam@example.com',    crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'mia@example.com',     crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'noah@example.com',    crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', ''),
  ('22222222-0000-0000-0000-000000000015', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'olivia@example.com',  crypt('password123', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{}', false, '', '', '', '')
on conflict (id) do nothing;

-- ─── 3. Members (one per commune so each shows at least 1 member) ───────────

insert into members (commune_id, user_id) values
  -- Berlin Trail Runners (8 members)
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000003'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000005'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000007'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000009'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000011'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000013'),
  ('11111111-0000-0000-0000-000000000001', '22222222-0000-0000-0000-000000000015'),
  -- Vegane Köche München (5 members)
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000004'),
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000006'),
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000008'),
  ('11111111-0000-0000-0000-000000000002', '22222222-0000-0000-0000-000000000010'),
  -- Hamburg Board Game Nights (11 members)
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000003'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000004'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000005'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000007'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000009'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000011'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000013'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000014'),
  ('11111111-0000-0000-0000-000000000003', '22222222-0000-0000-0000-000000000015'),
  -- Frankfurt Tech Talks (9 members)
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000004'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000006'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000008'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000010'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000012'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000014'),
  ('11111111-0000-0000-0000-000000000004', '22222222-0000-0000-0000-000000000015'),
  -- Cologne Street Photography (4 members)
  ('11111111-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000005'),
  ('11111111-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000003'),
  ('11111111-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000009'),
  ('11111111-0000-0000-0000-000000000005', '22222222-0000-0000-0000-000000000013'),
  -- Stuttgart Cyclists (6 members)
  ('11111111-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000006'),
  ('11111111-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000007'),
  ('11111111-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000011'),
  ('11111111-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000012'),
  ('11111111-0000-0000-0000-000000000006', '22222222-0000-0000-0000-000000000014'),
  -- Düsseldorf Jazz Circle (7 members)
  ('11111111-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000007'),
  ('11111111-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000004'),
  ('11111111-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000008'),
  ('11111111-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000010'),
  ('11111111-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000013'),
  ('11111111-0000-0000-0000-000000000007', '22222222-0000-0000-0000-000000000015'),
  -- Leipzig Makers Space (3 members)
  ('11111111-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000008'),
  ('11111111-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000006'),
  ('11111111-0000-0000-0000-000000000008', '22222222-0000-0000-0000-000000000012'),
  -- Nuremberg Book Club (5 members)
  ('11111111-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000009'),
  ('11111111-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000005'),
  ('11111111-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000011'),
  ('11111111-0000-0000-0000-000000000009', '22222222-0000-0000-0000-000000000014'),
  -- Bremen Language Exchange (6 members)
  ('11111111-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000010'),
  ('11111111-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000003'),
  ('11111111-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000007'),
  ('11111111-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000013'),
  ('11111111-0000-0000-0000-000000000010', '22222222-0000-0000-0000-000000000015'),
  -- Dresden Yoga & Meditation (10 members)
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000011'),
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000004'),
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000006'),
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000008'),
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000009'),
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000012'),
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000013'),
  ('11111111-0000-0000-0000-000000000011', '22222222-0000-0000-0000-000000000015'),
  -- Hannover Startup Founders (4 members)
  ('11111111-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000012'),
  ('11111111-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000004'),
  ('11111111-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000008'),
  ('11111111-0000-0000-0000-000000000012', '22222222-0000-0000-0000-000000000014'),
  -- Dortmund Urban Gardeners (3 members)
  ('11111111-0000-0000-0000-000000000013', '22222222-0000-0000-0000-000000000013'),
  ('11111111-0000-0000-0000-000000000013', '22222222-0000-0000-0000-000000000005'),
  ('11111111-0000-0000-0000-000000000013', '22222222-0000-0000-0000-000000000010'),
  -- Bonn Film Buffs (7 members)
  ('11111111-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000014'),
  ('11111111-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000001'),
  ('11111111-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000003'),
  ('11111111-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000006'),
  ('11111111-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000009'),
  ('11111111-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000011'),
  ('11111111-0000-0000-0000-000000000014', '22222222-0000-0000-0000-000000000015'),
  -- Karlsruhe Sketch Club (5 members)
  ('11111111-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000015'),
  ('11111111-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000002'),
  ('11111111-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000007'),
  ('11111111-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000010'),
  ('11111111-0000-0000-0000-000000000015', '22222222-0000-0000-0000-000000000013')
on conflict do nothing;

-- ─── 4. Events ──────────────────────────────────────────────────────────────

insert into events (commune_id, title, description, event_date, location) values
  -- Berlin Trail Runners
  ('11111111-0000-0000-0000-000000000001', 'Grunewald Forest Run',        'A relaxed 10 km loop through the Grunewald. Bring water and good shoes.', '2026-04-26T09:00:00', 'S-Bahnhof Grunewald, Berlin'),
  ('11111111-0000-0000-0000-000000000001', 'Tempelhofer Feld Intervals',  'Speed work on the old runway. 6×800 m with recovery jogs.', '2026-05-10T08:00:00', 'Tempelhofer Feld, Berlin'),

  -- Vegane Köche München
  ('11111111-0000-0000-0000-000000000002', 'Spring Potluck Brunch',       'Bring a plant-based dish to share. Theme: spring vegetables.', '2026-04-27T11:00:00', 'Café Jasmin, Munich'),

  -- Hamburg Board Game Nights
  ('11111111-0000-0000-0000-000000000003', 'Ticket to Ride Tournament',   'Single-elimination Ticket to Ride Europe. Sign up by Wednesday.', '2026-05-02T18:30:00', 'Spieltrieb, Schulterblatt 73, Hamburg'),
  ('11111111-0000-0000-0000-000000000003', 'Party Games Evening',         'Codenames, Wavelength, and more. Great for newcomers!', '2026-05-16T19:00:00', 'Café Knallhart, Hamburg'),

  -- Frankfurt Tech Talks
  ('11111111-0000-0000-0000-000000000004', 'LLMs in Production',          'Three 10-minute talks on running large language models in real products.', '2026-05-07T19:00:00', 'Basecamp Frankfurt, Gutleutstraße 96'),

  -- Cologne Street Photography
  ('11111111-0000-0000-0000-000000000005', 'Golden Hour Walk',            'Meet at the Hohenzollern Bridge at sunset. We shoot for 90 minutes then review together.', '2026-04-25T19:30:00', 'Hohenzollernbrücke, Cologne'),

  -- Düsseldorf Jazz Circle
  ('11111111-0000-0000-0000-000000000007', 'Open Mic Jazz Night',         'Bring your instrument or just your ears. Drummer and bassist provided.', '2026-05-03T20:00:00', 'Jazz Schmiede, Himmelgeister Str. 107g, Düsseldorf'),

  -- Leipzig Makers Space
  ('11111111-0000-0000-0000-000000000008', 'Intro to 3D Printing',        'We''ll print a small object from scratch — design, slice, print. No experience needed.', '2026-05-09T14:00:00', 'Basislager Coworking, Leipzig'),

  -- Bremen Language Exchange
  ('11111111-0000-0000-0000-000000000010', 'German / English Swap',       'Pair up with a native speaker of the language you''re learning. Casual and free.', '2026-04-30T18:00:00', 'Café Sand, Strandweg 1, Bremen'),

  -- Dresden Yoga & Meditation
  ('11111111-0000-0000-0000-000000000011', 'Sunrise Yoga in the Großer Garten', 'A gentle 60-minute flow as the park wakes up. Bring your own mat.', '2026-05-04T06:30:00', 'Großer Garten, Dresden'),
  ('11111111-0000-0000-0000-000000000011', 'Guided Sound Bath',           'An hour of Tibetan bowls and guided breathing. Limited to 12 people.', '2026-05-18T19:30:00', 'Studio Mitte, Dresden'),

  -- Bonn Film Buffs
  ('11111111-0000-0000-0000-000000000014', 'Screening: Metropolis (1927)', 'Fritz Lang''s restored masterpiece with live piano accompaniment.', '2026-05-06T20:00:00', 'Kino Rex, Bertha-von-Suttner-Platz, Bonn'),

  -- Karlsruhe Sketch Club
  ('11111111-0000-0000-0000-000000000015', 'Urban Sketching at the Marktplatz', 'Draw the pyramid and palace from life. All media welcome.', '2026-05-01T15:00:00', 'Marktplatz, Karlsruhe')
on conflict do nothing;
