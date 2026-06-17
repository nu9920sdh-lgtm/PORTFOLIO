var detailProjects = [
    {
        title: 'FREITAG Redesign',
        label: 'FREITAG redesign',
        subtitle: 'FREITAG redesign <span class="detail-project-type">(Responsive Web)</span>',
        dropdownName: 'FREITAG Redesign',
        type: 'Responsive Web',
        desc: 'article article article article article article article article article article article article article article article article article article article article article article article article article article article article article article',
        contribution: '100%',
        period: '2026.04-2026.05',
        pcScreen: { image: './images/freitag_pc.png', alt: 'FREITAG redesign PC full page', verticalPadding: true },
        mobileScreen: { image: './images/Main_Mobile.png', alt: 'FREITAG redesign mobile full page' },
    },
    {
        title: 'Nintendo Redesign',
        label: 'NINTENDO redesign',
        subtitle: 'NINTENDO redesign <span class="detail-project-type">(Responsive Web)</span>',
        dropdownName: 'Nintendo Redesign',
        type: 'Responsive Web',
        desc: 'article article article article article article article article article article article article article article article article article article article article article article article article article article article article article article',
        contribution: '100%',
        period: '2026.04-2026.05',
        pcScreen: { image: './images/nintendo_PC.jpg', alt: 'Nintendo redesign PC full page', verticalPadding: true, shiftRight: true },
        mobileScreen: { placeholder: 'MOBILE FULL PAGE', ratio: '1920 / 5000' },
    },
    {
        title: 'Mirror Me',
        label: 'Mirror me',
        subtitle: 'Mirror me <span class="detail-project-type">(Mobile APP Service)</span>',
        dropdownName: 'Mirror Me APP',
        type: 'Mobile APP Service',
        desc: 'article article article article article article article article article article article article article article article article article article article article article article article article article article article article article article',
        contribution: '80%',
        period: '2026.04-2026.05',
        pcScreen: { placeholder: 'PC FULL PAGE', ratio: '1920 / 5000' },
        mobileScreen: { placeholder: 'MOBILE FULL PAGE', ratio: '1920 / 5000' },
    },
    {
        title: 'EDIYA COFFEE - 먼작귀',
        label: 'EDIYA COFFEE - 먼작귀',
        subtitle: 'EDIYA COFFE X 먼작귀 <span class="detail-project-type">(Promotion Design)</span>',
        dropdownName: 'EDIYA COFFE-먼작귀',
        type: 'Promotion Design',
        desc: 'article article article article article article article article article article article article article article article article article article article article article article article article article article article article article article',
        contribution: '100%',
        period: '2026.04-2026.05',
        pcScreen: { image: './images/먼작귀_개인페이지 코딩.png', alt: 'EDIYA COFFEE X 먼작귀 PC full page', verticalPadding: true },
        mobileScreen: { image: './images/chiikawa_phone.png', alt: 'EDIYA COFFEE X 먼작귀 mobile full page', zoom: true },
    },
    {
        title: 'Team Domingo',
        label: 'TEAM DOMINGO redesign',
        subtitle: 'TEAM DOMINGO redesign',
        dropdownName: 'TEAM DOMINGO',
        type: 'Responsive Web',
        desc: 'article article article article article article article article article article article article article article article article article article article article article article article article article article article article article article',
        contribution: '100%',
        period: '2026.04-2026.05',
        pcScreen: { placeholder: 'PC FULL PAGE', ratio: '1920 / 5000' },
        mobileScreen: { placeholder: 'MOBILE FULL PAGE', ratio: '1920 / 5000' },
    },
];

var currentProjectIndex = 0;

var dropdown = document.querySelector('.detail-dropdown');
var dropdownLabel = document.querySelector('.detail-dropdown-label');
var dropdownItems = document.querySelectorAll('.detail-dropdown-item');
var mainTitle = document.querySelector('.detail-main-title');
var projectTitle = document.querySelector('.detail-project-title');
var detailDesc = document.querySelector('.detail-desc');
var metaItems = document.querySelectorAll('.detail-meta-item');
var pcTrack = document.querySelector('.detail-pc-track');
var mobileTrack = document.querySelector('.detail-mobile-track');
var progressFill = document.querySelector('.detail-progress-fill');

function createScreenPanel(screen) {
    var panel = document.createElement('div');
    panel.className = 'detail-screen-panel';

    if (screen.image) {
        var image = document.createElement('img');
        image.src = screen.image;
        image.alt = screen.alt || '';
        if (screen.verticalPadding) {
            panel.classList.add('detail-screen-panel-padded');
        }
        if (screen.shiftRight) {
            panel.classList.add('detail-screen-panel-shift-right');
        }
        if (screen.zoom) {
            panel.classList.add('detail-screen-panel-zoom');
        }
        panel.appendChild(image);
        return panel;
    }

    panel.classList.add('detail-placeholder');
    panel.style.aspectRatio = screen.ratio || '1920 / 5000';
    panel.textContent = screen.placeholder || 'FULL PAGE';
    return panel;
}

function renderScreen(track, screen) {
    track.innerHTML = '';
    track.appendChild(createScreenPanel(screen || { placeholder: 'FULL PAGE', ratio: '1920 / 5000' }));

    if (track.parentElement) {
        track.parentElement.scrollTop = 0;
    }
}

function updateScreenPosition() {
    pcTrack.style.transform = 'none';
    mobileTrack.style.transform = 'none';

    if (progressFill) {
        progressFill.style.width = '100%';
    }
}

function updateProject(index) {
    currentProjectIndex = index;

    var project = detailProjects[index];

    mainTitle.textContent = project.title;
    dropdownLabel.textContent = project.dropdownName;
    projectTitle.innerHTML = project.subtitle;
    detailDesc.textContent = project.desc;
    metaItems[0].querySelector('.detail-meta-value').textContent = project.contribution;
    metaItems[1].querySelector('.detail-meta-value').textContent = project.period;

    renderScreen(pcTrack, project.pcScreen);
    renderScreen(mobileTrack, project.mobileScreen);

    dropdownItems.forEach(function(item) {
        item.classList.toggle('active', parseInt(item.dataset.index) === index);
    });

    updateScreenPosition();
}

document.querySelector('.detail-dropdown-btn').addEventListener('click', function(e) {
    e.stopPropagation();
    dropdown.classList.toggle('open');
});

dropdownItems.forEach(function(item) {
    item.addEventListener('click', function() {
        var projectIndex = parseInt(this.dataset.index);
        updateProject(projectIndex);
        if (window.syncProjectsCarousel) {
            window.syncProjectsCarousel(projectIndex);
        }
        dropdown.classList.remove('open');
    });
});

document.addEventListener('click', function() {
    dropdown.classList.remove('open');
});

window.updateProjectDetail = updateProject;
window.getCurrentProjectDetailIndex = function() {
    return currentProjectIndex;
};

updateProject(0);
