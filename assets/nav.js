class Navbar {
    constructor() {
    }
    init() {
        this.navbar();
        let navTemplate = document.querySelector('#mobile');
        navTemplate.innerHTML = this.navbar();
        this.open();
    }
    navbar () {
        return `
            <div class="nav-item">
            <div class="nav-logo">
                <a href="index.html">TH</a>
            </div>
        </div>
        <div class="nav-item">
            <ul class="nav-list">
                <li><a href="index.html">Startseite</a></li>
                <li><a href="index.html">About</a></li>
                <li><a href="index.html">Blog</a></li>
                <li><a href="index.html">Login</a></li>
            </ul>
        </div>
    </div>`
    }
    open() {
        let nav = document.querySelector('#nav-btn');
        let bar = document.querySelector('#mobile')
        bar.style.display = 'block'

    }
    close() {
        let bar = document.querySelector('#mobile')
        bar.style.display = 'none'
    }
}

let navData = new Navbar()
navData.init();