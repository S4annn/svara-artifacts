-- ============================================
-- SEED DATA: Museum Rooms
-- ============================================
INSERT INTO public.museum_rooms (id, name, slug, description, theme, icon, required_level, reward_xp, is_default_unlocked, order_index) VALUES
('11111111-1111-1111-1111-111111111101', 'Hall of Awakening', 'lobby', 'Ruang utama museum tempat petualangan dimulai.', 'awakening', 'door-open', 1, 0, true, 0),
('11111111-1111-1111-1111-111111111102', 'Ruang Kerajaan Nusantara', 'kerajaan', 'Ruang yang menyimpan artefak kerajaan, pusaka, dan candi.', 'kerajaan', 'crown', 1, 100, true, 1),
('11111111-1111-1111-1111-111111111103', 'Ruang Prasasti dan Naskah', 'prasasti', 'Ruang berisi tulisan kuno dan bukti sejarah tertulis.', 'prasasti', 'scroll', 2, 150, false, 2),
('11111111-1111-1111-1111-111111111104', 'Ruang Seni dan Budaya', 'seni', 'Ruang seni pertunjukan dan tekstil tradisional.', 'seni', 'palette', 3, 150, false, 3),
('11111111-1111-1111-1111-111111111105', 'Ruang Musik Tradisional', 'musik', 'Ruang alat musik dan pertunjukan budaya daerah.', 'musik', 'music', 3, 150, false, 4),
('11111111-1111-1111-1111-111111111106', 'Ruang Misteri Artefak', 'misteri', 'Ruang teka-teki dan artefak tersembunyi.', 'misteri', 'help-circle', 5, 300, false, 5);


-- ============================================
-- SEED DATA: Artifacts
-- ============================================
INSERT INTO public.artifacts (id, room_id, name, slug, category, origin_region, historical_period, main_function, description, cultural_value, interesting_facts, game_x, game_y, interaction_radius, personality_tone, speaking_style, difficulty_level, first_greeting, image_url, source_title, source_note, order_index) VALUES
('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111102', 'Keris Jawa', 'keris-jawa', 'Senjata Tradisional', 'Jawa', 'Abad ke-9 hingga sekarang', 'Senjata tikam, simbol status, pusaka keluarga', 'Keris adalah senjata tikam khas Nusantara dengan bilah berlekuk atau lurus. Bukan hanya senjata, tetapi juga simbol status, kehormatan, dan identitas budaya.', 'Keris dianggap sebagai pusaka keluarga yang diwariskan turun-temurun. Dalam tradisi Jawa, keris memiliki nilai spiritual.', 'Keris diakui UNESCO sebagai Masterpiece of the Oral and Intangible Heritage of Humanity pada tahun 2005.', 400, 167, 80, 'bijaksana', 'Berbicara perlahan dan penuh makna, sering menggunakan metafora', 'easy', 'Aku adalah Keris Jawa. Jangan lihat aku hanya sebagai senjata, karena di lekuk bilahku tersimpan kisah kehormatan, pusaka, dan identitas budaya.', NULL, 'UNESCO ICH', 'UNESCO Intangible Cultural Heritage, Museum Nasional Indonesia', 1),

('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111102', 'Candi Borobudur', 'candi-borobudur', 'Bangunan Sejarah', 'Magelang, Jawa Tengah', 'Abad ke-8 sampai ke-9', 'Tempat ibadah Buddha, monumen keagamaan', 'Candi Borobudur adalah candi Buddha terbesar di dunia, dibangun pada masa Dinasti Syailendra. Memiliki lebih dari 2.600 panel relief dan 504 arca Buddha.', 'Borobudur melambangkan perjalanan spiritual dari dunia nafsu menuju pencerahan, tercermin dalam tiga tingkatan arsitekturnya.', 'Borobudur sempat terkubur abu vulkanik selama berabad-abad sebelum ditemukan kembali pada 1814 oleh Sir Thomas Stamford Raffles.', 250, 200, 80, 'filosofis', 'Berbicara dengan tenang dan agung, penuh kebijaksanaan mendalam', 'medium', 'Aku berdiri melewati abad demi abad. Di setiap reliefku, manusia belajar tentang perjalanan hidup.', NULL, 'UNESCO World Heritage', 'UNESCO World Heritage Centre, Balai Konservasi Borobudur', 2),

