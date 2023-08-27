export default function initTheme() {
    // function to change class of <html> tag accordingly based on value of theme variable
    function toggleThemeClass() {
        if (localStorage.getItem('theme') === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }

    // if theme variable has no value yet, give it a value based on user's system theme
    if (!localStorage.getItem('theme')) {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) localStorage.setItem('theme', 'dark');
        else localStorage.setItem('theme', 'light');
    }

    toggleThemeClass(); // once value has been given to theme variable, change class of <html> tag accordingly
    window.addEventListener('storage', toggleThemeClass); // whenever theme variable is modified, change class of <html> tag accordingly
}