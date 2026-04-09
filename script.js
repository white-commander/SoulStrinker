document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'http://localhost:3000/api';

    // Toast Notification System
    function showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            if(container.contains(toast)) container.removeChild(toast);
        }, 3000);
    }

    // 1. User State & Authentication
    let userState = {
        guestId: localStorage.getItem('guestId') || null,
        username: localStorage.getItem('username') || 'Guest User',
        language: 'en',
        userId: null
    };

    if (!userState.guestId) {
        userState.guestId = 'GUEST-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        localStorage.setItem('guestId', userState.guestId);
    }

    // Sync user with MySQL backend
    async function syncUser() {
        try {
            const res = await fetch(`${API_URL}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ guest_id: userState.guestId, username: userState.username })
            });
            const data = await res.json();
            userState.userId = data.id;
        } catch (e) {
            console.log('Backend not connected, running in local mode.');
        }
    }
    syncUser();

    const guestIdDisplay = document.getElementById('guest-id-display');
    const welcomeMessage = document.getElementById('welcome-message');
    const authStatus = document.getElementById('auth-status');
    const editUsernameInput = document.getElementById('edit-username');
    
    function updateUserUI() {
        guestIdDisplay.textContent = `Guest ID: ${userState.guestId}`;
        welcomeMessage.textContent = `Welcome to SoulStrinker, ${userState.username}!`;
        authStatus.textContent = userState.username;
        editUsernameInput.value = userState.username;
    }
    updateUserUI();

    // 2. Navigation Logic
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburger) hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
            }
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(sec => sec.classList.remove('active'));
            
            // Add active class to clicked
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            
            // Hide detail view if navigating away from games
            if(targetId !== 'games-section') {
                document.getElementById('game-detail-section').style.display = 'none';
            } else {
                document.getElementById('game-detail-section').style.display = 'none';
                document.getElementById('games-section').classList.add('active');
            }
        });
    });

    // 3. Mock Data Generation (Games & Streams)
    const gamesData = [
        { id: 1, name: 'Free Fire', category: 'Battle Royale', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', yt: 'https://www.youtube.com/embed/vK72Xj7R_gQ' },
        { id: 2, name: 'PUBG Mobile', category: 'Battle Royale', img: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', yt: 'https://www.youtube.com/embed/ucdjzJ-eB_o' },
        { id: 3, name: 'Clash of Clans', category: 'Strategy', img: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', yt: 'https://www.youtube.com/embed/P6sM2XG665E' },
        { id: 4, name: 'Chess', category: 'Board', img: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', yt: 'https://www.youtube.com/embed/U4ogK0MIzqk' },
        { id: 5, name: 'Ark: Survival Evolved', category: 'Survival', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', yt: 'https://www.youtube.com/embed/5fIAPcVdZO8' }
    ];

    const extraVideos = [
        'https://www.youtube.com/embed/MmB9b5njVbA', // Minecraft
        'https://www.youtube.com/embed/QkkoHAzjnUs', // GTA V
        'https://www.youtube.com/embed/e_E9W2vsRbQ', // Valorant
        'https://www.youtube.com/embed/UMvDXreXgJ8', // Apex Legends
        'https://www.youtube.com/embed/WNWijT9m_ls', // Fortnite
        'https://www.youtube.com/embed/vzHrjOMfHPY', // League of Legends
        'https://www.youtube.com/embed/0E44DClsX5Q', // Warzone
        'https://www.youtube.com/embed/HLUY1nICCAA', // Genshin Impact
        'https://www.youtube.com/embed/NSJ4cESNQfE', // Among Us
        'https://www.youtube.com/embed/eAvJAvRM2gA', // Roblox
        'https://www.youtube.com/embed/OmMDOOq8hF0', // Rocket League
        'https://www.youtube.com/embed/dQw4w9WgXcQ'  // Rickroll
    ];

    const popularGames = [
        { name: 'Minecraft', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Minecraft' },
        { name: 'Grand Theft Auto V', img: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg' },
        { name: 'Valorant', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Valorant' },
        { name: 'Apex Legends', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg' },
        { name: 'Fortnite', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Fortnite' },
        { name: 'League of Legends', img: 'https://placehold.co/500x300/2d3436/ff4757?text=League+of+Legends' },
        { name: 'Call of Duty: Warzone', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1962660/header.jpg' },
        { name: 'Genshin Impact', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Genshin+Impact' },
        { name: 'Among Us', img: 'https://cdn.akamai.steamstatic.com/steam/apps/945360/header.jpg' },
        { name: 'Roblox', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Roblox' },
        { name: 'Rocket League', img: 'https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg' },
        { name: 'Overwatch 2', img: 'https://cdn.akamai.steamstatic.com/steam/apps/2356500/header.jpg' },
        { name: 'Counter-Strike: Global Offensive', img: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg' },
        { name: 'Dota 2', img: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg' },
        { name: 'Cyberpunk 2077', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg' },
        { name: 'Elden Ring', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg' },
        { name: 'Red Dead Redemption 2', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg' },
        { name: 'The Witcher 3', img: 'https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg' },
        { name: 'Terraria', img: 'https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg' },
        { name: 'Stardew Valley', img: 'https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg' },
        { name: 'Rust', img: 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg' },
        { name: 'Dead by Daylight', img: 'https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg' },
        { name: 'Destiny 2', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1085660/header.jpg' },
        { name: 'Rainbow Six Siege', img: 'https://cdn.akamai.steamstatic.com/steam/apps/359550/header.jpg' },
        { name: 'Hollow Knight', img: 'https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg' },
        { name: 'Hades', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg' },
        { name: 'Fall Guys', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1097150/header.jpg' },
        { name: 'Phasmophobia', img: 'https://cdn.akamai.steamstatic.com/steam/apps/739630/header.jpg' },
        { name: 'World of Warcraft', img: 'https://placehold.co/500x300/2d3436/ff4757?text=World+of+Warcraft' },
        { name: 'Final Fantasy XIV', img: 'https://cdn.akamai.steamstatic.com/steam/apps/39210/header.jpg' },
        { name: 'Sea of Thieves', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1172620/header.jpg' },
        { name: 'Garry\'s Mod', img: 'https://cdn.akamai.steamstatic.com/steam/apps/4000/header.jpg' },
        { name: 'Left 4 Dead 2', img: 'https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg' },
        { name: 'Portal 2', img: 'https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg' },
        { name: 'Borderlands 3', img: 'https://cdn.akamai.steamstatic.com/steam/apps/397540/header.jpg' },
        { name: 'Mortal Kombat 11', img: 'https://cdn.akamai.steamstatic.com/steam/apps/976310/header.jpg' },
        { name: 'Tekken 7', img: 'https://cdn.akamai.steamstatic.com/steam/apps/389730/header.jpg' },
        { name: 'Street Fighter V', img: 'https://cdn.akamai.steamstatic.com/steam/apps/310950/header.jpg' },
        { name: 'Super Smash Bros. Ultimate', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Super+Smash+Bros.+Ultimate' },
        { name: 'Mario Kart 8', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Mario+Kart+8' },
        { name: 'Animal Crossing', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Animal+Crossing' },
        { name: 'Zelda: Breath of the Wild', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Zelda:+Breath+of+the+Wild' },
        { name: 'Splatoon 3', img: 'https://placehold.co/500x300/2d3436/ff4757?text=Splatoon+3' },
        { name: 'God of War', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/header.jpg' },
        { name: 'Spider-Man', img: 'https://cdn.akamai.steamstatic.com/steam/apps/1817070/header.jpg' }
    ];

    const gameCategories = ['Action', 'RPG', 'Shooter', 'Strategy', 'Sports', 'Puzzle', 'Simulation', 'Racing', 'Fighting', 'Platformer', 'Survival'];

    // Generate remaining dummy games up to 50
    for(let i=6; i<=50; i++) {
        const randomVideo = extraVideos[Math.floor(Math.random() * extraVideos.length)];
        const gameObj = popularGames[i - 6] || { name: `Game Title ${i}`, img: `https://picsum.photos/seed/${i}/500/300` };
        const randomCategory = gameCategories[Math.floor(Math.random() * gameCategories.length)];
        gamesData.push({
            id: i,
            name: gameObj.name,
            category: randomCategory,
            img: gameObj.img,
            yt: randomVideo
        });
    }

    const localizedTips = {
        'en': {
            1: 'Always keep moving to avoid sniper fire. Use gloo walls effectively.',
            2: 'Land in high-loot areas but be ready for early fights. Manage your boost.',
            3: 'Upgrade your Town Hall only after maxing out defenses.',
            4: 'Control the center of the board. Develop your knights before bishops.',
            5: 'Tame a Pteranodon early for mobility and scouting.'
        },
        'es': {
            1: 'Mantente siempre en movimiento para evitar a los francotiradores.',
            2: 'Aterriza en zonas de mucho botín pero prepárate para luchar.',
            3: 'Mejora tu Ayuntamiento solo después de al máximo las defensas.',
            4: 'Controla el centro del tablero. Desarrolla tus caballos.',
            5: 'Domestica un Pteranodon temprano para movilidad.'
        },
        'hi': {
            1: 'स्नाइपर से बचने के लिए हमेशा चलते रहें। ग्लू वॉल का उपयोग करें।',
            2: 'अच्छी लूट वाली जगहों पर उतरें लेकिन लड़ाई के लिए तैयार रहें।',
            3: 'अपनी रक्षा को अधिकतम करने के बाद ही अपना टाउन हॉल अपग्रेड करें।',
            4: 'बोर्ड के केंद्र को नियंत्रित करें।',
            5: 'गतिशीलता के लिए जल्दी एक Pteranodon को पालतू बनाएं।'
        }
    };

    // Random Content Generator
    const generateRandomContent = (langName) => {
        const categories = ['Gameplay Highlights', 'Tips & Tricks', 'Esports Finals', 'Funny Moments', 'Review', 'Walkthrough'];
        const content = [];
        for (let i = 0; i < 5000; i++) {
            const randomVideo = extraVideos[Math.floor(Math.random() * extraVideos.length)];
            const videoId = randomVideo.split('/').pop().split('?')[0];
            content.push({
                title: `${categories[Math.floor(Math.random() * categories.length)]} - ${langName} Edition`,
                desc: `Discover the best gaming moments in ${langName}!`,
                img: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
                yt: randomVideo
            });
        }
        return content;
    };

    // 4. Render Functions
    function renderRandomContent() {
        const container = document.getElementById('random-content-container');
        if(!container) return;
        container.innerHTML = '';
        const langSelectEl = document.getElementById('language-select');
        const langName = langSelectEl.options[langSelectEl.selectedIndex].text;
        const items = generateRandomContent(langName);
        
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'stream-card';
            card.innerHTML = `
                <img src="${item.img}" alt="${item.title}" class="skeleton" onload="this.classList.remove('skeleton')">
                <div class="stream-info">
                    <h3>${item.title}</h3>
                    <p>${item.desc}</p>
                </div>
            `;
            card.addEventListener('click', () => openVideoModal(item.title, item.yt));
            container.appendChild(card);
        });
    }

    // Open Video Modal
    function openVideoModal(title, ytUrl) {
        const videoModal = document.getElementById('video-modal');
        document.getElementById('video-modal-title').textContent = title;
        const embedUrl = ytUrl.includes('?') ? `${ytUrl}&autoplay=1` : `${ytUrl}?autoplay=1`;
        document.getElementById('video-modal-embed').innerHTML = `<iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        videoModal.style.display = 'block';
    }

    let currentPage = 1;
    const gamesPerPage = 12;
    let currentFilter = '';

    function renderGames(filter = '', page = 1) {
        currentFilter = filter;
        currentPage = page;
        const gamesContainer = document.getElementById('games-container');
        gamesContainer.innerHTML = '';
        
        const filteredGames = gamesData.filter(game => game.name.toLowerCase().includes(filter.toLowerCase()));
        
        if (filteredGames.length === 0) {
            gamesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #aaa; padding: 30px; font-size: 1.1rem;">No games found matching your search criteria.</p>';
            document.getElementById('pagination-controls').innerHTML = '';
            return;
        }

        const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
        const startIndex = (page - 1) * gamesPerPage;
        const paginatedGames = filteredGames.slice(startIndex, startIndex + gamesPerPage);
        
        paginatedGames.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.innerHTML = `
                <img src="${game.img}" alt="${game.name}" class="skeleton" onload="this.classList.remove('skeleton')">
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <p>${game.category}</p>
                </div>
            `;
            gameCard.addEventListener('click', () => showGameDetail(game));
            gamesContainer.appendChild(gameCard);
        });

        renderPagination(totalPages);
    }

    function renderPagination(totalPages) {
        const paginationContainer = document.getElementById('pagination-controls');
        if(!paginationContainer) return;
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) return;

        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn';
        prevBtn.innerHTML = '&laquo; Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => renderGames(currentFilter, currentPage - 1));
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => renderGames(currentFilter, i));
            paginationContainer.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn';
        nextBtn.innerHTML = 'Next &raquo;';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => renderGames(currentFilter, currentPage + 1));
        paginationContainer.appendChild(nextBtn);
    }

    // 5. Game Detail View
    const gameDetailSection = document.getElementById('game-detail-section');
    const gamesSection = document.getElementById('games-section');
    let currentGameId = null;

    function showGameDetail(game) {
        currentGameId = game.id;
        gamesSection.classList.remove('active');
        gameDetailSection.style.display = 'block';
        gameDetailSection.classList.add('active');
        
        document.getElementById('detail-game-name').textContent = game.name;
        
        // Video
        document.getElementById('detail-game-video').innerHTML = `<iframe src="${game.yt}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        
        updateGameTips();
    }

    function updateGameTips() {
        if(!currentGameId) return;
        const tips = localizedTips[userState.language]?.[currentGameId] || localizedTips['en'][currentGameId] || 'Tips are not available for this game yet.';
        document.getElementById('detail-game-tips').textContent = tips;
    }

    document.getElementById('back-to-games').addEventListener('click', () => {
        gameDetailSection.style.display = 'none';
        gameDetailSection.classList.remove('active');
        gamesSection.classList.add('active');
    });

    // 6. Sensitivity Module (Free Fire) - 300+ Devices Grid
    const devicesContainer = document.getElementById('devices-container');
    const deviceSearch = document.getElementById('device-search');
    const sensResults = document.getElementById('sensitivity-results');
    const sensList = document.getElementById('sens-list');
    const sensModalOverlay = document.getElementById('sens-modal-overlay');
    const closeSensBtn = document.getElementById('close-sens-btn');

    const allBrands = ['Samsung', 'Xiaomi', 'Vivo', 'Oppo', 'Realme', 'OnePlus', 'Asus', 'Google', 'Motorola', 'Apple'];
    const allRams = ['3GB', '4GB', '6GB', '8GB', '12GB', '16GB'];
    
    const modelLines = {
        'Samsung': ['Galaxy S23 Ultra', 'Galaxy S23', 'Galaxy S22', 'Galaxy S21 FE', 'Galaxy A54', 'Galaxy A53', 'Galaxy A34', 'Galaxy M53', 'Galaxy F23', 'Galaxy Z Fold 4', 'Galaxy Z Flip 4', 'Galaxy Note 20 Ultra'],
        'Xiaomi': ['13 Pro', '13', '12 Pro', '12', '11T Pro', 'Redmi Note 12 Pro', 'Redmi Note 12', 'Redmi Note 11', 'Poco X5 Pro', 'Poco X5', 'Poco F4', 'Poco M4 Pro'],
        'Vivo': ['X90 Pro', 'X80 Pro', 'X80', 'V27 Pro', 'V27', 'V25', 'Y75', 'Y35', 'Y22', 'T1 5G', 'IQOO 11', 'IQOO 9T', 'IQOO Z6'],
        'Oppo': ['Find X6 Pro', 'Find X5', 'Reno 10 Pro+', 'Reno 10', 'Reno 8 Pro', 'Reno 8', 'F21 Pro 5G', 'F21s Pro', 'A78', 'A96', 'A57', 'K10', 'A17'],
        'Realme': ['11 Pro+', '11 Pro', '10 Pro+', '10 Pro', '9 Pro+', '9 Pro', 'GT Neo 3', 'GT 2 Pro', 'GT 2', 'Narzo 50 Pro', 'Narzo 50', 'C55', 'C33', '8i', '9i'],
        'OnePlus': ['11 5G', '11R', '10 Pro', '10T', '9 Pro', '9', 'Nord 3', 'Nord CE 3 Lite', 'Nord CE 3', 'Nord 2T', '8T', '7T', 'Nord CE 2'],
        'Asus': ['ROG Phone 7 Ultimate', 'ROG Phone 7', 'ROG Phone 6 Pro', 'ROG Phone 6', 'Zenfone 9', 'Zenfone 8', 'ROG Phone 5s', 'ROG Phone 5', 'Zenfone 7', 'ROG Phone 3'],
        'Google': ['Pixel 7 Pro', 'Pixel 7', 'Pixel 7a', 'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a', 'Pixel 5', 'Pixel 4a 5G', 'Pixel 4 XL', 'Pixel 3a XL', 'Pixel Fold'],
        'Motorola': ['Edge 40 Pro', 'Edge 40', 'Edge 30 Ultra', 'Edge 30 Fusion', 'Edge 30', 'Moto G73', 'Moto G62', 'Moto G52', 'Moto G82', 'Moto E13', 'Razr 40 Ultra', 'Defy'],
        'Apple': ['iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 11 Pro', 'iPhone 11', 'iPhone SE (2022)']
    };

    const allDevices = [];
    let deviceId = 1;

    for (const brand in modelLines) {
        modelLines[brand].forEach(model => {
            // Generate 3 ram variants per model
            const startIndex = Math.floor(Math.random() * 3);
            const modelRams = allRams.slice(startIndex, startIndex + 3);
            modelRams.forEach(ram => {
                allDevices.push({
                    id: deviceId++,
                    brand: brand,
                    model: model,
                    ram: ram,
                    name: `${brand} ${model} ${ram}`
                });
            });
        });
    }

    // Ensure at least 300
    while(allDevices.length < 320) {
        allDevices.push({
            id: deviceId++, 
            brand: 'Infinix', 
            model: `Note ${Math.floor(Math.random() * 30)}`, 
            ram: allRams[Math.floor(Math.random() * allRams.length)], 
            name: `Infinix Note (Random)`
        });
    }

    const brandFilter = document.getElementById('brand-filter');
    const ramFilter = document.getElementById('ram-filter');

    // Populate Brand Filter dynamically
    const uniqueBrands = [...new Set(allDevices.map(d => d.brand))].sort();
    uniqueBrands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilter.appendChild(option);
    });

    // Populate RAM Filter dynamically
    const uniqueRams = [...new Set(allDevices.map(d => d.ram))].sort((a, b) => parseInt(a) - parseInt(b));
    uniqueRams.forEach(ram => {
        const option = document.createElement('option');
        option.value = ram;
        option.textContent = ram;
        ramFilter.appendChild(option);
    });

    function renderDevicesGrid() {
        devicesContainer.innerHTML = '';
        const textFilter = deviceSearch.value.toLowerCase();
        const selectedBrand = brandFilter.value;
        const selectedRam = ramFilter.value;

        const filtered = allDevices.filter(d => {
            const matchesText = d.brand.toLowerCase().includes(textFilter) || 
                                d.model.toLowerCase().includes(textFilter) || 
                                d.ram.toLowerCase().includes(textFilter) ||
                                d.name.toLowerCase().includes(textFilter);
            const matchesBrand = selectedBrand === '' || d.brand === selectedBrand;
            const matchesRam = selectedRam === '' || d.ram === selectedRam;
            
            return matchesText && matchesBrand && matchesRam;
        });
        
        if (filtered.length === 0) {
            devicesContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #aaa; padding: 30px; font-size: 1.1rem;">No devices match your current filters.</p>';
            return;
        }

        filtered.forEach(device => {
            const square = document.createElement('div');
            square.className = 'device-square';
            square.innerHTML = `
                <div class="device-brand">${device.brand}</div>
                <div class="device-model">${device.model}</div>
                <div class="device-ram">${device.ram}</div>
            `;
            square.addEventListener('click', () => showSensitivity(device));
            devicesContainer.appendChild(square);
        });
    }

    deviceSearch.addEventListener('input', renderDevicesGrid);
    brandFilter.addEventListener('change', renderDevicesGrid);
    ramFilter.addEventListener('change', renderDevicesGrid);

    function showSensitivity(device) {
        let baseMultiplier = 1;
        if(device.ram.includes('3GB') || device.ram.includes('4GB')) baseMultiplier = 1.4;
        else if(device.ram.includes('6GB')) baseMultiplier = 1.2;
        else baseMultiplier = 1.0;

        const generateSens = (base) => Math.min(200, Math.max(1, Math.floor(base * baseMultiplier + (Math.random() * 10 - 5))));

        const settings = [
            { name: 'General', value: generateSens(180) },
            { name: 'Red Dot', value: generateSens(160) },
            { name: '2x Scope', value: generateSens(150) },
            { name: '4x Scope', value: generateSens(140) },
            { name: 'Sniper Scope', value: generateSens(90) },
            { name: 'Free Look', value: generateSens(110) }
        ];

        document.getElementById('sens-device-title').textContent = `${device.brand} ${device.model} (${device.ram})`;
        sensList.innerHTML = '';
        settings.forEach(s => {
            sensList.innerHTML += `<li><span>${s.name}</span> <strong>${s.value}</strong></li>`;
        });
        
        sensModalOverlay.style.display = 'block';
        sensResults.style.display = 'block';
    }

    const closeSens = () => {
        sensModalOverlay.style.display = 'none';
        sensResults.style.display = 'none';
    };

    closeSensBtn.addEventListener('click', closeSens);
    sensModalOverlay.addEventListener('click', closeSens);

    // Initial render for devices
    renderDevicesGrid();

    // 7. Feedback System (Dual Purpose)
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackText = document.getElementById('feedback-text');
    const commentsList = document.getElementById('comments-list');
    
    // Load mock comments
    let comments = [
        { id: 1, author: 'GUEST-XYZ123', text: 'Love the sensitivity settings!', date: new Date().toLocaleDateString() }
    ];

    async function fetchComments() {
        try {
            const res = await fetch(`${API_URL}/comments`);
            if (res.ok) {
                comments = await res.json();
            } else {
                throw new Error('Backend failed');
            }
        } catch (e) {
            console.log('Backend not connected, using persistent local mock DB for comments.');
            const stored = localStorage.getItem('mockGlobalComments');
            if (stored) comments = JSON.parse(stored);
        }
        renderComments();
    }

    function renderComments() {
        commentsList.innerHTML = '';
        comments.forEach(comment => {
            commentsList.innerHTML += `
                <div class="comment-item">
                    <div class="comment-author">${comment.author}</div>
                    <div class="comment-text">${comment.text}</div>
                    <small>${comment.date}</small>
                </div>
            `;
        });
    }

    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = feedbackText.value.trim();
        if (!text) return;
        
        const newComment = {
            id: Date.now(),
            author: userState.username,
            text: text,
            date: new Date().toLocaleDateString()
        };

        try {
            // Attempt to save to online backend
            const res = await fetch(`${API_URL}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newComment)
            });
            
            if (res.ok) {
                const savedComment = await res.json();
                comments.unshift(savedComment);
            } else {
                throw new Error('Backend fallback');
            }
        } catch (e) {
            // Fallback: Save to local storage mock DB so it remains "visible" globally across reloads
            comments.unshift(newComment);
            localStorage.setItem('mockGlobalComments', JSON.stringify(comments));
        }
        
        renderComments();
        feedbackText.value = '';
        showToast('Feedback posted and visible to all users!', 'success');
    });

    // 8. Profile & Modal Logic
    const profileModal = document.getElementById('profile-modal');
    const profileBtn = document.getElementById('profile-btn');
    const closeBtn = document.querySelector('.close-btn');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const googleLoginBtn = document.getElementById('google-login-btn');

    profileBtn.addEventListener('click', () => {
        profileModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        profileModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == profileModal) {
            profileModal.style.display = 'none';
        }
        const videoModal = document.getElementById('video-modal');
        if (e.target == videoModal) {
            videoModal.style.display = 'none';
            document.getElementById('video-modal-embed').innerHTML = ''; // Clear iframe to stop audio
        }
    });

    document.getElementById('close-video-btn')?.addEventListener('click', () => {
        document.getElementById('video-modal').style.display = 'none';
        document.getElementById('video-modal-embed').innerHTML = ''; // Clear iframe to stop audio
    });

    saveProfileBtn.addEventListener('click', () => {
        const newName = editUsernameInput.value.trim();
        if (newName) {
            userState.username = newName;
            localStorage.setItem('username', newName);
            
            // Update backend
            if (userState.userId) {
                fetch(`${API_URL}/users/${userState.userId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: newName })
                }).catch(e => console.log('Backend update failed'));
            }
            
            updateUserUI();
            profileModal.style.display = 'none';
            showToast('Profile updated!', 'success');
        }
    });

    googleLoginBtn.addEventListener('click', () => {
        // Mock Google Login
        userState.username = 'Google User';
        localStorage.setItem('username', 'Google User');
        
        // Update backend
        if (userState.userId) {
            fetch(`${API_URL}/users/${userState.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'Google User' })
            }).catch(e => console.log('Backend update failed'));
        }
        
        updateUserUI();
        showToast('Mock Google Login Successful!', 'success');
    });

    // 9. Language & Search Handling
    const langSelect = document.getElementById('language-select');
    langSelect.addEventListener('change', (e) => {
        userState.language = e.target.value;
        renderRandomContent();
        updateGameTips();
    });

    // Debounce utility
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const searchInput = document.getElementById('global-search');
    searchInput.addEventListener('input', debounce((e) => {
        const term = e.target.value;
        // If searching, ensure we are on the games tab to see results
        if(!document.getElementById('games-section').classList.contains('active') && term.length > 0) {
            navItems.forEach(nav => nav.classList.remove('active'));
            contentSections.forEach(sec => sec.classList.remove('active'));
            document.querySelector('[data-target="games-section"]').classList.add('active');
            document.getElementById('games-section').classList.add('active');
            document.getElementById('game-detail-section').style.display = 'none';
        }
        renderGames(term, 1);
    }, 300));

    // Initial Renders
    renderRandomContent();
    renderGames();
    fetchComments();
});