('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111102', 'Patung Ganesha', 'patung-ganesha', 'Patung', 'Jawa', 'Masa Hindu-Buddha', 'Simbol kebijaksanaan dan ilmu pengetahuan', 'Patung Ganesha adalah representasi dewa berkepala gajah dalam tradisi Hindu yang banyak ditemukan di candi-candi Jawa.', 'Ganesha dianggap sebagai dewa pelindung ilmu pengetahuan dan penghilang rintangan.', 'Patung Ganesha dari Candi Banon menjadi lambang Museum Nasional Indonesia.', 550, 200, 80, 'bijaksana', 'Berbicara dengan nada hangat dan penuh dorongan untuk belajar', 'easy', 'Aku adalah Ganesha, simbol kebijaksanaan dan ilmu pengetahuan dalam banyak peninggalan Hindu-Buddha.', NULL, 'Museum Nasional Indonesia', 'Koleksi Museum Nasional Indonesia', 3);


INSERT INTO public.artifacts (id, room_id, name, slug, category, origin_region, historical_period, main_function, description, cultural_value, interesting_facts, game_x, game_y, interaction_radius, personality_tone, speaking_style, difficulty_level, first_greeting, image_url, source_title, source_note, order_index) VALUES
('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111103', 'Prasasti Yupa', 'prasasti-yupa', 'Prasasti', 'Kutai, Kalimantan Timur', 'Abad ke-4 Masehi', 'Bukti tertulis kerajaan tertua di Nusantara', 'Prasasti Yupa adalah tiang batu bertulis yang menjadi bukti keberadaan Kerajaan Kutai, kerajaan Hindu tertua di Nusantara.', 'Prasasti ini membuktikan bahwa peradaban tertulis di Nusantara sudah ada sejak abad ke-4 Masehi.', 'Prasasti Yupa ditulis dalam huruf Pallawa dan bahasa Sanskerta, menunjukkan pengaruh India di Nusantara.', 300, 200, 80, 'formal', 'Berbicara seperti saksi sejarah yang tua dan berwibawa', 'medium', 'Aku adalah Yupa, batu bertulis dari masa Kutai. Di tubuhku, jejak kerajaan tua Nusantara masih terukir.', NULL, 'Museum Nasional Indonesia', 'Koleksi Museum Nasional Indonesia, Buku Sejarah Indonesia Kuno', 1),

('22222222-2222-2222-2222-222222222205', '11111111-1111-1111-1111-111111111103', 'Naskah Lontar Bali', 'naskah-lontar', 'Naskah Kuno', 'Bali', 'Tradisional', 'Media tulis tradisional untuk menyimpan pengetahuan', 'Naskah lontar adalah manuskrip yang ditulis pada daun lontar (daun palem), digunakan di Bali untuk mencatat sastra, agama, dan pengetahuan.', 'Lontar menjadi media pelestarian pengetahuan tradisional Bali selama berabad-abad.', 'Proses pembuatan lontar melibatkan pengeringan daun, penulisan dengan pisau khusus, dan pewarnaan dengan jelaga.', 500, 200, 80, 'tenang', 'Berbicara dengan nada bijak seperti pustaka tua yang menyimpan banyak rahasia', 'medium', 'Aku adalah naskah lontar. Di helaian daun lontarku, pengetahuan lama dijaga dari generasi ke generasi.', NULL, 'Museum Bali', 'Gedong Kirtya Singaraja, Museum Bali', 2),

