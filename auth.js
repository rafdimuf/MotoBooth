// Dynamic Auth handler for MotoBooth static pages
(function() {
    // 1. Create script tag for Supabase CDN if not already loaded in the document
    if (!window.supabase) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.async = false;
        script.onload = initAuth;
        document.head.appendChild(script);
    } else {
        initAuth();
    }

    function initAuth() {
        // --- KONFIGURASI SUPABASE ---
        const SUPABASE_URL = "https://vpghdgbreksgwnvwlzvj.supabase.co"; 
        const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZ2hkZ2JyZWtzZ3dudndsenZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NjAyMzAsImV4cCI6MjA5MzUzNjIzMH0.YFcb4jIQIVYOIWI-2ezPC4G8VsQtKmECU1zssU5tluo";

        // Inisialisasi Supabase Client
        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        // Periksa Sesi Aktif saat Halaman Dimuat
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            updateNavbar(session?.user);
        });

        // Dengarkan Perubahan Sesi (Login / Logout)
        supabaseClient.auth.onAuthStateChange((event, session) => {
            updateNavbar(session?.user);
        });

        // Fungsi Dinamis Memperbarui Elemen Navbar "Log In"
        function updateNavbar(user) {
            // Temukan semua link navigasi yang mengarah ke login.html atau bertuliskan "log in"
            const loginLinks = Array.from(document.querySelectorAll('a')).filter(a => {
                const href = a.getAttribute('href');
                const text = a.textContent.trim().toLowerCase();
                return href === 'login.html' || text === 'log in' || text === 'login';
            });

            loginLinks.forEach(link => {
                if (user) {
                    const userMetadata = user.user_metadata || {};
                    const avatarUrl = userMetadata.avatar_url;
                    const name = userMetadata.full_name || user.email.split('@')[0];

                    if (avatarUrl) {
                        // Tampilkan foto profil Google yang indah dan nama user
                        link.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                                <img src="${avatarUrl}" alt="${name}" style="width: 32px; height: 32px; border-radius: 50%; border: 2px solid #f7cead; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" referrerPolicy="no-referrer">
                                <span style="font-size: 14px; font-weight: 600; color: #42567a; transition: color 0.2s;">${name}</span>
                            </div>
                        `;
                    } else {
                        // Tampilan Fallback jika tidak ada avatar
                        link.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 14px; font-weight: 600; color: #42567a;">👋 ${name}</span>
                            </div>
                        `;
                    }
                    
                    link.href = "#"; // Mencegah pergi ke halaman login
                    link.title = "Klik untuk Logout";
                    
                    // Aksi Logout saat klik profil
                    link.onclick = async (e) => {
                        e.preventDefault();
                        if (confirm("Apakah Anda ingin logout dari MotoBooth?")) {
                            try {
                                await supabaseClient.auth.signOut();
                                window.location.href = "motobooth.html"; // Kembali ke Beranda setelah logout
                            } catch (err) {
                                alert("Gagal logout: " + err.message);
                            }
                        }
                    };
                } else {
                    // Jika belum login, kembalikan ke tombol "Log In" standar
                    link.innerHTML = 'Log In';
                    link.href = 'login.html';
                    link.onclick = null;
                    link.title = "";
                }
            });
        }
    }
})();
