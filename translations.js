const translations = {
    "EN": {
        "welcome": "Welcome",
        "goodbye": "Goodbye"
    },
    "ES": {
        "welcome": "Bienvenido",
        "goodbye": "Adiós"
    },
    "FR": {
        "welcome": "Bienvenue",
        "goodbye": "Au revoir"
    },
    "DE": {
        "welcome": "Willkommen",
        "goodbye": "Auf Wiedersehen"
    },
    "IT": {
        "welcome": "Benvenuto",
        "goodbye": "Addio"
    },
    "PT": {
        "welcome": "Bem-vindo",
        "goodbye": "Adeus"
    }
};

function setLang(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
        const key = el.getAttribute('data-i18n');
        el.textContent = translations[lang][key] || key;
    });
}

// Example usage: setLang('EN'); // to set all elements to English