('22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111104', 'Topeng Cirebon', 'topeng-cirebon', 'Seni Pertunjukan', 'Cirebon, Jawa Barat', 'Tradisional', 'Media seni pertunjukan tari topeng', 'Topeng Cirebon digunakan dalam pertunjukan Tari Topeng Cirebon yang menggambarkan berbagai karakter manusia.', 'Setiap topeng mewakili karakter berbeda dan mengajarkan nilai-nilai kehidupan melalui seni pertunjukan.', 'Tari Topeng Cirebon memiliki lima karakter utama yang merepresentasikan tahapan kehidupan manusia.', 300, 200, 80, 'teatrikal', 'Berbicara dengan ekspresif dan dramatis, penuh ekspresi', 'easy', 'Aku adalah Topeng Cirebon. Di balik wajahku, tersimpan banyak karakter dan pelajaran hidup.', NULL, 'Keraton Kasepuhan Cirebon', 'Dokumentasi Tari Topeng Cirebon, Keraton Kasepuhan', 1),

('22222222-2222-2222-2222-222222222207', '11111111-1111-1111-1111-111111111104', 'Batik Parang', 'batik-parang', 'Tekstil Tradisional', 'Jawa', 'Tradisional', 'Kain bermotif simbolis untuk pakaian adat', 'Batik Parang adalah salah satu motif batik tertua dan paling terkenal dari Jawa dengan pola diagonal berulang.', 'Motif Parang melambangkan perjuangan yang tidak pernah berhenti dan kekuatan dalam menghadapi tantangan.', 'Pada masa kerajaan Mataram, motif Parang tertentu hanya boleh dikenakan oleh keluarga kerajaan.', 500, 200, 80, 'elegan', 'Berbicara dengan anggun dan penuh nasihat simbolis', 'easy', 'Aku adalah Batik Parang. Polaku mengalir seperti ombak, melambangkan perjuangan yang tak pernah berhenti.', NULL, 'Museum Batik Pekalongan', 'UNESCO ICH Batik Indonesia, Museum Batik Pekalongan', 2);


INSERT INTO public.artifacts (id, room_id, name, slug, category, origin_region, historical_period, main_function, description, cultural_value, interesting_facts, game_x, game_y, interaction_radius, personality_tone, speaking_style, difficulty_level, first_greeting, image_url, source_title, source_note, order_index) VALUES
('22222222-2222-2222-2222-222222222208', '11111111-1111-1111-1111-111111111105', 'Angklung', 'angklung', 'Alat Musik Tradisional', 'Jawa Barat', 'Tradisional', 'Alat musik bambu yang dimainkan dengan cara digoyangkan', 'Angklung adalah alat musik tradisional Sunda yang terbuat dari bambu dan menghasilkan nada saat digoyangkan.', 'Angklung melambangkan kebersamaan karena membutuhkan banyak pemain untuk menghasilkan melodi lengkap.', 'Angklung diakui UNESCO sebagai Masterpiece of the Oral and Intangible Heritage of Humanity pada tahun 2010.', 300, 200, 80, 'ceria', 'Berbicara dengan riang dan musikal, sering menggunakan analogi bunyi', 'easy', 'Halo! Aku Angklung. Dengarkan aku bergoyang, maka kamu akan mendengar suara kebersamaan.', NULL, 'UNESCO ICH', 'UNESCO Intangible Cultural Heritage 2010, Saung Angklung Udjo', 1),

('22222222-2222-2222-2222-222222222209', '11111111-1111-1111-1111-111111111105', 'Gamelan', 'gamelan', 'Alat Musik Tradisional', 'Jawa/Bali', 'Tradisional', 'Ansambel musik tradisional dari logam', 'Gamelan adalah ansambel musik tradisional yang terdiri dari berbagai instrumen perkusi logam, terutama dari Jawa dan Bali.', 'Gamelan mencerminkan filosofi keharmonisan dan keseimbangan dalam budaya Jawa dan Bali.', 'Gamelan Jawa dan Bali memiliki sistem nada yang berbeda: slendro (5 nada) dan pelog (7 nada).', 500, 200, 80, 'harmonis', 'Berbicara dengan tenang dan berirama, penuh keselarasan', 'medium', 'Aku adalah Gamelan. Suaraku lahir dari harmoni, kebersamaan, dan rasa.', NULL, 'Museum Nasional Indonesia', 'Koleksi Museum Nasional Indonesia, Dokumentasi Gamelan UNESCO', 2);

-- ============================================
-- SEED DATA: Memory Fragments
-- ============================================
INSERT INTO public.artifact_memory_fragments (id, artifact_id, title, content, unlock_condition, reward_xp, order_index) VALUES
-- Keris Jawa fragments
('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'Bukan Sekadar Senjata', 'Keris tidak hanya dikenal sebagai senjata, tetapi juga sebagai simbol kehormatan, status, dan identitas budaya Jawa.', 'chat', 20, 1),
('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'Pusaka Keluarga', 'Dalam tradisi Jawa, keris sering diwariskan sebagai pusaka keluarga dari generasi ke generasi.', 'chat', 20, 2),
('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 'Lekuk Bilah Bermakna', 'Bentuk bilah keris yang berlekuk (luk) memiliki makna filosofis dan estetika tersendiri dalam budaya Jawa.', 'quiz', 20, 3),

-- Candi Borobudur fragments
('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222202', 'Tiga Tingkatan Spiritual', 'Borobudur memiliki tiga tingkatan: Kamadhatu (dunia nafsu), Rupadhatu (dunia bentuk), dan Arupadhatu (dunia tanpa bentuk).', 'chat', 20, 1),
('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222202', 'Terkubur Berabad-abad', 'Borobudur sempat terkubur abu vulkanik dan hutan selama berabad-abad sebelum ditemukan kembali pada 1814.', 'chat', 20, 2),
('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222202', 'Relief Cerita Buddha', 'Borobudur memiliki lebih dari 2.600 panel relief yang menceritakan kisah kehidupan Buddha dan ajaran-ajarannya.', 'quiz', 20, 3),

-- Prasasti Yupa fragments
('33333333-3333-3333-3333-333333333307', '22222222-2222-2222-2222-222222222204', 'Bukti Tertua Nusantara', 'Prasasti Yupa adalah salah satu bukti tertulis tertua tentang keberadaan kerajaan di Nusantara.', 'chat', 20, 1),
('33333333-3333-3333-3333-333333333308', '22222222-2222-2222-2222-222222222204', 'Huruf Pallawa', 'Prasasti ini ditulis dalam huruf Pallawa dan bahasa Sanskerta, menunjukkan pengaruh budaya India.', 'chat', 20, 2),
('33333333-3333-3333-3333-333333333309', '22222222-2222-2222-2222-222222222204', 'Raja Mulawarman', 'Prasasti Yupa menyebut nama Raja Mulawarman yang melakukan upacara korban besar-besaran.', 'quiz', 20, 3),

-- Angklung fragments
('33333333-3333-3333-3333-333333333310', '22222222-2222-2222-2222-222222222208', 'Suara Kebersamaan', 'Angklung membutuhkan banyak pemain untuk menghasilkan melodi, melambangkan gotong royong.', 'chat', 20, 1),
('33333333-3333-3333-3333-333333333311', '22222222-2222-2222-2222-222222222208', 'Warisan Dunia', 'UNESCO mengakui angklung sebagai warisan budaya tak benda pada tahun 2010.', 'chat', 20, 2),
('33333333-3333-3333-3333-333333333312', '22222222-2222-2222-2222-222222222208', 'Bambu Pilihan', 'Angklung dibuat dari bambu hitam (awi wulung) atau bambu putih (awi temen) yang dipilih khusus.', 'quiz', 20, 3);


-- ============================================
-- SEED DATA: Badges
-- ============================================
INSERT INTO public.badges (id, name, description, icon, condition_type, condition_value, rarity, reward_xp) VALUES
('44444444-4444-4444-4444-444444444401', 'Penjelajah Pemula', 'Menyelesaikan quest pertama', 'compass', 'quest_complete', '1', 'common', 50),
('44444444-4444-4444-4444-444444444402', 'Keris Listener', 'Berbicara dengan Keris Jawa', 'message-circle', 'chat_artifact', 'keris-jawa', 'common', 30),
('44444444-4444-4444-4444-444444444403', 'Fragment Hunter', 'Membuka 5 memory fragment', 'puzzle', 'fragments_unlocked', '5', 'rare', 80),
('44444444-4444-4444-4444-444444444404', 'Quiz Perfect', 'Mendapat skor quiz 100%', 'star', 'quiz_perfect', '1', 'rare', 100),
('44444444-4444-4444-4444-444444444405', 'Pembaca Prasasti', 'Menyelesaikan quest Prasasti Yupa', 'scroll', 'quest_complete_specific', 'prasasti', 'common', 50),
('44444444-4444-4444-4444-444444444406', 'Sahabat Angklung', 'Berbicara dengan Angklung', 'music', 'chat_artifact', 'angklung', 'common', 30),
('44444444-4444-4444-4444-444444444407', 'Penjaga Budaya', 'Menyelesaikan 3 room', 'shield', 'rooms_completed', '3', 'epic', 150),
('44444444-4444-4444-4444-444444444408', 'Master Museum', 'Menyelesaikan semua main quest', 'trophy', 'all_main_quests', 'all', 'legendary', 500);

-- ============================================
-- SEED DATA: Quests
-- ============================================
INSERT INTO public.quests (id, title, description, quest_type, requirement_type, requirement_value, reward_xp, required_level, is_main_quest, order_index) VALUES
('55555555-5555-5555-5555-555555555501', 'Museum yang Terbangun', 'Bicara dengan Nara, dekati Keris Jawa, dan buka 2 memory fragment.', 'explore', 'multi', '{"chat_keris": true, "fragments": 2}', 100, 1, true, 1),
('55555555-5555-5555-5555-555555555502', 'Jejak Kerajaan Nusantara', 'Masuk Ruang Kerajaan, bicara dengan Candi Borobudur, buka 3 fragment kerajaan.', 'explore', 'multi', '{"visit_kerajaan": true, "chat_borobudur": true, "fragments": 3}', 150, 1, true, 2),
('55555555-5555-5555-5555-555555555503', 'Suara dari Prasasti', 'Masuk Ruang Prasasti, bicara dengan Prasasti Yupa, selesaikan quiz.', 'explore', 'multi', '{"visit_prasasti": true, "chat_yupa": true, "quiz_complete": true}', 150, 2, true, 3),
('55555555-5555-5555-5555-555555555504', 'Nada dari Masa Lalu', 'Masuk Ruang Musik, bicara dengan Angklung dan Gamelan.', 'explore', 'multi', '{"visit_musik": true, "chat_angklung": true, "chat_gamelan": true}', 150, 3, true, 4),
('55555555-5555-5555-5555-555555555505', 'Penjaga Warisan', 'Selesaikan semua room dan buka Ruang Misteri.', 'explore', 'multi', '{"rooms_completed": 4}', 300, 5, true, 5);

-- ============================================
-- SEED DATA: Quizzes (Keris Jawa)
-- ============================================
INSERT INTO public.quizzes (id, artifact_id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, reward_xp, order_index) VALUES
('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222201', 'Keris diakui UNESCO sebagai warisan budaya pada tahun berapa?', '2003', '2005', '2008', '2010', 'B', 'Keris diakui UNESCO sebagai Masterpiece of the Oral and Intangible Heritage of Humanity pada tahun 2005.', 20, 1),
('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222201', 'Apa nama lekukan pada bilah keris?', 'Pamor', 'Luk', 'Dhapur', 'Warangka', 'B', 'Lekukan pada bilah keris disebut luk, yang memiliki makna filosofis tersendiri.', 20, 2),
('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222201', 'Selain sebagai senjata, keris juga berfungsi sebagai...', 'Alat musik', 'Simbol status dan pusaka', 'Alat pertanian', 'Mata uang', 'B', 'Keris bukan hanya senjata, tetapi juga simbol status, kehormatan, dan pusaka keluarga.', 20, 3),
('66666666-6666-6666-6666-666666666604', '22222222-2222-2222-2222-222222222201', 'Dari pulau mana keris berasal?', 'Sumatera', 'Kalimantan', 'Jawa', 'Sulawesi', 'C', 'Keris berasal dari Jawa dan telah menyebar ke berbagai wilayah Nusantara.', 20, 4),
('66666666-6666-6666-6666-666666666605', '22222222-2222-2222-2222-222222222201', 'Apa yang dimaksud dengan pamor pada keris?', 'Sarung keris', 'Corak logam pada bilah', 'Gagang keris', 'Ujung keris', 'B', 'Pamor adalah corak atau pola pada bilah keris yang terbentuk dari campuran logam.', 20, 5);

-- ============================================
-- SEED DATA: Story Chapters
-- ============================================
INSERT INTO public.story_chapters (id, title, description, order_index, required_level, reward_xp) VALUES
('77777777-7777-7777-7777-777777777701', 'Museum yang Terbangun', 'Malam ini museum tiba-tiba hidup. Nara memanggilmu untuk menjadi Relic Keeper.', 1, 1, 100),
('77777777-7777-7777-7777-777777777702', 'Suara dari Ruang Kerajaan', 'Artefak kerajaan mulai berbicara. Bantu mereka mengingat kisah mereka.', 2, 1, 150),
('77777777-7777-7777-7777-777777777703', 'Jejak Tulisan Kuno', 'Prasasti dan naskah kuno menyimpan rahasia peradaban awal Nusantara.', 3, 2, 150),
('77777777-7777-7777-7777-777777777704', 'Nada dari Masa Lalu', 'Alat musik tradisional ingin kembali bersuara.', 4, 3, 150),
('77777777-7777-7777-7777-777777777705', 'Rahasia Ruang Misteri', 'Ruang terakhir menyimpan teka-teki yang hanya bisa dipecahkan oleh Relic Keeper sejati.', 5, 5, 300),
('77777777-7777-7777-7777-777777777706', 'Penjaga Warisan Nusantara', 'Kamu telah memulihkan semua ingatan. Museum kembali utuh.', 6, 6, 500);

-- ============================================
-- SEED DATA: Daily Missions
-- ============================================
INSERT INTO public.daily_missions (id, title, description, mission_type, target_value, reward_xp) VALUES
('88888888-8888-8888-8888-888888888801', 'Sapa Artefak', 'Chat dengan 1 artefak hari ini', 'chat', 1, 30),
('88888888-8888-8888-8888-888888888802', 'Pecahkan Teka-teki', 'Selesaikan 1 quiz', 'quiz', 1, 40),
('88888888-8888-8888-8888-888888888803', 'Pemburu Fragment', 'Buka 1 memory fragment', 'fragment', 1, 30),
('88888888-8888-8888-8888-888888888804', 'Penjelajah Ruangan', 'Kunjungi 2 ruangan', 'visit', 2, 50),
('88888888-8888-8888-8888-888888888805', 'Tantangan Misteri', 'Jawab 1 mystery challenge', 'mystery', 1, 60);

-- ============================================
-- SEED DATA: Mystery Challenges
-- ============================================
INSERT INTO public.mystery_challenges (id, artifact_id, clue, hints, answer, reward_xp, reward_xp_no_hint) VALUES
('99999999-9999-9999-9999-999999999901', '22222222-2222-2222-2222-222222222204', 'Aku berasal dari Kalimantan Timur. Aku menjadi salah satu bukti tertulis tertua di Nusantara. Aku berbentuk tiang batu dan berhubungan dengan Kerajaan Kutai. Siapakah aku?', '["Aku ditulis dalam huruf Pallawa", "Aku menyebut nama Raja Mulawarman", "Aku ditemukan di tepi Sungai Mahakam"]', 'Prasasti Yupa', 100, 150),
('99999999-9999-9999-9999-999999999902', '22222222-2222-2222-2222-222222222201', 'Aku bukan hanya senjata. Aku diwariskan turun-temurun. Bilahku bisa lurus atau berlekuk. UNESCO mengakuiku pada 2005. Siapakah aku?', '["Aku berasal dari Jawa", "Lekukanku disebut luk", "Aku juga simbol status dan kehormatan"]', 'Keris', 100, 150);
